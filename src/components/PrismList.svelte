<script lang="ts">
  import type { Prism } from '../types'
  import Button from './Button.svelte'
  export let prisms: Prism[]

  export let showSteps: () => void

  $: console.log('prisms = ', prisms)
</script>

@TODO - add slider component to display prisms
{#if prisms?.length}
  {#each prisms as { label, members }}
    <div class="border">
      <div class="border p-2">
        {label}
      </div>
      {#each members as { name, destination, split }}
        <div class="flex gap-2 m-2">
          <div>
            {name} -
          </div>
          <div>{destination} -</div>
          <div>{split}</div>
        </div>
      {/each}
    </div>
  {/each}
{/if}
<div class="w-full text-center">
  <Button on:click={showSteps} format={'primary'}>Create Prism</Button>
</div>
