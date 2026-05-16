import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Film, Shield, ArrowRight, AlertCircle } from 'lucide-react'

function Login() {
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
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/auth/login`, { email, password })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      navigate('/dashboard')
    } catch (err) {
      console.error('Login failed:', err)
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#121212] border border-white/5 p-12 rounded-[32px] space-y-10 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="bg-[#F5C518] text-black px-3 py-1 rounded-sm font-black text-2xl tracking-tighter shadow-[0_0_20px_rgba(245,197,24,0.2)]">
            IMDb
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-black uppercase tracking-tight">Intelligence</h1>
            <p className="text-xs text-white/30 uppercase font-bold tracking-widest">Secure Analyst Login</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 px-1">Access Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@imdb.ai"
                className="w-full rounded-xl border border-white/5 bg-[#0A0A0A] px-6 py-4 text-sm text-white placeholder:text-white/10 focus:border-[#F5C518]/30 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 px-1">Security Key</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/5 bg-[#0A0A0A] px-6 py-4 text-sm text-white placeholder:text-white/10 focus:border-[#F5C518]/30 focus:outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest bg-rose-500/5 p-4 rounded-xl border border-rose-500/10">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="btn-imdb w-full py-5 flex justify-center items-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Decrypting...' : 'Initialize Session'}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <div className="flex flex-col items-center gap-4 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
            Unauthorized Personnel?
          </p>
          <Link to="/signup" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F5C518] hover:text-[#E2B616] transition-colors">
            Request Analyst Access
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
