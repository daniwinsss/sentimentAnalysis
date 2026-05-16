const mongoose = require('mongoose')

const connectDb = async (uri) => {
  if (!uri) {
    throw new Error('MONGO_URI is missing')
  }
  return mongoose.connect(uri)
}

module.exports = connectDb
