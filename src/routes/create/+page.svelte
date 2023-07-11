<script lang="ts">
  import minus from '../../icons/minus'
  import plus from '../../icons/plus'
  import { createPrism, listPrisms } from '../../ln-message'
  import type { Member } from '../../types'
  import { addMemberPercentages, nodePublicKeyRegex, bolt12OfferRegex } from '../../utils'
  import Button from '../../components/Button.svelte'
  import PrismSummary from '../../components/PrismSummary.svelte'
  import Slide from '../../components/Slide.svelte'
  import { goto } from '$app/navigation'
  import { bolt12$, modalState$, nodeInfo$ } from '../../streams'
  import { onMount } from 'svelte'
  import arrowLeft from '../../icons/arrow-left'
  import arrowRight from '../../icons/arrow-right'

  type Slides = typeof slides
  type SlideStep = Slides[number]
  type SlideDirection = 'right' | 'left'

  let slides = [0, 1, 2, 3] // Default slides - Name your prism, two members, summary
  let slide: SlideStep = 0
  let previousSlide: SlideStep = 0
  let label: string = '' // prism name
  let memberCount = 1 // minimum of 1 members in a prism
  let members: Member[] = []
  let labelError = '' // Prism label validation

  function back() {
    previousSlide = slides[slides.indexOf(slide) - 2]
    slide = slides[slides.indexOf(slide) - 1]
  }

  function next(to = slides[slides.indexOf(slide) + 1]) {
    previousSlide = slide
    slide = to
  }

  // Member name validation
  function validateName(name: string) {
    if (name.includes(' ')) {
      return 'name cannot have spaces'
    }

    if (
      !members
        .map((member) => member['name'])
        .filter((name) => name !== '')
        .every((value, index, arr) => arr.indexOf(value) === index)
    ) {
      return 'name must be unique'
    }
    return ''
  }

  // Member destination validation
  function validateDestination(type: string, destination: string) {
    if (type == "bolt12") {
      if (!bolt12OfferRegex.test(destination)) {
        return 'destination is invalid Bolt12 offer.'
      }
    } 
    
    if (type == "keysend") {
      if (!nodePublicKeyRegex.test(destination)) {
        return 'destination is invalid node public key.'
      }
    } 

    return ''
  }

  // Member split destination
  function validateSplit(split: number) {
    if (split < 1) {
      return 'split minimum value is 1'
    }
    if (split > 1000) {
      return 'split maximum value is 1000'
    }
    if (!/^\d+$/.test(split.toString())) {
      return 'split must only be integers'
    }

    return ''
  }

  // Disables next button on member slide
  function isMemberInvalid(member: Member) {
    if (
      !member.name ||
      !member.destination ||
      !member.split ||
      member.nameError ||
      member.destinationError
    ) {
      return true
    }
    return false
  }

  $: slideDirection = (
    slides.indexOf(previousSlide) > slides.indexOf(slide) ? 'right' : 'left'
  ) as SlideDirection

  // Update members & slides based on member count input on first slide
  $: {
    members = new Array(memberCount).fill({
      name: '',
      nameError: '',
      destination: '',
      type: '', 
      destinationError: '',
      split: 1, // Default to all members having same share
      splitError: '',
      percentage: 0
    })

    const memberSlides = Array.from({ length: memberCount }, (_, index) => index + 1)

    slides = [0, ...memberSlides, memberCount + 1]
  }

  // Calculate percentage values for each member
  $: {
    if (members.length) {
      members = addMemberPercentages(members)
    }
  }

  // Prism label validation
  $: {
    if (label.includes(' ')) {
      labelError = 'spaces not allowed'
    } else {
      labelError = ''
    }
  }

  // Member validation
  $: {
    members.forEach((member) => {
      member.nameError = member.name ? validateName(member.name) : ''
      member.destinationError = member.destination ? validateDestination(member.type, member.destination) : ''
      member.splitError = validateSplit(member.split)
    })
  }

  onMount(() => {
    if (!$nodeInfo$.data) {
      goto('/connect')
    }
  })
</script>

<div class="w-full max-w-sm">
  <!-- Name your prism -->
  {#if slide === 0}
    <Slide back={() => goto('/')} direction={slideDirection}>
      <div class="max-w-sm">
        <h1 class="text-4xl">Name your prism</h1>
        <input
          id="address"
          class="mt-4 w-full p-2 rounded"
          type="text"
          bind:value={label}
          placeholder="bitcoin-dev-fund"
        />
        {#if labelError}
          <p class="mt-1 text-sm text-red-500">{labelError}</p>
        {/if}
        <!-- Member Count -->
        <h1 class="mt-8 text-4xl text-center">Members</h1>
        <div class="flex justify-around mt-4">
          <button
            on:click={() => {
              if (memberCount > 2) {
                memberCount--
              }
            }}
          >
            <div class="w-8">
              {@html minus}
            </div></button
          >
          <p class="text-4xl">{memberCount}</p>
          <button
            on:click={() => {
              if (memberCount < 10) {
                memberCount++
              }
            }}
          >
            <div class="w-8">
              {@html plus}
            </div></button
          >
        </div>

        <div class="mt-8">
          <Button
            disabled={!label || labelError !== ''}
            format="secondary"
            fullWidth={true}
            on:click={() => next()}><div class="w-6">{@html arrowRight}</div></Button
          >
        </div>
      </div>
    </Slide>
  {/if}
  <!-- Choose prism members  -->
  {#each members as member, i}
    {#if slide === i + 1}
      <Slide direction={slideDirection}>
        <div class="max-w-sm">
          <h1 class="text-3xl mb-6">Member {i + 1}</h1>
          <div class="flex flex-col w-full overflow">
            <!-- Name, Split & Share (%) -->
            <div class="flex flex-between items-center gap-6">
              <!-- Name -->
              <div class="w-full">
                <label class="mb-1 block" for="name">Name</label>
                <input
                  id="name"
                  class="border w-full p-2 rounded"
                  type="text"
                  bind:value={member.name}
                  placeholder="Alice"
                />
              </div>
              <!-- Split -->
              <div>
                <label class="mb-1 block" for="split">Split</label>
                <input
                  id="split"
                  class="border w-full p-2 rounded"
                  type="number"
                  min="1"
                  bind:value={member.split}
                />
              </div>
              <!-- Share -->
              <div class="w-20">
                <label class="mb-1 block" for="percentage">Share</label>
                <p class="p-2 pl-0">{member.percentage?.toFixed(1)}%</p>
              </div>
            </div>
            <!-- Name field validation -->
            {#if member.nameError}
              <p class="mt-1 text-sm text-red-500">{member.nameError}</p>
            {/if}
            <!-- Split field validation -->
            {#if member.splitError}
              <p class="mt-1 text-sm text-red-500">{member.splitError}</p>
            {/if}
            <!-- Destination -->
            <div class="mt-6">
              <label class="mb-1 block" for="type">Type</label>
              <select bind:value={member.type} class="border w-full p-2 rounded" style="color: black"> 
                <option value="bolt12" selected>Bolt12</option>
                <option value="keysend">Keysend</option>
                <option value="other">Other</option>
              </select>
              <label class="mb-1 block" for="destination">Destination</label>
              <textarea
                id="destination"
                class="border w-full p-2 rounded"
                rows="2"
                bind:value={member.destination}
                placeholder="Offer (Bolt12) or Node Public Key (Keysend)"
              />
              {#if member.destinationError}
                <p class="text-sm text-red-500">{member.destinationError}</p>
              {/if}
            </div>
          </div>
          <!-- Buttons -->
          <div class="mt-8 flex w-full justify-between">
            <Button format="secondary" on:click={() => back()}
              ><div class="w-6">{@html arrowLeft}</div></Button
            >
            <Button
              disabled={isMemberInvalid(members[i])}
              format="secondary"
              on:click={() => next()}><div class="w-6">{@html arrowRight}</div></Button
            >
          </div>
        </div>
      </Slide>
    {/if}
  {/each}
  <!-- Summary  -->
  {#if slide === slides.length - 1}
    <Slide direction={slideDirection}>
      <div class="max-w-sm">
        <h1 class="text-4xl">Summary</h1>
        <PrismSummary prism={{ label, members }} />
        <div class="mt-8 flex w-full justify-between">
          <Button format="secondary" on:click={() => back()}
            ><div class="w-6">{@html arrowLeft}</div></Button
          >
          <Button
            format="primary"
            on:click={async () => {
              const prism = await createPrism({ label, members })
              if (prism?.offer.bolt12) {
                bolt12$.next({
                  ...$bolt12$,
                  data: prism.offer.bolt12
                })
                modalState$.next({
                  ...$modalState$,
                  data: 'qr'
                })
                listPrisms()
              }
            }}>Finish</Button
          >
        </div>
      </div>
    </Slide>
  {/if}
</div>
