<script lag="ts">
  import Header from '../components/Header.svelte'
  import '../app.css'
  import { modalState$ } from '../streams'
  import { fade } from 'svelte/transition'
  import { goto } from '$app/navigation'
  import Triangle from '../components/Triangle.svelte'
  import Qr from '../components/QR.svelte'
  import close from '../icons/close'
</script>

<Header />
<slot />
<!-- QR Modal -->
{#if $modalState$ === 'qr'}
  <div
    transition:fade
    class="flex w-full h-full top-0 absolute backdrop-blur-sm bg-black/30 flex flex-col items-center justify-center z-10"
  >
    <button
      class="w-8 cursor-pointer absolute top-4 right-4 z-[99]"
      on:click={() => {
        modalState$.next(null)
        goto('/')
      }}
    >
      {@html close}
    </button>

    <Triangle />
    <div class="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center">
      <Qr />
    </div>
  </div>
{/if}
