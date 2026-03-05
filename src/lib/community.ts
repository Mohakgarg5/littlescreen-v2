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
      { type: "youtube", title: "Songs for Littles – Ms. Rachel", url: "https://youtube.com/watch?v=NsEJGgXYm5s", youtubeId: "NsEJGgXYm5s", note: "Start with Season 1 Episode 1" },
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
      { type: "youtube", title: "Wheels on the Bus | Super Simple Songs", url: "https://youtube.com/watch?v=GbpO_RDpZeM", youtubeId: "GbpO_RDpZeM", note: "Download offline before boarding" },
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
      { type: "youtube", title: "Daniel Tiger - Mad & Sad songs compilation", url: "https://youtube.com/watch?v=pWepfJ-8XU0", youtubeId: "pWepfJ-8XU0" },
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
    title: "The only YouTube videos that don't overstimulate a sick toddler",
    body: "As a pediatric nurse and mom, the worst thing for a sick kid is high-stimulation content — it agitates them when they need calm. Here's what we play on sick days. All of these have slow pacing, soft audio, no jump cuts, no bright flashing. Numberblocks and Twinkle Twinkle are gold standard.",
    resources: [
      { type: "youtube", title: "Numberblocks – gentle learning", url: "https://youtube.com/watch?v=OWgRsFw0iU0", youtubeId: "OWgRsFw0iU0" },
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
    body: "I used to dread taking my daughter out to eat. Now I have a go-to YouTube playlist downloaded offline. The key: swap to the next video every 3-4 minutes BEFORE she loses interest, not after. Baby Shark and Wheels on the Bus are the holy grail for this.",
    resources: [
      { type: "youtube", title: "Baby Shark Dance | Pinkfong", url: "https://youtube.com/watch?v=XqZsoesa55w", youtubeId: "XqZsoesa55w" },
      { type: "youtube", title: "Wheels on the Bus | Super Simple Songs", url: "https://youtube.com/watch?v=GbpO_RDpZeM", youtubeId: "GbpO_RDpZeM" },
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
    title: "Numberblocks on YouTube — my kindergartners arrive already knowing place value",
    body: "I'm an ECE teacher. Every September I can tell which kids watched Numberblocks at home. They arrive understanding number composition in a way that takes months to teach otherwise. It's the best pre-math content I've seen — it embeds concepts in narrative, not drills. Watch WITH them and ask \"how many is that?\"",
    resources: [
      { type: "youtube", title: "Numberblocks Official – Free episodes", url: "https://youtube.com/watch?v=OWgRsFw0iU0", youtubeId: "OWgRsFw0iU0" },
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
    body: "That witching hour before dinner when kids are wired and you're trying to cook was killing us. We now put on a GoNoodle dance video at 5pm for 10 minutes. They burn off the pent-up energy, come to dinner calmer, and actually eat. Game changer.",
    resources: [
      { type: "youtube", title: "GoNoodle | Jump & Dance", url: "https://youtube.com/watch?v=l4WNrvVjiTw", youtubeId: "l4WNrvVjiTw", note: "10 minutes = full reset" },
    ],
    likes: 67,
    saves: 289,
    createdAt: "2 days ago",
    tags: ["energy", "active", "routine", "witching-hour"],
  },
];
