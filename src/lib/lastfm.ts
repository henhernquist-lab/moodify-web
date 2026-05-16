import type { SimilarTrack, TrackSuggestion, TrackInfo, TrackTag } from '@/src/types/music'

const API_KEY = (
  typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_LASTFM_API_KEY
    // @ts-expect-error — Vite env fallback for non-Next builds
    : import.meta.env?.VITE_LASTFM_API_KEY
) ?? ''
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/'

const cache = new Map<string, unknown>()

function buildUrl(params: Record<string, string | number>): string {
  const searchParams = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
    api_key: API_KEY,
    format: 'json',
  })
  return `${BASE_URL}?${searchParams.toString()}`
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    if (data.error) return null
    return data as T
  } catch {
    return null
  }
}

function getLargestImage(images: Array<{ '#text': string; size: string }>): string {
  const preferred = ['extralarge', 'large', 'medium', 'small']
  for (const size of preferred) {
    const img = images?.find((i) => i.size === size)
    if (img?.['#text']) return img['#text']
  }
  return ''
}

export async function getSimilarTracks(
  artist: string,
  track: string,
  limit: number = 12
): Promise<SimilarTrack[]> {
  const key = `similar:${artist}:${track}:${limit}`
  if (cache.has(key)) return cache.get(key) as SimilarTrack[]

  const url = buildUrl({ method: 'track.getSimilar', artist, track, limit })
  const data = await fetchJson<{ similartracks?: { track?: unknown[] } }>(url)

  const tracks = data?.similartracks?.track ?? []
  const result: SimilarTrack[] = (tracks as Array<{
    name: string
    artist: { name: string }
    image: Array<{ '#text': string; size: string }>
    match: number
    url: string
  }>).map((t) => ({
    name: t.name,
    artist: t.artist?.name ?? '',
    image: getLargestImage(t.image ?? []),
    match: Number(t.match ?? 0),
    url: t.url ?? '',
  }))

  cache.set(key, result)
  return result
}

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

export function searchTrack(query: string): Promise<TrackSuggestion[]> {
  return new Promise((resolve) => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer)

    searchDebounceTimer = setTimeout(async () => {
      const key = `search:${query}`
      if (cache.has(key)) {
        resolve(cache.get(key) as TrackSuggestion[])
        return
      }

      const url = buildUrl({ method: 'track.search', track: query, limit: 5 })
      const data = await fetchJson<{
        results?: { trackmatches?: { track?: unknown[] } }
      }>(url)

      const tracks = data?.results?.trackmatches?.track ?? []
      const result: TrackSuggestion[] = (tracks as Array<{
        name: string
        artist: string
        url: string
      }>).map((t) => ({
        name: t.name,
        artist: t.artist ?? '',
        url: t.url ?? '',
      }))

      cache.set(key, result)
      resolve(result)
    }, 300)
  })
}

export async function getTrackInfo(
  artist: string,
  track: string
): Promise<TrackInfo | null> {
  const key = `info:${artist}:${track}`
  if (cache.has(key)) return cache.get(key) as TrackInfo

  const url = buildUrl({ method: 'track.getInfo', artist, track })
  const data = await fetchJson<{
    track?: {
      name: string
      artist: { name: string } | string
      album?: {
        title: string
        image: Array<{ '#text': string; size: string }>
      }
      toptags?: { tag?: Array<{ name: string }> }
      duration?: string | number
    }
  }>(url)

  const t = data?.track
  if (!t) return null

  const artistName =
    typeof t.artist === 'string' ? t.artist : t.artist?.name ?? ''
  const tags: string[] = (t.toptags?.tag ?? []).map((tag) => tag.name).filter(Boolean)

  const result: TrackInfo = {
    name: t.name ?? '',
    artist: artistName,
    album: t.album?.title ?? '',
    image: getLargestImage(t.album?.image ?? []),
    tags,
    duration: Number(t.duration ?? 0),
  }

  cache.set(key, result)
  return result
}

export async function getTopTagsForTrack(
  artist: string,
  track: string
): Promise<TrackTag[]> {
  const key = `tags:${artist}:${track}`
  if (cache.has(key)) return cache.get(key) as TrackTag[]

  const url = buildUrl({ method: 'track.getTopTags', artist, track })
  const data = await fetchJson<{
    toptags?: { tag?: Array<{ name: string; url: string }> }
  }>(url)

  const raw = data?.toptags?.tag ?? []
  const result: TrackTag[] = raw.slice(0, 3).map((tag) => ({
    name: tag.name ?? '',
    url: tag.url ?? '',
  }))

  cache.set(key, result)
  return result
}
