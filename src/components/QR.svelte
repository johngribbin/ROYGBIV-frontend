<script lang="ts">
  import { fade } from 'svelte/transition'
  import { onDestroy } from 'svelte'
  import copy from '../icons/copy'
  import photo from '../icons/photo'
  import check from '../icons/check'
  import { truncateValue } from '../utils'
  import { browser } from '$app/environment'
  import type QRCodeStyling from 'qr-code-styling'

  export let value: string | null
  export let size = Math.min(window.innerWidth - 50, 400)

  export function getQrImage() {
    return canvas?.toDataURL()
  }

  const truncated = truncateValue(value as string)

  let canvas: HTMLCanvasElement | null = null
  let node: HTMLDivElement
  let qrCode: QRCodeStyling
  let rendered = false

  $: if (browser && value && node && !rendered) {
    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      qrCode = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: `lightning:${value}`.toUpperCase(),
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

  async function copyImage() {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': qrCode.getRawData() as Promise<Blob>
        })
      ])

      copySuccess = true

      copyTimeout = setTimeout(() => (copySuccess = false), 3000)
    } catch (error) {
      console.warn(error)
    }
  }

  onDestroy(() => {
    copyTimeout && clearTimeout(copyTimeout)
  })
</script>

<div
  in:fade|local={{ duration: 250 }}
  class="border-2 border-neutral-400 rounded-lg shadow-md max-w-full p-2 md:p-4 flex flex-col justify-center items-center relative"
>
  <div class="rounded overflow-hidden transition-opacity" bind:this={node} />
  <div class="absolute -bottom-9 right-0 mt-2 flex items-center gap-x-2">
    <button on:click={copyImage} class="flex items-center">
      {#if copySuccess}
        <div in:fade|local={{ duration: 250 }} class="w-8 text-utility-success">{@html check}</div>
      {:else}
        <div in:fade|local={{ duration: 250 }} class="w-8">{@html copy}</div>
      {/if}
    </button>
    <button
      on:click={() => qrCode.download({ extension: 'png', name: truncated })}
      class="flex items-center"
    >
      <div class="w-8">{@html photo}</div>
    </button>
  </div>
  <span>{value}</span>
</div>
