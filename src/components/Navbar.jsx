import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const [isAuthed, setIsAuthed] = useState(false)
  const [userInitial, setUserInitial] = useState('')

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem('token')
      const name = localStorage.getItem('userName') || ''
      setIsAuthed(Boolean(token))
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
              <div className="w-10 h-10 rounded-full bg-indigo-500/80 text-white flex items-center justify-center font-semibold">
                {userInitial || '?'}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

