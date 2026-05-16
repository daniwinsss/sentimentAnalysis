import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Search, 
  History, 
  Upload, 
  LogOut, 
  Film,
  BarChart2,
  User,
  Menu,
  X
} from 'lucide-react'

function Shell({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    navigate('/login')
  }

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/analyze', label: 'Analyze Review', icon: Search },
    { path: '/batch', label: 'Batch Process', icon: Upload },
    { path: '/history', label: 'Archives', icon: History },
    { path: '/compare', label: 'Model Benchmarks', icon: BarChart2 },
  ]

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white">
      {/* Sidebar for Authenticated Users */}
      {token && (
        <aside 
          className={`bg-[#121212] border-r border-white/5 flex flex-col sticky top-0 h-screen transition-all duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen && (
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="bg-[#F5C518] text-black px-2 py-0.5 rounded-sm font-black text-lg tracking-tighter">
                  IMDb
                </div>
                <span className="font-display font-bold text-sm tracking-tight text-white/90">INTELLIGENCE</span>
              </Link>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <nav className="flex-1 px-3 space-y-1 mt-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all group ${
                    isActive 
                      ? 'bg-[#F5C518] text-black shadow-[0_0_20px_rgba(245,197,24,0.15)]' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-black' : 'group-hover:text-[#F5C518] transition-colors'} />
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-white/5 space-y-4">
            <div className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/5 ${!isSidebarOpen ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-[#F5C518] flex items-center justify-center text-black font-bold text-xs shrink-0">
                {user.name?.charAt(0) || 'U'}
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold truncate text-white uppercase tracking-wider">{user.name || 'Pro User'}</p>
                  <p className="text-[8px] text-[#F5C518] uppercase tracking-widest font-black">Verified Analyst</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/5 transition-all ${
                !isSidebarOpen ? 'justify-center' : ''
              }`}
            >
              <LogOut size={18} />
              {isSidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen relative flex flex-col">
        {/* Top Navbar for Guests / Landing */}
        {!token && (
          <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-[#F5C518] text-black px-2 py-0.5 rounded-sm font-black text-xl tracking-tighter">
                  IMDb
                </div>
                <span className="font-display font-bold text-lg tracking-tight text-white/90 uppercase">Intelligence</span>
              </Link>
              
              <div className="flex items-center gap-8">
                <Link to="/login" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                  Member Login
                </Link>
                <Link to="/signup" className="btn-imdb">
                  Initialize Access
                </Link>
              </div>
            </div>
          </header>
        )}

        {/* Dynamic Content */}
        <div className={`flex-1 p-8 lg:p-12 ${!token ? 'pt-32' : ''} max-w-[1600px] mx-auto w-full`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Subtle Background Glows */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#F5C518]/[0.02] blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-white/[0.01] blur-[100px] rounded-full pointer-events-none -z-10" />
      </main>
    </div>
  )
}

export default Shell
