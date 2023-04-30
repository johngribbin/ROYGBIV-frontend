<script lang="ts">
    import Icon from "./Icon/Icon.svelte"

    export let format:string = 'primary'
    export let disabled:boolean = false
    export let icon:string|null = null
    export let fill:boolean = false
</script>

<button class={"rounded p-[2px]" + " " + format} on:click disabled={disabled} class:fill>
    <span class="bg-black p-2 rounded flex flex-row items-center justify-center align-center gap-2">
        <p class="">
            <slot /> 
        </p>
        {#if icon}
            <span class="icon text-white w-5 h-5">
                <Icon icon={icon} />
            </span>
        {/if}
    </span>
    
</button>

<style lang="css">
    .primary, .primary p {
        @apply bg-gradient-to-br from-red-500 via-green-500 to-indigo-300;
    }

    .primary p {
        @apply bg-clip-text text-transparent;
    }

    .secondary {
        @apply bg-white;
    }
    
    .primary .icon {
        @apply text-indigo-300;
    }

    .primary:disabled {
        @apply opacity-50;
    }

    .fill {
        @apply w-full;
    }
</style>