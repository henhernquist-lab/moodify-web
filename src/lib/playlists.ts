import type { MoodPlaylistTrack } from '@/src/types/music'

const API_KEY = (
  typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_LASTFM_API_KEY
    // @ts-expect-error — Vite env fallback
    : import.meta.env?.VITE_LASTFM_API_KEY
) ?? ''
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/'

const cache = new Map<string, unknown>()

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

function formatDuration(ms: number): string {
  if (!ms || ms <= 0) return ''
  const totalSec = Math.round(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

// ─── Tag mapping ───

type TagTiers = [string[], string[], string[]]
type TagMap = Record<string, Record<string, TagTiers>>

// Structure: MOOD -> ENERGY -> [low intensity tags, mid intensity tags, high intensity tags]
const TAG_MAP: TagMap = {
  Melancholic: {
    Low:      [['sad', 'slowcore', 'ambient'],          ['melancholy', 'dream pop', 'shoegaze'],       ['dark ambient', 'drone', 'funeral doom']],
    Medium:   [['sad', 'indie', 'acoustic'],             ['melancholy', 'indie rock', 'singer-songwriter'], ['slowcore', 'emo', 'post-rock']],
    High:     [['sad', 'indie pop', 'chamber pop'],      ['melancholy', 'post-punk', 'dark wave'],       ['emo', 'screamo', 'post-hardcore']],
  },
  Energetic: {
    Low:      [['chill', 'lo-fi', 'downtempo'],          ['groove', 'funk', 'nu disco'],                ['synthwave', 'retrowave', 'electro']],
    Medium:   [['indie pop', 'power pop', 'dance'],     ['electropop', 'pop rock', 'alternative'],     ['edm', 'house', 'dance pop']],
    High:     [['hype', 'workout', 'electronic'],        ['drum and bass', 'dubstep', 'hardstyle'],      ['hardcore', 'metalcore', 'thrash metal']],
  },
  Focused: {
    Low:      [['ambient', 'minimal', 'drone'],         ['lo-fi', 'chillhop', 'study'],                 ['instrumental', 'post-rock', 'cinematic']],
    Medium:   [['lo-fi', 'jazz', 'instrumental hip hop'], ['chillhop', 'downtempo', 'trip hop'],       ['electronic', 'idm', 'glitch']],
    High:     [['techno', 'minimal techno', 'deep house'], ['progressive house', 'tech house', 'trance'], ['psytrance', 'hard techno', 'industrial']],
  },
  Euphoric: {
    Low:      [['dream pop', 'shoegaze', 'ethereal'],   ['chillwave', 'synth pop', 'vaporwave'],        ['nu disco', 'indietronica', 'glitch hop']],
    Medium:   [['dance pop', 'synth pop', 'electropop'], ['house', 'disco', 'funk'],                   ['trance', 'progressive house', 'uplifting']],
    High:     [['edm', 'festival', 'anthem'],           ['hardstyle', 'happy hardcore', 'eurodance'],   ['psystyle', 'rave', 'gabber']],
  },
  Nostalgic: {
    Low:      [['acoustic', 'folk', 'singer-songwriter'], ['classic rock', 'soft rock', 'oldies'],       ['soul', 'motown', 'r&b']],
    Medium:   [['indie folk', 'alt-country', 'americana'], ['retro', 'new wave', 'synthwave'],           ['80s', '90s', 'britpop']],
    High:     [['punk', 'grunge', 'post-punk'],          ['garage rock', 'noise pop', 'shoegaze'],      ['emo', 'ska', 'math rock']],
  },
  Dark: {
    Low:      [['dark ambient', 'drone', 'dark jazz'],  ['doom', 'funeral', 'neofolk'],                 ['dark folk', 'witch house', 'dungeon synth']],
    Medium:   [['post-punk', 'dark wave', 'goth'],      ['industrial', 'ebm', 'coldwave'],              ['black metal', 'doom metal', 'deathrock']],
    High:     [['black metal', 'death metal', 'grindcore'], ['industrial metal', 'noise', 'power electronics'], ['harsh noise', 'darkcore', 'crossbreed']],
  },
  Peaceful: {
    Low:      [['ambient', 'new age', 'meditation'],    ['classical', 'neoclassical', 'piano'],         ['folk', 'celtic', 'world']],
    Medium:   [['chillout', 'downtempo', 'lounge'],     ['bossa nova', 'jazz', 'smooth jazz'],         ['acoustic', 'singer-songwriter', 'soft rock']],
    High:     [['world music', 'afrobeat', 'reggae'],   ['ska', 'calypso', 'latin'],                   ['flamenco', 'fado', 'tango']],
  },
  Rebellious: {
    Low:      [['punk blues', 'garage', 'lo-fi'],       ['indie rock', 'alternative', 'grunge'],       ['noise rock', 'sludge', 'stoner']],
    Medium:   [['punk', 'hardcore', 'post-punk'],       ['riot grrrl', 'ska punk', 'anarcho-punk'],   ['crossover thrash', 'crossover', 'skate punk']],
    High:     [['thrash metal', 'hardcore punk', 'd-beat'], ['grindcore', 'powerviolence', 'crust'],    ['sludge metal', 'mathcore', 'screamo']],
  },
}

function intensityTier(intensity: number): 0 | 1 | 2 {
  if (intensity <= 3) return 0
  if (intensity <= 7) return 1
  return 2
}

export function getTagMapping(mood: string, energy: string, intensity: number): string[] {
  const moodTags = TAG_MAP[mood]
  if (!moodTags) return ['indie', 'alternative', 'pop']
  const energyTags = moodTags[energy]
  if (!energyTags) return ['indie', 'alternative', 'pop']
  return energyTags[intensityTier(intensity)] ?? ['indie', 'alternative', 'pop']
}

export async function generateMoodPlaylist(
  mood: string,
  energy: string,
  intensity: number,
  limit: number = 20
): Promise<MoodPlaylistTrack[]> {
  const tags = getTagMapping(mood, energy, intensity)
  const primaryTag = tags[0]

  const cacheKey = `playlist:${primaryTag}:${limit}`
  if (cache.has(cacheKey)) return cache.get(cacheKey) as MoodPlaylistTrack[]

  const params = new URLSearchParams({
    method: 'tag.getTopTracks',
    tag: primaryTag,
    limit: String(limit),
    api_key: API_KEY,
    format: 'json',
  })

  const data = await fetchJson<{
    tracks?: {
      track?: Array<{
        name: string
        artist: { name: string }
        image: Array<{ '#text': string; size: string }>
        duration?: string | number
      }>
    }
  }>(`${BASE_URL}?${params.toString()}`)

  const raw = data?.tracks?.track ?? []
  const result: MoodPlaylistTrack[] = raw.map((t) => ({
    name: t.name ?? '',
    artist: t.artist?.name ?? '',
    image: getLargestImage(t.image ?? []),
    duration: formatDuration(Number(t.duration ?? 0)),
  }))

  cache.set(cacheKey, result)
  return result
}

// ─── localStorage helpers ───

const STORAGE_KEY = 'moodify_playlists'

export function getSavedPlaylists(): MoodPlaylistTrack[][] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export interface SavedPlaylist {
  name: string
  mood: string
  energy: string
  intensity: number
  tracks: MoodPlaylistTrack[]
  createdAt: string
}

export function getSavedPlaylistObjects(): SavedPlaylist[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function savePlaylist(playlist: SavedPlaylist): void {
  const existing = getSavedPlaylistObjects()
  existing.unshift(playlist)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}
