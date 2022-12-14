const axios = require('axios')
const { aws4Interceptor } = require('aws4-axios')
const { config } = require('./config')
const logger = require('./logger')

// init axios with SignatureV4
const client = axios.create()
const interceptor = aws4Interceptor(
  {
    region: config.s3api.region,
    service: 's3',
  },
  {
    accessKeyId: config.s3api.access_key,
    secretAccessKey: config.s3api.secret_key,
  },
)
client.interceptors.request.use(interceptor)

const api = {
  listAllBuckets: async function listBuckets() {
    const { url } = config.s3api
    const path = '/admin/metadata/bucket'
    const params = '?format=json'
    const req = url + path + params
    let res
    try {
      res = await client.get(req)
      logger.debug('listBuckets result: %o', res)
      return res.data
    } catch (error) {
      logger.error(`listBuckets returned the following error: ${error}`)
      return null
    }
  },
  listBucketPerUser: async function listBucketPerUser(user) {
    const { url } = config.s3api
    const path = '/admin/bucket'
    let params
    // if user specified list only buckets belonging to this user
    if (user) params = `?uid=${user}`
    const req = url + path + params
    let res
    try {
      res = await client.get(req)
      logger.debug('listBucketPerUser result: %o', res)
      return res.data
    } catch (error) {
      logger.error(`listBucketPerUser returned the following error: ${error}`)
      return null
    }
  },
  bucketStats: async function bucketStats(bucket) {
    const { url } = config.s3api
    const path = '/admin/bucket'
    const params = `?bucket=${bucket}&stats=True&format=json`
    const req = url + path + params
    let res
    try {
      res = await client.get(req)
      logger.debug('bucketStats result: %o', res)
      return res.data
    } catch (error) {
      logger.error(`bucketStats returned the following error: ${error}`)
      return null
    }
  },
}

module.exports = { api }
