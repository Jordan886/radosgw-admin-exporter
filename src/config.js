const config = {
  s3api: {
    url: 'https://' + process.env.S3_URL,
    access_key: process.env.S3_ACCESS_KEY,
    secret_key: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION
  },
}

module.exports = {
  config
}