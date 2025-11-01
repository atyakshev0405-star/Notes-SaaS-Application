import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, Plus, Loader2, CheckCircle, XCircle, Menu, X } from 'lucide-react';
import axios from 'axios';
import NoteCard from './components/NoteCard';
import Sidebar from './components/Sidebar';
import UserTable from './components/UserTable';
import Profile from './components/Profile';
import ErrorPage from './components/ErrorPage';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [accessLevel, setAccessLevel] = useState('private');
  const [isLogin, setIsLogin] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAccessLevel, setEditAccessLevel] = useState('private');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token });
      fetchNotes();
      if (user?.role === 'admin') {
        fetchAllNotes();
      }
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, { email, password });
      const { access_token, role } = response.data;
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser({ token: access_token, role, email, password });
      fetchNotes();
      if (role === 'admin') {
        fetchAllNotes();
      }
      showNotification(`${isLogin ? 'Login' : 'Registration'} successful!`);
    } catch (error) {
      showNotification(error.response?.data?.detail || 'Authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notes/`);
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const fetchAllNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/notes`);
      setAllNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch all notes:', error);
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/notes/`, { title, content, access_level: accessLevel });
      console.log('Note created:', response.data);
      setTitle('');
      setContent('');
      setAccessLevel('private');
      fetchNotes();
      showNotification('Note created successfully!');
    } catch (error) {
      console.error('Failed to create note:', error);
      showNotification('Failed to create note: ' + (error.response?.data?.detail || error.message), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditAccessLevel(note.access_level);
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditContent('');
    setEditAccessLevel('private');
  };

  const updateNote = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/notes/${editingNote.id}`, {
        title: editTitle,
        content: editContent,
        access_level: editAccessLevel
      });
      console.log('Note updated:', response.data);
      cancelEdit();
      fetchNotes();
      showNotification('Note updated successfully!');
    } catch (error) {
      console.error('Failed to update note:', error);
      showNotification('Failed to update note: ' + (error.response?.data?.detail || error.message), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/notes/${noteId}`);
      fetchNotes();
      showNotification('Note deleted successfully!');
    } catch (error) {
      console.error('Failed to delete note:', error);
      showNotification('Failed to delete note: ' + (error.response?.data?.detail || error.message), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setNotes([]);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">

        <div className="card w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Notes SaaS
            </h1>
            <h2 className="text-xl font-semibold text-gray-700">
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="email">
                Email Address
              </label>
              <input
                className="input-field w-full"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                className="input-field w-full"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="btn-primary w-full flex items-center justify-center"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
            <div className="text-center">
              <button
                className="text-blue-600 hover:text-blue-800 font-medium"
                type="button"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Note</h2>
                <form onSubmit={createNote} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="title">
                      Title
                    </label>
                    <input
                      className="input-field w-full"
                      id="title"
                      type="text"
                      placeholder="Enter note title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="content">
                      Content
                    </label>
                    <textarea
                      className="input-field w-full resize-none"
                      id="content"
                      rows="4"
                      placeholder="Write your note content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="accessLevel">
                      Access Level
                    </label>
                    <select
                      className="input-field w-full"
                      id="accessLevel"
                      value={accessLevel}
                      onChange={(e) => setAccessLevel(e.target.value)}
                    >
                      <option value="private">🔒 Private</option>
                      <option value="public">🌍 Public</option>
                      <option value="shared">🤝 Shared</option>
                    </select>
                  </div>
                  <button
                    className="btn-primary w-full flex items-center justify-center"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? 'Creating...' : 'Create Note'}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Notes ({notes.length})</h2>
                {notes.length === 0 ? (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No notes yet</h3>
                    <p className="text-gray-600 text-sm">Create your first note to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {notes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={startEdit}
                        onDelete={deleteNote}
                        isEditing={editingNote && editingNote.id === note.id}
                        editForm={{
                          title: editTitle,
                          content: editContent,
                          accessLevel: editAccessLevel,
                          setTitle: setEditTitle,
                          setContent: setEditContent,
                          setAccessLevel: setEditAccessLevel
                        }}
                        onSaveEdit={updateNote}
                        onCancelEdit={cancelEdit}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'notes':
        return (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">My Notes</h2>
            {notes.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No notes yet</h3>
                <p className="text-gray-600 text-sm">Create your first note to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={startEdit}
                    onDelete={deleteNote}
                    isEditing={editingNote && editingNote.id === note.id}
                    editForm={{
                      title: editTitle,
                      content: editContent,
                      accessLevel: editAccessLevel,
                      setTitle: setEditTitle,
                      setContent: setEditContent,
                      setAccessLevel: setEditAccessLevel
                    }}
                    onSaveEdit={updateNote}
                    onCancelEdit={cancelEdit}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case 'users':
        return <UserTable showNotification={showNotification} />;
      case 'all-notes':
        return (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">All Notes</h2>
            {allNotes.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No notes found</h3>
                <p className="text-gray-600 text-sm">No notes have been created yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    isEditing={false}
                    editForm={{}}
                    onSaveEdit={() => {}}
                    onCancelEdit={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case 'profile':
        return <Profile user={user} onLogout={logout} showNotification={showNotification} />;
      default:
        return <ErrorPage errorCode={404} onGoHome={() => setCurrentPage('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`toast ${notification.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {notification.type === 'error' ? (
            <XCircle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="ml-2 md:ml-0 text-xl font-semibold text-gray-900">
                Notes SaaS
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={logout}
                className="btn-danger"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Top Navigation Panel */}
        <div className={`fixed top-16 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'animate-slide-down opacity-100' : 'animate-fade-out opacity-0 pointer-events-none'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Sidebar
              currentPage={currentPage}
              setCurrentPage={(page) => {
                setCurrentPage(page);
                setSidebarOpen(false);
              }}
              userRole={user?.role || 'user'}
            />
          </div>
        </div>



        {/* Main Content */}
        <main className="flex-1 p-8 md:ml-0">
          <div className="max-w-7xl mx-auto">
            <div className="page-enter-active">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
