<script lang="ts">
  import { fade } from 'svelte/transition'
  import { onDestroy } from 'svelte'
  import photo from '../icons/photo'
  import { truncateValue, writeClipboardValue } from '../utils'
  import { browser } from '$app/environment'
  import type QRCodeStyling from 'qr-code-styling'
  import { bolt12$ } from '../streams'
  import CopyString from './CopyString.svelte'

  export let size = Math.min(window.innerWidth - 50, 400)

  export function getQrImage() {
    return canvas?.toDataURL()
  }

  const truncated = truncateValue($bolt12$ as string)

  let canvas: HTMLCanvasElement | null = null
  let node: HTMLDivElement
  let qrCode: QRCodeStyling
  let rendered = false

  $: if (browser && $bolt12$ && node && !rendered) {
    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      qrCode = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: `lightning:${$bolt12$}`.toUpperCase(),
        imageOptions: { hideBackgroundDots: false, imageSize: 0.25, margin: 0 },
        dotsOptions: {
          type: 'dots',
          color: '#ec4899',
          gradient: {
            type: 'radial',
            rotation: 0.017453292519943295,
            colorStops: [
              { offset: 0, color: '#f97316' },
              { offset: 1, color: '#d946ef' }
            ]
          }
        },
        backgroundOptions: { color: '#ffffff' },
        cornersSquareOptions: { type: 'extra-rounded', color: '#22c55e' },
        cornersDotOptions: { type: 'dot', color: '#000000' }
      })

      qrCode.append(node)
      rendered = true
    })
  }

  let copySuccess = false
  let copyTimeout: NodeJS.Timeout

  async function copyBolt12() {
    if ($bolt12$) {
      copySuccess = await writeClipboardValue($bolt12$)

      if (copySuccess) {
        copyTimeout = setTimeout(() => (copySuccess = false), 3000)
      }
    }
  }

  onDestroy(() => {
    copyTimeout && clearTimeout(copyTimeout)
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  on:click={copyBolt12}
  in:fade|local={{ duration: 250 }}
  class="cursor-pointer border-2 border-neutral-400 rounded-lg shadow-md max-w-full p-2 md:p-4 flex flex-col justify-center items-center relative"
>
  <div class="rounded overflow-hidden transition-opacity" bind:this={node} />
  <div class="absolute -bottom-9 right-0 mt-2 flex items-center gap-x-2">
    <CopyString stringVal={$bolt12$} />
    <button
      on:click={() => qrCode.download({ extension: 'png', name: truncated })}
      class="flex items-center"
    >
      <div class="w-8">{@html photo}</div>
    </button>
  </div>
</div>
