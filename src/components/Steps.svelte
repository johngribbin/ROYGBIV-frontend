<script lang="ts">
  import Button from './Button.svelte'
import Slide from './Slide.svelte'

  type Slides = typeof slides
  type SlideStep = Slides[number]
  type SlideDirection = 'right' | 'left'

  const slides = ['0', '1', '2', 'summary'] as const
  let slide: SlideStep = '0'
  let previousSlide: SlideStep = '0'

  $: slideDirection = (
    slides.indexOf(previousSlide) > slides.indexOf(slide) ? 'right' : 'left'
  ) as SlideDirection

  function back() {
    previousSlide = slides[slides.indexOf(slide) - 2]
    slide = slides[slides.indexOf(slide) - 1]
  }

  function next(to = slides[slides.indexOf(slide) + 1]) {
    previousSlide = slide
    slide = to
  }

  let prismName: string
  let members = [
    {
      name: '',
      destination: '',
      split: 0,
      percentage: 0
    },
    {
      name: '',
      destination: '',
      split: 0,
      percentage: 0
    }
  ]

  // Calaculate percentages for each member
  $: {
    if (members) {
      const allSplits = members.map((member) => member.split).reduce((a, b) => a + b)
      const updatedMembers = members.map((member) => {
        return {
          ...member,
          percentage: member.split ? (member.split / allSplits) * 100 : 0
        }
      })

      members = updatedMembers
    }
  }

  // @TODO
  function addMember() {}
</script>

<div class="border rounded max-w-6xl w-full p-10">
  {#if slide === '0'}
    <Slide direction={slideDirection}>
      <div class="mt-4 w-full text-sm slide-content">
        <label class="font-medium mb-1 block" for="address">Name your prism</label>
        <textarea
          id="address"
          class="border w-full p-2 rounded"
          rows="1"
          bind:value={prismName}
          placeholder=""
        />
      </div>
      <Button class="px-4 py-2 border rounded" on:click={() => next()}>Next</Button>
    </Slide>
  {/if}
  {#if slide === '1'}
    <Slide direction={slideDirection}>
      <div class="flex flex-row gap-4 w-full mb-8">
        {#each members as member}
          <div class="flex flex-wrap border border-gray-600 basis-1/2 p-6 rounded">
              <div class="mt-4 w-full text-sm flex flex-col gap-4">
                <h3>Member</h3>
                <label class="font-medium mb-1 block" for="address">Name</label>
                <textarea
                  id="address"
                  class="border w-full p-2 rounded w-full"
                  rows="1"
                  cols="200"
                  bind:value={member.name}
                  placeholder=""
                />
              </div>
              <div class="mt-4 w-full text-sm">
                <label class="font-medium mb-1 block" for="address">Destination</label>
                <textarea
                  id="address"
                  class="border w-full p-2 rounded"
                  rows="1"
                  bind:value={member.destination}
                  placeholder="pubkey"
                />
              </div>
              <div class="mt-4 w-full text-sm">
                <label class="font-medium mb-1 block" for="address">Split</label>
                <input
                  id="address"
                  class="border w-full p-2 rounded"
                  type="number"
                  bind:value={member.split}
                  placeholder="weight"
                />
              </div>
              <div class="mt-4 w-full text-sm">
                <label class="font-medium mb-1 block" for="address">Share</label>
                {member.percentage.toFixed(1)}%
              </div>
          </div>
        {/each}
      </div>
      <div class="flex gap-2 w-full items-end justify-end">
        <Button format="secondary" on:click={() => back()}>Back</Button>
        <Button icon="ArrowRight" on:click={() => next()}>Next</Button>
      </div> 
    </Slide>
  {/if}
  {#if slide === '2'}
    <!-- // @TODO - send values to create-prism method -->
    <Slide direction={slideDirection}
      ><Button format="secondary" on:click={() => back()}>Back</Button>Finish</Slide
    >
  {/if}
</div>

<style>
  label {
    @apply text-lg font-bold;
  }

  .slide-content {
    @apply flex flex-col gap-4;
  }
</style>