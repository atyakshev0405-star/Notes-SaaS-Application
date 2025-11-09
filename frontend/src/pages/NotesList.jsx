import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  FileText, 
  Globe,
  Sparkles,
  TrendingUp,
  Clock,
  Tag
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card } from '../components/ui/card'

export default function NotesList({ defaultTab = 'my' }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState(defaultTab)

  useEffect(() => {
    fetchNotes()
  }, [activeTab])

  const fetchNotes = async () => {
    setLoading(true)
    try {
      let res
      if (activeTab === 'public') {
        res = await axios.get('/notes/public')
      } else if (activeTab === 'my') {
        res = await axios.get('/notes', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
      } else {
        res = await axios.get('/notes', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
      }
      setNotes(res.data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return
    try {
      await axios.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
      setNotes(notes.filter(note => note.id !== id))
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note')
    }
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getVisibilityBadge = (visibility) => {
    const badges = {
      private: { 
        color: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-600 dark:text-red-400 border border-red-500/30', 
        icon: EyeOff, 
        label: 'Private',
        glow: 'shadow-lg shadow-red-500/20'
      },
      public: { 
        color: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400 border border-green-500/30', 
        icon: Eye, 
        label: 'Public',
        glow: 'shadow-lg shadow-green-500/20'
      },
      unlisted: { 
        color: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30', 
        icon: FileText, 
        label: 'Unlisted',
        glow: 'shadow-lg shadow-yellow-500/20'
      }
    }
    const badge = badges[visibility] || badges.private
    const Icon = badge.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${badge.color} ${badge.glow} backdrop-blur-sm`}>
        <Icon className="w-3.5 h-3.5" />
        {badge.label}
      </span>
    )
  }

  const showTabs = defaultTab !== 'public'
  
  const tabs = [
    { id: 'my', label: 'My Notes', icon: FileText, gradient: 'from-indigo-600 to-purple-600' },
    { id: 'public', label: 'Public Notes', icon: Globe, gradient: 'from-green-600 to-emerald-600' },
    ...(user?.role === 'admin' ? [
      { id: 'all', label: 'All Notes', icon: Filter, gradient: 'from-orange-600 to-red-600' }
    ] : [])
  ]

  const stats = [
    { label: 'Total Notes', value: filteredNotes.length, icon: FileText, color: 'from-indigo-600 to-purple-600' },
    { label: 'Public', value: filteredNotes.filter(n => n.visibility === 'public').length, icon: Globe, color: 'from-green-600 to-emerald-600' },
    { label: 'Private', value: filteredNotes.filter(n => n.visibility === 'private').length, icon: EyeOff, color: 'from-red-600 to-pink-600' },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="aurora" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-950 dark:via-indigo-950/30 dark:to-purple-950/30" />
      
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 80 + 40}px`,
              height: `${Math.random() * 80 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {defaultTab === 'public' ? 'Public Notes' : 'My Notes'}
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {defaultTab === 'public' ? 'Explore amazing notes from the community' : 'Create, organize, and manage your notes with style'}
          </p>
        </motion.div>

        {/* Stats Cards */}
        {showTabs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity`} />
                  <div className="relative glass rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Tabs */}
        {showTabs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex flex-wrap gap-3"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  {isActive && (
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${tab.gradient} rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity`} />
                  )}
                  <div className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-xl`
                      : 'glass text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-white/20'
                  }`}>
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </div>
                </motion.button>
              )
            })}
          </motion.div>
        )}

        {/* Search and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showTabs ? 0.3 : 0.1 }}
          className="mb-8 flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              type="text"
              placeholder="Search your notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-6 glass border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-lg"
            />
          </div>
          
          {showTabs && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/notes/new')}
                className="relative overflow-hidden group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 rounded-xl shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  New Note
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full"
            />
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FileText className="w-24 h-24 mx-auto text-slate-300 dark:text-slate-700 mb-6" />
            </motion.div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              No notes found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
              {searchTerm ? 'Try adjusting your search' : activeTab === 'public' ? 'No public notes available yet' : 'Create your first note to get started'}
            </p>
            {!searchTerm && activeTab === 'my' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/notes/new')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl shadow-xl shadow-indigo-500/30"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Note
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  
                  {/* Card */}
                  <Card className="relative glass rounded-2xl p-6 border border-white/20 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer h-full flex flex-col">
                    <div onClick={() => navigate(`/notes/${note.id}`)} className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all line-clamp-2 flex-1">
                          {note.title}
                        </h3>
                        {note.is_draft && (
                          <span className="ml-2 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 dark:text-yellow-400 rounded-full border border-yellow-500/30">
                            Draft
                          </span>
                        )}
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {note.content}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        {getVisibilityBadge(note.visibility)}
                        
                        {note.tags && (
                          <div className="flex gap-2 flex-wrap">
                            {note.tags.split(',').slice(0, 2).map((tag, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-500/20"
                              >
                                <Tag className="w-3 h-3" />
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {note.created_at && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="w-3 h-3" />
                          {new Date(note.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          onClick={() => navigate(`/notes/${note.id}`)}
                          variant="outline"
                          size="sm"
                          className="w-full glass border-indigo-500/30 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 transition-all duration-300"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNote(note.id)
                          }}
                          variant="outline"
                          size="sm"
                          className="glass border-red-500/30 text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10 hover:border-red-500/50 transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
