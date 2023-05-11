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
  import { modalState$, prisms$ } from '../streams.js'

  let ln: Lnmessage
  let connectionStatus$: Lnmessage['connectionStatus$']

  $: if (ln) {
    connectionStatus$ = ln.connectionStatus$
  }

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
  let bolt12 = ''
  let info: Info
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
      // Connect directly to a node without TLS
      wsProtocol: 'ws:',
      logger: {
        info: console.log,
        error: console.error,
        warn: console.warn
      }
    })

    // Initiate the connection to the remote node
    connecting = true
    await ln.connect()
    connecting = false
    modalState$.next(null)
    // Fetch node info & prism list
    const infoResult = await request('getinfo')
    info = infoResult as Info
    const prismsResult = await request('listprisms')
    prisms$.next(prismsResult as Prism[])
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
  // '020ef052047a5ebed8f368cf99cb9f70c0b03b3a13a677476fb63f798abfd450a7',
  // Dave
  // '028ecac9a4b69486932aa4e8d82ce76b8adda2f28399507689365fad826a2f94d4',
  // Erin
  // '03334c2d3482ac3f552ce2279dfce58c06d61df5b889f43a9da5fa73a330c80b47',
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
      const result = await request('createprism', params)
      console.log(
        `
      
      CREATE PRISM METHOD RESPONSE =
      
      `,
        result,
        `
      
      `
      )
      bolt12 = (result as { bolt12: string }).bolt12
      modalState$.next('qr')
      const prismsResult = await request('listprisms')
      prisms$.next(prismsResult as Prism[])
    } catch (error) {
      console.log(
        `
      
      CREATE PRISM METHOD ERROR = 
      
      `,
        error,
        `
      
      `
      )
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

  // @TODO
  // After creating a prism, call listprisms to update UI
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
    {#if $connectionStatus$ !== 'connected' && !$modalState$}
      <div class="flex flex-col items-center justify-center bg-black">
        <Button on:click={() => modalState$.next('connect')} icon="ArrowUpCircle">Connect</Button>

        <p class="max-w-md mt-8 text-center">
          ROYGBIV creates lightning prisms, which are special BOLT12 offers. Any payments received
          to these offers will split out to multiple recipients. Connect your Core Lightning node to
          get started.
        </p>
      </div>
    {/if}

    <!-- Prism List -->
    {#if $connectionStatus$ === 'connected' && !showSteps}
      <PrismList showSteps={() => (showSteps = true)} />
    {/if}

    <!-- Prism Steps -->
    {#if showSteps}
      <PrismSteps finish={(prism) => createPrism(prism)} />
    {/if}
  </div>
</main>

<!-- Connect Modal -->
{#if $modalState$ === 'connect'}
  <div
    transition:fade
    class="w-full h-full bg-black absolute top-0 bg-black/30 flex flex-col items-center justify-center z-10 p-6"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="p-4 cursor-pointer absolute top-4 right-4 text-white"
      on:click={() => modalState$.next(null)}
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
      {#if !websocketProxy}
        <p class="mt-1 text-sm text-red-500">WebSocket Proxy is required</p>
      {/if}
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
{#if $modalState$ === 'qr'}
  <div
    transition:fade
    class="flex w-full h-full top-0 absolute backdrop-blur-sm bg-black/30 flex flex-col items-center justify-center z-10"
  >
    <button
      class="w-8 cursor-pointer absolute top-4 right-4 z-[99]"
      on:click={() => {
        modalState$.next(null)
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
