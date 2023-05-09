<script lang="ts">
  import type { Prism } from '../types'
  import Button from './Button.svelte'
  export let prisms: Prism[]

  export let showSteps: () => void

  $: console.log('prisms = ', prisms)
</script>

@TODO - finish stlying, consider slider component
<div class="overflow-auto">
  <h1 class="mb-4 text-3xl">Your prisms</h1>
  {#if prisms?.length}
    {#each prisms as { label, bolt12, members }}
      <div class="border max-w-md">
        <div class="border p-2 break-words">
          {label} -
          {bolt12}
        </div>
        {#each members as { name, destination, split }}
          <div class="m-2 break-words">
            {name} -
            {destination} -
            {split}
          </div>
        {/each}
      </div>
    {/each}
  {/if}
  <div class="w-full text-center">
    <Button on:click={showSteps} format={'primary'}>Create Prism</Button>
  </div>
</div>
