<script lang="ts">
  import Lnmessage from 'lnmessage'
  import { parseNodeAddress, validateParsedNodeAddress } from '../utils.js'
  import Header from '../components/Header.svelte'
  import PrismSteps from '../components/PrismSteps.svelte'
  import type { Info, Prism } from '../types.js'
  import { fade } from 'svelte/transition'
  import Qr from '../components/QR.svelte'
  import close from '../icons/close.js'
  import Button from '../components/Button.svelte'
  import Icon from '../components/Icon/Icon.svelte'
  import Triangle from '../components/Triangle.svelte'
  import PrismList from '../components/PrismList.svelte'

  let ln: Lnmessage
  let connectionStatus$: Lnmessage['connectionStatus$']

  $: if (ln) {
    connectionStatus$ = ln.connectionStatus$
  }

  // Bob
  let address =
    '024cc0d3240b52130248a8fcb4f144babf3ddfb6c9787fb670a308d03737b6ca09@roygbiv.money:9736'
  // Polar
  // let address = '03093b030028e642fc3b9a05c8eb549f202958e92143da2e85579b92ef0f49cc7d@localhost:7272'
  // let address = ''
  let addressError = ''
  // Bobs rune
  let rune = 'Va8U-_ViDUG4O9yGHN4Vsn7b72kXGDBfI5JXPmavy7Q9MA=='
  // Polar
  // let rune = 'SFTxHiGlQrB2H19h7gCPzLuml3-xroW-sloI84CXRek9NQ=='
  // let rune = ''
  let runeError = ''
  let websocketProxy = 'wss://api.clams.tech/ws-proxy'
  let websocketProxyError = ''
  let connectDisabled = false
  let bolt12 = ''
  let info: Info

  let modalOpen: 'connect' | 'qr' | null = null
  let connecting = false
  let showSteps = false

  async function connect() {
    const { publicKey, ip, port } = parseNodeAddress(address)

    // https://github.com/aaronbarnardsound/lnmessage#initialisation
    ln = new Lnmessage({
      // The public key of the node you would like to connect to
      remoteNodePublicKey: publicKey,
      // WebSocket proxy endpoint to connect through if running in prod
      wsProxy: websocketProxy,
      // The IP address of the node
      ip,
      // The port of the node, defaults to 9735
      port,
      // connect directly to a node without TLS
      wsProtocol: 'ws:',
      logger: {
        info: console.log,
        error: console.error,
        warn: console.warn
      }
    })

    // initiate the connection to the remote node
    connecting = true
    await ln.connect()
    connecting = false
    modalOpen = null
    showSteps = true

    const infoResult = await request('getinfo')
    info = infoResult as Info
  }

  async function request(method: string, params?: unknown): Promise<unknown> {
    console.log(
      `
    
    PARAMS PASSED TO PRISM METHOD = 
    
    `,
      params,
      `
    
    `
    )

    try {
      const result = await ln.commando({
        method,
        params,
        rune
      })

      return result
    } catch (error) {
      const { message } = error as { message: string }
      console.log(message)
    }
  }

  // Carol
  // '02357d77ba5402b88e7ff7010c7f3e174fb3fe455052604d66123d5a1a34f8718e',
  // Dave
  // '038ae7aab146154e38e8a37bc0ecf922af4d9650b297052101adefe55e1c052555',
  // Erin
  // '02b86ea4956c660c54acdd576050d4db66b9b0bc65ea15208ab0a3f600864267da',
  async function createPrism(prism: Prism) {
    const { label, members } = prism

    const params = {
      label,
      members: members.map((member) => ({
        name: member.name,
        destination: member.destination,
        split: member.split
      }))
    }

    try {
      const result = await request('prism', params)
      bolt12 = (result as { bolt12: string }).bolt12
      modalOpen = 'qr'
    } catch (error) {
      console.log(error)
    }
  }

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
  <Header {info} />

  <!-- Content Container -->
  <div class="max-w-4xl p-6">
    <!-- Animation -->
    {#if !info}
      <div class="flex justify-center max-w-lg">
        <!-- svelte-ignore a11y-media-has-caption -->
        <video src="triangle.mp4" poster="triangle.jpg" autoplay loop>ROYGBIV</video>
      </div>
    {/if}

    <!-- Button to open connect modal -->
    {#if $connectionStatus$ !== 'connected' && !modalOpen}
      <div class="flex flex-col items-center justify-center bg-black">
        <Button on:click={() => (modalOpen = 'connect')} icon="ArrowUpCircle">Connect</Button>

        <p class="max-w-md mt-8 text-center">
          ROYGBIV creates lightning prisms, which are special BOLT12 offers. Any payments received
          to these offers will split out to multiple recipients. Connect your Core Lightning node to
          get started.
        </p>
      </div>
    {/if}

    <!-- Prism Steps -->
    {#if $connectionStatus$ === 'connected' && showSteps}
      <PrismSteps finish={(prism) => createPrism(prism)} />
    {/if}

    <!-- Prism List -->
    {#if $connectionStatus$ === 'connected' && !showSteps}
      <PrismList />
    {/if}
  </div>
</main>

<!-- Connect Modal -->
{#if modalOpen === 'connect'}
  <div
    transition:fade
    class="w-full h-full bg-black absolute top-0 bg-black/30 flex flex-col items-center justify-center z-10 p-6"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="p-4 cursor-pointer absolute top-4 right-4 text-white"
      on:click={() => (modalOpen = null)}
    >
      <div class="w-6 h-6">
        <Icon icon="Cross" />
      </div>
    </div>
    <div class="max-w-lg border-2 p-8 rounded relative bg-black w-full">
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
        {#if addressError}
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
        {#if !rune.length}
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
      <!-- Connect Button -->
      <div class="mt-8">
        <Button disabled={connectDisabled} fullWidth={true} on:click={connect}>
          {$connectionStatus$ === 'connecting' ? '...' : 'Connect'}
        </Button>
      </div>
    </div>
  </div>
{/if}

<!-- QR Modal -->
{#if modalOpen === 'qr'}
  <div
    transition:fade
    class="flex w-full h-full top-0 absolute backdrop-blur-sm bg-black/30 flex flex-col items-center justify-center z-10"
  >
    <button
      class="w-8 cursor-pointer absolute top-4 right-4 z-[99]"
      on:click={() => {
        modalOpen = null
        showSteps = false
      }}
    >
      {@html close}
    </button>

    <Triangle />
    <div class="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center">
      <Qr value={bolt12} />
    </div>
  </div>
{/if}
