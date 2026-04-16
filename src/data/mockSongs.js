// Mock song data used until Spotify integration is connected.
// TODO: Replace with Spotify API call in src/services/spotify.js

const mockSongs = [
  {
    id: 'mock_001',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    genre: 'Pop',
    decade: '2020s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_002',
    title: 'HUMBLE.',
    artist: 'Kendrick Lamar',
    genre: 'Rap',
    decade: '2010s',
    difficulty: 'Medium',
    previewUrl: null,
  },
  {
    id: 'mock_003',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    genre: 'Rock',
    decade: '80s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_004',
    title: 'No Scrubs',
    artist: 'TLC',
    genre: 'R&B',
    decade: '90s',
    difficulty: 'Medium',
    previewUrl: null,
  },
  {
    id: 'mock_005',
    title: 'Old Town Road',
    artist: 'Lil Nas X ft. Billy Ray Cyrus',
    genre: 'Country',
    decade: '2010s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_006',
    title: 'One More Time',
    artist: 'Daft Punk',
    genre: 'Electronic',
    decade: '2000s',
    difficulty: 'Medium',
    previewUrl: null,
  },
  {
    id: 'mock_007',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    genre: 'Pop',
    decade: '2010s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_008',
    title: 'Lose Yourself',
    artist: 'Eminem',
    genre: 'Rap',
    decade: '2000s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_009',
    title: 'Enter Sandman',
    artist: 'Metallica',
    genre: 'Rock',
    decade: '90s',
    difficulty: 'Medium',
    previewUrl: null,
  },
  {
    id: 'mock_010',
    title: 'Crazy in Love',
    artist: 'Beyoncé ft. Jay-Z',
    genre: 'R&B',
    decade: '2000s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_011',
    title: 'Jolene',
    artist: 'Dolly Parton',
    genre: 'Country',
    decade: '80s',
    difficulty: 'Hard',
    previewUrl: null,
  },
  {
    id: 'mock_012',
    title: 'Levels',
    artist: 'Avicii',
    genre: 'Electronic',
    decade: '2010s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_013',
    title: 'As It Was',
    artist: 'Harry Styles',
    genre: 'Pop',
    decade: '2020s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_014',
    title: 'DNA.',
    artist: 'Kendrick Lamar',
    genre: 'Rap',
    decade: '2010s',
    difficulty: 'Medium',
    previewUrl: null,
  },
  {
    id: 'mock_015',
    title: 'Sweet Child O\' Mine',
    artist: "Guns N' Roses",
    genre: 'Rock',
    decade: '80s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_016',
    title: 'Say My Name',
    artist: "Destiny's Child",
    genre: 'R&B',
    decade: '90s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_017',
    title: 'Tennessee Whiskey',
    artist: 'Chris Stapleton',
    genre: 'Country',
    decade: '2010s',
    difficulty: 'Medium',
    previewUrl: null,
  },
  {
    id: 'mock_018',
    title: 'Sandstorm',
    artist: 'Darude',
    genre: 'Electronic',
    decade: '2000s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_019',
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    genre: 'Pop',
    decade: '2010s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_020',
    title: 'SICKO MODE',
    artist: 'Travis Scott',
    genre: 'Rap',
    decade: '2010s',
    difficulty: 'Medium',
    previewUrl: null,
  },
  {
    id: 'mock_021',
    title: 'Don\'t Stop Believin\'',
    artist: 'Journey',
    genre: 'Rock',
    decade: '80s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_022',
    title: 'I Will Always Love You',
    artist: 'Whitney Houston',
    genre: 'R&B',
    decade: '90s',
    difficulty: 'Easy',
    previewUrl: null,
  },
  {
    id: 'mock_023',
    title: 'Before He Cheats',
    artist: 'Carrie Underwood',
    genre: 'Country',
    decade: '2000s',
    difficulty: 'Medium',
    previewUrl: null,
  },
  {
    id: 'mock_024',
    title: 'Around the World',
    artist: 'Daft Punk',
    genre: 'Electronic',
    decade: '90s',
    difficulty: 'Hard',
    previewUrl: null,
  },
  {
    id: 'mock_025',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    genre: 'Pop',
    decade: '2020s',
    difficulty: 'Easy',
    previewUrl: null,
  },
]

export default mockSongs

/**
 * Filter songs by settings
 * TODO: Replace with Spotify API call when integrated
 */
function songMatchesDecade(song, decades) {
  if (decades.includes('All')) return true
  const year = song.year ?? 0
  return decades.some(d => {
    if (d === 'Old School') return year < 2000
    if (d === 'Throwback') return year >= 2000 && year <= 2012
    if (d === 'Current') return year > 2012
    return false
  })
}

export function filterSongs({ genres = ['All'], decades = ['All'], difficulty = 'Mixed' }) {
  let songs = [...mockSongs]

  if (!genres.includes('All')) {
    songs = songs.filter(s => genres.includes(s.genre))
  }

  if (!decades.includes('All')) {
    songs = songs.filter(s => songMatchesDecade(s, decades))
  }

  if (difficulty !== 'Mixed') {
    songs = songs.filter(s => s.difficulty === difficulty)
  }

  return songs
}

/**
 * Pick a random song from filtered results
 * TODO: Replace with Spotify API call when integrated
 */
export function pickRandomSong(settings, usedIds = []) {
  const available = filterSongs(settings).filter(s => !usedIds.includes(s.id))
  if (available.length === 0) {
    // If all songs used, reset the pool
    const all = filterSongs(settings)
    return all[Math.floor(Math.random() * all.length)]
  }
  return available[Math.floor(Math.random() * available.length)]
}
