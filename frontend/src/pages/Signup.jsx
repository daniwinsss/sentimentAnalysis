import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/auth/signup`, { name, email, password })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      navigate('/dashboard')
    } catch (err) {
      console.error('Signup failed:', err)
      setError(err.response?.data?.message || 'Initialization failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg glass p-12 rounded-[48px] space-y-10"
    >
      <div className="space-y-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Initialization</p>
        <h1 className="text-4xl font-medium text-white tracking-tight">Create workspace.</h1>
        <p className="text-sm text-white/40">Enter your details to deploy your analytics environment.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 px-2">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Morgan"
            className="w-full rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-4 text-sm text-white placeholder:text-white/10 focus:border-white/20 focus:outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 px-2">
            Workspace Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-4 text-sm text-white placeholder:text-white/10 focus:border-white/20 focus:outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 px-2">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-4 text-sm text-white placeholder:text-white/10 focus:border-white/20 focus:outline-none transition-all"
          />
        </div>

        {error && (
          <p className="text-rose-500 text-[10px] font-bold uppercase tracking-[0.1em] text-center">
            {error}
          </p>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full overflow-hidden rounded-full bg-white py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black transition-transform active:scale-95 disabled:opacity-50"
        >
          <span className="relative z-10">{loading ? 'Deploying...' : 'Deploy Account'}</span>
          {!loading && <div className="absolute inset-0 -translate-x-full bg-neutral-200 transition-transform group-hover:translate-x-0" />}
        </button>
      </form>

      <div className="flex flex-col items-center gap-4 border-t border-white/5 pt-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
          Already authorized?
        </p>
        <Link to="/login" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-white/80 transition-colors">
          Access Workspace
        </Link>
      </div>
    </motion.div>
  )
}

export default Signup
