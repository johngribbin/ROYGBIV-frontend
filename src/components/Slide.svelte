<script lang="ts">
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import BackButton from './BackButton.svelte'
  import { browser } from '$app/environment'

  export let back: (() => void) | null = null
  export let direction: 'left' | 'right' = 'left'
  export let backText: string | undefined = undefined

  let mounted = false

  onMount(() => (mounted = true))

  function getValue() {
    if (browser) {
      const { innerWidth } = window
      return innerWidth > 500 ? 500 : innerWidth
    }
    return 0
  }

  const x = direction === 'left' ? getValue() : -getValue()
</script>

{#if mounted}
  <div class="">
    {#if back}
      <BackButton on:click={back} />
    {/if}

    <div in:fly|local={{ x, duration: 250 }} class="flex flex-col gap-4 justify-center h-full overflow-auto">
      <slot />
    </div>
  </div>
{/if}
