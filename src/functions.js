const { config } = require('./config')
const { api } = require('./api')

const itemListPerUser = async function itemListPerUser(users) {
  const bucket_list = []
  await Promise.all(users.map(async (user) => {
    const buckets = await api.listBucketPerUser(user)
    buckets.map((item) => bucket_list.push(item))
  }))
  return bucket_list
}

const getBucketStats = async function getBucketsStats(filter_type, filter_list) {
  const filterd_buckets = {
    user: async function perUserList(users) {
      const buckets = await itemListPerUser(users)
      return buckets
    },
    bucket: async function perBucketList(buckets) {
      return buckets
    },
    default: async function defaultList() {
      const buckets = await api.listAllBuckets()
      return buckets
    },
  }

  const buckets_to_stat = await filterd_buckets[filter_type](filter_list)
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

  stats.map((item) => {
    const labels = JSON.stringify(item.labels)
    final_result += `${prefix || ''}size${labels} ${item.stats.size}\n`
    final_result += `${prefix || ''}size_actual${labels} ${item.stats.size_actual}\n`
    final_result += `${prefix || ''}size_utilized${labels} ${item.stats.size_utilized}\n`
    final_result += `${prefix || ''}num_objects${labels} ${item.stats.num_objects}\n`
    return null
  })
  return final_result
}

module.exports = { getBucketStats }
