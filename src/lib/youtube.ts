import type { YouTubeResult } from '@/src/types/music'

const API_KEY = (
  typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    // @ts-expect-error — Vite env fallback
    : import.meta.env?.VITE_YOUTUBE_API_KEY
) ?? ''
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search'

const cache = new Map<string, YouTubeResult | null>()

export async function searchYouTube(
  trackName: string,
  artistName: string
): Promise<YouTubeResult | null> {
  const query = `${trackName} ${artistName} official audio`
  const key = `yt:${query}`
  if (cache.has(key)) return cache.get(key) ?? null

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: '1',
      videoCategoryId: '10',
      key: API_KEY,
    })
    const res = await fetch(`${BASE_URL}?${params.toString()}`)
    if (!res.ok) {
      cache.set(key, null)
      return null
    }
    const data = await res.json()
    const item = data.items?.[0]
    if (!item?.id?.videoId) {
      cache.set(key, null)
      return null
    }

    const result: YouTubeResult = {
      videoId: item.id.videoId,
      title: item.snippet?.title ?? '',
      thumbnail: item.snippet?.thumbnails?.high?.url
        ?? item.snippet?.thumbnails?.medium?.url
        ?? item.snippet?.thumbnails?.default?.url
        ?? '',
    }

    cache.set(key, result)
    return result
  } catch {
    cache.set(key, null)
    return null
  }
}
