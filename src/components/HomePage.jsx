import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import axios from 'axios'

function HomePage() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_BASE_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setShortUrl('')
    setCopied(false)

    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        `${apiUrl}/api/create`,
        { url: url.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const data = response.data

      if (!data?.shortUrl) {
        throw new Error(data?.error || 'Failed to create short URL')
      }
      setShortUrl(`${apiUrl}/${data.shortUrl}`)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError('Failed to copy to clipboard')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {/* Hero Section */}
        <section className="px-4 py-20 flex items-center justify-center">
          <div className="w-full max-w-4xl text-center space-y-8">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-200">
                <span className="size-2 rounded-full bg-indigo-400 animate-pulse"></span>
                Fast, Simple, Reliable
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-300 via-indigo-200 to-white bg-clip-text text-transparent">
                Shorten Your URLs
              </h1>
              <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto">
                Transform long, complex URLs into short, shareable links in seconds.
                Perfect for social media, emails, and more.
              </p>
            </div>

            {/* URL Shortener Form */}
            <div className="mt-12 w-full max-w-3xl mx-auto">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter your long URL here..."
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-base text-white placeholder:text-slate-400 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 disabled:opacity-60"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-500/50 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
                      disabled={loading}
                    >
                      {loading ? 'Shortening...' : 'Shorten URL'}
                    </button>
                  </div>
                  {error && (
                    <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                      {error}
                    </div>
                  )}
                </form>

                {shortUrl && (
                  <div className="mt-6 rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-4 shadow-inner animate-in fade-in slide-in-from-bottom-4">
                    <div className="text-sm font-medium text-indigo-100 mb-2">
                      Your shortened URL
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 break-all text-lg font-semibold text-indigo-200 hover:text-indigo-100 transition"
                      >
                        {shortUrl}
                      </a>
                      <button
                        onClick={handleCopy}
                        className="rounded-lg border border-indigo-300/60 px-4 py-2 text-sm font-semibold text-indigo-50 transition hover:bg-indigo-400/20"
                        title="Copy to clipboard"
                      >
                        {copied ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button
                onClick={() => navigate('/login-user')}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-500/50 hover:scale-105"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/register-user')}
                className="rounded-xl border border-indigo-400/60 px-8 py-3 text-base font-semibold text-indigo-200 transition hover:bg-indigo-400/20 hover:scale-105"
              >
                Create Account
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-300 via-indigo-200 to-white bg-clip-text text-transparent mb-4">
                Why Choose Our URL Shortener?
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Everything you need to manage and share your links effectively
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl hover:border-indigo-400/30 transition">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
                <p className="text-slate-300">
                  Generate short URLs instantly with our optimized infrastructure
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl hover:border-indigo-400/30 transition">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Secure & Reliable</h3>
                <p className="text-slate-300">
                  Your links are safe with enterprise-grade security and reliability
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl hover:border-indigo-400/30 transition">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Analytics Ready</h3>
                <p className="text-slate-300">
                  Track clicks and monitor performance with detailed analytics
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-slate-400 text-sm">
              © 2025 URL Shortener. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomePage

