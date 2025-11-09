import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Save, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  FileText, 
  Sparkles,
  Tag,
  Globe,
  Lock,
  FileQuestion
} from 'lucide-react'
import axios from 'axios'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card } from '../components/ui/card'
import { useToast } from '../components/ui/toast'

export default function NoteEditor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useToast()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [visibility, setVisibility] = useState('private')
  const [isDraft, setIsDraft] = useState(false)
  const [tags, setTags] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (id) {
      fetchNote()
    }
  }, [id])

  const fetchNote = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
      setTitle(res.data.title)
      setContent(res.data.content)
      setVisibility(res.data.visibility)
      setIsDraft(res.data.is_draft)
      setTags(res.data.tags || '')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load note",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const noteData = {
        title,
        content,
        visibility,
        is_draft: isDraft,
        tags: tags || null
      }

      if (id) {
        await axios.put(`/notes/${id}`, noteData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
        toast({
          title: "Success!",
          description: "Note updated successfully",
        })
      } else {
        await axios.post('/notes', noteData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
        toast({
          title: "Success!",
          description: "Note created successfully",
        })
      }
      navigate('/')
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to save note",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const visibilityOptions = [
    {
      value: 'private',
      label: 'Private',
      description: 'Only you can see this',
      icon: Lock,
      gradient: 'from-red-600 to-pink-600',
      bgGradient: 'from-red-500/10 to-pink-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      value: 'public',
      label: 'Public',
      description: 'Everyone can see this',
      icon: Globe,
      gradient: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      value: 'unlisted',
      label: 'Unlisted',
      description: 'Only with link',
      icon: FileQuestion,
      gradient: 'from-yellow-600 to-orange-600',
      bgGradient: 'from-yellow-500/10 to-orange-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="aurora" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-950 dark:via-indigo-950/30 dark:to-purple-950/30" />
      
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(10)].map((_, i) => (
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/')}
              className="p-3 rounded-xl glass border border-white/20 hover:border-indigo-500/30 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </motion.button>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </motion.div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {id ? 'Edit Note' : 'Create Note'}
              </h1>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg ml-16">
            {id ? 'Update your note with new ideas' : 'Start writing something amazing'}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
            <Card className="relative glass rounded-2xl p-6 border border-white/20 group-focus-within:border-indigo-500/30 transition-all duration-300">
              <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Title
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a captivating title..."
                required
                className="text-2xl font-bold bg-transparent border-0 focus:ring-0 p-0 placeholder:text-slate-400"
              />
            </Card>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
            <Card className="relative glass rounded-2xl p-6 border border-white/20 group-focus-within:border-purple-500/30 transition-all duration-300">
              <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts here..."
                required
                rows={12}
                className="w-full bg-transparent border-0 focus:ring-0 p-0 resize-none text-slate-900 dark:text-white placeholder:text-slate-400 text-lg leading-relaxed"
              />
            </Card>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-orange-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
            <Card className="relative glass rounded-2xl p-6 border border-white/20 group-focus-within:border-pink-500/30 transition-all duration-300">
              <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <Input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="work, personal, ideas (comma-separated)"
                className="bg-transparent border-0 focus:ring-0 p-0 placeholder:text-slate-400"
              />
            </Card>
          </motion.div>

          {/* Visibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Visibility
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {visibilityOptions.map((option, index) => {
                const Icon = option.icon
                const isSelected = visibility === option.value
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => setVisibility(option.value)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    {isSelected && (
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${option.gradient} rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity`} />
                    )}
                    <Card className={`relative glass rounded-2xl p-6 border transition-all duration-300 ${
                      isSelected
                        ? `${option.borderColor} bg-gradient-to-br ${option.bgGradient}`
                        : 'border-white/20 hover:border-white/30'
                    }`}>
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className={`p-3 rounded-xl ${isSelected ? `bg-gradient-to-br ${option.gradient}` : 'bg-slate-100 dark:bg-slate-800'}`}>
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                        </div>
                        <div>
                          <p className={`font-semibold mb-1 ${isSelected ? option.textColor : 'text-slate-900 dark:text-white'}`}>
                            {option.label}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Draft Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="glass rounded-2xl p-6 border border-white/20">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-600 to-orange-600">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Save as Draft</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">You can publish it later</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isDraft}
                  onChange={(e) => setIsDraft(e.target.checked)}
                  className="w-6 h-6 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </label>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                type="button"
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full glass border-white/20 hover:border-slate-500/30 py-6 rounded-xl text-lg font-semibold"
              >
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-xl shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 text-lg"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {id ? 'Update Note' : 'Create Note'}
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
