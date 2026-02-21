export type Moment =
  | "bedtime"
  | "travel"
  | "calm"
  | "sick-day"
  | "restaurant"
  | "learning"
  | "active"
  | "morning";

export type AgeGroup = "1-2" | "2-3" | "3-4" | "4-5" | "5-6" | "all";

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  ageGroups: AgeGroup[];
  moments: Moment[];
  platform: "YouTube" | "Netflix" | "PBS Kids" | "Disney+" | "Spotify";
  parentRating: number;
  parentReviews: number;
  tags: string[];
  workedFor: number;
  addedBy: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  coverEmoji: string;
  moments: Moment[];
  ageGroups: AgeGroup[];
  itemCount: number;
  saves: number;
  createdBy: string;
  parentVerified: boolean;
  tags: string[];
  gradient: string;
  items?: ContentItem[];
}

export const MOMENTS: { id: Moment; label: string; emoji: string; color: string; bg: string }[] = [
  { id: "bedtime", label: "Bedtime Wind-Down", emoji: "🌙", color: "#7C3AED", bg: "#EDE9FE" },
  { id: "travel", label: "Travel & Flights", emoji: "✈️", color: "#0284C7", bg: "#E0F2FE" },
  { id: "calm", label: "Calm & Reset", emoji: "🌿", color: "#059669", bg: "#D1FAE5" },
  { id: "sick-day", label: "Sick Day Comfort", emoji: "🤒", color: "#DC2626", bg: "#FEE2E2" },
  { id: "restaurant", label: "Restaurant Wait", emoji: "🍕", color: "#D97706", bg: "#FEF3C7" },
  { id: "learning", label: "Learning & Growth", emoji: "📚", color: "#2563EB", bg: "#DBEAFE" },
  { id: "active", label: "Move & Dance", emoji: "💃", color: "#DB2777", bg: "#FCE7F3" },
  { id: "morning", label: "Morning Start", emoji: "☀️", color: "#CA8A04", bg: "#FEF9C3" },
];

export const AGE_GROUPS: { id: AgeGroup; label: string }[] = [
  { id: "all", label: "All Ages" },
  { id: "1-2", label: "1–2 yrs" },
  { id: "2-3", label: "2–3 yrs" },
  { id: "3-4", label: "3–4 yrs" },
  { id: "4-5", label: "4–5 yrs" },
  { id: "5-6", label: "5–6 yrs" },
];

export const SAMPLE_PLAYLISTS: Playlist[] = [
  {
    id: "bedtime-wind-down-2yr",
    title: "2-Year-Old Bedtime Wind-Down",
    description: "Calm songs, slow animations, and gentle routines that actually work for toddler bedtime. Parents in our community swear by these.",
    cover: "/playlists/bedtime.jpg",
    coverEmoji: "🌙",
    moments: ["bedtime"],
    ageGroups: ["1-2", "2-3"],
    itemCount: 12,
    saves: 847,
    createdBy: "Sarah M., mom of 3",
    parentVerified: true,
    tags: ["calm", "sleep", "routine", "lullabies"],
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    id: "flight-safe-toddler",
    title: "Flight-Safe Toddler Videos",
    description: "Holds attention 30+ minutes. These videos worked on a 6-hour flight with a 2-year-old. No WiFi needed for some!",
    cover: "/playlists/travel.jpg",
    coverEmoji: "✈️",
    moments: ["travel"],
    ageGroups: ["1-2", "2-3", "3-4"],
    itemCount: 15,
    saves: 1243,
    createdBy: "James K., dad of 2",
    parentVerified: true,
    tags: ["travel", "offline", "long-form", "distraction"],
    gradient: "from-sky-400 to-blue-600",
  },
  {
    id: "calm-down-videos",
    title: "Videos That Calm Tantrums",
    description: "When your toddler is overstimulated or melting down. Breathing songs, slow clips, soft animations — all parent-tested.",
    cover: "/playlists/calm.jpg",
    coverEmoji: "🌿",
    moments: ["calm"],
    ageGroups: ["1-2", "2-3", "3-4"],
    itemCount: 9,
    saves: 692,
    createdBy: "Priya N., mom of twins",
    parentVerified: true,
    tags: ["tantrum", "calm", "regulation", "breathing"],
    gradient: "from-emerald-400 to-teal-600",
  },
  {
    id: "sick-day-gentle",
    title: "Low-Stim Sick Day Shows",
    description: "Gentle, quiet, comforting shows toddlers watch without getting wound up. Perfect when your little one is home sick.",
    cover: "/playlists/sickday.jpg",
    coverEmoji: "🤒",
    moments: ["sick-day"],
    ageGroups: ["1-2", "2-3", "3-4", "4-5"],
    itemCount: 11,
    saves: 534,
    createdBy: "Maria L., mom of 1",
    parentVerified: true,
    tags: ["gentle", "quiet", "comforting", "low-stim"],
    gradient: "from-rose-400 to-pink-600",
  },
  {
    id: "restaurant-quick-wins",
    title: "5-Minute Restaurant Savers",
    description: "Short, engaging videos for when food is delayed and the meltdown is coming. Calm, not hyper. Tested in real restaurants.",
    cover: "/playlists/restaurant.jpg",
    coverEmoji: "🍕",
    moments: ["restaurant"],
    ageGroups: ["1-2", "2-3", "3-4"],
    itemCount: 8,
    saves: 421,
    createdBy: "David R., dad of 3",
    parentVerified: true,
    tags: ["quick", "engaging", "calm", "public"],
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: "abc-123-adventures",
    title: "ABC & 123 Adventures",
    description: "Learning letters, numbers, and early concepts through songs and stories that kids actually want to watch again and again.",
    cover: "/playlists/learning.jpg",
    coverEmoji: "📚",
    moments: ["learning"],
    ageGroups: ["2-3", "3-4", "4-5"],
    itemCount: 18,
    saves: 976,
    createdBy: "Teacher Jen, mom of 2",
    parentVerified: true,
    tags: ["educational", "letters", "numbers", "songs"],
    gradient: "from-blue-500 to-violet-600",
  },
  {
    id: "dance-and-wiggle",
    title: "Dance & Wiggle Time",
    description: "Get the energy OUT before it gets chaotic. Fun, silly dance videos that turn the living room into a dance floor.",
    cover: "/playlists/dance.jpg",
    coverEmoji: "💃",
    moments: ["active"],
    ageGroups: ["1-2", "2-3", "3-4", "4-5", "5-6"],
    itemCount: 14,
    saves: 1102,
    createdBy: "Community Pick",
    parentVerified: true,
    tags: ["energy", "dancing", "movement", "fun"],
    gradient: "from-pink-500 to-fuchsia-600",
  },
  {
    id: "morning-start-up",
    title: "Happy Morning Starter",
    description: "Cheerful, energizing shows that set a positive tone without the chaos. Great for the TV-while-getting-dressed window.",
    cover: "/playlists/morning.jpg",
    coverEmoji: "☀️",
    moments: ["morning"],
    ageGroups: ["2-3", "3-4", "4-5", "5-6"],
    itemCount: 10,
    saves: 388,
    createdBy: "Amy T., mom of 2",
    parentVerified: true,
    tags: ["morning", "cheerful", "routine", "positive"],
    gradient: "from-yellow-400 to-orange-400",
  },
];

export const FEATURED_PLAYLISTS = SAMPLE_PLAYLISTS.slice(0, 4);

export const PARENT_PICKS: ContentItem[] = [
  {
    id: "ms-rachel-songs",
    title: "Songs for Littles – Ms. Rachel",
    description: "Speech therapist-approved songs for toddlers. Perfect for language development and bedtime.",
    thumbnail: "🎵",
    duration: "15 min episodes",
    ageGroups: ["1-2", "2-3"],
    moments: ["bedtime", "learning"],
    platform: "YouTube",
    parentRating: 4.9,
    parentReviews: 2847,
    tags: ["speech", "language", "educational", "songs"],
    workedFor: 94,
    addedBy: "Sarah M.",
  },
  {
    id: "bluey-episodes",
    title: "Bluey — Season 1 Best Episodes",
    description: "Carefully picked episodes that are calming and don't wind kids up. Dad-approved for the 'safe show' go-to.",
    thumbnail: "🐕",
    duration: "7 min episodes",
    ageGroups: ["3-4", "4-5", "5-6"],
    moments: ["calm", "sick-day", "restaurant"],
    platform: "Disney+",
    parentRating: 4.8,
    parentReviews: 1923,
    tags: ["calm", "family", "gentle", "humor"],
    workedFor: 97,
    addedBy: "James K.",
  },
  {
    id: "cocomelon-bedtime",
    title: "CoComelon — Bedtime Songs Only",
    description: "Filtered to just the bedtime and calm songs. Skips the energetic ones that backfire at 8pm.",
    thumbnail: "🌙",
    duration: "25 min playlist",
    ageGroups: ["1-2", "2-3"],
    moments: ["bedtime"],
    platform: "YouTube",
    parentRating: 4.2,
    parentReviews: 3201,
    tags: ["bedtime", "songs", "routine"],
    workedFor: 81,
    addedBy: "Priya N.",
  },
  {
    id: "cosmic-kids-yoga",
    title: "Cosmic Kids Yoga",
    description: "Yoga adventures that calm kids down and stretch them out. Amazing for bedtime prep or after tantrums.",
    thumbnail: "🧘",
    duration: "20 min adventures",
    ageGroups: ["2-3", "3-4", "4-5"],
    moments: ["calm", "bedtime", "active"],
    platform: "YouTube",
    parentRating: 4.7,
    parentReviews: 1567,
    tags: ["yoga", "calm", "movement", "breathing"],
    workedFor: 89,
    addedBy: "Maria L.",
  },
  {
    id: "pbs-kids-daniel",
    title: "Daniel Tiger's Neighborhood",
    description: "Teaches emotional regulation through songs. 'If you feel so mad...' — parents AND kids know every song.",
    thumbnail: "🐯",
    duration: "28 min episodes",
    ageGroups: ["2-3", "3-4", "4-5"],
    moments: ["calm", "learning"],
    platform: "PBS Kids",
    parentRating: 4.8,
    parentReviews: 2134,
    tags: ["emotions", "regulation", "educational", "calm"],
    workedFor: 93,
    addedBy: "David R.",
  },
  {
    id: "numberblocks-bbc",
    title: "Numberblocks",
    description: "Best math show for early learners. Kids absorb numbers without it feeling like learning. BBC quality.",
    thumbnail: "🔢",
    duration: "5 min episodes",
    ageGroups: ["2-3", "3-4", "4-5"],
    moments: ["learning"],
    platform: "Netflix",
    parentRating: 4.9,
    parentReviews: 1342,
    tags: ["math", "numbers", "educational", "BBC"],
    workedFor: 96,
    addedBy: "Amy T.",
  },
];
