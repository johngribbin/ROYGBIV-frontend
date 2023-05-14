<script lang="ts">
  import { fade } from 'svelte/transition'
  import { ln, connect, getInfo, listPrisms } from '../../ln-message'
  import Button from '../../components/Button.svelte'
  import { parseNodeAddress, validateParsedNodeAddress } from '../../utils'
  import { nodeInfo$ } from '../../streams'
  import { goto } from '$app/navigation'

  // Bob
  let address =
    '02e8cc0da4b828fb2d3bcf007f6e6fe249e132502eee623d760006805f73f639e9@roygbiv.money:9736'
  // let address = ''
  let addressError = ''
  // Bobs rune
  let rune = 'WQ5LoTjfxqznw7NkVUwVeGq_VHlwQsj7smzLl4m5VQY9MA=='
  // let rune = ''
  let runeError = ''
  let websocketProxy = 'wss://roygbiv.money:9836'
  let websocketProxyError = ''
  let connectDisabled = false

  // Address validation
  $: {
    if (validateParsedNodeAddress(parseNodeAddress(address)) === false) {
      addressError = 'node address is invalid'
    } else {
      addressError = ''
    }
  }

  // Rune validation
  $: {
    if (!rune.length) {
      runeError = 'rune is required'
    } else {
      runeError = ''
    }
  }

  // WebSocket Proxy validation
  $: {
    if (!websocketProxy.length) {
      websocketProxyError = 'websocket proxy is required'
    } else {
      websocketProxyError = ''
    }
  }

  // Disable connect button if any validation fails
  $: {
    if (addressError || runeError || websocketProxyError) {
      connectDisabled = true
    } else {
      connectDisabled = false
    }
  }

  // @TODO fix button connection status
  let connectionStatus$

  $: if (ln) {
    connectionStatus$ = ln.connectionStatus$
    console.log('connectionStatus$ = ', connectionStatus$)
  }

  $: if ($nodeInfo$) {
    goto('/')
  }
</script>

<div
  in:fade|local={{ duration: 250 }}
  class="max-w-md border-2 p-8 rounded relative bg-black w-full"
>
  <h1 class="text-4xl">Connect your node</h1>
  <!-- Address -->
  <div class="mt-6 w-full text-sm">
    <label class="font-medium mb-1 block" for="address">Address</label>
    <textarea
      id="address"
      class="border w-full p-2 rounded"
      rows="3"
      bind:value={address}
      placeholder="033f4bbfcd67bd0fc858499929a3255d063999ee23f4c5e12b8b1089e132b3e408@localhost:7272"
    />
    <!-- Address validation -->
    {#if address && addressError}
      <p class="mt-1 text-sm text-red-500">{addressError}</p>
    {/if}
  </div>
  <!-- Rune -->
  <div class="w-full mt-6 text-sm">
    <label class="font-medium mb-1 block" for="rune">Rune</label>
    <textarea
      id="rune"
      class="border w-full p-2 rounded"
      rows="2"
      bind:value={rune}
      placeholder="O2osJxV-6lGUgAf-0NllduniYbq1Zkn-45trtbx4qAE9MA=="
    />
    <!-- Address validation -->
    {#if rune && runeError}
      <p class="mt-1 text-sm text-red-500">{runeError}</p>
    {/if}
  </div>
  <!-- WebSocket Proxy -->
  <div class="mt-6 w-full text-sm">
    <label class="font-medium mb-1 block" for="address">WebSocket Proxy</label>
    <input
      id="address"
      class="border w-full p-2 rounded"
      bind:value={websocketProxy}
      placeholder="wss://wsproxy.clams.tech"
    />
  </div>
  {#if websocketProxy && websocketProxyError}
    <p class="mt-1 text-sm text-red-500">WebSocket Proxy is required</p>
  {/if}
  <!-- Connect Button -->
  <div class="mt-8">
    <Button
      disabled={connectDisabled}
      fullWidth={true}
      on:click={async () => {
        await connect(address, rune, websocketProxy)
        await getInfo()
        await listPrisms()
      }}
    >
      {$connectionStatus$ === 'connecting' ? '...' : 'Connect'}
    </Button>
  </div>
</div>
