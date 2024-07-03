<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let hover, data, background;

    function enter() {
        hover = data;
    }

    function leave() {
        hover = null;
    }
</script>

<td on:mouseenter={enter} on:mouseleave={leave} on:click={() => dispatch('choose', data)} style:background>
    <slot/>
</td>

<style lang="scss">
  td {
    cursor: pointer;
  }
</style>