import { useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function RegisterUser({ setLoginPage }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const response = await axios.post(`${apiUrl}/api/auth/register-user`, { name, email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = response.data;
      const displayName = result?.user?.name || name;
      if (result?.token) {
        localStorage.setItem('token', result.token);
      }
      if (displayName) {
        localStorage.setItem('userName', displayName);
      }
      window.dispatchEvent(new Event('auth-change'));
      navigate('/url-page');
    } catch (error) {
      console.log('Error: ', error?.response?.data?.message || error.message);
    }
    console.log('Register attempt:', { name, email, password })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
          <header className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 via-indigo-200 to-white bg-clip-text text-transparent">
              Create your account
            </h1>
            <p className="text-slate-300 text-sm">Register to start shortening URLs</p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm text-slate-200">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm text-slate-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm text-slate-200">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 text-sm font-semibold text-indigo-100 hover:text-white"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm text-slate-200">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-500/50"
            >
              Create account
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-200">
            <span>Already have an account?</span>
            <button type="button" className="font-semibold text-indigo-200 hover:text-white" onClick={() => navigate('/login-user')}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterUser
