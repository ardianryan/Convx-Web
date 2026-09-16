import { writable } from 'svelte/store';
import { getApiUrl } from '../api.js';

export const playlists = writable([]);
export const activePlaylist = writable(null);
export const isPlaylistLoading = writable(false);
export const playlistError = writable(null);

// Modal state for adding a track to playlist
export const trackToAddToPlaylist = writable(null); // When not null, AddToPlaylistModal is open
export const editingPlaylist = writable(null); // When not null, PlaylistModal is open for create/edit

/**
 * Fetch all playlists belonging to the user
 */
export async function fetchPlaylists() {
  isPlaylistLoading.set(true);
  playlistError.set(null);
  try {
    const res = await fetch(getApiUrl('/api/playlists'), {
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const list = data.playlists || [];
    playlists.set(list);
    return list;
  } catch (err) {
    console.warn('[Playlists Store] fetchPlaylists error:', err);
    playlistError.set(err.message || 'Gagal memuat daftar putar');
    return [];
  } finally {
    isPlaylistLoading.set(false);
  }
}

/**
 * Create a new playlist
 */
export async function createPlaylist({ name, description = '', accentColor = 'rose' }) {
  isPlaylistLoading.set(true);
  playlistError.set(null);
  try {
    const res = await fetch(getApiUrl('/api/playlists'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, description, accentColor }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data.playlist) {
      playlists.update((list) => [data.playlist, ...list]);
      return data.playlist;
    }
  } catch (err) {
    console.error('[Playlists Store] createPlaylist error:', err);
    playlistError.set(err.message || 'Gagal membuat daftar putar');
    throw err;
  } finally {
    isPlaylistLoading.set(false);
  }
}

/**
 * Get full playlist detail with tracks
 */
export async function getPlaylistDetail(id) {
  isPlaylistLoading.set(true);
  playlistError.set(null);
  try {
    const res = await fetch(getApiUrl(`/api/playlists/${id}`), {
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.playlist) {
      activePlaylist.set(data.playlist);
      return data.playlist;
    }
  } catch (err) {
    console.error('[Playlists Store] getPlaylistDetail error:', err);
    playlistError.set(err.message || 'Gagal memuat detail daftar putar');
    throw err;
  } finally {
    isPlaylistLoading.set(false);
  }
}

/**
 * Update playlist metadata
 */
export async function updatePlaylist(id, { name, description, accentColor }) {
  try {
    const res = await fetch(getApiUrl(`/api/playlists/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, description, accentColor }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Update in list
    playlists.update((list) =>
      list.map((p) => (p.id === id ? { ...p, ...data.playlist } : p))
    );

    // Update in active
    activePlaylist.update((active) =>
      active && active.id === id ? { ...active, ...data.playlist } : active
    );

    return data.playlist;
  } catch (err) {
    console.error('[Playlists Store] updatePlaylist error:', err);
    throw err;
  }
}

/**
 * Delete a playlist
 */
export async function deletePlaylist(id) {
  try {
    const res = await fetch(getApiUrl(`/api/playlists/${id}`), {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    playlists.update((list) => list.filter((p) => p.id !== id));
    activePlaylist.update((active) => (active && active.id === id ? null : active));
    return true;
  } catch (err) {
    console.error('[Playlists Store] deletePlaylist error:', err);
    throw err;
  }
}

/**
 * Add a track to playlist
 */
export async function addTrackToPlaylist(playlistId, track) {
  try {
    const res = await fetch(getApiUrl(`/api/playlists/${playlistId}/tracks`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ song: track }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    const data = await res.json();

    // Update local state if active
    if (data.track) {
      activePlaylist.update((active) => {
        if (!active || active.id !== playlistId) return active;
        const tracks = [...(active.tracks || []), data.track];
        return {
          ...active,
          tracks,
          trackCount: tracks.length,
          totalDuration: (active.totalDuration || 0) + (data.track.duration || 0),
        };
      });

      // Update count in playlists list
      playlists.update((list) =>
        list.map((p) =>
          p.id === playlistId
            ? {
                ...p,
                trackCount: (p.trackCount || 0) + 1,
                totalDuration: (p.totalDuration || 0) + (data.track.duration || 0),
                thumbnails: p.thumbnails?.length < 4 ? [...(p.thumbnails || []), data.track.thumbnail] : p.thumbnails,
              }
            : p
        )
      );
    }
    return data.track;
  } catch (err) {
    console.error('[Playlists Store] addTrackToPlaylist error:', err);
    throw err;
  }
}

/**
 * Remove track from playlist
 */
export async function removeTrackFromPlaylist(playlistId, trackId) {
  try {
    const res = await fetch(getApiUrl(`/api/playlists/${playlistId}/tracks/${trackId}`), {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    activePlaylist.update((active) => {
      if (!active || active.id !== playlistId) return active;
      const removedTrack = active.tracks?.find((t) => t.id === trackId);
      const tracks = active.tracks?.filter((t) => t.id !== trackId) || [];
      return {
        ...active,
        tracks,
        trackCount: tracks.length,
        totalDuration: Math.max(0, (active.totalDuration || 0) - (removedTrack?.duration || 0)),
      };
    });

    playlists.update((list) =>
      list.map((p) =>
        p.id === playlistId
          ? { ...p, trackCount: Math.max(0, (p.trackCount || 1) - 1) }
          : p
      )
    );

    return true;
  } catch (err) {
    console.error('[Playlists Store] removeTrackFromPlaylist error:', err);
    throw err;
  }
}

/**
 * Fetch remote YouTube playlist
 */
export async function fetchRemotePlaylist(urlOrId) {
  isPlaylistLoading.set(true);
  playlistError.set(null);
  try {
    const res = await fetch(getApiUrl(`/api/playlist/yt?url=${encodeURIComponent(urlOrId)}`), {
      credentials: 'include',
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!data.tracks || data.tracks.length === 0) {
      throw new Error('Tidak ada lagu yang ditemukan di daftar putar ini');
    }
    const remotePl = {
      ...data,
      isRemote: true,
      accentColor: 'rose',
    };
    activePlaylist.set(remotePl);
    return remotePl;
  } catch (err) {
    console.error('[Playlists Store] fetchRemotePlaylist error:', err);
    playlistError.set(err.message || 'Gagal memuat daftar putar YouTube');
    throw err;
  } finally {
    isPlaylistLoading.set(false);
  }
}

/**
 * Save a remote YouTube playlist permanently to user's library
 */
export async function saveRemotePlaylistToLibrary(remotePl) {
  if (!remotePl) return;
  isPlaylistLoading.set(true);
  try {
    // 1. Create personal playlist
    const created = await createPlaylist({
      name: remotePl.title || 'Daftar Putar Impor',
      description: remotePl.description || `Diimpor dari YouTube (${remotePl.tracks?.length || 0} lagu)`,
      accentColor: remotePl.accentColor || 'rose',
    });

    // 2. Add each track
    if (created && remotePl.tracks && remotePl.tracks.length > 0) {
      for (const track of remotePl.tracks) {
        await addTrackToPlaylist(created.id, track);
      }
      return await getPlaylistDetail(created.id);
    }
    return created;
  } catch (err) {
    console.error('[Playlists Store] saveRemotePlaylistToLibrary error:', err);
    throw err;
  } finally {
    isPlaylistLoading.set(false);
  }
}
