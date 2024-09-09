import * as functions from 'firebase-functions/v2'
import express from 'express'

const app = express()

app.get('/', (req, res) => {
  return res.status(200).send('Hello World!')
})

export const api = functions.https.onRequest(app)
