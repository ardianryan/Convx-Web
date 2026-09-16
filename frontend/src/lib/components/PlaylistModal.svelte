<script>
  import { X, Sparkles, Loader2 } from 'lucide-svelte';
  import {
    editingPlaylist,
    createPlaylist,
    updatePlaylist,
    activePlaylist,
    getPlaylistDetail
  } from '../stores/playlists.js';

  let name = '';
  let description = '';
  let accentColor = 'rose';
  let isSubmitting = false;
  let errorMsg = '';

  const colorPresets = [
    { id: 'rose', label: 'Apple Rose', gradient: 'from-rose-500 to-red-600', ring: 'ring-rose-500' },
    { id: 'amber', label: 'Sunset Amber', gradient: 'from-amber-500 to-orange-600', ring: 'ring-amber-500' },
    { id: 'ocean', label: 'Ocean Blue', gradient: 'from-blue-600 to-cyan-500', ring: 'ring-blue-500' },
    { id: 'violet', label: 'Neon Violet', gradient: 'from-fuchsia-600 to-purple-700', ring: 'ring-purple-500' },
    { id: 'emerald', label: 'Emerald Teal', gradient: 'from-emerald-500 to-teal-700', ring: 'ring-emerald-500' },
    { id: 'dark', label: 'Pure Obsidian', gradient: 'from-neutral-700 to-neutral-900', ring: 'ring-neutral-400' },
  ];

  $: isEditing = $editingPlaylist && $editingPlaylist.id;

  $: if ($editingPlaylist) {
    name = $editingPlaylist.name || '';
    description = $editingPlaylist.description || '';
    accentColor = $editingPlaylist.accentColor || 'rose';
    errorMsg = '';
  }

  function handleClose() {
    editingPlaylist.set(null);
  }

  async function handleSubmit() {
    if (!name.trim()) {
      errorMsg = 'Nama daftar putar wajib diisi';
      return;
    }
    isSubmitting = true;
    errorMsg = '';
    try {
      if (isEditing) {
        await updatePlaylist($editingPlaylist.id, {
          name: name.trim(),
          description: description.trim(),
          accentColor,
        });
      } else {
        const created = await createPlaylist({
          name: name.trim(),
          description: description.trim(),
          accentColor,
        });
        if (created) {
          await getPlaylistDetail(created.id);
        }
      }
      handleClose();
    } catch (err) {
      errorMsg = err.message || 'Gagal menyimpan daftar putar';
    } finally {
      isSubmitting = false;
    }
  }
</script>

{#if $editingPlaylist}
  <!-- Backdrop -->
  <div
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 anim-fade-in"
    on:click|self={handleClose}
    on:keydown={(e) => e.key === 'Escape' && handleClose()}
  >
    <!-- Modal Card -->
    <div
      class="w-full max-w-md bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden flex flex-col anim-scale-up"
    >
      <!-- Header -->
      <div class="px-6 pt-6 pb-4 flex items-center justify-between border-b border-black/5 dark:border-white/10">
        <div>
          <h2 class="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {isEditing ? 'Edit Daftar Putar' : 'Daftar Putar Baru'}
          </h2>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isEditing ? 'Perbarui detail daftar putar Anda' : 'Buat koleksi lagu pribadi favorit Anda'}
          </p>
        </div>
        <button
          type="button"
          on:click={handleClose}
          aria-label="Tutup modal"
          class="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center text-neutral-500 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Form Body -->
      <form on:submit|preventDefault={handleSubmit} class="p-6 space-y-5">
        {#if errorMsg}
          <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
            {errorMsg}
          </div>
        {/if}

        <!-- Name Field -->
        <div>
          <label for="playlist-name-input" class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
            Nama Daftar Putar <span class="text-[#fa2d48]">*</span>
          </label>
          <input
            id="playlist-name-input"
            type="text"
            bind:value={name}
            placeholder="mis. Lagu Favorit 2026, Gym Spirit..."
            class="w-full px-4 py-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#fa2d48] transition-all"
            required
          />
        </div>

        <!-- Description Field -->
        <div>
          <label for="playlist-desc-input" class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
            Deskripsi (Opsional)
          </label>
          <textarea
            id="playlist-desc-input"
            bind:value={description}
            rows="2"
            placeholder="Beri catatan singkat mengenai playlist ini..."
            class="w-full px-4 py-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#fa2d48] transition-all resize-none"
          ></textarea>
        </div>

        <!-- Theme / Color Gradient Picker -->
        <div>
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
            Tema Warna Sampul
          </label>
          <div class="grid grid-cols-6 gap-2.5">
            {#each colorPresets as preset}
              <button
                type="button"
                on:click={() => (accentColor = preset.id)}
                class="group relative aspect-square rounded-xl bg-gradient-to-br {preset.gradient} p-0.5 transition-transform active:scale-95 {accentColor === preset.id ? 'ring-2 ' + preset.ring + ' ring-offset-2 ring-offset-white dark:ring-offset-[#1c1c1e] scale-105' : 'opacity-70 hover:opacity-100'}"
                title={preset.label}
                aria-label={preset.label}
              >
                {#if accentColor === preset.id}
                  <span class="absolute inset-0 flex items-center justify-center">
                    <span class="w-2 h-2 rounded-full bg-white shadow"></span>
                  </span>
                {/if}
              </button>
            {/each}
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            on:click={handleClose}
            class="px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#fa2d48] hover:bg-[#e0263f] text-white shadow-lg shadow-[#fa2d48]/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {#if isSubmitting}
              <Loader2 class="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            {:else}
              <Sparkles class="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan' : 'Buat Daftar Putar'}</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
