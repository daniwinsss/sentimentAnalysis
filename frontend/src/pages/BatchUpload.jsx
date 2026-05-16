import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { 
  UploadCloud, 
  FileText, 
  Database, 
  Download, 
  CheckCircle2,
  Loader2,
  Trash2,
  Film
} from 'lucide-react'

function BatchUpload() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [model, setModel] = useState('logistic')
  const [error, setError] = useState(null)
  const fileInputRef = useRef()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile)
      setError(null)
    } else {
      setError('Please select a valid CSV file for cinematic processing.')
      setFile(null)
    }
  }

  const handleBatchAnalyze = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('model', model)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/analyze/batch`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )

      setResults(response.data.results || [])
      setError(null)
    } catch (err) {
      console.error('Batch analysis failed:', err)
      setError(err.response?.data?.message || 'Batch processing error. Ensure your CSV contains a "text" header.')
    } finally {
      setLoading(false)
    }
  }

  const downloadResults = () => {
    if (results.length === 0) return
    const headers = ['Text', 'Sentiment', 'Confidence']
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + results.map(r => `"${r.text.replace(/"/g, '""')}",${r.sentiment},${r.confidence}`).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `batch_results_${new Date().getTime()}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="space-y-2">
        <p className="text-[10px] font-black text-[#F5C518] uppercase tracking-[0.4em]">Bulk Data Pipeline</p>
        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter">Batch Processor</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
        {/* Upload Zone */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#121212] border border-white/5 p-10 rounded-[32px] space-y-10 h-fit"
        >
          <div className="space-y-2">
            <h3 className="text-xl font-display font-black uppercase tracking-tight">Data Ingestion</h3>
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Supports IMDb Dataset Formats</p>
          </div>

          <div 
            onClick={() => !loading && fileInputRef.current.click()}
            className={`relative group cursor-pointer aspect-square rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center gap-6 ${
              file 
                ? 'border-[#F5C518]/40 bg-[#F5C518]/5' 
                : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            }`}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
            
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
              file ? 'bg-[#F5C518] text-black scale-110 shadow-[0_0_30px_rgba(245,197,24,0.3)]' : 'bg-white/5 text-white/20'
            }`}>
              {loading ? <Loader2 size={24} className="animate-spin" /> : <UploadCloud size={24} />}
            </div>

            <div className="space-y-2">
               <p className="text-xs font-black uppercase tracking-widest text-white/80">
                 {file ? file.name : 'Drop CSV Package'}
               </p>
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                 {file ? `${(file.size / 1024).toFixed(1)} KB` : 'CSV Files Only (Max 50MB)'}
               </p>
            </div>

            {file && !loading && (
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="absolute top-4 right-4 p-2 rounded-lg bg-black/40 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Select Intelligence Engine</label>
             <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'logistic', label: 'Logistic' },
                  { id: 'nb', label: 'NB' },
                  { id: 'svm', label: 'SVM' },
                  { id: 'bert', label: 'BERT' },
                ].map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      model === m.id 
                        ? 'bg-[#F5C518] text-black border-[#F5C518]' 
                        : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
             </div>
          </div>

          <button
            onClick={handleBatchAnalyze}
            disabled={loading || !file}
            className="btn-imdb w-full py-5 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? 'Processing Dataset...' : 'Execute Batch Inference'}
            <Database size={16} />
          </button>

          {error && (
            <p className="text-center text-rose-500 text-[10px] font-black uppercase tracking-widest bg-rose-500/5 p-4 rounded-xl border border-rose-500/10">
              {error}
            </p>
          )}
        </motion.div>

        {/* Results / History */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#121212] border border-white/5 rounded-[32px] overflow-hidden flex flex-col"
        >
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
             <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#F5C518]" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Operation Status</h4>
             </div>
             {results.length > 0 && (
               <button 
                 onClick={downloadResults}
                 className="flex items-center gap-2 bg-[#F5C518] text-black px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest hover:scale-105 transition-all"
               >
                  <Download size={12} />
                  Export Results
               </button>
             )}
          </div>

          <div className="flex-1 min-h-[400px] max-h-[600px] overflow-y-auto">
            {results.length > 0 ? (
              <div className="divide-y divide-white/5">
                {results.map((res, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className="p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors group"
                  >
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#F5C518] shrink-0">
                          <FileText size={18} />
                       </div>
                       <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-white/80 uppercase tracking-widest truncate">"{res.text}"</p>
                          <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Processed Segment {i + 1}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                       <div className="text-right">
                          <p className={`text-[10px] font-black uppercase tracking-widest ${res.sentiment.toLowerCase() === 'positive' ? 'text-emerald-500' : 'text-rose-500'}`}>{res.sentiment}</p>
                          <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">{(res.confidence * 100).toFixed(0)}% Match</p>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center gap-6 p-12 opacity-20">
                 <Film size={48} />
                 <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest">Idle Processor</p>
                    <p className="text-[10px] uppercase tracking-widest">Awaiting cinematic data ingest</p>
                 </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-[#F5C518]/5 border-t border-white/5">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#F5C518]">Queue Analytics</span>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Neural Engine v2.0-STABLE</span>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BatchUpload
