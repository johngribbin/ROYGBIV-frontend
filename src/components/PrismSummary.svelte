<script lang="ts">
  import type { Prism } from '../types'

  export let prism: Prism
</script>

<p class="mt-4 text-md">
  {prism.label} has {prism.members.length} members with the following splits:
</p>
<div class="mt-6">
  {#each prism.members as member, i}
    <div class="flex p-1">
      <p class="mr-2">{i + 1})</p>
      <p class="mr-2">{member?.percentage?.toFixed(1)}% -</p>
      <p>{member.name}</p>
    </div>
  {/each}
</div>
