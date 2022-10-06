import requestID from 'express-request-id'
import express from 'express'

const app = express()
app.use(requestID())

export default app
