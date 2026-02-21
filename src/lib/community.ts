import { Moment } from "./data";

export type ResourceType =
  | "youtube"
  | "amazon"
  | "blog"
  | "netflix"
  | "spotify"
  | "pbs"
  | "book"
  | "app"
  | "disney"
  | "article";

export interface LinkedResource {
  type: ResourceType;
  title: string;
  url: string;
  youtubeId?: string; // for embeddable YouTube links
  price?: string;     // for Amazon products
  note?: string;      // optional short note
}

export interface WhatWorkedPost {
  id: string;
  author: string;
  authorInitial: string;
  authorColor: string; // bg color for avatar
  childAge: string;
  moment: Moment;
  title: string;
  body: string;
  resources: LinkedResource[];
  likes: number;
  saves: number;
  liked?: boolean;
  saved?: boolean;
  createdAt: string;
  tags: string[];
}

export const RESOURCE_META: Record<ResourceType, { label: string; color: string; bg: string; icon: string }> = {
  youtube:  { label: "YouTube",  color: "#C0392B", bg: "#FEF2F2", icon: "▶" },
  amazon:   { label: "Amazon",   color: "#C07A4A", bg: "#FDF3E9", icon: "📦" },
  blog:     { label: "Blog",     color: "#5E8F75", bg: "#EEF7F2", icon: "✍" },
  netflix:  { label: "Netflix",  color: "#7B2D2D", bg: "#FDF2F2", icon: "N" },
  spotify:  { label: "Spotify",  color: "#2D7A4A", bg: "#EEF7F2", icon: "♪" },
  pbs:      { label: "PBS Kids", color: "#2D4A7A", bg: "#EFF4FB", icon: "📺" },
  book:     { label: "Book",     color: "#7A5C2D", bg: "#FBF5EA", icon: "📖" },
  app:      { label: "App",      color: "#5C2D7A", bg: "#F5EEF8", icon: "📱" },
  disney:   { label: "Disney+",  color: "#1B3A8A", bg: "#EEF2FB", icon: "✨" },
  article:  { label: "Article",  color: "#5E8F75", bg: "#EEF7F2", icon: "📄" },
};

export const COMMUNITY_POSTS: WhatWorkedPost[] = [
  {
    id: "bedtime-white-noise",
    author: "David R.",
    authorInitial: "D",
    authorColor: "#D4956A",
    childAge: "2y 5m",
    moment: "bedtime",
    title: "White noise + blackout curtains stopped 45-min bedtime battles",
    body: "White noise machine + blackout curtains. Seriously. We tried everything else first. The combination of total darkness and constant low sound stopped the 45-minute bedtime battles completely. This is the exact one we bought:",
    resources: [
      { type: "amazon", title: "Hatch Rest Sound Machine", url: "https://amazon.com", price: "$69.99", note: "The pink noise setting works best" },
      { type: "blog",   title: "Blackout curtain guide for nurseries", url: "https://example.com" },
    ],
    likes: 67,
    saves: 289,
    createdAt: "2 days ago",
    tags: ["sleep", "bedtime", "white-noise"],
  },
  {
    id: "ms-rachel-speech",
    author: "Sarah M.",
    authorInitial: "S",
    authorColor: "#A87898",
    childAge: "1y 8m",
    moment: "learning",
    title: "Ms. Rachel literally transformed my son's speech in 6 weeks",
    body: "Our pediatrician was a bit concerned about speech delays at 18 months. A friend suggested Ms. Rachel on YouTube. We did 20 minutes a day for 6 weeks. His pediatrician was shocked at the 2-year checkup. The key is watching WITH him and doing the prompts together — not just putting it on.",
    resources: [
      { type: "youtube", title: "Songs for Littles – Ms. Rachel (Full Playlist)", url: "https://youtube.com/watch?v=zjq2HFKZnSE", youtubeId: "zjq2HFKZnSE", note: "Start with Season 1 Episode 1" },
      { type: "article", title: "How co-viewing improves toddler language outcomes", url: "https://example.com" },
      { type: "book",    title: "30 Million Words — Dana Suskind", url: "https://amazon.com", price: "$14.99" },
    ],
    likes: 142,
    saves: 521,
    createdAt: "5 days ago",
    tags: ["speech", "language", "co-viewing", "development"],
  },
  {
    id: "flight-survival-pack",
    author: "James K.",
    authorInitial: "J",
    authorColor: "#6A98C8",
    childAge: "2y 1m",
    moment: "travel",
    title: "6-hour flight with a 2-year-old — here's what actually got us through",
    body: "Flew NYC to London with our 2-year-old. We downloaded everything offline and had a physical \"surprise bag\" that we opened one item every 45 minutes. The Bluey compilation was the MVP — held attention for a full hour. Do NOT rely on plane WiFi.",
    resources: [
      { type: "youtube",  title: "Bluey Fantasy Full Episodes Compilation", url: "https://youtube.com/watch?v=zjq2HFKZnSE", youtubeId: "zjq2HFKZnSE" },
      { type: "amazon",   title: "Trunki Kids Ride-On Suitcase", url: "https://amazon.com", price: "$59.99", note: "The surprise activity compartment" },
      { type: "amazon",   title: "Melissa & Doug Water Wow Books (Travel Pack)", url: "https://amazon.com", price: "$18.99" },
      { type: "app",      title: "Khan Academy Kids (offline mode)", url: "https://apps.apple.com", note: "Download before boarding" },
    ],
    likes: 203,
    saves: 847,
    createdAt: "1 week ago",
    tags: ["travel", "flight", "offline", "toddler"],
  },
  {
    id: "daniel-tiger-emotions",
    author: "Priya N.",
    authorInitial: "P",
    authorColor: "#88B888",
    childAge: "3y 2m",
    moment: "calm",
    title: "Daniel Tiger's emotion songs genuinely work in real-time meltdowns",
    body: "When my twins are spiraling I now just start singing \"When you feel so mad that you want to roar, take a deep breath and count to four.\" They actually STOP. It took about 3 weeks of watching the show consistently for them to learn the songs. The NHS even recommends this approach for emotional co-regulation.",
    resources: [
      { type: "pbs",     title: "Daniel Tiger's Neighborhood – Managing Feelings", url: "https://pbskids.org" },
      { type: "youtube", title: "Daniel Tiger - Mad & Sad songs compilation", url: "https://youtube.com/watch?v=pWepfJ-8XU0", youtubeId: "pWepfJ-8XU0" },
      { type: "book",    title: "Daniel Tiger's \"Grr-ific\" Feelings", url: "https://amazon.com", price: "$8.99", note: "Read before/after screen time" },
    ],
    likes: 94,
    saves: 412,
    createdAt: "1 week ago",
    tags: ["emotions", "tantrums", "calm-down", "daniel-tiger"],
  },
  {
    id: "sick-day-survival",
    author: "Amy T.",
    authorInitial: "A",
    authorColor: "#C8A86A",
    childAge: "3y 9m",
    moment: "sick-day",
    title: "The only shows that don't overstimulate a sick toddler",
    body: "As a pediatric nurse and mom, the worst thing for a sick kid is high-stimulation content — it agitates them when they need calm. Here's what we play on sick days. All of these have slow pacing, soft audio, no jump cuts, no bright flashing. Bluey, Shaun the Sheep and Numberblocks are the gold standard.",
    resources: [
      { type: "netflix",  title: "Shaun the Sheep (no dialogue, very calm)", url: "https://netflix.com" },
      { type: "disney",   title: "Bluey – Quiet Episodes Only", url: "https://disneyplus.com" },
      { type: "youtube",  title: "Numberblocks – gentle learning", url: "https://youtube.com/watch?v=OWgRsFw0iU0", youtubeId: "OWgRsFw0iU0" },
      { type: "amazon",   title: "Children's Cold & Flu Care – Dr. William Sears", url: "https://amazon.com", price: "$12.99" },
    ],
    likes: 78,
    saves: 334,
    createdAt: "2 weeks ago",
    tags: ["sick-day", "low-stim", "calm", "no-flashing"],
  },
  {
    id: "restaurant-5min-saves",
    author: "Maria L.",
    authorInitial: "M",
    authorColor: "#C87870",
    childAge: "2y 3m",
    moment: "restaurant",
    title: "5-minute saves for restaurant waits — tested in 30+ restaurants",
    body: "I used to dread taking my daughter out to eat. Now I have a \"restaurant kit\" — downloaded Bluey clip, a small sensory toy, and the Starfall app for when food is delayed. The key: swap to the next thing every 3-4 minutes BEFORE she loses interest, not after.",
    resources: [
      { type: "youtube", title: "Bluey – Magic Xylophone (7 min, super calm)", url: "https://youtube.com/watch?v=zjq2HFKZnSE", youtubeId: "zjq2HFKZnSE" },
      { type: "app",     title: "Starfall Learn to Read – offline works", url: "https://apps.apple.com" },
      { type: "amazon",  title: "Sensory Fidget Tube Toy (silent, no sound)", url: "https://amazon.com", price: "$9.99" },
    ],
    likes: 51,
    saves: 198,
    createdAt: "2 weeks ago",
    tags: ["restaurant", "public", "5-minutes", "offline"],
  },
  {
    id: "numberblocks-math",
    author: "Teacher Jen",
    authorInitial: "J",
    authorColor: "#8878C8",
    childAge: "4y",
    moment: "learning",
    title: "Numberblocks — my kindergartners arrive already knowing place value",
    body: "I'm an ECE teacher. Every September I can tell which kids watched Numberblocks at home. They arrive understanding number composition in a way that takes months to teach otherwise. It's the best pre-math content I've seen — it embeds concepts in narrative, not drills. Watch WITH them and ask \"how many is that?\"",
    resources: [
      { type: "netflix",  title: "Numberblocks – All Seasons on Netflix", url: "https://netflix.com" },
      { type: "youtube",  title: "Numberblocks Official – Free episodes", url: "https://youtube.com/watch?v=OWgRsFw0iU0", youtubeId: "OWgRsFw0iU0" },
      { type: "book",     title: "Numberblocks Annual 2024", url: "https://amazon.com", price: "$16.99" },
      { type: "app",      title: "Numberblocks: Watch and Learn App", url: "https://apps.apple.com", price: "$3.99" },
    ],
    likes: 167,
    saves: 634,
    createdAt: "3 weeks ago",
    tags: ["math", "learning", "numberblocks", "early-childhood"],
  },
  {
    id: "cosmic-kids-yoga-bedtime",
    author: "Sarah M.",
    authorInitial: "S",
    authorColor: "#A87898",
    childAge: "3y 5m",
    moment: "bedtime",
    title: "20 minutes of Cosmic Kids yoga before bed — no more bedtime resistance",
    body: "My son was fighting bedtime HARD at 3. We started doing a Cosmic Kids yoga session at 7pm as part of the routine. It burns off the last of the physical energy, involves deep breathing, and the adventures are calm and cozy. By 7:30 he's genuinely ready for sleep. It's been 4 months and it still works.",
    resources: [
      { type: "youtube", title: "Frozen – A Cosmic Kids Yoga Adventure", url: "https://youtube.com/watch?v=xlg052EKMtk", youtubeId: "xlg052EKMtk", note: "Our favorite — 23 min, perfect length" },
      { type: "youtube", title: "Cosmic Kids – Sleep & Relax Playlist", url: "https://youtube.com/watch?v=yCjJyiqpAuU", youtubeId: "yCjJyiqpAuU" },
      { type: "amazon",  title: "Kids Yoga Mat with Alignment Marks", url: "https://amazon.com", price: "$22.99" },
    ],
    likes: 88,
    saves: 371,
    createdAt: "3 weeks ago",
    tags: ["bedtime", "yoga", "routine", "energy"],
  },
];
