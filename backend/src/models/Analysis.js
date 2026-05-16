const mongoose = require('mongoose')

const analysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    sentiment: { type: String, required: true },
    confidence: { type: Number, required: true },
    modelUsed: { type: String, required: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Analysis', analysisSchema)
