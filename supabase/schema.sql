-- littleScreen v2 Database Schema
-- Run this in the Supabase dashboard SQL editor

-- ─────────────────────────────────────────
-- PARENT CONCERNS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parent_concerns (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     TEXT NOT NULL,
  concern     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS parent_concerns_user_id_idx ON parent_concerns(user_id);

-- ─────────────────────────────────────────
-- PLAYLISTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS playlists (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     TEXT NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  moment      TEXT,
  age_group   TEXT,
  is_public   BOOLEAN DEFAULT false,
  saves       INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS playlists_user_id_idx ON playlists(user_id);
CREATE INDEX IF NOT EXISTS playlists_is_public_idx ON playlists(is_public);

-- ─────────────────────────────────────────
-- PLAYLIST TAGS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS playlist_tags (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  tag         TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS playlist_tags_playlist_id_idx ON playlist_tags(playlist_id);

-- ─────────────────────────────────────────
-- PLAYLIST ITEMS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS playlist_items (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id   UUID REFERENCES playlists(id) ON DELETE CASCADE,
  video_id      TEXT NOT NULL,
  title         TEXT NOT NULL,
  thumbnail_url TEXT,
  channel_name  TEXT,
  position      INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS playlist_items_playlist_id_idx ON playlist_items(playlist_id);

-- ─────────────────────────────────────────
-- CONTENT RATINGS (scraped + AI)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_ratings (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title                   TEXT NOT NULL,
  source                  TEXT NOT NULL,
  age_min                 INTEGER,
  age_max                 INTEGER,
  sex_romance_nudity      INTEGER,
  violence_scariness      INTEGER,
  products_purchases      INTEGER,
  drinking_drugs_smoking  INTEGER,
  language                INTEGER,
  ai_approved             BOOLEAN,
  ai_score                NUMERIC(3,2),
  ai_notes                TEXT,
  scraped_at              TIMESTAMPTZ DEFAULT now(),
  UNIQUE(title, source)
);
CREATE INDEX IF NOT EXISTS content_ratings_title_idx ON content_ratings(title);

-- ─────────────────────────────────────────
-- FEEDBACK
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feedback (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     TEXT NOT NULL,
  video_id    TEXT,
  trigger     TEXT NOT NULL,
  rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  email_sent  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS feedback_user_id_idx ON feedback(user_id);
CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON feedback(created_at);

-- ─────────────────────────────────────────
-- APPROVED CHANNELS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS approved_channels (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_name TEXT NOT NULL UNIQUE,
  platform     TEXT NOT NULL,
  age_min      INTEGER,
  age_max      INTEGER,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────
-- COMMUNITY POSTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     TEXT NOT NULL,
  user_name   TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  moment      TEXT,
  age_group   TEXT,
  resources   JSONB DEFAULT '[]',
  likes       INTEGER DEFAULT 0,
  saves       INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS community_posts_created_at_idx ON community_posts(created_at);
CREATE INDEX IF NOT EXISTS community_posts_user_id_idx ON community_posts(user_id);

-- ─────────────────────────────────────────
-- FOLLOWS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS follows (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id         TEXT NOT NULL,
  following_username  TEXT NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_username)
);
CREATE INDEX IF NOT EXISTS follows_follower_id_idx ON follows(follower_id);
