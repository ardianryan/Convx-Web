<script>
  import {
    ArrowLeft,
    Play,
    Pause,
    Shuffle,
    MoreHorizontal,
    Plus,
    Trash2,
    Edit3,
    Music2,
    Clock,
    Sparkles,
    BookmarkPlus,
    Check,
    Loader2
  } from 'lucide-svelte';
  import {
    activePlaylist,
    editingPlaylist,
    deletePlaylist,
    removeTrackFromPlaylist,
    trackToAddToPlaylist,
    saveRemotePlaylistToLibrary
  } from '../stores/playlists.js';
  import {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    addToQueue,
    queue
  } from '../stores/player.js';

  export let onBack = () => {};

  let isSavingRemote = false;
  let savedSuccess = false;

  $: playlist = $activePlaylist;
  $: tracks = playlist?.tracks || [];

  function formatTotalDuration(seconds) {
    if (!seconds) return '0 menit';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs} jam ${mins} menit`;
    }
    return `${mins} menit`;
  }

  function formatTime(seconds) {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function handlePlayAll() {
    if (tracks.length === 0) return;
    playSong(tracks[0], tracks);
  }

  function handleShuffle() {
    if (tracks.length === 0) return;
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    playSong(shuffled[0], shuffled);
  }

  function handlePlayTrack(track) {
    if ($currentSong?.id === track.id || $currentSong?.id === track.songId) {
      togglePlay();
    } else {
      playSong(track, tracks);
    }
  }

  function handleEdit() {
    if (!playlist || playlist.isRemote) return;
    editingPlaylist.set(playlist);
  }

  async function handleDelete() {
    if (!playlist || playlist.isRemote) return;
    if (confirm(`Apakah Anda yakin ingin menghapus daftar putar "${playlist.name}"?`)) {
      await deletePlaylist(playlist.id);
      onBack();
    }
  }

  async function handleRemoveTrack(trackId, trackTitle) {
    if (!playlist || playlist.isRemote) return;
    if (confirm(`Hapus "${trackTitle}" dari daftar putar ini?`)) {
      await removeTrackFromPlaylist(playlist.id, trackId);
    }
  }

  async function handleSaveRemote() {
    if (!playlist || !playlist.isRemote || isSavingRemote) return;
    isSavingRemote = true;
    try {
      const saved = await saveRemotePlaylistToLibrary(playlist);
      savedSuccess = true;
      setTimeout(() => {
        savedSuccess = false;
      }, 3000);
    } catch (err) {
      alert(err.message || 'Gagal menyimpan ke perpustakaan');
    } finally {
      isSavingRemote = false;
    }
  }

  const gradientMap = {
    rose: 'from-rose-500 via-pink-600 to-red-600',
    amber: 'from-amber-500 via-orange-500 to-red-600',
    ocean: 'from-blue-600 via-indigo-600 to-cyan-500',
    violet: 'from-fuchsia-600 via-purple-600 to-indigo-700',
    emerald: 'from-emerald-500 via-teal-600 to-cyan-700',
    dark: 'from-neutral-800 via-neutral-900 to-black',
  };

  $: gradientClass = gradientMap[playlist?.accentColor] || gradientMap.rose;
</script>

{#if playlist}
  <div class="space-y-6 max-w-5xl mx-auto pb-16 anim-tab-view">
    <!-- Back Navigation -->
    <div class="flex items-center justify-between pt-1">
      <button
        type="button"
        on:click={onBack}
        class="flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-[#fa2d48] dark:hover:text-[#fa2d48] transition-colors cursor-pointer group"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Daftar Putar</span>
      </button>

      {#if !playlist.isRemote}
        <div class="flex items-center gap-2">
          <button
            type="button"
            on:click={handleEdit}
            class="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 class="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            on:click={handleDelete}
            class="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-500 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
        </div>
      {/if}
    </div>

    <!-- Apple Music Hero Header -->
    <div class="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 pt-2">
      <!-- Cover Artwork / 4-Quadrant Mosaic -->
      <div class="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl shrink-0 border border-black/10 dark:border-white/15 bg-neutral-900 group">
        {#if playlist.coverUrl}
          <img src={playlist.coverUrl} alt={playlist.name || playlist.title} class="w-full h-full object-cover" />
        {:else if playlist.thumbnails && playlist.thumbnails.length >= 4}
          <div class="w-full h-full grid grid-cols-2 grid-rows-2">
            {#each playlist.thumbnails.slice(0, 4) as thumb}
              <img src={thumb} alt="" class="w-full h-full object-cover" />
            {/each}
          </div>
        {:else}
          <div class="w-full h-full bg-gradient-to-br {gradientClass} flex items-center justify-center p-6 text-white shadow-inner">
            <Music2 class="w-20 h-20 opacity-80" />
          </div>
        {/if}

        <!-- Ambient glow blur underneath -->
        <div class="absolute -inset-2 bg-gradient-to-br {gradientClass} opacity-30 blur-2xl -z-10 pointer-events-none"></div>
      </div>

      <!-- Playlist Details & Actions -->
      <div class="flex-1 text-center sm:text-left min-w-0 space-y-3">
        <div>
          <span class="text-[11px] font-extrabold uppercase tracking-widest text-[#fa2d48]">
            {playlist.isRemote ? 'DAFTAR PUTAR YOUTUBE' : 'DAFTAR PUTAR'}
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight mt-1 truncate">
            {playlist.name || playlist.title}
          </h1>
          <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {playlist.description || (playlist.author ? `Kurasi oleh ${playlist.author}` : 'Koleksi musik pribadi Anda')}
          </p>
        </div>

        <div class="flex items-center justify-center sm:justify-start gap-2 text-xs text-neutral-400 dark:text-neutral-500 font-medium">
          <span>{tracks.length} lagu</span>
          <span>•</span>
          <span>{formatTotalDuration(playlist.totalDuration)}</span>
        </div>

        <!-- Buttons Row -->
        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
          <button
            type="button"
            disabled={tracks.length === 0}
            on:click={handlePlayAll}
            class="px-5 py-2.5 rounded-full bg-[#fa2d48] hover:bg-[#e0263f] text-white font-bold text-sm shadow-lg shadow-[#fa2d48]/25 flex items-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <Play class="w-4 h-4 fill-white" />
            <span>Putar</span>
          </button>

          <button
            type="button"
            disabled={tracks.length === 0}
            on:click={handleShuffle}
            class="px-5 py-2.5 rounded-full bg-black/[0.06] dark:bg-white/[0.1] hover:bg-black/[0.1] dark:hover:bg-white/[0.15] text-neutral-900 dark:text-white font-bold text-sm flex items-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <Shuffle class="w-4 h-4" />
            <span>Acak</span>
          </button>

          {#if playlist.isRemote}
            <button
              type="button"
              disabled={isSavingRemote || savedSuccess}
              on:click={handleSaveRemote}
              class="px-4 py-2.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 dark:text-emerald-400 font-bold text-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              {#if isSavingRemote}
                <Loader2 class="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              {:else if savedSuccess}
                <Check class="w-4 h-4 stroke-[3]" />
                <span>Tersimpan di Perpustakaan!</span>
              {:else}
                <BookmarkPlus class="w-4 h-4" />
                <span>Simpan ke Perpustakaan</span>
              {/if}
            </button>
          {/if}
        </div>
      </div>
    </div>

    <!-- Track List Table -->
    <section class="pt-4">
      {#if tracks.length === 0}
        <div class="py-20 text-center rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
          <Music2 class="w-10 h-10 text-neutral-400 dark:text-neutral-600 mx-auto mb-2 opacity-50" />
          <p class="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
            Daftar putar ini masih kosong
          </p>
          <p class="text-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-sm mx-auto">
            Cari lagu apa pun atau jelajahi beranda, lalu klik tombol "+" atau opsi menu untuk menambahkan lagu ke sini.
          </p>
        </div>
      {:else}
        <div class="rounded-3xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/5 dark:border-white/5 overflow-hidden shadow-lg divide-y divide-black/[0.04] dark:divide-white/[0.04]">
          <!-- Table Header -->
          <div class="px-4 py-2.5 flex items-center text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            <span class="w-8 text-center">#</span>
            <span class="flex-1 min-w-0 pl-3">Judul</span>
            <span class="w-20 text-right pr-4 hidden sm:block">Durasi</span>
            <span class="w-20 text-right pr-2">Aksi</span>
          </div>

          <!-- Table Rows -->
          {#each tracks as track, idx (track.id || track.songId || idx)}
            {@const trackId = track.songId || track.id}
            {@const isCurrent = $currentSong?.id === trackId}
            <div
              role="button"
              tabindex="0"
              on:click={() => handlePlayTrack(track)}
              on:keydown={(e) => e.key === 'Enter' && handlePlayTrack(track)}
              class="flex items-center px-3 py-2.5 sm:px-4 sm:py-3 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:bg-black/[0.07] dark:active:bg-white/[0.1] transition-colors cursor-pointer group select-none {isCurrent ? 'bg-[#fa2d48]/10 dark:bg-[#fa2d48]/15' : ''}"
            >
              <!-- Index / Play icon / Equalizer -->
              <div class="w-8 text-center shrink-0 flex items-center justify-center">
                {#if isCurrent}
                  {#if $isPlaying}
                    <div class="flex items-end gap-[2px] h-3.5">
                      <span class="w-[2.5px] h-3 bg-[#fa2d48] rounded-full anim-eq-1"></span>
                      <span class="w-[2.5px] h-4 bg-[#ff6480] rounded-full anim-eq-2"></span>
                      <span class="w-[2.5px] h-2 bg-[#fa2d48] rounded-full anim-eq-3"></span>
                    </div>
                  {:else}
                    <Pause class="w-3.5 h-3.5 text-[#fa2d48] fill-[#fa2d48]" />
                  {/if}
                {:else}
                  <span class="text-xs font-semibold text-neutral-400 dark:text-neutral-500 group-hover:hidden font-mono">
                    {idx + 1}
                  </span>
                  <Play class="w-3.5 h-3.5 text-neutral-700 dark:text-white fill-current hidden group-hover:block" />
                {/if}
              </div>

              <!-- Artwork + Title + Artist -->
              <div class="flex items-center gap-3 flex-1 min-w-0 pl-3">
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  class="w-10 h-10 rounded-lg object-cover bg-neutral-800 shrink-0 shadow-sm"
                  loading="lazy"
                />
                <div class="min-w-0 flex-1 pr-2">
                  <p class="text-sm font-bold truncate transition-colors {isCurrent ? 'text-[#fa2d48]' : 'text-neutral-900 dark:text-white'}">
                    {track.title}
                  </p>
                  <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>
              </div>

              <!-- Duration -->
              <div class="w-20 text-right pr-4 text-xs text-neutral-400 dark:text-neutral-500 font-mono hidden sm:block shrink-0">
                {track.durationText || formatTime(track.duration)}
              </div>

              <!-- Quick Actions -->
              <div class="w-20 flex items-center justify-end gap-1 shrink-0">
                <!-- Add to another playlist -->
                <button
                  type="button"
                  on:click|stopPropagation={() => trackToAddToPlaylist.set(track)}
                  class="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  title="Tambahkan ke daftar putar lain"
                >
                  <Plus class="w-4 h-4" />
                </button>

                <!-- Remove from this playlist (if user's personal playlist) -->
                {#if !playlist.isRemote}
                  <button
                    type="button"
                    on:click|stopPropagation={() => handleRemoveTrack(track.id, track.title)}
                    class="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Hapus dari daftar putar ini"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </section>
  </div>
{/if}
