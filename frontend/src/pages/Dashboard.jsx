import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { 
  Film, 
  TrendingUp, 
  Users, 
  Clock, 
  ChevronRight,
  MessageSquare,
  Activity,
  BarChart2
} from 'lucide-react'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/analytics/overview`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setStats(response.data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const mainStats = [
    { 
      label: 'Total Reviews Analyzed', 
      value: stats?.totalAnalyses || '0', 
      icon: Film,
      trend: '+12% this month'
    },
    { 
      label: 'Positive Sentiment', 
      value: stats?.distribution?.positive ? `${((stats.distribution.positive / stats.totalAnalyses) * 100).toFixed(1)}%` : '0%', 
      icon: TrendingUp,
      trend: '+4.2% shift'
    },
    { 
      label: 'Average Confidence', 
      value: stats?.averageConfidence ? `${(stats.averageConfidence * 100).toFixed(1)}%` : '0.0%', 
      icon: Activity,
      trend: 'Model Stable'
    }
  ]

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-6">
       <div className="w-16 h-16 border-t-2 border-[#F5C518] rounded-full animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F5C518] animate-pulse">Synchronizing Cinematic Data...</p>
    </div>
  )

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-[#F5C518] uppercase tracking-[0.4em]">IMDb Intelligence Platform</p>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter">Command Center</h1>
        </div>
        <div className="flex items-center gap-3 bg-[#121212] border border-white/5 px-6 py-3 rounded-xl">
           <div className="w-2 h-2 rounded-full bg-[#F5C518] animate-pulse" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Neural Engine Online</span>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        {mainStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-2xl relative overflow-hidden group"
          >
            <stat.icon size={24} className="text-[#F5C518] mb-8" />
            <div className="space-y-1">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-4xl font-display font-black text-white">{stat.value}</h3>
            </div>
            <p className="mt-4 text-[10px] font-bold text-[#F5C518]/50 uppercase tracking-widest">{stat.trend}</p>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5C518]/[0.02] blur-3xl -z-10 group-hover:bg-[#F5C518]/[0.05] transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* Distribution Section */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#121212] border border-white/5 p-10 rounded-3xl space-y-12"
        >
          <div className="flex items-center justify-between">
             <div className="space-y-1">
               <h3 className="text-xl font-display font-black uppercase tracking-tight">Sentiment Breakdown</h3>
               <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">IMDb 50K Dataset Accuracy Comparison</p>
             </div>
             <BarChart2 size={20} className="text-[#F5C518]/40" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Positive', value: stats?.distribution?.positive || 0, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Neutral', value: stats?.distribution?.neutral || 0, color: 'text-[#F5C518]', bg: 'bg-[#F5C518]/10' },
              { label: 'Negative', value: stats?.distribution?.negative || 0, color: 'text-rose-500', bg: 'bg-rose-500/10' }
            ].map((item) => (
              <div key={item.label} className="space-y-4">
                <div className={`${item.bg} ${item.color} p-6 rounded-2xl border border-white/5`}>
                  <p className="text-4xl font-display font-black">{item.value}</p>
                </div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest text-center">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Visual Trend Simulation */}
          <div className="h-32 w-full flex items-end gap-2 px-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${Math.random() * 80 + 20}%` }}
                className="flex-1 bg-white/[0.03] rounded-t-sm hover:bg-[#F5C518]/20 transition-colors"
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          <div className="bg-[#F5C518] p-10 rounded-3xl text-black">
            <div className="space-y-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">System Performance</p>
                <h3 className="text-3xl font-display font-black uppercase tracking-tighter">Model Health</h3>
              </div>
              
              <div className="space-y-4">
                 {[
                   { label: 'Latency', value: '42ms' },
                   { label: 'Uptime', value: '99.9%' },
                   { label: 'F1 Score', value: '0.94' }
                 ].map((item) => (
                   <div key={item.label} className="flex justify-between border-b border-black/10 pb-4">
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{item.label}</span>
                     <span className="text-lg font-display font-black">{item.value}</span>
                   </div>
                 ))}
              </div>

              <button className="w-full bg-black text-white py-5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black/90 transition-all">
                Export Benchmarks
              </button>
            </div>
          </div>

          <div className="bg-[#121212] border border-white/5 p-8 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-[#181818] transition-colors">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#F5C518]">
                  <MessageSquare size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider">Live Analysis</h4>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Active Processing Session</p>
               </div>
            </div>
            <ChevronRight size={20} className="text-white/20 group-hover:text-[#F5C518] transition-colors" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
