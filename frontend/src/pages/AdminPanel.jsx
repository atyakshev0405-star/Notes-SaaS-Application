import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Shield, 
  UserCheck, 
  UserX, 
  Crown,
  Activity,
  TrendingUp,
  Sparkles,
  Search,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react'
import axios from 'axios'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card } from '../components/ui/card'
import { useToast } from '../components/ui/toast'

export default function AdminPanel() {
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
      setUsers(res.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleUserRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin'
      await axios.put(`/admin/users/${userId}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
      )
      toast({
        title: "Success!",
        description: `User role updated to ${newRole}`,
      })
      fetchUsers()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`/admin/users/${userId}/status`,
        { is_active: !currentStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
      )
      toast({
        title: "Success!",
        description: `User ${!currentStatus ? 'activated' : 'deactivated'}`,
      })
      fetchUsers()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      icon: Users,
      gradient: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      iconBg: 'from-blue-600 to-cyan-600'
    },
    {
      label: 'Admins',
      value: users.filter(u => u.role === 'admin').length,
      icon: Crown,
      gradient: 'from-purple-600 to-pink-600',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      iconBg: 'from-purple-600 to-pink-600'
    },
    {
      label: 'Active Users',
      value: users.filter(u => u.is_active).length,
      icon: UserCheck,
      gradient: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      iconBg: 'from-green-600 to-emerald-600'
    },
    {
      label: 'Inactive',
      value: users.filter(u => !u.is_active).length,
      icon: UserX,
      gradient: 'from-red-600 to-orange-600',
      bgGradient: 'from-red-500/10 to-orange-500/10',
      iconBg: 'from-red-600 to-orange-600'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="aurora" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-950 dark:via-purple-950/30 dark:to-pink-950/30" />
      
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
              <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Manage users, roles, and permissions
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
                <Card className={`relative glass rounded-2xl p-6 border border-white/20 bg-gradient-to-br ${stat.bgGradient}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.iconBg} shadow-lg`}>
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

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            <Input
              type="text"
              placeholder="Search users by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-6 glass border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-lg"
            />
          </div>
        </motion.div>

        {/* Users Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-600 rounded-full"
            />
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading users...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <Card className="relative glass rounded-2xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Verified
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                                <span className="text-white font-semibold">
                                  {user.email[0].toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">
                                  {user.email}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  ID: {user.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                              user.role === 'admin'
                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                                : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                            }`}>
                              {user.role === 'admin' ? <Crown className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                              user.is_active
                                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                                : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                            }`}>
                              {user.is_active ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                              user.is_verified
                                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                                : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {user.is_verified ? '✓ Verified' : '⏳ Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  onClick={() => toggleUserRole(user.id, user.role)}
                                  size="sm"
                                  variant="outline"
                                  className="glass border-purple-500/30 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:border-purple-500/50 transition-all"
                                >
                                  <Shield className="w-4 h-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  onClick={() => toggleUserStatus(user.id, user.is_active)}
                                  size="sm"
                                  variant="outline"
                                  className={`glass transition-all ${
                                    user.is_active
                                      ? 'border-red-500/30 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 hover:border-red-500/50'
                                      : 'border-green-500/30 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 hover:border-green-500/50'
                                  }`}
                                >
                                  {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                </Button>
                              </motion.div>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
