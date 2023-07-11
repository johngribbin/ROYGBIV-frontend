<script lang="ts">
  import type { Prism } from '../types'
  import { addMemberPercentages, shortenString } from '../utils'
  import qrIcon from '../icons/qr'
  import { bolt12$, modalState$ } from '../streams'
  import CopyString from './CopyString.svelte'

  export let prism: Prism

  $: {
    prism.members = addMemberPercentages(prism?.members)
  }

  function showQR() {
    if (prism.offer.bolt12) {
      bolt12$.next({
        ...$bolt12$,
        data: prism.offer.bolt12
      })
      modalState$.next({
        ...$modalState$,
        data: 'qr'
      })
    }
  }
</script>

<h1 class="flex text-2xl mt-4">
  {prism.label}
  {#if prism.offer.bolt12}
    <CopyString stringVal={prism.offer.bolt12} />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click={showQR} class="w-8 cursor-pointer">{@html qrIcon}</div>
  {/if}
</h1>
<div class="mt-4 flex flex-col gap-2 h-36 overflow-auto">
  {#each prism.members as member, i}
    <div class="flex items-center gap-2">
      <p class="text-sm">{i + 1})</p>
      <p>{member?.percentage?.toFixed(1)}% -</p>
      <p>{member.name}</p>
      <p>({shortenString(member.destination, 9)})</p>
      <CopyString stringVal={member.destination} />
    </div>
  {/each}
</div>
