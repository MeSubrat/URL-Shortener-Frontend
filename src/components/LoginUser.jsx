import { useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function LoginUser({ setLoginPage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Email: ', email, 'Password: ', password);
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login-user`, {
        email,
        password
      },
        {
          withCredentials: true
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
        })
      const result = response.data;
      const name = result?.user?.name || result?.user?.email || email || '';
      if (result?.token) {
        localStorage.setItem('token', result.token);
      }
      if (name) {
        localStorage.setItem('userName', name);
      }
      window.dispatchEvent(new Event('auth-change'));
      navigate('/url-page');
    } catch (error) {
      console.log('Error: ', error?.response?.data?.message || error.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
          <header className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 via-indigo-200 to-white bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="text-slate-300 text-sm">Login to continue to URL Shortener</p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit}>
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

            <div className="flex items-center justify-between text-sm text-slate-200">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="size-4 rounded border-slate-500 bg-slate-800" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-indigo-200 hover:text-white">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-500/50"
            >
              Login
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-200">
            <span>Don&apos;t have an account?</span>
            <button type="button" className="font-semibold text-indigo-200 hover:text-white" onClick={() => navigate('/register-user')}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginUser