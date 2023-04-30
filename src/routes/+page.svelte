<script lang="ts">
  import Lnmessage from 'lnmessage'
  import { parseNodeAddress } from '../utils.js'
  import Header from '../components/Header.svelte'
  import Steps from '../components/Steps.svelte'
  import type { Info, Prism } from '../types.js'
  import { fade } from 'svelte/transition'
  import Qr from '../components/QR.svelte'
  import close from '../icons/close.js'
  import Button from '../components/Button.svelte'
  import Icon from '../components/Icon/Icon.svelte'
  import prism from '../icons/prism.js'

  let ln: Lnmessage
  let connectionStatus$: Lnmessage['connectionStatus$']

  $: if (ln) {
    connectionStatus$ = ln.connectionStatus$
  }

  $: {
    if ($connectionStatus$ === 'connected') {
      modalOpen = null
    }
  }

  let address = '0314eaa0f87f844933fe6af76930b9ff3ef09c8ec7f226243d3c56dfecd758cf88@localhost:7272'
  let rune = 'koyEoWA-Zeof6fxJXpZPpGbJAhyFU1yTErX1UBTQZyI9MQ=='
  let bolt12 = ''
  let info: Info

  let modalOpen: 'connect' | 'qr' | null = null
  let connecting = false

  async function connect() {
    const { publicKey, ip, port } = parseNodeAddress(address)

    // https://github.com/aaronbarnardsound/lnmessage#initialisation
    ln = new Lnmessage({
      // The public key of the node you would like to connect to
      remoteNodePublicKey: publicKey,
      // WebSocket proxy endpoint to connect through if running in prod
      // wsProxy: 'wss://<WEBSOCKET_PROXY>',
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

    const infoResult = await request('getinfo')
    info = infoResult as Info
  }

  async function request(method: string, params?: unknown): Promise<unknown> {
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

  async function createPrism(prism: Prism) {
    try {
      const result =
        'lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrm9deu7xyfzrc2q32xjurnzgpyzsskyyppzvu7dwwmpelpf5vme4sj6p46ymme86xsf847n2v689nxdr6ds8c'
      bolt12 = result
      // const result = await request('createprism', prism)
      // bolt12 = (result as { bolt12: string }).bolt12
    } catch (error) {
      console.log(error)
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

  {#if !info}
    <div class="mb-8">
      {@html prism}
    </div>
  {/if}

  <!-- Button to open connect modal -->
  {#if $connectionStatus$ !== 'connected' && !modalOpen}
    <div class="flex flex-col items-center justify-center bg-black">
      <Button on:click={() => (modalOpen = 'connect')} icon="ArrowUpCircle">Connect</Button>

      <p class="max-w-md mt-8 text-center">
        ROYGBIV creates lightning prisms, which are special BOLT12 offers. Any payments received to
        these offers will split out to multiple recipients. Connect your Core Lightning node to get
        started.
      </p>
    </div>
  {/if}

  <!-- Prism Steps -->
  {#if $connectionStatus$ === 'connected'}
    <Steps />
  {/if}
</main>

<!-- Modal -->
{#if modalOpen === 'connect'}
  <div
    transition:fade
    class="w-full h-full bg-black absolute top-0 bg-black/30 flex flex-col items-center justify-center z-10"
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
    <div class="w-1/2 max-w-lg border-2 p-6 rounded relative bg-black">
      <h1 class="text-lg">Connect your Node</h1>
      <!-- Address -->
      <div class="mt-4 w-full text-sm">
        <label class="font-medium mb-1 block" for="address">Address</label>
        <textarea
          id="address"
          class="border w-full p-2 rounded"
          rows="3"
          bind:value={address}
          placeholder="033f4bbfcd67bd0fc858499929a3255d063999ee23f4c5e12b8b1089e132b3e408@localhost:7272"
        />
      </div>
      <!-- Rune -->
      <div class="w-full mt-4 text-sm">
        <label class="font-medium mb-1 block" for="rune">Rune</label>
        <textarea
          id="rune"
          class="border w-full p-2 rounded"
          rows="2"
          bind:value={rune}
          placeholder="O2osJxV-6lGUgAf-0NllduniYbq1Zkn-45trtbx4qAE9MA=="
        />
      </div>
      <!-- Connect Button -->
      <div class="flex items-center justify-between w-full mt-4">
        <Button on:click={connect} disabled={!address}>
          {$connectionStatus$ === 'connecting' ? '...' : 'Connect'}
        </Button>
      </div>
    </div>
  </div>
{/if}

{#if modalOpen === 'qr'}
  <div
    transition:fade
    class="w-full h-full top-0 absolute backdrop-blur-sm bg-black/30 flex flex-col items-center justify-center z-10"
  >
    <button class="w-8 cursor-pointer absolute top-4 right-4" on:click={() => (modalOpen = null)}>
      {@html close}
    </button>

    <Qr value={bolt12} />
  </div>
{/if}

<style>
  h2 {
    @apply font-bold text-lg;
  }
</style>
