// if present load config from .env file
require('dotenv').config()
const logger = require('./logger')
const { config } = require('./config')
const { getBucketStats } = require('./functions')

const start = async function start() {
  // eslint-disable-next-line import/extensions
  const { default: app } = await import('./express.mjs')
  app.get('/metrics', async (req, res) => {
    logger.info(`calling /metrics requestIP: ${req.ip}, requestID: ${req.id}`)
    const stats = await getBucketStats(config.filters.filter_type(), config.filters.filter_list())
    res.set('Content-Type', 'text/plain')
    if (stats) {
      res.send(stats)
      logger.info(`request completed sucessfully: ${req.id}`)
    } else {
      res.status(500).send('There was an error, check rados API')
      logger.error(`request completed with errors: ${req.id}`)
    }
  })
  app.listen(config.webserver.port, () => {
    logger.info(`Server listening on port ${config.webserver.port}`)
  })
}

start()
