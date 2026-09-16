<script>
  import { X, Plus, Check, Music2, ListMusic, Loader2 } from 'lucide-svelte';
  import {
    playlists,
    trackToAddToPlaylist,
    addTrackToPlaylist,
    editingPlaylist,
    fetchPlaylists
  } from '../stores/playlists.js';

  let addingToId = null;
  let successPlaylistId = null;
  let errorMsg = '';

  $: track = $trackToAddToPlaylist;

  function handleClose() {
    trackToAddToPlaylist.set(null);
    addingToId = null;
    successPlaylistId = null;
    errorMsg = '';
  }

  async function handleAdd(playlist) {
    if (!track || addingToId) return;
    addingToId = playlist.id;
    errorMsg = '';
    try {
      await addTrackToPlaylist(playlist.id, track);
      successPlaylistId = playlist.id;
      setTimeout(() => {
        handleClose();
      }, 700);
    } catch (err) {
      errorMsg = err.message || 'Gagal menambahkan lagu';
      addingToId = null;
    }
  }

  function handleCreateNew() {
    editingPlaylist.set({ name: '', description: '', accentColor: 'rose' });
  }

  const gradientMap = {
    rose: 'from-rose-500 to-red-600',
    amber: 'from-amber-500 to-orange-600',
    ocean: 'from-blue-600 to-cyan-500',
    violet: 'from-fuchsia-600 to-purple-700',
    emerald: 'from-emerald-500 to-teal-700',
    dark: 'from-neutral-700 to-neutral-900',
  };
</script>

{#if track}
  <div
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 anim-fade-in"
    on:click|self={handleClose}
    on:keydown={(e) => e.key === 'Escape' && handleClose()}
  >
    <div
      class="w-full max-w-md bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden flex flex-col anim-scale-up max-h-[85vh]"
    >
      <!-- Header -->
      <div class="px-6 pt-5 pb-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
            Tambahkan ke Daftar Putar
          </h2>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Pilih daftar putar tujuan untuk lagu ini
          </p>
        </div>
        <button
          type="button"
          on:click={handleClose}
          aria-label="Tutup"
          class="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center text-neutral-500 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Target Track Banner -->
      <div class="px-6 py-3 bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/10 flex items-center gap-3">
        <img
          src={track.thumbnail}
          alt={track.title}
          class="w-10 h-10 rounded-lg object-cover shadow-sm bg-neutral-800 shrink-0"
        />
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold text-neutral-900 dark:text-white truncate">
            {track.title}
          </p>
          <p class="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
            {track.artist}
          </p>
        </div>
      </div>

      {#if errorMsg}
        <div class="mx-6 mt-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
          {errorMsg}
        </div>
      {/if}

      <!-- Playlists Scrollable List -->
      <div class="p-4 space-y-1.5 overflow-y-auto flex-1 min-h-[160px]">
        <!-- Create New Playlist Button Row -->
        <button
          type="button"
          on:click={handleCreateNew}
          class="w-full px-3.5 py-3 rounded-2xl flex items-center gap-3 bg-[#fa2d48]/10 hover:bg-[#fa2d48]/15 text-[#fa2d48] font-semibold text-sm transition-colors text-left group cursor-pointer"
        >
          <div class="w-10 h-10 rounded-xl bg-[#fa2d48] text-white flex items-center justify-center shadow-md shadow-[#fa2d48]/20 group-hover:scale-105 transition-transform shrink-0">
            <Plus class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
            <span class="block text-sm font-bold">Buat Daftar Putar Baru</span>
            <span class="block text-xs opacity-75 font-normal">Buat koleksi baru untuk lagu ini</span>
          </div>
        </button>

        {#if $playlists.length === 0}
          <div class="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
            Belum ada daftar putar lain. Klik tombol di atas untuk membuat yang pertama!
          </div>
        {:else}
          {#each $playlists as pl (pl.id)}
            {@const isAdding = addingToId === pl.id}
            {@const isDone = successPlaylistId === pl.id}
            {@const grad = gradientMap[pl.accentColor] || gradientMap.rose}
            <button
              type="button"
              disabled={isAdding || isDone}
              on:click={() => handleAdd(pl)}
              class="w-full px-3 py-2.5 rounded-2xl flex items-center justify-between gap-3 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors text-left cursor-pointer group"
            >
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <!-- Cover / Gradient Thumbnail -->
                <div class="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-sm relative bg-neutral-800 flex items-center justify-center">
                  {#if pl.coverUrl}
                    <img src={pl.coverUrl} alt={pl.name} class="w-full h-full object-cover" />
                  {:else}
                    <div class="w-full h-full bg-gradient-to-br {grad} flex items-center justify-center">
                      <Music2 class="w-4 h-4 text-white/80" />
                    </div>
                  {/if}
                </div>

                <div class="min-w-0 flex-1">
                  <p class="text-sm font-bold text-neutral-900 dark:text-white truncate group-hover:text-[#fa2d48] transition-colors">
                    {pl.name}
                  </p>
                  <p class="text-xs text-neutral-400 dark:text-neutral-500 truncate">
                    {pl.trackCount || 0} lagu
                  </p>
                </div>
              </div>

              <!-- Action Status -->
              <div class="shrink-0">
                {#if isDone}
                  <span class="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center anim-scale-up">
                    <Check class="w-4 h-4 stroke-[3]" />
                  </span>
                {:else if isAdding}
                  <span class="w-7 h-7 flex items-center justify-center text-neutral-400">
                    <Loader2 class="w-4 h-4 animate-spin" />
                  </span>
                {:else}
                  <span class="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 group-hover:bg-[#fa2d48] group-hover:text-white text-neutral-400 dark:text-neutral-500 flex items-center justify-center transition-colors">
                    <Plus class="w-4 h-4" />
                  </span>
                {/if}
              </div>
            </button>
          {/each}
        {/if}
      </div>
    </div>
  </div>
{/if}
