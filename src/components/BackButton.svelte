<script lang="ts">
  import caret from '../icons/caret'
</script>

<button
  on:click
  class="absolute top-12 z-10 left-0 flex items-center pt-5 pb-4 px-3 cursor-pointer font-bold text-inherit w-full"
>
  <div class="w-6 cursor-pointer rotate-90">
    {@html caret}
  </div>
  <span>Back</span>
</button>
