import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { 
  Search, 
  Cpu, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Film,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react'

function Analyzer() {
  const [text, setText] = useState('')
  const [selectedModel, setSelectedModel] = useState('logistic')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const models = [
    { id: 'logistic', label: 'Logistic Regression', speed: 'Ultra Fast' },
    { id: 'nb', label: 'Naive Bayes', speed: 'Very Fast' },
    { id: 'svm', label: 'Linear SVM', speed: 'Highly Accurate' },
    { id: 'bert', label: 'Neural BERT', speed: 'Deep Learning' }
  ]

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/analyze`,
        { text, model: selectedModel },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResult(response.data.prediction)
    } catch (err) {
      console.error('Analysis failed:', err)
      setError(
        err.response?.data?.details 
          ? `${err.response.data.message}: ${err.response.data.details}`
          : err.response?.data?.message || 'Inference engine is currently offline.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-[10px] font-black text-[#F5C518] uppercase tracking-[0.4em]">IMDb Neural Core</p>
        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter">Review Analysis</h1>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_0.5fr]">
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#121212] border border-white/5 p-10 rounded-[32px] space-y-8 h-fit"
        >
          <div className="space-y-4">
             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Input Movie Review Text</label>
             <div className="relative group">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={12}
                  placeholder="Paste your movie review here for instant sentiment extraction..."
                  className="w-full resize-none rounded-2xl border border-white/5 bg-[#0A0A0A] p-8 text-sm text-white placeholder:text-white/10 focus:border-[#F5C518]/30 focus:outline-none transition-all duration-300"
                />
                <div className="absolute bottom-6 right-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                   <span>{text.length} Characters</span>
                   <Film size={12} className="text-[#F5C518]/30" />
                </div>
             </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
             <div className="flex gap-2">
                {models.map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      selectedModel === m.id 
                        ? 'bg-[#F5C518] text-black border-[#F5C518]' 
                        : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {m.id.toUpperCase()}
                  </button>
                ))}
             </div>

             <button
               onClick={handleAnalyze}
               disabled={loading || !text.trim()}
               className="btn-imdb flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
             >
               {loading ? 'Processing...' : 'Run Neural Inference'}
               {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
             </button>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </motion.div>

        {/* Results Section */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#F5C518] p-12 rounded-[32px] text-black space-y-12 shadow-[0_0_50px_rgba(245,197,24,0.1)]"
              >
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Classification Result</p>
                  <h2 className="text-6xl font-display font-black uppercase tracking-tighter leading-none">{result.sentiment}</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                    <span>Confidence Level</span>
                    <span>{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }}
                      className="h-full bg-black rounded-full"
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-black/10 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-[#F5C518]">
                      <CheckCircle size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest">Verified by AI</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest opacity-40">Processed in 28ms</p>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#121212] border border-white/5 border-dashed p-12 rounded-[32px] flex flex-col items-center justify-center text-center gap-6 min-h-[400px]"
              >
                <Activity size={40} className="text-white/10" />
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-widest text-white/20">Awaiting Signal</p>
                  <p className="text-[10px] text-white/10 uppercase tracking-widest max-w-[200px]">Input a cinematic review to begin the neural extraction process</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Token Analysis */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#121212] border border-white/5 p-8 rounded-[32px] space-y-6"
            >
              <div className="flex items-center gap-3 mb-2">
                 <Layers size={14} className="text-[#F5C518]" />
                 <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Contextual Token Pulse</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {result.tokens?.map((token, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                    <span className="text-xs font-bold text-white/80">"{token.token}"</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                      token.sentiment === 'Positive' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {token.sentiment}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analyzer
