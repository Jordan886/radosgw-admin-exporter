// if present load config from .env file
require('dotenv').config()
const { api } = require('./api')

const start = async function start() {
  const buckets = await api.listBuckets()
  console.debug(buckets)
  const stats = await api.bucketStats('1827e484')
  console.debug(stats.usage)
}

start()