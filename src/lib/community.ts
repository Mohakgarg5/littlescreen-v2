import { Moment } from "./data";

export type ResourceType = "youtube";

export interface LinkedResource {
  type: ResourceType;
  title: string;
  url: string;
  youtubeId?: string;
  note?: string;
}

export interface WhatWorkedPost {
  id: string;
  author: string;
  authorInitial: string;
  authorColor: string;
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
  youtube: { label: "YouTube", color: "#C0392B", bg: "#FEF2F2", icon: "▶" },
};

export const COMMUNITY_POSTS: WhatWorkedPost[] = [
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
      { type: "youtube", title: "Toddler Learning with Ms. Rachel | Nursery Rhymes & Songs", url: "https://youtube.com/watch?v=h67AgK4EHq4", youtubeId: "h67AgK4EHq4", note: "Start from the beginning, watch together" },
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
    body: "Flew NYC to London with our 2-year-old. We downloaded everything offline and had a physical \"surprise bag\" that we opened one item every 45 minutes. Baby Shark was the MVP — held attention for a full 30 minutes. Do NOT rely on plane WiFi. Download before you leave.",
    resources: [
      { type: "youtube", title: "Baby Shark Dance | Pinkfong", url: "https://youtube.com/watch?v=XqZsoesa55w", youtubeId: "XqZsoesa55w" },
      { type: "youtube", title: "Baby Shark + More Kids Songs | Pinkfong Compilation", url: "https://youtube.com/watch?v=IPf2cA1KUdE", youtubeId: "IPf2cA1KUdE", note: "Download offline before boarding" },
    ],
    likes: 203,
    saves: 847,
    createdAt: "1 week ago",
    tags: ["travel", "flight", "offline", "toddler"],
  },
  {
    id: "calm-down-tantrums",
    author: "Priya N.",
    authorInitial: "P",
    authorColor: "#88B888",
    childAge: "3y 2m",
    moment: "calm",
    title: "Cosmic Kids Yoga fixed our 3pm meltdowns completely",
    body: "My twins were spiraling every afternoon around 3pm — overtired, overstimulated, screaming. We started putting on Cosmic Kids Yoga at 2:45 before the meltdown hit. The yoga movement burns off the last bit of energy, the breathing slows them down, and the adventure story keeps them engaged. It's been 4 months and it still works every time.",
    resources: [
      { type: "youtube", title: "Frozen | A Cosmic Kids Yoga Adventure", url: "https://youtube.com/watch?v=xlg052EKMtk", youtubeId: "xlg052EKMtk", note: "23 min — perfect length for pre-meltdown reset" },
    ],
    likes: 94,
    saves: 412,
    createdAt: "1 week ago",
    tags: ["tantrums", "calm-down", "yoga", "routine"],
  },
  {
    id: "sick-day-survival",
    author: "Amy T.",
    authorInitial: "A",
    authorColor: "#C8A86A",
    childAge: "3y 9m",
    moment: "sick-day",
    title: "The only YouTube videos that don't overstimulate a sick toddler",
    body: "As a pediatric nurse and mom, the worst thing for a sick kid is high-stimulation content — it agitates them when they need calm. Here's what we play on sick days. Both have slow pacing, soft audio, no jump cuts. Twinkle Twinkle and CoComelon Bath Song are the gold standard for low-stim comfort.",
    resources: [
      { type: "youtube", title: "Bath Song | CoComelon Nursery Rhymes", url: "https://youtube.com/watch?v=WRVsOCh907o", youtubeId: "WRVsOCh907o", note: "7.3 billion views — familiar = comforting when sick" },
      { type: "youtube", title: "Twinkle Twinkle Little Star | Super Simple Songs", url: "https://youtube.com/watch?v=yCjJyiqpAuU", youtubeId: "yCjJyiqpAuU" },
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
    title: "5-minute YouTube saves for restaurant waits — tested in 30+ restaurants",
    body: "I used to dread taking my daughter out to eat. Now I have a go-to YouTube playlist downloaded offline. The key: swap to the next video every 3-4 minutes BEFORE she loses interest, not after. Baby Shark then GoNoodle is my proven combo.",
    resources: [
      { type: "youtube", title: "Baby Shark Dance | Pinkfong", url: "https://youtube.com/watch?v=XqZsoesa55w", youtubeId: "XqZsoesa55w" },
      { type: "youtube", title: "Banana Banana Meatball | GoNoodle", url: "https://youtube.com/watch?v=BQ9q4U2P3ig", youtubeId: "BQ9q4U2P3ig", note: "Swap to this after Baby Shark" },
    ],
    likes: 51,
    saves: 198,
    createdAt: "2 weeks ago",
    tags: ["restaurant", "public", "5-minutes", "offline"],
  },
  {
    id: "learning-songs-work",
    author: "Teacher Jen",
    authorInitial: "J",
    authorColor: "#8878C8",
    childAge: "4y",
    moment: "learning",
    title: "These YouTube songs — my kindergartners arrive knowing colors, animals, and counting",
    body: "I'm an ECE teacher. Every September I can tell which kids watched CoComelon and Super Simple Songs at home. They arrive understanding colors, basic counting, and animal names in a way that takes months to teach otherwise. Watch WITH them and ask questions — 'what color is that?' The interaction doubles the learning.",
    resources: [
      { type: "youtube", title: "The Colors Song | CoComelon", url: "https://youtube.com/watch?v=yP8Qedl1gS0", youtubeId: "yP8Qedl1gS0", note: "Colors clicked after 3-4 watches for most kids" },
      { type: "youtube", title: "Old MacDonald + More | Super Simple Songs", url: "https://youtube.com/watch?v=lWhqORImND0", youtubeId: "lWhqORImND0" },
    ],
    likes: 167,
    saves: 634,
    createdAt: "3 weeks ago",
    tags: ["learning", "colors", "early-childhood", "co-viewing"],
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
      { type: "youtube", title: "Frozen | A Cosmic Kids Yoga Adventure", url: "https://youtube.com/watch?v=xlg052EKMtk", youtubeId: "xlg052EKMtk", note: "23 min — our favorite, perfect length" },
    ],
    likes: 88,
    saves: 371,
    createdAt: "3 weeks ago",
    tags: ["bedtime", "yoga", "routine", "energy"],
  },
  {
    id: "gonoodle-energy",
    author: "David R.",
    authorInitial: "D",
    authorColor: "#D4956A",
    childAge: "2y 5m",
    moment: "active",
    title: "GoNoodle burns off energy before dinner — saved our evenings",
    body: "That witching hour before dinner when kids are wired and you're trying to cook was killing us. We now put on GoNoodle's Banana Banana Meatball at 5pm for 10 minutes. They burn off the pent-up energy, come to dinner calmer, and actually eat. Game changer.",
    resources: [
      { type: "youtube", title: "Banana Banana Meatball | GoNoodle", url: "https://youtube.com/watch?v=BQ9q4U2P3ig", youtubeId: "BQ9q4U2P3ig", note: "10 minutes = full energy reset" },
    ],
    likes: 67,
    saves: 289,
    createdAt: "2 days ago",
    tags: ["energy", "active", "routine", "witching-hour"],
  },
];
