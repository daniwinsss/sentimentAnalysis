const parseCsvBuffer = (buffer) => {
  const content = buffer.toString('utf-8')
  const lines = content.split(/\r?\n/).filter(Boolean)
  const header = lines[0].split(',')
  const rows = lines.slice(1).map((line) => {
    const values = line.split(',')
    return header.reduce((acc, key, index) => {
      acc[key.trim()] = values[index]?.trim() ?? ''
      return acc
    }, {})
  })
  return { header, rows }
}

const toCsv = (header, rows) => {
  const csvHeader = header.join(',')
  const csvRows = rows.map((row) =>
    header.map((key) => `${row[key] ?? ''}`).join(',')
  )
  return [csvHeader, ...csvRows].join('\n')
}

module.exports = { parseCsvBuffer, toCsv }
