/**
 * iTunes Search API Service
 * No auth, no keys, works from any browser.
 * Returns 30-second MP3 preview clips.
 *
 * In production (Vercel) requests are routed through /api/itunes to avoid
 * CORS restrictions. In local dev the iTunes API is called directly.
 */

// Use our serverless proxy in production, direct iTunes in local dev
const ITUNES_SEARCH = import.meta.env.DEV
  ? 'https://itunes.apple.com/search'
  : '/api/itunes'

// ─── FIFA: hardcoded song list (searched individually on iTunes) ──────────────

const FIFA_SONGS = [
  { title: 'Around Us',                    artist: 'Jonsi' },
  { title: 'Paper Romance',                artist: 'Groove Armada' },
  { title: 'Record Collection',            artist: 'Mark Ronson' },
  { title: 'Tighten Up',                   artist: 'The Black Keys' },
  { title: 'Alive',                        artist: 'Empire Of The Sun' },
  { title: 'Boa Noite',                    artist: 'Karol Conka' },
  { title: 'The City',                     artist: 'The 1975' },
  { title: 'Compliment Your Soul',         artist: 'Dan Croll' },
  { title: "Don't Forget Who You Are",     artist: 'Miles Kane' },
  { title: 'Hearts Like Ours',             artist: 'The Naked And Famous' },
  { title: 'Hit It',                       artist: 'American Authors' },
  { title: 'Little Games',                 artist: 'The Colourist' },
  { title: 'Lived A Lie',                  artist: 'You Me At Six' },
  { title: 'Love Me Again',                artist: 'John Newman' },
  { title: 'Magic',                        artist: 'Olympic Ayres' },
  { title: 'Mechanical',                   artist: 'Oliver' },
  { title: 'Miko',                         artist: 'The Chain Gang Of 1974' },
  { title: 'My Number',                    artist: 'Foals' },
  { title: 'On Our Way',                   artist: 'The Royal Concept' },
  { title: 'Ratchet',                      artist: 'Bloc Party' },
  { title: "Runnin'",                      artist: 'David Dallas' },
  { title: 'We Sink',                      artist: 'CHVRCHES' },
  { title: 'Worship You',                  artist: 'Vampire Weekend' },
  { title: '16 Years',                     artist: 'The Griswolds' },
  { title: "Busy Earnin'",                 artist: 'Jungle' },
  { title: 'Cocoon',                       artist: 'Catfish and the Bottlemen' },
  { title: 'Down By The River',            artist: 'Milky Chance' },
  { title: 'L.A.F',                        artist: 'BROODS' },
  { title: 'Mess Is Mine',                 artist: 'Vance Joy' },
  { title: 'My Type',                      artist: 'Saint Motel' },
  { title: 'The Nights',                   artist: 'Avicii' },
  { title: 'Out Of The Blue',              artist: 'Prides' },
  { title: 'Pressure',                     artist: 'Tensnake' },
  { title: 'Push',                         artist: 'A-Trak' },
  { title: 'Sunrise',                      artist: 'Slaptop' },
  { title: 'Sunshine',                     artist: 'Teddybears' },
  { title: 'Tonight',                      artist: 'Magic Man' },
  { title: 'Walk',                         artist: 'Kwabs' },
  { title: 'We Are Done',                  artist: 'The Madden Brothers' },
  { title: 'Wild Heart',                   artist: 'Saint Raymond' },
  { title: 'Dreams',                       artist: 'Beck' },
  { title: 'Mountain at My Gates',         artist: 'Foals' },
  { title: 'Shine A Light',                artist: 'BANNERS' },
  { title: 'Big Dreams',                   artist: 'Bakar' },
  { title: 'Everytime I Run',              artist: 'Husky Loops' },
  { title: 'Genius',                       artist: 'LSD' },
  { title: 'Musika',                       artist: 'Yolanda Be Cool' },
  { title: 'Sway',                         artist: 'Tove Styrke' },
  { title: 'Truth Is',                     artist: 'Stealth' },
  { title: 'Highway',                      artist: 'Suzi Wu' },
  { title: 'The Runner',                   artist: 'Foals' },
  { title: 'Heat Waves',                   artist: 'Glass Animals' },
  { title: 'Little Talks',                 artist: 'Of Monsters and Men' },
  { title: 'Ticket To Ride',               artist: 'KAWALA' },
  { title: 'Kids',                         artist: 'MGMT' },
  { title: 'Walking On A Dream',           artist: 'Empire Of The Sun' },
  { title: 'On Top Of The World',          artist: 'Imagine Dragons' },
  { title: 'Young Blood',                  artist: 'The Naked And Famous' },
  { title: 'Punching In A Dream',          artist: 'The Naked And Famous' },
  { title: 'Dreaming',                     artist: 'Smallpools' },
  { title: 'Sun in My Pocket',             artist: 'Locnville' },
  { title: 'A Teen',                       artist: 'V.I.C' },
  { title: "Trouble's Coming",             artist: 'Royal Blood' },
  { title: 'Jerk It Out',                  artist: 'Caesars' },
  { title: 'Send Them Off!',               artist: 'Bastille' },
  { title: 'Song 2',                       artist: 'Blur' },
  { title: 'Last Chance',                  artist: 'Casper Caan' },
  { title: 'Up All Night',                 artist: 'Beck' },
  { title: 'Followers',                    artist: 'Martin Garrix' },
  { title: 'Landline',                     artist: 'binki' },
  { title: 'Apartment 402',               artist: 'girl in red' },
  { title: "Feet Don't Fail Me Now",       artist: 'Joy Crookes' },
  { title: 'Good Girls',                   artist: 'CHVRCHES' },
  { title: 'Club Foot',                    artist: 'Kasabian' },
  { title: 'Way Down We Go',               artist: 'KALEO' },
  { title: 'Pogo',                         artist: 'Digitalism' },
  { title: 'Undercover Martyn',            artist: 'Two Door Cinema Club' },
  { title: 'Going Kokomo',                 artist: 'Royel Otis' },
  { title: 'Something For Your M.I.N.D.', artist: 'Superorganism' },
  { title: 'The Valleys',                  artist: 'The Mountains' },
  { title: 'Love Natural',                 artist: 'Crystal Fighters' },
  { title: 'Are You What You Want to Be?', artist: 'Foster The People' },
  { title: 'Phone Numbers',                artist: 'Dominic Fike' },
  { title: 'I Can Talk',                   artist: 'Two Door Cinema Club' },
  { title: 'Paddling Out',                 artist: 'Miike Snow' },
  { title: 'The Mission',                  artist: 'Bakar' },
  { title: "I'm with You",                 artist: 'GROUPLOVE' },
  { title: 'Rushing Back',                 artist: 'Flume' },
  { title: 'pockets',                      artist: 'hard life' },
  { title: "I Know It's You",              artist: 'Guards' },
  { title: 'Gold Rush',                    artist: 'Death Cab for Cutie' },
]

// ─── UK: hardcoded song list ──────────────────────────────────────────────────

const UK_SONGS = [
  { title: 'Supersonic',                          artist: 'Oasis' },
  { title: "She's Electric",                      artist: 'Oasis' },
  { title: 'Half the World Away',                 artist: 'Oasis' },
  { title: 'Stand by Me',                         artist: 'Oasis' },
  { title: 'Live Forever',                        artist: 'Oasis' },
  { title: 'Champagne Supernova',                 artist: 'Oasis' },
  { title: "Don't Look Back in Anger",            artist: 'Oasis' },
  { title: 'Stop Crying Your Heart Out',          artist: 'Oasis' },
  { title: 'Cigarettes & Alcohol',                artist: 'Oasis' },
  { title: 'Whatever',                            artist: 'Oasis' },
  { title: 'Morning Glory',                       artist: 'Oasis' },
  { title: 'Slide Away',                          artist: 'Oasis' },
  { title: 'Acquiesce',                           artist: 'Oasis' },
  { title: 'Some Might Say',                      artist: 'Oasis' },
  { title: 'Cast No Shadow',                      artist: 'Oasis' },
  { title: "D'You Know What I Mean?",             artist: 'Oasis' },
  { title: "Rock 'n' Roll Star",                  artist: 'Oasis' },
  { title: 'How Soon Is Now?',                    artist: 'The Smiths' },
  { title: "Heaven Knows I'm Miserable Now",      artist: 'The Smiths' },
  { title: 'Bigmouth Strikes Again',              artist: 'The Smiths' },
  { title: 'There Is a Light That Never Goes Out',artist: 'The Smiths' },
  { title: 'This Charming Man',                   artist: 'The Smiths' },
  { title: 'Girl Afraid',                         artist: 'The Smiths' },
  { title: 'The Headmaster Ritual',               artist: 'The Smiths' },
  { title: 'This Night Has Opened My Eyes',       artist: 'The Smiths' },
  { title: 'Well I Wonder',                       artist: 'The Smiths' },
  { title: 'Nowhere Fast',                        artist: 'The Smiths' },
  { title: 'Hand in Glove',                       artist: 'The Smiths' },
  { title: 'Still Ill',                           artist: 'The Smiths' },
  { title: 'Back to the Old House',               artist: 'The Smiths' },
  { title: 'I Wanna Be Adored',                   artist: 'The Stone Roses' },
  { title: 'She Bangs the Drums',                 artist: 'The Stone Roses' },
  { title: 'Waterfall',                           artist: 'The Stone Roses' },
  { title: 'I Am the Resurrection',               artist: 'The Stone Roses' },
  { title: 'Love Spreads',                        artist: 'The Stone Roses' },
  { title: 'Made of Stone',                       artist: 'The Stone Roses' },
  { title: 'Sally Cinnamon',                      artist: 'The Stone Roses' },
  { title: 'No Surprises',                        artist: 'Radiohead' },
  { title: 'High and Dry',                        artist: 'Radiohead' },
  { title: 'Just',                                artist: 'Radiohead' },
  { title: 'Jigsaw Falling Into Place',           artist: 'Radiohead' },
  { title: 'Let Down',                            artist: 'Radiohead' },
  { title: 'Blue Monday',                         artist: 'New Order' },
  { title: 'Love Will Tear Us Apart',             artist: 'Joy Division' },
  { title: 'Disorder',                            artist: 'Joy Division' },
  { title: 'Friday I\'m In Love',                 artist: 'The Cure' },
  { title: "Boys Don't Cry",                      artist: 'The Cure' },
  { title: 'Just Like Heaven',                    artist: 'The Cure' },
  { title: 'Inbetween Days',                      artist: 'The Cure' },
  { title: 'Lovesong',                            artist: 'The Cure' },
  { title: 'Lullaby',                             artist: 'The Cure' },
  { title: 'A Forest',                            artist: 'The Cure' },
  { title: 'Do I Wanna Know?',                    artist: 'Arctic Monkeys' },
  { title: 'R U Mine?',                           artist: 'Arctic Monkeys' },
  { title: '505',                                 artist: 'Arctic Monkeys' },
  { title: 'Fluorescent Adolescent',              artist: 'Arctic Monkeys' },
  { title: "Why'd You Only Call Me When You're High?", artist: 'Arctic Monkeys' },
  { title: 'Mardy Bum',                           artist: 'Arctic Monkeys' },
  { title: 'From The Ritz To The Rubble',         artist: 'Arctic Monkeys' },
  { title: 'I Bet You Look Good On The Dancefloor', artist: 'Arctic Monkeys' },
  { title: 'Crying Lightning',                    artist: 'Arctic Monkeys' },
  { title: 'Riot Van',                            artist: 'Arctic Monkeys' },
  { title: 'Song 2',                              artist: 'Blur' },
  { title: 'Parklife',                            artist: 'Blur' },
  { title: 'Girls & Boys',                        artist: 'Blur' },
  { title: 'Coffee & TV',                         artist: 'Blur' },
  { title: 'Country House',                       artist: 'Blur' },
  { title: "There's No Other Way",                artist: 'Blur' },
  { title: 'Common People',                       artist: 'Pulp' },
  { title: 'Disco 2000',                          artist: 'Pulp' },
  { title: 'Do You Remember The First Time?',     artist: 'Pulp' },
  { title: 'Bitter Sweet Symphony',               artist: 'The Verve' },
  { title: 'Lucky Man',                           artist: 'The Verve' },
  { title: 'Naive',                               artist: 'The Kooks' },
  { title: 'She Moves In Her Own Way',            artist: 'The Kooks' },
  { title: 'Ooh La',                              artist: 'The Kooks' },
  { title: 'Club Foot',                           artist: 'Kasabian' },
  { title: 'Fire',                                artist: 'Kasabian' },
  { title: 'L.S.F.',                              artist: 'Kasabian' },
  { title: 'Underdog',                            artist: 'Kasabian' },
  { title: "You're in Love with a Psycho",        artist: 'Kasabian' },
  { title: 'stevie',                              artist: 'Kasabian' },
  { title: 'London Calling',                      artist: 'The Clash' },
  { title: 'Should I Stay or Should I Go',        artist: 'The Clash' },
  { title: 'Linger',                              artist: 'The Cranberries' },
  { title: 'Sunday Bloody Sunday',                artist: 'U2' },
  { title: 'Yellow',                              artist: 'Coldplay' },
  { title: 'Here Comes The Sun',                  artist: 'The Beatles' },
  { title: 'Come Together',                       artist: 'The Beatles' },
  { title: 'Let It Be',                           artist: 'The Beatles' },
  { title: 'A Day In The Life',                   artist: 'The Beatles' },
  { title: "Another One Bites The Dust",          artist: 'Queen' },
  { title: "Don't Stop Me Now",                   artist: 'Queen' },
  { title: 'Not Nineteen Forever',                artist: 'Courteeners' },
  { title: 'Alright',                             artist: 'Supergrass' },
  { title: 'Born Slippy',                         artist: 'Underworld' },
  { title: 'If I Had A Gun',                      artist: "Noel Gallagher's High Flying Birds" },
  { title: 'When the Sun Hits',                   artist: 'Slowdive' },
]

// ─── Pop: hardcoded song list ─────────────────────────────────────────────────

const POP_SONGS = [
  { title: 'Set Fire to the Rain',              artist: 'Adele' },
  { title: 'Just the Way You Are',              artist: 'Bruno Mars' },
  { title: 'Locked out of Heaven',              artist: 'Bruno Mars' },
  { title: 'Uptown Funk',                       artist: 'Mark Ronson' },
  { title: 'I Run',                             artist: 'HAVEN.' },
  { title: 'High Hopes',                        artist: 'Panic! At The Disco' },
  { title: 'Love Story',                        artist: 'Taylor Swift' },
  { title: 'Blank Space',                       artist: 'Taylor Swift' },
  { title: 'Counting Stars',                    artist: 'OneRepublic' },
  { title: 'I Knew You Were Trouble',           artist: 'Taylor Swift' },
  { title: 'Firework',                          artist: 'Katy Perry' },
  { title: 'Halo',                              artist: 'Beyonce' },
  { title: 'FIGURED YOU OUT',                   artist: 'Devkota' },
  { title: 'Party In The U.S.A.',               artist: 'Miley Cyrus' },
  { title: 'Last Friday Night (T.G.I.F.)',      artist: 'Katy Perry' },
  { title: 'Story of My Life',                  artist: 'One Direction' },
  { title: 'gigolo',                            artist: 'bbno$' },
  { title: 'We Are Never Ever Getting Back Together', artist: 'Taylor Swift' },
  { title: 'Roar',                              artist: 'Katy Perry' },
  { title: 'TiK ToK',                           artist: 'Kesha' },
  { title: 'Baby',                              artist: 'Justin Bieber' },
  { title: 'What About Us',                     artist: 'P!nk' },
  { title: 'Chlorine',                          artist: 'Twenty One Pilots' },
  { title: 'Ride',                              artist: 'Twenty One Pilots' },
  { title: 'CRASH OUT',                         artist: 'Cwby' },
  { title: 'Stressed Out',                      artist: 'Twenty One Pilots' },
  { title: 'Heathens',                          artist: 'Twenty One Pilots' },
  { title: '1-800',                             artist: 'bbno$' },
  { title: 'Natural',                           artist: 'Imagine Dragons' },
  { title: "think you're someone new",          artist: 'Ian Asher' },
  { title: 'Youngblood',                        artist: '5 Seconds of Summer' },
  { title: 'Happier',                           artist: 'Marshmello' },
  { title: 'Get Down',                          artist: 'Uhfwea' },
  { title: 'Something Just Like This',          artist: 'The Chainsmokers' },
  { title: 'Try',                               artist: 'P!nk' },
  { title: 'Someday',                           artist: 'OneRepublic' },
  { title: 'Lost',                              artist: 'Maroon 5' },
  { title: 'High',                              artist: 'The Chainsmokers' },
  { title: 'Hey, Soul Sister',                  artist: 'Train' },
  { title: 'Shut Up and Dance',                 artist: 'WALK THE MOON' },
  { title: 'Raise Your Glass',                  artist: 'P!nk' },
  { title: 'Drive By',                          artist: 'Train' },
  { title: 'check',                             artist: 'bbno$' },
  { title: 'I Want It That Way',                artist: 'Backstreet Boys' },
  { title: 'A Thousand Miles',                  artist: 'Vanessa Carlton' },
  { title: 'two',                               artist: 'bbno$' },
  { title: 'Symphony',                          artist: 'Clean Bandit' },
  { title: 'Wrecking Ball',                     artist: 'Miley Cyrus' },
  { title: 'Wake Me Up',                        artist: 'Avicii' },
  { title: 'Girl on Fire',                      artist: 'Alicia Keys' },
  { title: 'Part Of Me',                        artist: 'Katy Perry' },
  { title: 'California Gurls',                  artist: 'Katy Perry' },
  { title: 'Love For You',                      artist: 'LOVELI LORI' },
  { title: 'Rude',                              artist: 'MAGIC!' },
  { title: 'Maps',                              artist: 'Maroon 5' },
  { title: 'Teenage Dream',                     artist: 'Katy Perry' },
  { title: 'Scars To Your Beautiful',           artist: 'Alessia Cara' },
  { title: 'Cake By The Ocean',                 artist: 'DNCE' },
  { title: '24K Magic',                         artist: 'Bruno Mars' },
  { title: 'Titanium',                          artist: 'David Guetta' },
  { title: 'Chandelier',                        artist: 'Sia' },
  { title: 'Treat You Better',                  artist: 'Shawn Mendes' },
  { title: 'Attention',                         artist: 'Charlie Puth' },
  { title: 'How Long',                          artist: 'Charlie Puth' },
  { title: 'Burn',                              artist: 'Ellie Goulding' },
  { title: 'What Makes You Beautiful',          artist: 'One Direction' },
  { title: 'Sugar',                             artist: 'Maroon 5' },
  { title: 'A Sky Full of Stars',               artist: 'Coldplay' },
  { title: 'A Thousand Years',                  artist: 'Christina Perri' },
  { title: 'Mercy',                             artist: 'Shawn Mendes' },
  { title: 'Pumped Up Kicks',                   artist: 'Foster The People' },
  { title: 'Take on Me',                        artist: 'a-ha' },
  { title: 'Night Changes',                     artist: 'One Direction' },
  { title: 'Rewrite The Stars',                 artist: 'Zac Efron' },
  { title: 'A Million Dreams',                  artist: 'P!nk' },
  { title: 'Heart Attack',                      artist: 'Demi Lovato' },
  { title: 'The One That Got Away',             artist: 'Katy Perry' },
  { title: 'Rockabye',                          artist: 'Clean Bandit' },
  { title: "There's Nothing Holdin' Me Back",   artist: 'Shawn Mendes' },
  { title: 'This Is What You Came For',         artist: 'Calvin Harris' },
  { title: 'Sorry',                             artist: 'Justin Bieber' },
  { title: 'Ophelia',                           artist: 'The Lumineers' },
  { title: 'Without Me',                        artist: 'Halsey' },
  { title: 'Stronger (What Doesn\'t Kill You)', artist: 'Kelly Clarkson' },
  { title: 'Fight Song',                        artist: 'Rachel Platten' },
  { title: 'Stitches',                          artist: 'Shawn Mendes' },
  { title: 'One Last Time',                     artist: 'Ariana Grande' },
  { title: 'Unconditionally',                   artist: 'Katy Perry' },
  { title: 'Black Magic',                       artist: 'Little Mix' },
  { title: 'Dynamite',                          artist: 'Taio Cruz' },
  { title: 'When I Was Your Man',               artist: 'Bruno Mars' },
  { title: 'Pompeii',                           artist: 'Bastille' },
  { title: 'Hello',                             artist: 'Adele' },
  { title: 'All About That Bass',               artist: 'Meghan Trainor' },
  { title: "Somebody's Someone",               artist: 'Toby Lightman' },
  { title: 'Safe And Sound',                    artist: 'Capital Cities' },
  { title: 'Feel It Still',                     artist: 'Portugal. The Man' },
  { title: 'Bad At Love',                       artist: 'Halsey' },
  { title: 'Beauty And A Beat',                 artist: 'Justin Bieber' },
  { title: 'Dark Horse',                        artist: 'Katy Perry' },
  { title: 'Animals',                           artist: 'Maroon 5' },
  { title: 'Closer',                            artist: 'The Chainsmokers' },
  { title: 'Count on Me',                       artist: 'Bruno Mars' },
  { title: 'Hard Times',                        artist: 'Paramore' },
  { title: 'Drag Me Down',                      artist: 'One Direction' },
  { title: 'Diamonds',                          artist: 'Rihanna' },
  { title: 'Wolves',                            artist: 'Selena Gomez' },
  { title: 'Starships',                         artist: 'Nicki Minaj' },
  { title: 'Die Young',                         artist: 'Kesha' },
  { title: 'Umbrella',                          artist: 'Rihanna' },
  { title: 'The Middle',                        artist: 'Zedd' },
  { title: 'Sweet but Psycho',                  artist: 'Ava Max' },
  { title: 'Solo',                              artist: 'Clean Bandit' },
  { title: 'Love The Way You Lie',              artist: 'Eminem' },
  { title: 'Bad Romance',                       artist: 'Lady Gaga' },
  { title: '...Baby One More Time',             artist: 'Britney Spears' },
  { title: 'Toxic',                             artist: 'Britney Spears' },
  { title: 'Wannabe',                           artist: 'Spice Girls' },
  { title: 'Oops!...I Did It Again',            artist: 'Britney Spears' },
  { title: 'Gimme More',                        artist: 'Britney Spears' },
  { title: "Don't Stop The Music",              artist: 'Rihanna' },
  { title: 'Viva La Vida',                      artist: 'Coldplay' },
  { title: 'Timber',                            artist: 'Pitbull' },
  { title: 'Whatcha Say',                       artist: 'Jason Derulo' },
  { title: 'Ghost',                             artist: 'Justin Bieber' },
  { title: 'Only Girl (In The World)',           artist: 'Rihanna' },
  { title: 'Stay',                              artist: 'Rihanna' },
]

// ─── Rock: hardcoded song list ────────────────────────────────────────────────

const ROCK_SONGS = [
  { title: "Can't Stop",                       artist: 'Red Hot Chili Peppers' },
  { title: 'Iris',                             artist: 'The Goo Goo Dolls' },
  { title: 'Paranoid',                         artist: 'Black Sabbath' },
  { title: 'Whole Lotta Love',                 artist: 'Led Zeppelin' },
  { title: 'Starman',                          artist: 'David Bowie' },
  { title: 'Jump',                             artist: 'Van Halen' },
  { title: 'Song 2',                           artist: 'Blur' },
  { title: 'Thunderstruck',                    artist: 'AC/DC' },
  { title: 'Push',                             artist: 'Matchbox Twenty' },
  { title: 'La Grange',                        artist: 'ZZ Top' },
  { title: "Mama, I'm Coming Home",            artist: 'Ozzy Osbourne' },
  { title: 'Hotel California',                 artist: 'Eagles' },
  { title: 'Riders on the Storm',              artist: 'The Doors' },
  { title: 'Run to the Hills',                 artist: 'Iron Maiden' },
  { title: 'Blitzkrieg Bop',                   artist: 'Ramones' },
  { title: "SEEIN' STARS",                     artist: 'Turnstile' },
  { title: 'American Idiot',                   artist: 'Green Day' },
  { title: 'Iron Man',                         artist: 'Black Sabbath' },
  { title: 'New York Groove',                  artist: 'Ace Frehley' },
  { title: 'Up From the Bottom',               artist: 'Linkin Park' },
  { title: 'I Believe in a Thing Called Love', artist: 'The Darkness' },
  { title: 'Epic',                             artist: 'Faith No More' },
  { title: 'Smells Like Teen Spirit',          artist: 'Nirvana' },
  { title: 'Numb',                             artist: 'Linkin Park' },
  { title: 'Enter Sandman',                    artist: 'Metallica' },
  { title: 'Scar Tissue',                      artist: 'Red Hot Chili Peppers' },
  { title: '(I Can\'t Get No) Satisfaction',   artist: 'The Rolling Stones' },
  { title: 'Another One Bites The Dust',       artist: 'Queen' },
  { title: 'When Doves Cry',                   artist: 'Prince' },
  { title: 'Immigrant Song',                   artist: 'Led Zeppelin' },
  { title: 'Home Again',                       artist: 'Shihad' },
  { title: 'Mr. Brightside',                   artist: 'The Killers' },
  { title: 'Lonely Boy',                       artist: 'The Black Keys' },
  { title: 'Take It Easy',                     artist: 'Eagles' },
  { title: "Feel like Makin' Love",            artist: 'Bad Company' },
  { title: "I'll Be There for You",            artist: 'The Rembrandts' },
  { title: 'Purple Rain',                      artist: 'Prince' },
  { title: '3AM',                              artist: 'Matchbox Twenty' },
  { title: 'Stairway to Heaven',               artist: 'Led Zeppelin' },
  { title: "Don't Stop",                       artist: 'Fleetwood Mac' },
  { title: 'Heroes',                           artist: 'David Bowie' },
  { title: 'Under the Bridge',                 artist: 'Red Hot Chili Peppers' },
  { title: 'All The Small Things',             artist: 'blink-182' },
  { title: 'Dreams',                           artist: 'Fleetwood Mac' },
  { title: 'Basket Case',                      artist: 'Green Day' },
  { title: 'Take Me Away',                     artist: 'Lash' },
  { title: 'Smoke on the Water',               artist: 'Deep Purple' },
  { title: 'Beautiful Day',                    artist: 'U2' },
  { title: 'Kiss',                             artist: 'Prince' },
  { title: 'Uprising',                         artist: 'Muse' },
  { title: 'Run to Paradise',                  artist: 'Choirboys' },
  { title: 'Everlong',                         artist: 'Foo Fighters' },
  { title: 'Heart of Gold',                    artist: 'Neil Young' },
  { title: 'In the End',                       artist: 'Linkin Park' },
  { title: 'Alone with You',                   artist: 'Sunnyboys' },
  { title: 'Walk This Way',                    artist: 'Aerosmith' },
  { title: 'Bohemian Rhapsody',                artist: 'Queen' },
  { title: 'Otherside',                        artist: 'Red Hot Chili Peppers' },
  { title: 'Blue Monday',                      artist: 'New Order' },
  { title: 'Gravity',                          artist: 'The Superjesus' },
  { title: 'Teenagers',                        artist: 'My Chemical Romance' },
  { title: 'Born in the U.S.A.',               artist: 'Bruce Springsteen' },
  { title: 'How You Remind Me',               artist: 'Nickelback' },
  { title: "What I've Done",                   artist: 'Linkin Park' },
  { title: 'Misery Business',                  artist: 'Paramore' },
  { title: 'Solid Rock',                       artist: 'Goanna' },
  { title: "I'm Just a Kid",                   artist: 'Simple Plan' },
  { title: 'I Miss You',                       artist: 'blink-182' },
  { title: 'Supermassive Black Hole',          artist: 'Muse' },
  { title: 'We Will Rock You',                 artist: 'Queen' },
  { title: 'White Wedding',                    artist: 'Billy Idol' },
  { title: "I Was Made For Lovin' You",        artist: 'KISS' },
  { title: "You're Gonna Go Far, Kid",         artist: 'The Offspring' },
  { title: 'Slide',                            artist: 'The Goo Goo Dolls' },
  { title: 'Semi-Charmed Life',                artist: 'Third Eye Blind' },
  { title: 'Backseat',                         artist: 'Balu Brigada' },
  { title: 'You Oughta Know',                  artist: 'Alanis Morissette' },
  { title: 'Get Set',                          artist: 'Taxiride' },
  { title: 'Californication',                  artist: 'Red Hot Chili Peppers' },
  { title: 'Take on Me',                       artist: 'a-ha' },
  { title: '! (The Song Formerly Known As)',   artist: 'Regurgitator' },
  { title: 'You Really Got Me',                artist: 'The Kinks' },
  { title: 'Sake Bomb',                        artist: 'The D4' },
  { title: 'Ace of Spades',                    artist: 'Motorhead' },
  { title: "Howlin' for You",                  artist: 'The Black Keys' },
  { title: 'Hungry Like the Wolf',             artist: 'Duran Duran' },
  { title: 'Go Your Own Way',                  artist: 'Fleetwood Mac' },
  { title: 'Rebel Rebel',                      artist: 'David Bowie' },
  { title: 'Feel It Still',                    artist: 'Portugal. The Man' },
  { title: "I'm Gonna Be (500 Miles)",         artist: 'The Proclaimers' },
  { title: 'Listen to the Music',              artist: 'The Doobie Brothers' },
  { title: 'London Calling',                   artist: 'The Clash' },
  { title: "Baba O'Riley",                     artist: 'The Who' },
  { title: 'Welcome To The Jungle',            artist: "Guns N' Roses" },
  { title: 'Unravelling',                      artist: 'Muse' },
  { title: 'Start Me Up',                      artist: 'The Rolling Stones' },
  { title: 'Highway to Hell',                  artist: 'AC/DC' },
  { title: "Don't Stop Believin'",             artist: 'Journey' },
  { title: 'Sultans Of Swing',                 artist: 'Dire Straits' },
  { title: 'A Horse With No Name',             artist: 'America' },
  { title: 'The Chain',                        artist: 'Fleetwood Mac' },
  { title: 'Sideways',                         artist: 'Balu Brigada' },
  { title: 'Back In Black',                    artist: 'AC/DC' },
  { title: 'Born To Be Wild',                  artist: 'Steppenwolf' },
  { title: 'From The Sea',                     artist: 'Eskimo Joe' },
  { title: "Sweet Child O' Mine",              artist: "Guns N' Roses" },
  { title: 'Wonderwall',                       artist: 'Oasis' },
  { title: 'Edge of Seventeen',               artist: 'Stevie Nicks' },
  { title: 'The Boys Are Back In Town',        artist: 'Thin Lizzy' },
  { title: 'In the Name of the Father',        artist: 'PRESIDENT' },
  { title: "Living in the 70's",               artist: 'Skyhooks' },
  { title: 'Come As You Are',                  artist: 'Nirvana' },
  { title: 'A Little Love',                    artist: 'Biffy Clyro' },
  { title: "Livin' On A Prayer",               artist: 'Bon Jovi' },
  { title: 'I Got You',                        artist: 'Split Enz' },
  { title: 'Priscilla',                        artist: 'Les Votives' },
  { title: 'Loser',                            artist: 'Beck' },
  { title: 'Gravity',                          artist: 'Jon Toogood' },
  { title: 'Know Your Product',                artist: 'The Saints' },
  { title: 'Should I Stay or Should I Go',     artist: 'The Clash' },
  { title: 'Walk On the Wild Side',            artist: 'Lou Reed' },
  { title: 'The American Dream Is Killing Me', artist: 'Green Day' },
  { title: 'Killing In The Name',              artist: 'Rage Against The Machine' },
  { title: 'Photograph',                       artist: 'Nickelback' },
  { title: 'Down with the Sickness',           artist: 'Disturbed' },
  { title: 'Give It Away',                     artist: 'Red Hot Chili Peppers' },
]

// ─── Rap: hardcoded song list ─────────────────────────────────────────────────

const RAP_SONGS = [
  { title: 'Bad and Boujee',                    artist: 'Migos' },
  { title: 'Black Beatles',                      artist: 'Rae Sremmurd' },
  { title: 'iSpy',                              artist: 'KYLE' },
  { title: 'Go Flex',                           artist: 'Post Malone' },
  { title: 'Murder on My Mind',                 artist: 'YNW Melly' },
  { title: 'Gold Digger',                       artist: 'Kanye West' },
  { title: 'Candy Paint',                       artist: 'Post Malone' },
  { title: 'DNA.',                              artist: 'Kendrick Lamar' },
  { title: 'For The Night',                     artist: 'Pop Smoke' },
  { title: 'Praise The Lord (Da Shine)',         artist: 'A$AP Rocky' },
  { title: 'Thrift Shop',                       artist: 'Macklemore' },
  { title: 'White Iverson',                     artist: 'Post Malone' },
  { title: 'See You Again',                     artist: 'Tyler, The Creator' },
  { title: 'Trap Queen',                        artist: 'Fetty Wap' },
  { title: 'Going Bad',                         artist: 'Meek Mill' },
  { title: 'LOVE.',                             artist: 'Kendrick Lamar' },
  { title: 'Money Trees',                       artist: 'Kendrick Lamar' },
  { title: 'MIDDLE CHILD',                      artist: 'J. Cole' },
  { title: 'Panda',                             artist: 'Desiigner' },
  { title: 'Goodbyes',                          artist: 'Post Malone' },
  { title: 'BUTTERFLY EFFECT',                  artist: 'Travis Scott' },
  { title: 'Ransom',                            artist: 'Lil Tecca' },
  { title: 'Godzilla',                          artist: 'Eminem' },
  { title: "Ni**as In Paris",                   artist: 'JAY-Z' },
  { title: 'In Da Club',                        artist: '50 Cent' },
  { title: 'Still D.R.E.',                      artist: 'Dr. Dre' },
  { title: 'Stronger',                          artist: 'Kanye West' },
  { title: 'Young, Wild & Free',                artist: 'Snoop Dogg' },
  { title: 'Drip Too Hard',                     artist: 'Lil Baby' },
  { title: "Gangsta's Paradise",                artist: 'Coolio' },
  { title: 'HIGHEST IN THE ROOM',               artist: 'Travis Scott' },
  { title: 'Mask Off',                          artist: 'Future' },
  { title: 'Wow.',                              artist: 'Post Malone' },
  { title: 'Congratulations',                   artist: 'Post Malone' },
  { title: 'Better Now',                        artist: 'Post Malone' },
  { title: 'No Role Modelz',                    artist: 'J. Cole' },
  { title: 'SICKO MODE',                        artist: 'Travis Scott' },
  { title: 'XO Tour Llif3',                     artist: 'Lil Uzi Vert' },
  { title: 'HUMBLE.',                           artist: 'Kendrick Lamar' },
  { title: 'goosebumps',                        artist: 'Travis Scott' },
  { title: 'rockstar',                          artist: 'Post Malone' },
  { title: 'STOMP EM OUT',                      artist: 'NLE Choppa' },
  { title: '8TEEN',                             artist: 'Khalid' },
  { title: 'Gin N Juice',                       artist: 'Snoop Dogg' },
  { title: 'Wet Dreamz',                        artist: 'J. Cole' },
  { title: 'Everyday',                          artist: 'A$AP Rocky' },
  { title: 'Heartless',                         artist: 'Kanye West' },
  { title: 'Forever',                           artist: 'Drake' },
  { title: 'Come Get Her',                      artist: 'Rae Sremmurd' },
  { title: 'Big Poppa',                         artist: 'The Notorious B.I.G.' },
  { title: 'Black and Yellow',                  artist: 'Wiz Khalifa' },
  { title: 'Leave Me Alone',                    artist: 'Flipp Dinero' },
  { title: "Bitch, Don't Kill My Vibe",         artist: 'Kendrick Lamar' },
  { title: 'Father Stretch My Hands Pt. 1',     artist: 'Kanye West' },
  { title: 'Hypnotize',                         artist: 'The Notorious B.I.G.' },
  { title: 'All Eyez On Me',                    artist: '2Pac' },
  { title: 'Faucet Failure',                    artist: 'Ski Mask The Slump God' },
  { title: 'Tunnel Vision',                     artist: 'Kodak Black' },
  { title: 'T-Shirt',                           artist: 'Migos' },
  { title: 'Ms. Jackson',                       artist: 'Outkast' },
  { title: 'Magnolia',                          artist: 'Playboi Carti' },
  { title: 'Juicy',                             artist: 'The Notorious B.I.G.' },
  { title: 'It Was A Good Day',                 artist: 'Ice Cube' },
  { title: 'Runaway',                           artist: 'Kanye West' },
  { title: 'Bound 2',                           artist: 'Kanye West' },
  { title: 'Homecoming',                        artist: 'Kanye West' },
  { title: 'Follow God',                        artist: 'Kanye West' },
  { title: 'Gangsta',                           artist: 'Free Nationals' },
  { title: 'Runnin',                            artist: '21 Savage' },
  { title: '5% TINT',                           artist: 'Travis Scott' },
  { title: 'The Spins',                         artist: 'Mac Miller' },
  { title: 'Superhero (Heroes & Villains)',      artist: 'Metro Boomin' },
  { title: 'Dior',                              artist: 'Pop Smoke' },
  { title: 'All Falls Down',                    artist: 'Kanye West' },
  { title: 'Pure Cocaine',                      artist: 'Lil Baby' },
  { title: 'The Party & The After Party',        artist: 'The Weeknd' },
  { title: 'Return of the Mack',                artist: 'Mark Morrison' },
  { title: 'I KNOW ?',                          artist: 'Travis Scott' },
  { title: "Nuthin' But A G Thang",             artist: 'Dr. Dre' },
  { title: 'All Of The Lights',                 artist: 'Kanye West' },
  { title: 'Alright',                           artist: 'Kendrick Lamar' },
  { title: 'Flashing Lights',                   artist: 'Kanye West' },
  { title: 'So Fresh, So Clean',                artist: 'Outkast' },
  { title: 'California Love',                   artist: '2Pac' },
  { title: 'Trapanese',                         artist: 'lil ricefield' },
  { title: 'BIRDBOY',                           artist: 'NLE Choppa' },
  { title: 'Swalla',                            artist: 'Jason Derulo' },
  { title: 'Programs',                          artist: 'Mac Miller' },
  { title: 'ANXIETY',                           artist: 'Sleepy Hallow' },
  { title: 'Luv Em All',                        artist: 'Sleepy Hallow' },
  { title: 'Moves Like Jagger',                 artist: 'Maroon 5' },
  { title: "God's Plan",                        artist: 'Drake' },
  { title: 'Passionfruit',                      artist: 'Drake' },
  { title: 'One Dance',                         artist: 'Drake' },
  { title: 'Hotline Bling',                     artist: 'Drake' },
  { title: 'You Know How We Do It',             artist: 'Ice Cube' },
]

// ─── Genre → iTunes search terms (fallback for any unhandled genres) ─────────

const GENRE_QUERIES = {}

// ─── Search iTunes for a specific song by title + artist ─────────────────────

async function searchSong({ title, artist }, genre = 'FIFA') {
  const term = `${title} ${artist}`
  const url = `${ITUNES_SEARCH}?term=${encodeURIComponent(term)}&media=music&entity=song&limit=5&country=gb`

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()

    const titleLower  = title.toLowerCase()
    const artistLower = artist.toLowerCase().split(' ')[0] // match on first word of artist name

    // Priority 1: title + artist both match
    for (const item of data.results ?? []) {
      if (!item.previewUrl) continue
      const tMatch = item.trackName?.toLowerCase().includes(titleLower) || titleLower.includes(item.trackName?.toLowerCase())
      const aMatch = item.artistName?.toLowerCase().includes(artistLower)
      if (tMatch && aMatch) {
        return {
          id:         String(item.trackId),
          title:      item.trackName,
          artist:     item.artistName,
          genre,
          previewUrl: item.previewUrl,
          albumArt:   item.artworkUrl100?.replace('100x100', '300x300') ?? null,
        }
      }
    }

    // No artist match found — skip rather than return a wrong song
  } catch {
    // silently skip
  }
  return null
}

// ─── Fetch tracks from iTunes for a general search term ──────────────────────

async function fetchItunesTracks(term, limit = 50) {
  const url = `${ITUNES_SEARCH}?term=${encodeURIComponent(term)}&media=music&entity=song&limit=${limit}&country=gb`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`iTunes fetch failed (${res.status})`)

  const data = await res.json()
  const tracks = []

  for (const item of data.results ?? []) {
    if (!item.previewUrl) continue
    if (!item.trackName) continue
    if (!item.artistName) continue

    tracks.push({
      id:         String(item.trackId),
      title:      item.trackName,
      artist:     item.artistName,
      genre:      item.primaryGenreName ?? 'Mixed',
      previewUrl: item.previewUrl,
      albumArt:   item.artworkUrl100?.replace('100x100', '300x300') ?? null,
    })
  }

  return tracks
}

// ─── Fetch a hardcoded song list individually ────────────────────────────────

async function fetchHardcodedSongs(songList, genre) {
  // Shuffle and cap at 35 songs to keep load times fast (~4s vs 15s+ for full lists)
  // Different songs are picked each game since the list is shuffled fresh each time
  const LIMIT = 35
  const shuffled = [...songList].sort(() => Math.random() - 0.5).slice(0, LIMIT)

  console.log(`[iTunes] Fetching ${genre} songs — searching ${shuffled.length} of ${songList.length} tracks...`)

  const results = []
  const BATCH = 10

  for (let i = 0; i < shuffled.length; i += BATCH) {
    const batch = shuffled.slice(i, i + BATCH)
    const batchResults = await Promise.all(batch.map(s => searchSong(s, genre)))
    results.push(...batchResults.filter(Boolean))
    if (i + BATCH < shuffled.length) await new Promise(r => setTimeout(r, 150))
  }

  const found = results.length
  console.log(`[iTunes] ${genre}: ${found}/${shuffled.length} songs found with previews`)
  return results
}

const fetchFifaSongs  = () => fetchHardcodedSongs(FIFA_SONGS,  'FIFA')
const fetchUkSongs    = () => fetchHardcodedSongs(UK_SONGS,   'UK')
const fetchPopSongs   = () => fetchHardcodedSongs(POP_SONGS,  'Pop')
const fetchRockSongs  = () => fetchHardcodedSongs(ROCK_SONGS, 'Rock')
const fetchRapSongs   = () => fetchHardcodedSongs(RAP_SONGS,  'Rap')

// ─── Deduplicate by track ID ──────────────────────────────────────────────────

function dedupe(tracks) {
  const seen = new Set()
  return tracks.filter(t => {
    if (seen.has(t.id)) return false
    seen.add(t.id)
    return true
  })
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Fetch songs from iTunes for the selected genres.
 * FIFA uses a hardcoded song list searched individually.
 * All other genres use keyword queries.
 *
 * @param {string[]} genres - e.g. ['Pop', 'Rap'] or ['All']
 * @returns {Promise<{ songs: Array, fallback: boolean }>}
 */
export async function fetchSongsByGenre(genres = ['All']) {
  const useAll      = !genres || genres.length === 0 || genres.includes('All')
  const needsFifa   = useAll || genres.includes('FIFA')
  const needsUk     = useAll || genres.includes('UK')
  const needsPop    = useAll || genres.includes('Pop')
  const needsRock   = useAll || genres.includes('Rock')
  const needsRap    = useAll || genres.includes('Rap')
  const otherGenres = useAll
    ? Object.keys(GENRE_QUERIES)
    : genres.filter(g => GENRE_QUERIES[g])

  console.log('[iTunes] Fetching genres:', [
    ...otherGenres,
    ...(needsFifa ? ['FIFA'] : []),
    ...(needsUk   ? ['UK']  : []),
    ...(needsPop  ? ['Pop'] : []),
    ...(needsRock ? ['Rock'] : []),
    ...(needsRap  ? ['Rap']  : []),
  ])

  const fifaPromise = needsFifa ? fetchFifaSongs()  : Promise.resolve([])
  const ukPromise   = needsUk   ? fetchUkSongs()    : Promise.resolve([])
  const popPromise  = needsPop  ? fetchPopSongs()    : Promise.resolve([])
  const rockPromise = needsRock ? fetchRockSongs()   : Promise.resolve([])
  const rapPromise  = needsRap  ? fetchRapSongs()    : Promise.resolve([])

  const generalFetches = otherGenres.flatMap(genre => {
    const queries = [...GENRE_QUERIES[genre]].sort(() => Math.random() - 0.5).slice(0, 2)
    return queries.map(q => fetchItunesTracks(q, 50))
  })

  const [fifaTracks, ukTracks, popTracks, rockTracks, rapTracks, ...generalResults] = await Promise.all([
    fifaPromise,
    ukPromise,
    popPromise,
    rockPromise,
    rapPromise,
    ...generalFetches.map(p => p.catch(() => [])),
  ])

  let combined = [...fifaTracks, ...ukTracks, ...popTracks, ...rockTracks, ...rapTracks]
  for (const r of generalResults) combined.push(...r)

  combined = dedupe(combined)
  combined = combined.sort(() => Math.random() - 0.5)

  console.log(`[iTunes] ${combined.length} total songs loaded with audio previews ✅`)

  if (combined.length === 0) {
    console.warn('[iTunes] All fetches failed — using emergency fallback')
    const fallback = await fetchItunesTracks('pop hits', 30).catch(() => [])
    return { songs: fallback, fallback: true }
  }

  return { songs: combined, fallback: false }
}
