const { sqliteTable, text, integer } = require('drizzle-orm/sqlite-core');

// System settings table (key-value store for platform config)
const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

// Admin users table
const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  name: text('name'),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at').notNull(),
});

// User auth sessions
const sessions = sqliteTable('sessions', {
  token: text('token').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  expiresAt: integer('expires_at').notNull(),
  createdAt: integer('created_at').notNull(),
});

// Proxy relays (Cloudflare Workers, etc.)
const proxyRelays = sqliteTable('proxy_relays', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type').notNull().default('cloudflare'),
  url: text('url').notNull(),
  isActive: integer('is_active').notNull().default(1),
  createdAt: integer('created_at').notNull(),
});

// Active devices tracking
const devices = sqliteTable('devices', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  deviceType: text('device_type').notNull(), // desktop, mobile, tablet
  platform: text('platform').notNull(),      // macOS, Windows, iOS, Android, Linux
  browser: text('browser').notNull(),        // Chrome, Safari, Firefox, Edge
  isPlaying: integer('is_playing').notNull().default(0),
  currentSong: text('current_song'),         // JSON string
  lastHeartbeat: integer('last_heartbeat').notNull(),
  createdAt: integer('created_at').notNull(),
});

// User Playlists
const playlists = sqliteTable('playlists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  coverUrl: text('cover_url'),
  accentColor: text('accent_color').notNull().default('rose'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Playlist Tracks
const playlistTracks = sqliteTable('playlist_tracks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  playlistId: integer('playlist_id').notNull().references(() => playlists.id, { onDelete: 'cascade' }),
  songId: text('song_id').notNull(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  album: text('album'),
  duration: integer('duration').notNull().default(0),
  durationText: text('duration_text'),
  thumbnail: text('thumbnail'),
  position: integer('position').notNull().default(0),
  addedAt: integer('added_at').notNull(),
});

module.exports = {
  settings,
  users,
  sessions,
  proxyRelays,
  devices,
  playlists,
  playlistTracks,
};

