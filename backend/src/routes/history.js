const express = require('express')
const Analysis = require('../models/Analysis')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, async (req, res) => {
  const items = await Analysis.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
  return res.json({ items })
})

router.delete('/:id', auth, async (req, res) => {
  await Analysis.deleteOne({ _id: req.params.id, userId: req.user.id })
  return res.json({ status: 'deleted' })
})

module.exports = router
