import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { 
  History as HistoryIcon, 
  Search, 
  Trash2, 
  Calendar, 
  BarChart3,
  Film,
  ExternalLink,
  ChevronRight
} from 'lucide-react'

function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:4000/api/history', {
        headers: { Authorization: `Bearer ${token}` }
      })
      // The API returns { items: [...] }
      setHistory(response.data.items || [])
    } catch (err) {
      console.error('Failed to fetch history:', err)
      setError('Failed to retrieve history archives.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:4000/api/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setHistory(history.filter(item => item._id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const filteredHistory = history.filter(item => 
    item.text.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-6">
       <div className="w-16 h-16 border-t-2 border-[#F5C518] rounded-full animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F5C518] animate-pulse">Accessing Intelligence Vault...</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-[#F5C518] uppercase tracking-[0.4em]">Audit Logs</p>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter text-white">History Archive</h1>
        </div>
        
        <div className="relative group w-full md:w-96">
           <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#F5C518] transition-colors" />
           <input
             type="text"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Search past analyses..."
             className="w-full bg-[#121212] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-[#F5C518]/30 transition-all"
           />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {[
           { label: 'Logged Entries', value: history.length, icon: HistoryIcon },
           { label: 'Positive Tilt', value: history.filter(h => h.sentiment === 'Positive').length, icon: BarChart3 },
           { label: 'Recent Analysis', value: history[0] ? new Date(history[0].createdAt).toLocaleDateString() : 'N/A', icon: Calendar },
           { label: 'Engine Load', value: 'OPTIMAL', icon: Film },
         ].map((stat, i) => (
           <div key={i} className="bg-[#121212] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#F5C518]">
                 <stat.icon size={18} />
              </div>
              <div>
                 <p className="text-[8px] font-black uppercase tracking-widest text-white/20">{stat.label}</p>
                 <p className="text-sm font-black text-white uppercase">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Main Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#121212] border border-white/5 rounded-[40px] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5">
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Review Fragment</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Sentiment</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Confidence</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Timestamp</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredHistory.length > 0 ? filteredHistory.map((item) => (
                <tr key={item._id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-10 max-w-sm">
                    <p className="text-xs text-white/60 font-medium leading-relaxed line-clamp-2">"{item.text}"</p>
                  </td>
                  <td className="px-10 py-10">
                     <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.sentiment === 'Positive' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.sentiment === 'Positive' ? 'text-emerald-500' : 'text-rose-500'}`}>
                           {item.sentiment}
                        </span>
                     </div>
                  </td>
                  <td className="px-10 py-10">
                     <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                       {typeof item.confidence === 'number' ? (item.confidence * 100).toFixed(0) : '0'}% Match
                     </span>
                  </td>
                  <td className="px-10 py-10">
                     <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-10 py-10 text-right">
                    <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-[#F5C518] transition-all">
                          <ExternalLink size={14} />
                       </button>
                       <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-rose-500 transition-all"
                       >
                          <Trash2 size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                       <HistoryIcon size={40} />
                       <p className="text-[10px] font-black uppercase tracking-widest">Archive Vault Empty</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default History
