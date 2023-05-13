<script lang="ts">
  import { nodeInfo$ } from '../streams'
</script>

<header class="absolute top-0 flex justify-between p-6 w-full items-center">
  {#if $nodeInfo$}
    <h1 class="font-black text-3xl">ROYGBIV</h1>
    <div class="flex items-center">
      <div
        style="background-color: #{$nodeInfo$.color};"
        class="rounded-full w-8 h-8 overflow-hidden mr-2"
      />
      <div class="text-sm font-bold">
        {$nodeInfo$.alias}
      </div>
    </div>
  {/if}
</header>
