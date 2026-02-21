import { Playlist, SAMPLE_PLAYLISTS } from "./data";

export interface Parent {
  username: string;
  displayName: string;
  avatar: string; // emoji
  bio: string;
  location: string;
  kidsAges: string;
  followers: number;
  following: number;
  playlistCount: number;
  joinedDate: string;
  badges: string[];
  playlists: Playlist[];
  gradient: string;
}

export const SAMPLE_PARENTS: Parent[] = [
  {
    username: "sarah_m",
    displayName: "Sarah M.",
    avatar: "👩",
    bio: "Mom of 3 under 4 — always chasing the right show for the right moment. I swear by low-stim content and bedtime routines.",
    location: "Chicago, IL",
    kidsAges: "4y, 2y, 1y",
    followers: 1847,
    following: 214,
    playlistCount: 8,
    joinedDate: "Jan 2024",
    badges: ["Top Contributor", "Bedtime Expert"],
    playlists: SAMPLE_PLAYLISTS.filter((p) =>
      ["bedtime-wind-down-2yr", "calm-down-videos", "sick-day-gentle"].includes(p.id)
    ),
    gradient: "from-rose-400 to-pink-500",
  },
  {
    username: "james_k",
    displayName: "James K.",
    avatar: "👨",
    bio: "Dad of a 2-year-old. Took 6 flights with her last year — became the unofficial expert on travel playlists. Ask me anything.",
    location: "San Francisco, CA",
    kidsAges: "2y",
    followers: 2341,
    following: 89,
    playlistCount: 5,
    joinedDate: "Mar 2024",
    badges: ["Travel Expert", "500+ Saves"],
    playlists: SAMPLE_PLAYLISTS.filter((p) =>
      ["flight-safe-toddler", "restaurant-quick-wins"].includes(p.id)
    ),
    gradient: "from-sky-400 to-blue-600",
  },
  {
    username: "priya_n",
    displayName: "Priya N.",
    avatar: "👩‍🦱",
    bio: "Twin mom — double the chaos, double the screen time expertise. Emotional regulation content is my specialty.",
    location: "Austin, TX",
    kidsAges: "3y twins",
    followers: 923,
    following: 451,
    playlistCount: 6,
    joinedDate: "Jun 2024",
    badges: ["Twin Parent", "Calm Content Expert"],
    playlists: SAMPLE_PLAYLISTS.filter((p) =>
      ["calm-down-videos", "bedtime-wind-down-2yr"].includes(p.id)
    ),
    gradient: "from-emerald-400 to-teal-600",
  },
  {
    username: "teacher_jen",
    displayName: "Teacher Jen",
    avatar: "👩‍🏫",
    bio: "Early childhood educator + mom of 2. I curate only evidence-based, screen-time-worthy content. No junk, just quality.",
    location: "Boston, MA",
    kidsAges: "5y, 3y",
    followers: 3102,
    following: 178,
    playlistCount: 12,
    joinedDate: "Sep 2023",
    badges: ["ECE Professional", "Top Pick Creator", "1000+ Saves"],
    playlists: SAMPLE_PLAYLISTS.filter((p) =>
      ["abc-123-adventures", "morning-start-up", "dance-and-wiggle"].includes(p.id)
    ),
    gradient: "from-violet-400 to-purple-600",
  },
  {
    username: "david_r",
    displayName: "David R.",
    avatar: "🧔",
    bio: "Stay-at-home dad of 3. The restaurant survival guy. I've field-tested every calming video in every public place imaginable.",
    location: "Portland, OR",
    kidsAges: "6y, 4y, 2y",
    followers: 1234,
    following: 312,
    playlistCount: 7,
    joinedDate: "Feb 2024",
    badges: ["Restaurant Survival Pro"],
    playlists: SAMPLE_PLAYLISTS.filter((p) =>
      ["restaurant-quick-wins", "sick-day-gentle", "abc-123-adventures"].includes(p.id)
    ),
    gradient: "from-amber-400 to-orange-500",
  },
  {
    username: "amy_t",
    displayName: "Amy T.",
    avatar: "👩‍🦰",
    bio: "Mom of 2, pediatric nurse. Evidence-based screen time takes only. Low stim, developmental value, zero manipulation.",
    location: "New York, NY",
    kidsAges: "5y, 2y",
    followers: 2876,
    following: 93,
    playlistCount: 9,
    joinedDate: "Nov 2023",
    badges: ["Medical Professional", "Verified Parent"],
    playlists: SAMPLE_PLAYLISTS.filter((p) =>
      ["morning-start-up", "abc-123-adventures", "sick-day-gentle"].includes(p.id)
    ),
    gradient: "from-yellow-400 to-orange-400",
  },
  {
    username: "maria_l",
    displayName: "Maria L.",
    avatar: "👩‍🦳",
    bio: "First-time mom figuring it all out. My daughter loves Bluey and Daniel Tiger — I'm building the definitive calm-down playlist.",
    location: "Miami, FL",
    kidsAges: "2y",
    followers: 445,
    following: 683,
    playlistCount: 3,
    joinedDate: "Oct 2024",
    badges: ["New Parent"],
    playlists: SAMPLE_PLAYLISTS.filter((p) =>
      ["calm-down-videos", "sick-day-gentle"].includes(p.id)
    ),
    gradient: "from-pink-400 to-rose-500",
  },
  {
    username: "community_picks",
    displayName: "Community Picks",
    avatar: "✨",
    bio: "The best of the best — collectively voted up by our parent community. These are the playlists everyone saves.",
    location: "littleScreen HQ",
    kidsAges: "All ages",
    followers: 12847,
    following: 0,
    playlistCount: 8,
    joinedDate: "Jan 2024",
    badges: ["Official", "Community Curated"],
    playlists: SAMPLE_PLAYLISTS,
    gradient: "from-orange-400 to-violet-600",
  },
];
