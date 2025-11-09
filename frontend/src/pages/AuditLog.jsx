import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Shield, 
  User,
  FileText,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Eye,
  Clock,
  Filter,
  Search,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import axios from 'axios'
import { Input } from '../components/ui/input'
import { Card } from '../components/ui/card'
import { useToast } from '../components/ui/toast'

export default function AuditLog() {
  const { toast } = useToast()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/admin/audit', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
      setLogs(res.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load audit logs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action) => {
    const icons = {
      login: LogIn,
      logout: LogOut,
      register: User,
      create_note: Plus,
      update_note: Edit,
      delete_note: Trash2,
      view_note: Eye,
      change_role: Shield,
    }
    return icons[action] || Activity
  }

  const getActionColor = (action) => {
    const colors = {
      login: { 
        bg: 'from-green-500/20 to-emerald-500/20', 
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-500/30',
        glow: 'from-green-600 to-emerald-600'
      },
      logout: { 
        bg: 'from-orange-500/20 to-red-500/20', 
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-500/30',
        glow: 'from-orange-600 to-red-600'
      },
      register: { 
        bg: 'from-blue-500/20 to-cyan-500/20', 
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-500/30',
        glow: 'from-blue-600 to-cyan-600'
      },
      create_note: { 
        bg: 'from-purple-500/20 to-pink-500/20', 
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-500/30',
        glow: 'from-purple-600 to-pink-600'
      },
      update_note: { 
        bg: 'from-indigo-500/20 to-blue-500/20', 
        text: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-500/30',
        glow: 'from-indigo-600 to-blue-600'
      },
      delete_note: { 
        bg: 'from-red-500/20 to-pink-500/20', 
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-500/30',
        glow: 'from-red-600 to-pink-600'
      },
      change_role: { 
        bg: 'from-yellow-500/20 to-orange-500/20', 
        text: 'text-yellow-600 dark:text-yellow-400',
        border: 'border-yellow-500/30',
        glow: 'from-yellow-600 to-orange-600'
      },
    }
    return colors[action] || { 
      bg: 'from-slate-500/20 to-gray-500/20', 
      text: 'text-slate-600 dark:text-slate-400',
      border: 'border-slate-500/30',
      glow: 'from-slate-600 to-gray-600'
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.actor_id?.toString().includes(searchTerm)
    const matchesFilter = filterAction === 'all' || log.action === filterAction
    return matchesSearch && matchesFilter
  })

  const actionTypes = ['all', ...new Set(logs.map(log => log.action))]

  const stats = [
    {
      label: 'Total Events',
      value: logs.length,
      icon: Activity,
      gradient: 'from-indigo-600 to-purple-600'
    },
    {
      label: 'Today',
      value: logs.filter(log => {
        const today = new Date().toDateString()
        return new Date(log.created_at).toDateString() === today
      }).length,
      icon: Clock,
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      label: 'User Actions',
      value: logs.filter(log => ['login', 'logout', 'register'].includes(log.action)).length,
      icon: User,
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      label: 'Note Actions',
      value: logs.filter(log => log.action.includes('note')).length,
      icon: FileText,
      gradient: 'from-purple-600 to-pink-600'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="aurora" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-cyan-50/30 dark:from-slate-950 dark:via-indigo-950/30 dark:to-cyan-950/30" />
      
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
              <Activity className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Audit Log
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Track all system activities and user actions
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity`} />
                <Card className="relative glass rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </motion.div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold gradient-text">
                    {stat.value}
                  </p>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 space-y-4"
        >
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              type="text"
              placeholder="Search by action or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-6 glass border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-lg"
            />
          </div>

          {/* Action Filter */}
          <div className="flex flex-wrap gap-2">
            {actionTypes.map((action, index) => (
              <motion.button
                key={action}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterAction(action)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  filterAction === action
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'glass text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-white/20'
                }`}
              >
                {action === 'all' ? 'All Actions' : action.replace('_', ' ')}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Logs */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full"
            />
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading audit logs...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredLogs.map((log, index) => {
                const Icon = getActionIcon(log.action)
                const colors = getActionColor(log.action)
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="relative group"
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.glow} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity`} />
                    <Card className="relative glass rounded-2xl p-6 border border-white/20 hover:border-indigo-500/30 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} shadow-lg flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${colors.text}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                {log.action.replace('_', ' ').toUpperCase()}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <User className="w-3.5 h-3.5" />
                                  User ID: {log.actor_id}
                                </span>
                                {log.target_type && (
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5" />
                                    {log.target_type} #{log.target_id}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${colors.bg} ${colors.text} border ${colors.border} whitespace-nowrap`}>
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                          </div>

                          {/* Additional Info */}
                          {(log.ip || log.user_agent) && (
                            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                              {log.ip && (
                                <p className="flex items-center gap-2">
                                  <span className="font-medium">IP:</span>
                                  <span className="font-mono">{log.ip}</span>
                                </p>
                              )}
                              {log.user_agent && (
                                <p className="flex items-center gap-2">
                                  <span className="font-medium">User Agent:</span>
                                  <span className="truncate">{log.user_agent}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {filteredLogs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <Activity className="w-24 h-24 mx-auto text-slate-300 dark:text-slate-700 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  No logs found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Try adjusting your search or filter
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
