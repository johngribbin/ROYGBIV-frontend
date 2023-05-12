<script lang="ts">
  import Button from './Button.svelte'
  import { prisms$ } from '../streams'
  import Slide from './Slide.svelte'
  import PrismSummary from './PrismSummary.svelte'

  type Slides = typeof slides
  type SlideStep = Slides[number]
  type SlideDirection = 'right' | 'left'

  let slides = [0] // Default slides
  let slide: SlideStep = 0
  let previousSlide: SlideStep = 0

  export let showSteps: () => void

  function back() {
    previousSlide = slides[slides.indexOf(slide) - 2]
    slide = slides[slides.indexOf(slide) - 1]
  }

  function next(to = slides[slides.indexOf(slide) + 1]) {
    previousSlide = slide
    slide = to
  }

  $: slideDirection = (
    slides.indexOf(previousSlide) > slides.indexOf(slide) ? 'right' : 'left'
  ) as SlideDirection

  // Update slides based on prism count
  $: {
    const prismSlides = Array.from({ length: $prisms$.length - 1 }, (_, index) => index + 1)
    slides = [0, ...prismSlides]
  }
</script>

{#if $prisms$?.length}
  <h1 class="mb-4 text-3xl">Your prisms</h1>
  {#each $prisms$ as prism, i}
    <div class="w-full max-w-md">
      <div class="max-w-sm">
        {#if slide === i}
          <Slide direction={slideDirection}>
            <PrismSummary {prism} />
            <div class="mt-8 flex w-full justify-between">
              <Button disabled={i === 0} format="secondary" on:click={() => back()}>Back</Button>
              <Button on:click={showSteps} format={'primary'}>Create</Button>
              <Button
                disabled={slide === slides.length - 1}
                format="secondary"
                on:click={() => next()}>Next</Button
              >
            </div>
          </Slide>
        {/if}
      </div>
    </div>
  {/each}
{/if}
