const express = require('express')
const multer = require('multer')
const Analysis = require('../models/Analysis')
const auth = require('../middleware/auth')
const { predictSingle, predictBatch } = require('../services/mlService')
const { parseCsvBuffer, toCsv } = require('../services/csvService')

const router = express.Router()
const upload = multer({ limits: { fileSize: 2 * 1024 * 1024 } })

router.post('/', auth, async (req, res) => {
  const { text, model } = req.body
  if (!text) {
    return res.status(400).json({ message: 'Text is required' })
  }

  try {
    console.log(`Analyzing with model: ${model}, text length: ${text.length}`);
    const prediction = await predictSingle(text, model).catch(err => {
      console.error('ML Service Fetch Error:', err.message);
      if (err.response) {
        console.error('ML Service Error Data:', err.response.data);
        console.error('ML Service Error Status:', err.response.status);
      }
      throw err;
    });
    
    console.log('Prediction received from ML service:', JSON.stringify(prediction, null, 2));
    
    if (!prediction || !prediction.sentiment) {
      console.error('ML Service returned invalid data:', prediction)
      return res.status(500).json({ 
        message: 'Incomplete response from sentiment engine',
        details: 'The ML service did not return a valid sentiment classification.'
      })
    }

    const record = await Analysis.create({
      userId: req.user.id,
      text,
      sentiment: prediction.sentiment,
      confidence: prediction.confidence,
      modelUsed: prediction.model || model
    })
    return res.json({ prediction, record })
  } catch (error) {
    let errorMessage = error.message
    let errorDetail = 'Could not reach sentiment engine.'

    if (error.response) {
      // The ML service responded with an error status
      errorMessage = `ML Service Error: ${error.response.status}`
      errorDetail = error.response.data?.detail || JSON.stringify(error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      errorDetail = 'Sentiment engine is offline (Connection Refused).'
    }

    console.error('Analysis Engine Error:', errorMessage, errorDetail)
    return res.status(500).json({ 
      message: 'Sentiment engine is currently offline or overloaded.',
      details: errorDetail
    })
  }
})

router.post('/batch', auth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'CSV file is required' })
  }

  try {
    const model = req.body.model || 'logistic'
    const { rows } = parseCsvBuffer(req.file.buffer)
    
    // Filter out empty rows
    const validRows = rows.filter(row => row.text || row.review)
    const items = validRows.map((row) => row.text || row.review)
    
    if (items.length === 0) {
      return res.status(400).json({ message: 'No valid text found in CSV' })
    }

    const results = await predictBatch(items, model)
    console.log(`Batch prediction finished for ${items.length} items`)
    const analysisRecords = []
    const enrichedResults = validRows.map((row, index) => {
      const prediction = results.items[index]
      
      analysisRecords.push({
        userId: req.user.id,
        text: items[index],
        sentiment: prediction.sentiment,
        confidence: prediction.confidence,
        modelUsed: model
      })

      return {
        text: items[index],
        sentiment: prediction.sentiment,
        confidence: prediction.confidence
      }
    })

    // Bulk insert into database
    await Analysis.insertMany(analysisRecords)

    return res.json({ 
      results: enrichedResults,
      summary: {
        total: items.length,
        positive: enrichedResults.filter(r => r.sentiment.toLowerCase() === 'positive').length,
        negative: enrichedResults.filter(r => r.sentiment.toLowerCase() === 'negative').length
      }
    })
  } catch (error) {
    console.error('Batch Processing Error:', error)
    return res.status(500).json({ message: 'Batch analysis failed', error: error.message })
  }
})

module.exports = router
