<script lang="ts">
  import type { Prism } from '../types'
  import Button from './Button.svelte'
  export let prisms: Prism[]

  export let showSteps: () => void
</script>

<h1 class="mb-4 text-3xl">Your prisms</h1>
<div class="flex overflow-auto max-w-md">
  {#if prisms?.length}
    {#each prisms as { label, bolt12, members }}
      <div class="border max-w-md">
        <div class="p-2">
          {label}
        </div>
        <div class="p-2 break-words">
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
</div>

<div class="mt-8 w-full text-center">
  <Button on:click={showSteps} format={'primary'}>Create Prism</Button>
</div>
