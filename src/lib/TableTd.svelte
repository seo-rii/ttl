<script lang="ts">
    import {Hoverable} from "nunui";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let hover, data;

    function enter() {
        hover = data;
    }

    function leave() {
        hover = null;
    }
</script>

<td on:mouseenter={enter} on:mouseleave={leave} on:click={() => dispatch('choose', data)}>
    <slot/>
</td>

<style lang="scss">
  td {
    cursor: pointer;
  }
</style>