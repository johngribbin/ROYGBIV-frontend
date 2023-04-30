<script lang="ts">
    import ArrowRight from './icons/ArrowRight'
    import ArrowUpCircle from './icons/ArrowUpCircle';
    import Cross from './icons/Cross';
    const icons = [
        {
            name: 'ArrowRight',
            icon: ArrowRight
        },
        {
            name: 'ArrowUpCircle',
            icon: ArrowUpCircle
        },
        {
            name: 'Cross',
            icon: Cross
        }
    ]

    type IconName = keyof typeof icons

    export let icon:string
</script>

<span>
    {@html icons.find(({name}) => name === icon)?.icon}
</span>