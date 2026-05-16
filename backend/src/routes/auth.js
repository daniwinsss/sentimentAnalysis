const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const createToken = require('../utils/token')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hashed })

  const token = createToken({ id: user._id, email: user.email })
  return res.status(201).json({ token, user: { id: user._id, name, email } })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing credentials' })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = createToken({ id: user._id, email: user.email })
  return res.json({ token, user: { id: user._id, name: user.name, email } })
})

router.get('/profile', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  return res.json({ user })
})

module.exports = router
