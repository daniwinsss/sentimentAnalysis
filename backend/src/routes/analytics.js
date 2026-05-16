const express = require('express')
const Analysis = require('../models/Analysis')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/overview', auth, async (req, res) => {
  try {
    const items = await Analysis.find({ userId: req.user.id })
    const totalAnalyses = items.length
    
    const distribution = items.reduce(
      (acc, item) => {
        const sentiment = item.sentiment ? item.sentiment.toLowerCase() : 'neutral'
        if (sentiment === 'positive') acc.positive++
        else if (sentiment === 'negative') acc.negative++
        else acc.neutral++
        return acc
      },
      { positive: 0, neutral: 0, negative: 0 }
    )

    const totalConfidence = items.reduce((sum, item) => sum + (item.confidence || 0), 0)
    const averageConfidence = totalAnalyses > 0 ? totalConfidence / totalAnalyses : 0

    return res.json({ 
      totalAnalyses, 
      distribution, 
      averageConfidence 
    })
  } catch (error) {
    res.status(500).json({ message: 'Analytics failed', error: error.message })
  }
})

router.get('/model-comparison', auth, async (req, res) => {
  const items = await Analysis.find({ userId: req.user.id })
  const modelCounts = items.reduce((acc, item) => {
    acc[item.modelUsed] = (acc[item.modelUsed] || 0) + 1
    return acc
  }, {})

  return res.json({ modelCounts })
})

module.exports = router
