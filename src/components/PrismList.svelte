<script lang="ts">
  import Button from './Button.svelte'
  import { prisms$ } from '../streams'

  export let showSteps: () => void
</script>

{#if $prisms$?.length}
  <h1 class="mb-4 text-3xl">Your prisms</h1>
  <div class="flex overflow-auto w-full max-w-md">
    {#each $prisms$ as { label, bolt12, members }}
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
  </div>
{/if}

<div class="mt-8 w-full text-center">
  <Button on:click={showSteps} format={'primary'}>Create Prism</Button>
</div>
