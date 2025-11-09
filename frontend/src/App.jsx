import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AnimatePresence } from 'framer-motion'
import axios from 'axios'
import Login from './pages/Login'
import Register from './pages/Register'
import NotesList from './pages/NotesList'
import NoteEditor from './pages/NoteEditor'
import AdminPanel from './pages/AdminPanel'
import AuditLog from './pages/AuditLog'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import { AuthProvider } from './hooks/useAuth'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from './components/ui/toast'

// Configure axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
              <Navbar />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<ProtectedRoute><NotesList /></ProtectedRoute>} />
                  <Route path="/public" element={<NotesList defaultTab="public" />} />
                  <Route path="/notes/new" element={<ProtectedRoute><NoteEditor /></ProtectedRoute>} />
                  <Route path="/notes/:id" element={<ProtectedRoute><NoteEditor /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
                  <Route path="/admin/audit" element={<ProtectedRoute adminOnly><AuditLog /></ProtectedRoute>} />
                </Routes>
              </AnimatePresence>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
