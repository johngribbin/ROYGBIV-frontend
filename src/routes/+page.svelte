<script lang="ts">
  import Button from '../components/Button.svelte'
  import PrismList from '../components/ListPrisms.svelte'
  import { nodeInfo$ } from '../streams.js'
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
{#if !$nodeInfo$}
  <div class="flex justify-center max-w-md">
    <!-- Animation -->
    <!-- svelte-ignore a11y-media-has-caption -->
    <video src="triangle.mp4" poster="triangle.jpg" autoplay loop>ROYGBIV</video>
  </div>

  <div class="flex flex-col items-center justify-center bg-black">
    <Button on:click={() => goto('/connect')} icon="ArrowUpCircle">Connect</Button>
    <p class="max-w-md mt-8 text-center">
      ROYGBIV creates lightning prisms, which are special BOLT12 offers. Any payments received to
      these offers will split out to multiple recipients. Connect your Core Lightning node to get
      started.
    </p>
  </div>
{:else}
  <div class="w-full max-w-sm">
    <PrismList />
  </div>
{/if}
