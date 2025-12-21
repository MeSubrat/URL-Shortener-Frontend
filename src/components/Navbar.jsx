import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const [isAuthed, setIsAuthed] = useState(false)
  const [userInitial, setUserInitial] = useState('')
  const [userName, setUserName] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem('token')
      const name = localStorage.getItem('userName') || ''
      setIsAuthed(Boolean(token))
      setUserName(name)
      setUserInitial(name.trim().charAt(0)?.toUpperCase() || '')
    }

    syncAuth()
    window.addEventListener('storage', syncAuth)
    window.addEventListener('auth-change', syncAuth)
    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener('auth-change', syncAuth)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    setIsAuthed(false)
    setUserInitial('')
    setUserName('')
    setShowDropdown(false)
    window.dispatchEvent(new Event('auth-change'))
    navigate('/')
  }

  const handleProfile = () => {
    setShowDropdown(false)
    // TODO: Navigate to profile page when you create it
    // navigate('/profile')
    console.log('Navigate to profile page')
  }

  return (
    <nav className="w-full border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-indigo-200 to-white bg-clip-text text-transparent hover:opacity-80 transition cursor-pointer"
          >
            URL Shortener
          </button>
          <div className="flex items-center gap-4">
            {!isAuthed ? (
              <>
                <button
                  onClick={() => navigate('/login-user')}
                  className="text-sm font-medium text-slate-200 hover:text-white transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register-user')}
                  className="rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-500/50"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full bg-indigo-500/80 text-white flex items-center justify-center font-semibold hover:bg-indigo-500 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                  aria-label="User menu"
                >
                  {userInitial || '?'}
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">{userName || 'User'}</p>
                      <p className="text-xs text-slate-400 mt-1">Signed in</p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={handleProfile}
                        className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-white/10 transition flex items-center gap-3"
                      >
                        <svg
                          className="w-5 h-5 text-indigo-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-200 hover:bg-red-500/10 transition flex items-center gap-3"
                      >
                        <svg
                          className="w-5 h-5 text-red-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

