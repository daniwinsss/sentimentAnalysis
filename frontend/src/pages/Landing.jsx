import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Film, Zap, BarChart2, Shield, Search, ArrowRight } from 'lucide-react'

function Landing() {
  const features = [
    {
      icon: Search,
      title: "Review Intelligence",
      description: "Deep semantic analysis of IMDb movie reviews with 98% accuracy on sentiment detection."
    },
    {
      icon: BarChart2,
      title: "Model Benchmarking",
      description: "Compare Logistic Regression, Naive Bayes, and SVM models on real cinematic datasets."
    },
    {
      icon: Zap,
      title: "Real-time Inference",
      description: "Zero-latency predictions powered by optimized FastAPI and Scikit-learn pipelines."
    }
  ]

  const movieExamples = [
    { text: "A cinematic masterpiece. The pacing was perfect and the acting was top-tier.", sentiment: "Positive" },
    { text: "Completely wasted my time. The plot was non-existent and the sound design was poor.", sentiment: "Negative" },
    { text: "Visually stunning but emotionally hollow. Great to look at, hard to feel for.", sentiment: "Mixed" }
  ]

  return (
    <div className="space-y-40">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center max-w-5xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-12"
        >
          IMDb Dataset v2.0 • 50,000 Reviews Indexed
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-7xl md:text-9xl font-display font-black leading-[0.9] tracking-tighter uppercase mb-12"
        >
          Cinematic <br />
          <span className="text-white/20">Intelligence.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl font-medium leading-relaxed mb-16"
        >
          The professional standard for IMDb sentiment analysis. Benchmark movie reviews with enterprise-grade NLP and cinematic-quality visualization.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6"
        >
          <Link to="/signup" className="btn-imdb flex items-center gap-4 group">
            Start Analyzing <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/analyze" className="px-10 py-4 rounded-md border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
            Try Preview
          </Link>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#F5C518]/[0.05] blur-[100px] rounded-full -z-10 animate-pulse" />
      </section>

      {/* Review Showcase Section */}
      <section className="grid gap-8 md:grid-cols-3">
        {movieExamples.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-2xl relative group"
          >
            <div className={`absolute top-6 right-8 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${
              item.sentiment === 'Positive' ? 'bg-emerald-500/20 text-emerald-500' : 
              item.sentiment === 'Negative' ? 'bg-rose-500/20 text-rose-500' : 'bg-white/10 text-white/40'
            }`}>
              {item.sentiment}
            </div>
            <Film size={20} className="text-[#F5C518] mb-8 group-hover:scale-110 transition-transform" />
            <p className="text-sm italic leading-relaxed text-white/60 mb-6 font-medium">"{item.text}"</p>
            <div className="h-[2px] w-8 bg-[#F5C518] opacity-20" />
          </motion.div>
        ))}
      </section>

      {/* Feature Section */}
      <section className="bg-[#121212] border border-white/5 rounded-[40px] p-12 lg:p-24">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter leading-[0.9]">
              Engineered for <br />
              <span className="text-[#F5C518]">IMDb Accuracy.</span>
            </h2>
            <div className="space-y-8">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div key={i} className="flex gap-6 group">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-[#F5C518]/30 transition-colors">
                      <Icon size={20} className="text-[#F5C518]" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-black uppercase tracking-widest text-white">{feature.title}</h4>
                      <p className="text-sm text-white/40 leading-relaxed max-w-sm">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/5 overflow-hidden flex flex-col p-12 space-y-8">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">IMDb Analytics v.04</span>
                 <Zap size={14} className="text-[#F5C518]" />
               </div>
               <div className="flex-1 flex flex-col justify-center text-center space-y-2">
                 <span className="text-6xl font-display font-black text-white">98.2%</span>
                 <span className="text-[10px] font-black text-[#F5C518] uppercase tracking-[0.4em]">F1 Benchmark</span>
               </div>
               <div className="h-40 w-full flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      className="flex-1 bg-white/5 rounded-t-sm"
                    />
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-40 text-center flex flex-col items-center">
        <h3 className="text-5xl font-display font-black uppercase tracking-tighter mb-12 max-w-2xl leading-none">
          Ready to experience the <span className="text-[#F5C518]">future of film NLP?</span>
        </h3>
        <Link to="/signup" className="btn-imdb px-12 py-5 text-sm">
          Initialize Pro Workspace
        </Link>
      </section>
    </div>
  )
}

export default Landing
