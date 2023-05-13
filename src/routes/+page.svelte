<script lang="ts">
  import Header from '../components/Header.svelte'
  import { fade } from 'svelte/transition'
  import Qr from '../components/QR.svelte'
  import close from '../icons/close.js'
  import Button from '../components/Button.svelte'
  import Triangle from '../components/Triangle.svelte'
  import PrismList from '../components/ListPrisms.svelte'
  import { modalState$, nodeInfo$, prisms$ } from '../streams.js'
  import { goto } from '$app/navigation'
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap"
    rel="stylesheet"
  />
</svelte:head>
<main class="w-screen h-screen flex flex-col items-center justify-center relative">
  <Header />

  <!-- Content Container -->
  <div class="max-w-4xl p-6">
    <!-- Animation -->
    {#if !$nodeInfo$}
      <div class="flex justify-center max-w-lg">
        <!-- svelte-ignore a11y-media-has-caption -->
        <video src="triangle.mp4" poster="triangle.jpg" autoplay loop>ROYGBIV</video>
      </div>

      <div class="flex flex-col items-center justify-center bg-black">
        <Button on:click={() => goto('/connect')} icon="ArrowUpCircle">Connect</Button>

        <p class="max-w-md mt-8 text-center">
          ROYGBIV creates lightning prisms, which are special BOLT12 offers. Any payments received
          to these offers will split out to multiple recipients. Connect your Core Lightning node to
          get started.
        </p>
      </div>
    {/if}

    <!-- Button to open connect modal -->

    {#if $prisms$.length}
      <PrismList />
    {/if}
  </div>
</main>

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
        showSteps = false
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
