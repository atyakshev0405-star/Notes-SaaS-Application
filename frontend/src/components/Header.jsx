import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/button'

export default function Header() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Don't show header on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  // Don't show header if still loading or no user
  if (loading || !user) {
    return null
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              📝 Notes App
            </Link>
            <nav className="flex space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                My Notes
              </Link>
              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin Panel
                  </Link>
                  <Link
                    to="/admin/audit"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Audit Log
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.email}
              {user?.role === 'admin' && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  Admin
                </span>
              )}
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
