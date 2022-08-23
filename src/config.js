const config = {
  s3api: {
    url: process.env.S3_URL,
    access_key: process.env.S3_ACCESS_KEY,
    secret_key: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION,
  },
  filters: {
    filter_type: () => {
      let type
      type = process.env.FILTER_TYPE || ''
      if (type.match(/user/i)) type = 'user'
      if (type.match(/bucket/i)) type = 'bucket'
      // prevent surprises down the code since there can be only 3 valid values
      if (type !== 'user' && type !== 'bucket') type = 'default'
      return type
    },
    filter_list: () => {
      const list = process.env.FILTER_LIST || ''
      const array = list.split(',')
      return array
    },
  },
  webserver: {
    port: process.env.EXPORTER_PORT || 9501,
    metrics_prefix: process.env.EXPORTER_METRICS_PREFIX || null,
  },
}

module.exports = { config }
