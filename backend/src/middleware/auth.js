const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  const header = req.headers.authorization
  if (!header) {
    return res.status(401).json({ message: 'Authorization header is missing' })
  }

  const parts = header.split(' ')
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ message: 'Invalid authorization format. Use "Bearer <token>"' })
  }

  const token = parts[1]
  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ message: 'Token is null or undefined' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    return next()
  } catch (error) {
    console.error('JWT Verification Error:', error.message)
    return res.status(401).json({ message: `Session invalid: ${error.message}` })
  }
}

module.exports = auth
