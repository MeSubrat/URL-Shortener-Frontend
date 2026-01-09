import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import axios from 'axios'

function UrlPage() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [userUrls, setUserUrls] = useState([])
  const [loadingUrls, setLoadingUrls] = useState(false)
  const [copiedUrlId, setCopiedUrlId] = useState(null)
  const apiUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000"

  // Fetch user's URLs - Add your backend API call here
  const fetchUserUrls = async () => {
    setLoadingUrls(true)
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/urls`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = response.data;
      setUserUrls(result.urls || [])
    } catch (err) {
      console.error('Error fetching URLs:', err)
    } finally {
      setLoadingUrls(false)
    }
  }
  useEffect(() => {
    fetchUserUrls()
  }, [])
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
      const response = await axios.post(`${apiUrl}/api/create`, { url: url.trim() }, { withCredentials: true }, {
        headers: {
          'Content-Type': 'application/json'
        },
      }
      )
      const data = await response.data;
      setShortUrl(`${apiUrl}/${data.shortUrl}`)
      // Refresh the URLs list after creating a new short URL
      await refreshUrls()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (urlToCopy, urlId = null) => {
    try {
      await navigator.clipboard.writeText(urlToCopy)
      if (urlId) {
        setCopiedUrlId(urlId)
        setTimeout(() => setCopiedUrlId(null), 2000)
      } else {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      setError('Failed to copy to clipboard')
    }
  }
  // Refresh URLs list after creating a new short URL
  const refreshUrls = async () => {
    setLoadingUrls(true)
    try {
      await fetchUserUrls()
    } catch (err) {
      console.error('Error refreshing URLs:', err)
    } finally {
      setLoadingUrls(false)
    }
  }
  const handleUrlClick = (item) => {
    setUserUrls(prevUrls => (
      prevUrls.map(url =>
        url._id === item._id ? { ...url, clicks: url.clicks + 1 } : url)
    ))
  }
  // useEffect(() => {

  // })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* URL Shortener Form Section */}
          <div className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
            <header className="text-center space-y-2 mb-10">
              <p className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
                <span className="size-2 rounded-full bg-indigo-400"></span>
                Live link shortener
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-300 via-indigo-200 to-white bg-clip-text text-transparent">
                URL Shortener
              </h1>
              <p className="text-slate-300">
                Transform long URLs into short, shareable links in seconds.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter your long URL here..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 disabled:opacity-60"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-500/50 disabled:opacity-60"
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
              <div className="mt-8 rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-4 shadow-inner">
                <div className="text-sm font-medium text-indigo-100 mb-2">
                  Your shortened URL
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 break-all text-lg font-semibold text-indigo-200 hover:text-indigo-100"
                  >
                    {shortUrl}
                  </a>
                  <button
                    onClick={() => handleCopy(shortUrl)}
                    className="rounded-lg border border-indigo-300/60 px-4 py-2 text-sm font-semibold text-indigo-50 transition hover:bg-indigo-400/20"
                    title="Copy to clipboard"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User's URLs List Section */}
          <div className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-indigo-200 to-white bg-clip-text text-transparent">
                Your Short URLs
              </h2>
              <button
                onClick={refreshUrls}
                className="text-sm font-medium text-indigo-200 hover:text-white transition"
                disabled={loadingUrls}
              >
                {loadingUrls ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {loadingUrls ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                <p className="mt-4 text-slate-300">Loading your URLs...</p>
              </div>
            ) : userUrls.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <p className="mt-4 text-slate-300">No URLs created yet</p>
                <p className="text-sm text-slate-400 mt-2">Create your first short URL above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userUrls.map((urlItem) => (
                  <div
                    key={urlItem._id || urlItem.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-indigo-400/30 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <a
                            href={`${apiUrl}/${urlItem.shortUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-indigo-200 hover:text-indigo-100 break-all"
                            onClick={() => handleUrlClick(urlItem)}
                          >
                            {apiUrl}/{urlItem.shortUrl}
                          </a>
                        </div>
                        <a
                          href={urlItem.fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-slate-400 hover:text-slate-300 break-all block truncate"
                          title={urlItem.fullUrl}
                        >
                          {urlItem.fullUrl}
                        </a>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                          {urlItem.clicks !== undefined && (
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                                />
                              </svg>
                              {urlItem.clicks} clicks
                            </span>
                          )}
                          {urlItem.createdAt && (
                            <span>
                              Created {new Date(urlItem.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(`${apiUrl}/${urlItem.shortUrl}`, urlItem._id || urlItem.id)}
                          className="rounded-lg border border-indigo-300/60 px-4 py-2 text-sm font-semibold text-indigo-50 transition hover:bg-indigo-400/20 whitespace-nowrap"
                          title="Copy to clipboard"
                        >
                          {copiedUrlId === (urlItem._id || urlItem.id) ? '✓ Copied!' : 'Copy'}
                        </button>
                        {/* TODO: Add delete functionality when backend is ready */}
                        {/* <button
                          onClick={() => handleDelete(urlItem._id || urlItem.id)}
                          className="rounded-lg border border-red-300/60 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-400/20"
                          title="Delete URL"
                        >
                          Delete
                        </button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UrlPage