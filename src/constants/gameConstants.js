// ─── Game Modes ────────────────────────────────────────────────────────────────
export const GAME_MODES = {
  CLASSIC: 'classic',
  TEAM_BATTLE: 'teamBattle',
  NO_HOST: 'noHost',
  SUFFER: 'suffer',
}

export const GAME_MODE_META = {
  [GAME_MODES.CLASSIC]: {
    label: 'Classic',
    description: 'Everyone plays individually, take turns',
    icon: '🎵',
    color: 'from-blue-500 to-blue-700',
    borderColor: 'border-blue-500',
  },
  [GAME_MODES.TEAM_BATTLE]: {
    label: 'Team Battle',
    description: 'Teams compete, losing team drinks',
    icon: '⚔️',
    color: 'from-red-500 to-red-700',
    borderColor: 'border-red-500',
  },
  [GAME_MODES.NO_HOST]: {
    label: 'No Host',
    description: 'Pass the device — the guesser holds it and reveals the answer themselves',
    icon: '📱',
    color: 'from-purple-500 to-purple-700',
    borderColor: 'border-purple-500',
  },
  [GAME_MODES.SUFFER]: {
    label: 'Suffer',
    description: 'No scores — just chaos. Get it wrong and face a random dare or drinking penalty',
    icon: '💀',
    color: 'from-rose-600 to-red-900',
    borderColor: 'border-rose-600',
  },
}

// ─── Difficulties ───────────────────────────────────────────────────────────────
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Mixed']

// ─── Genres ────────────────────────────────────────────────────────────────────
export const GENRES = ['Pop', 'Rap', 'Rock', 'UK', 'FIFA', 'All']

// ─── Decades ───────────────────────────────────────────────────────────────────
export const DECADES = ['Old School', 'Throwback', 'Current', 'All']

// ─── Rounds Options ────────────────────────────────────────────────────────────
export const ROUND_OPTIONS = [5, 10, 20]

// ─── Clip Lengths (seconds) ────────────────────────────────────────────────────
export const CLIP_LENGTHS = [15, 10, 5]

// ─── Timer Options (seconds, null = off, 'unlimited' = unlimited) ──────────────
export const TIMER_OPTIONS_CLASSIC = ['Unlimited', 10, 20, 30]
export const TIMER_OPTIONS_TEAM = [10, 20, 30, 'Unlimited']

// ─── Skip Limit Options ────────────────────────────────────────────────────────
export const SKIP_OPTIONS = [0, 1, 2, 3]

// ─── Hint Options ──────────────────────────────────────────────────────────────
export const HINT_OPTIONS = [0, 1, 2, 3]

// ─── Team Colours ──────────────────────────────────────────────────────────────
export const TEAM_COLOURS = [
  { name: 'Orange', bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-400', hex: '#f97316' },
  { name: 'Pink', bg: 'bg-pink-500', border: 'border-pink-500', text: 'text-pink-400', hex: '#ec4899' },
  { name: 'Blue', bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-400', hex: '#3b82f6' },
  { name: 'Green', bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-400', hex: '#22c55e' },
]

// ─── Chaos Intensity ───────────────────────────────────────────────────────────
export const CHAOS_INTENSITIES = ['Mild', 'Wild', 'Absolutely Unhinged']

// ─── Chaos Cards ───────────────────────────────────────────────────────────────
export const CHAOS_CARDS = [
  { id: 'cc1', text: 'Everyone must hum the song instead of saying the title', intensity: 'Mild' },
  { id: 'cc2', text: 'Loser of this round must finish their drink', intensity: 'Wild' },
  { id: 'cc3', text: 'First person to answer — right or wrong — drinks', intensity: 'Mild' },
  { id: 'cc4', text: 'Whoever answers must do it in an accent', intensity: 'Mild' },
  { id: 'cc5', text: 'No speaking — write your answer in the air with your finger', intensity: 'Mild' },
  { id: 'cc6', text: 'Sabotage round — the host can cut the clip even shorter', intensity: 'Wild' },
  { id: 'cc7', text: 'Answer in a British accent or drink', intensity: 'Mild' },
  { id: 'cc8', text: 'Whisper your answer or drink', intensity: 'Mild' },
  { id: 'cc9', text: 'Stand up to answer — sit down wrong and drink', intensity: 'Mild' },
  { id: 'cc10', text: 'Point at someone else to answer instead of you', intensity: 'Mild' },
  { id: 'cc11', text: 'The host picks someone at random to answer instead', intensity: 'Wild' },
  { id: 'cc12', text: 'Everyone drinks regardless of who gets it right', intensity: 'Wild' },
  { id: 'cc13', text: 'Answer using only song lyrics — no normal words allowed', intensity: 'Wild' },
  { id: 'cc14', text: 'The player to the left of the guesser must drink if they get it wrong', intensity: 'Wild' },
  { id: 'cc15', text: 'Reverse round — wrong answer gives out drinks, correct answer means YOU drink', intensity: 'Absolutely Unhinged' },
  { id: 'cc16', text: 'Double or nothing — guess and bet a drink; right = give 2, wrong = drink 2', intensity: 'Absolutely Unhinged' },
  { id: 'cc17', text: 'Everyone must stand up. First to sit down without answering drinks', intensity: 'Wild' },
  { id: 'cc18', text: 'The person who answers must do it while doing star jumps', intensity: 'Mild' },
  { id: 'cc19', text: 'Auction round — players bid sips to steal the turn from each other', intensity: 'Absolutely Unhinged' },
  { id: 'cc20', text: 'BLACKOUT ROUND — host covers the screen. Answer blind or drink double', intensity: 'Absolutely Unhinged' },
]

export const CHAOS_CARDS_BY_INTENSITY = {
  Mild: CHAOS_CARDS.filter(c => c.intensity === 'Mild'),
  Wild: CHAOS_CARDS.filter(c => c.intensity !== 'Absolutely Unhinged'),
  'Absolutely Unhinged': CHAOS_CARDS,
}

// ─── Suffer Mode Penalties ─────────────────────────────────────────────────────
export const SUFFER_PENALTIES = [
  'Finish your drink 🍺',
  'Take 3 big sips',
  'Take 5 sips',
  'Skull half your drink',
  'Take a shot',
  'Take 2 shots',
  'Drink for 5 seconds straight',
  'Drink for 10 seconds straight',
  'Take a sip for every wrong answer you\'ve had this round',
  'Everyone watches you finish your drink',
  'Do 10 push ups',
  'Talk in an accent for the next 2 rounds',
  'Text your most recent contact a random emoji',
  'Show the group your most recent photo',
  'Read your last text message out loud',
  'Read your last Google search out loud',
  'Let someone send a message from your phone',
  'Do a toast about the person to your left',
  'Everyone in the group takes a sip with you',
  'Only use your left hand to drink for the rest of the game',
  'You must stand up for the next 3 songs',
  'Add a rule — you make up a rule that applies to everyone for 3 rounds',
  'Waterfall — you start drinking, everyone follows, nobody stops until you stop',
  'You cannot say the word "drink" for the rest of the game or you sip',
  'Drink every time you laugh for the next 2 rounds',
  'No using your phone for the next 3 rounds or you drink',
  'Drink with your non-dominant hand for the rest of the night',
  'Take a drink every time someone gets an answer right for the next 5 songs',
  'No swearing for the next 3 rounds or take a sip each time',
  'Sit on the floor for the next round',
  'Last one to put their hands on their head drinks with you',
]

// ─── Scoring ───────────────────────────────────────────────────────────────────
export const POINTS = {
  CORRECT_SONG: 2,
  ARTIST_ONLY: 1,
  TEAM_CORRECT: 2,
}

// ─── Max Players ───────────────────────────────────────────────────────────────
export const MAX_PLAYERS = 10
export const MAX_TEAMS = 4

// ─── Default Settings ──────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS = {
  playlistUrl: '',
  genres: ['All'],
  decades: ['All'],
  difficulty: 'Mixed',
  rounds: 5,
  clipLength: 15,
  skipLimit: 0,
  hintLimit: 0,
  guessTimer: 'Unlimited',
  artistOnly: 'Off',
  chaosIntensity: 'Wild',
  dareMode: false,
  enabledChaosCards: CHAOS_CARDS.map(c => c.id),
}
