const { config } = require('./config')
const { api } = require('./api')
const logger = require('./logger')

const itemListPerUser = async function itemListPerUser(users) {
  const bucket_list = []
  await Promise.all(users.map(async (user) => {
    const buckets = await api.listBucketPerUser(user)
    buckets.map((item) => bucket_list.push(item))
  }))
  logger.debug(`found the following buckets ${bucket_list}`)
  return bucket_list
}

const getBucketStats = async function getBucketsStats(filter_type, filter_list) {
  logger.debug(`calling getBucketStats with filter_type ${filter_type} and filter_list ${filter_list}`)
  const filterd_buckets = {
    user: async function perUserList(users) {
      const buckets = await itemListPerUser(users)
      logger.debug(`found the following buckets ${buckets}`)
      return buckets
    },
    bucket: async function perBucketList(buckets) {
      return buckets
    },
    default: async function defaultList() {
      const buckets = await api.listAllBuckets()
      logger.debug(`found the following buckets ${buckets}`)
      return buckets
    },
  }

  const buckets_to_stat = await filterd_buckets[filter_type](filter_list)
  // if buckets are null it means that the api returned some error
  if (!buckets_to_stat) return null
  const stats = await Promise.all(buckets_to_stat.map(async (bucket) => {
    const bucket_stats = {
      labels: {},
      stats: {},
    }
    const stats_result = await api.bucketStats(bucket)
    bucket_stats.labels.bucket = stats_result?.bucket || ''
    bucket_stats.labels.owner = stats_result?.owner || ''
    bucket_stats.stats.size = stats_result?.usage['rgw.main']?.size || ''
    bucket_stats.stats.size_actual = stats_result?.usage['rgw.main']?.size_actual || ''
    bucket_stats.stats.size_utilized = stats_result?.usage['rgw.main']?.size_utilized || ''
    bucket_stats.stats.num_objects = stats_result?.usage['rgw.main']?.size_utilized || ''
    return bucket_stats
  }))

  // prepare output as Prometheus Exporter
  let final_result = ''
  const prefix = config.webserver.metrics_prefix ? `${config.webserver.metrics_prefix}_` : null

  stats?.map((item) => {
    const labels = `{bucket="${item.labels.bucket}",owner="${item.labels.owner}"}`
    final_result += `${prefix || ''}size${labels} ${item.stats.size || 0}\n`
    final_result += `${prefix || ''}size_actual${labels} ${item.stats.size_actual || 0}\n`
    final_result += `${prefix || ''}size_utilized${labels} ${item.stats.size_utilized || 0}\n`
    final_result += `${prefix || ''}num_objects${labels} ${item.stats.num_objects || 0}\n`
    return null
  })
  return final_result
}

module.exports = { getBucketStats }
