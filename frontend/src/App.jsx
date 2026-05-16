import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Shell from './components/Shell.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Analyzer from './pages/Analyzer.jsx'
import BatchUpload from './pages/BatchUpload.jsx'
import History from './pages/History.jsx'
import Compare from './pages/Compare.jsx'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/analyze" element={<ProtectedRoute><Analyzer /></ProtectedRoute>} />
          <Route path="/batch" element={<ProtectedRoute><BatchUpload /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}

export default App
