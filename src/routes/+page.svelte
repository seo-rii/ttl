<script lang="ts">
    import {onMount} from "svelte";
    import {browser} from "$app/environment";

    let data: any = {};

    if (browser) onMount(async () => {
        data = await fetch('/result.json').then(r => r.json());
    })
</script>

{data?.version}