const axios = require('axios')

const predictSingle = async (text, model) => {
  const url = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000'
  const response = await axios.post(
    `${url}/predict`,
    { text },
    { params: model ? { model } : {} }
  )
  return response.data
}

const predictBatch = async (items, model) => {
  const url = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000'
  const response = await axios.post(
    `${url}/predict/batch`,
    { items },
    { params: model ? { model } : {} }
  )
  return response.data
}

module.exports = { predictSingle, predictBatch }
