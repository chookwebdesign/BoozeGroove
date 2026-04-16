/**
 * Vercel serverless proxy for the iTunes Search API.
 * Forwards query params to iTunes and returns the response.
 * This bypasses browser CORS restrictions on the public domain.
 */
export default async function handler(req, res) {
  const params = new URLSearchParams(req.query).toString()
  const url = `https://itunes.apple.com/search?${params}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      return res.status(response.status).json({ resultCount: 0, results: [] })
    }
    const data = await response.json()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    return res.status(200).json(data)
  } catch {
    return res.status(500).json({ resultCount: 0, results: [] })
  }
}
