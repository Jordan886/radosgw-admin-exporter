const axios = require('axios')
const { aws4Interceptor } = require('aws4-axios')
const { config } = require('./config')

// init axios with SignatureV4
const client = axios.create()
const interceptor = aws4Interceptor(
  {
  region: config.s3api.region,
  service: 's3',
  },
  {
  accessKeyId: config.s3api.access_key,
  secretAccessKey: config.s3api.secret_key
  }
)
client.interceptors.request.use(interceptor)

const api = {
  listBuckets: async function listBuckets(){
    const url = config.s3api.url
    const path = '/admin/metadata/bucket'
    const params = '?format=json'
    req = url + path + params
    let res
    try {
      res = await client.get(req)
      return res.data
    }catch(error){
      throw new Error(error)
    }
  },
  bucketStats: async function bucketStats(bucket){
    const url = config.s3api.url
    const path = '/admin/bucket'
    const params = `?bucket=${bucket}&stats=True&format=json`
    req = url + path + params
    let res
    try {
      res = await client.get(req)
      return res.data
    }catch(error){
      throw new Error(error)
    }

  }
}

module.exports = { api }