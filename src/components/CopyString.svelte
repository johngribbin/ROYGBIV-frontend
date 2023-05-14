<script lang="ts">
  import { fade } from 'svelte/transition'
  import { writeClipboardValue } from '../utils'
  import copy from '../icons/copy'
  import check from '../icons/check'

  export let stringVal: string

  let copySuccess = false
  let copyTimeout: NodeJS.Timeout

  async function copyStringVal() {
    if (stringVal) {
      copySuccess = await writeClipboardValue(stringVal)

      if (copySuccess) {
        copyTimeout = setTimeout(() => (copySuccess = false), 3000)
      }
    }
  }
</script>

<button on:click={copyStringVal} class="flex items-center">
  {#if copySuccess}
    <div in:fade|local={{ duration: 250 }} class="w-8 text-utility-success">{@html check}</div>
  {:else}
    <div in:fade|local={{ duration: 250 }} class="w-8">{@html copy}</div>
  {/if}
</button>
