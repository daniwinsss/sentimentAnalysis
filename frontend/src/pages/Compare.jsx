import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { BarChart2, Zap, Shield, Target, Cpu, Activity } from 'lucide-react'

function Compare() {
  const [usage, setUsage] = useState({})

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/analytics/model-comparison`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUsage(response.data.modelCounts || {})
      } catch (err) {
        console.error('Failed to fetch model usage:', err)
      }
    }
    fetchUsage()
  }, [])

  const models = [
    {
      id: "logistic",
      name: "Logistic Regression",
      accuracy: "89.2%",
      precision: "88.5%",
      recall: "89.8%",
      f1: "89.1%",
      speed: "12ms",
      desc: "Balanced and efficient baseline model for text classification."
    },
    {
      id: "nb",
      name: "Naive Bayes",
      accuracy: "87.5%",
      precision: "86.1%",
      recall: "88.9%",
      f1: "87.4%",
      speed: "8ms",
      desc: "Fastest inference speed, ideal for high-volume batch processing."
    },
    {
      id: "svm",
      name: "Linear SVM",
      accuracy: "91.4%",
      precision: "90.8%",
      recall: "91.9%",
      f1: "91.3%",
      speed: "24ms",
      desc: "Superior accuracy for complex semantic patterns in long-form reviews."
    },
    {
      id: "bert",
      name: "Neural BERT",
      accuracy: "94.8%",
      precision: "94.2%",
      recall: "95.1%",
      f1: "94.6%",
      speed: "180ms",
      desc: "State-of-the-art transformer model for deep semantic understanding."
    }
  ]

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <p className="text-[10px] font-black text-[#F5C518] uppercase tracking-[0.4em]">Algorithm Benchmarks</p>
        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter">Model Comparison</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {models.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#121212] border border-white/5 p-8 rounded-3xl relative overflow-hidden group"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-black uppercase tracking-tight text-white group-hover:text-[#F5C518] transition-colors">{m.name}</h3>
                  <p className="text-xs text-white/30 leading-relaxed">{m.desc}</p>
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Invocations</p>
                   <p className="text-lg font-display font-black text-[#F5C518]">{usage[m.id] || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Accuracy', value: m.accuracy, icon: Target },
                  { label: 'Precision', value: m.precision, icon: Shield },
                  { label: 'Recall', value: m.recall, icon: Activity },
                  { label: 'F1 Score', value: m.f1, icon: BarChart2 },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-lg font-display font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F5C518]/5 border border-[#F5C518]/10 rounded-xl">
                 <div className="flex items-center gap-2">
                   <Zap size={14} className="text-[#F5C518]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#F5C518]">Inference</span>
                 </div>
                 <span className="text-sm font-black text-[#F5C518]">{m.speed}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visual Benchmark Chart Placeholder */}
      <section className="bg-[#121212] border border-white/5 p-12 rounded-[40px] space-y-12">
        <div className="flex justify-between items-center">
           <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-white">Performance Hierarchy</h3>
           <Cpu size={24} className="text-white/10" />
        </div>
        
        <div className="space-y-10">
          {models.map((m, i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/40">{m.name}</span>
                <span className="text-[#F5C518]">{m.accuracy} Accuracy</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: m.accuracy }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                  className="h-full bg-gradient-to-r from-[#F5C518] to-[#E2B616] rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Compare
