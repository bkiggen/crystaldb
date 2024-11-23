import { Router, Request, Response } from 'express'
import fetch from 'node-fetch'

const router = Router()

const clientId = process.env.CRATEJOY_KEY
const clientSecret = process.env.CRATEJOY_SECRET

const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
  'base64'
)

router.use(async (req, res) => {
  console.log('🚀 ~ router.BODY ~ req:', req.body)
  const endpoint = req.body.path
  const method = req.body.method
  const baseUrl = 'https://api.cratejoy.com/v1'
  const url = `${baseUrl}${endpoint}`
  console.log('🚀 ~ router.use ~ url:', url)

  const headers = {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/json',
  }
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: ['POST', 'PUT', 'PATCH'].includes(method)
        ? JSON.stringify(req.body)
        : undefined,
    })

    console.log('🚀 ~ Response status:', response, JSON.stringify(req.body))
    const contentType = response.headers.get('content-type')
    let data

    if (contentType && contentType.includes('application/json')) {
      data = await response.json() // Parse JSON response
    } else {
      data = await response.text() // Parse non-JSON response
    }

    res.status(response.status).send(data)
  } catch (error) {
    console.error('Error proxying request to Cratejoy:', error)
    res.status(500).send({ error: 'Error communicating with Cratejoy API' })
  }
})

export default router
