// if present load config from .env file
require('dotenv').config()
const express = require('express')
const { config } = require('./config')
const { getBucketStats } = require('./functions')

const start = async function start() {
  const app = express()
  app.get('/metrics', async (req, res) => {
    const stats = await getBucketStats(config.filters.filter_type(), config.filters.filter_list())
    res.set('Content-Type', 'text/plain')
    res.send(stats)
  })
  app.listen(config.webserver.port, () => {
  })
}

start()
