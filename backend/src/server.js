require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth')
const analyzeRoutes = require('./routes/analyze')
const historyRoutes = require('./routes/history')
const analyticsRoutes = require('./routes/analytics')

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/analyze', analyzeRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/analytics', analyticsRoutes)

const port = process.env.PORT || 4000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('Mongo connection failed', error)
    process.exit(1)
  })
