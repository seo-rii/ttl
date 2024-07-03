<script lang="ts">
    import {createEventDispatcher} from "svelte";

    export let data, hover;

    const dispatch = createEventDispatcher();
    const start = 8 * 60;
    const end = 24 * 60;

    function perc(h, m) {
        const time = h * 60 + m;
        return (time - start) / (end - start) * 100;
    }

    const materialColors = [
        "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3",
        "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39",
        "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E",
        "#607D8B"
    ];

    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    function getColorForSubject(subject) {
        const hash = hashString(subject);
        const colorIndex = hash % materialColors.length;
        return materialColors[colorIndex];
    }

    $: color = getColorForSubject(data.code);
</script>

{#each data.time as time}
    {@const top = perc(time.sh, time.sm)}
    {@const bot = perc(time.eh, time.em)}
    {@const height = bot - top}
    <div style:background="{color}11"
         class:hover style:top="{top + 0.2}%"
         style:height="{height - 0.4}%" style:left="{time.date * 20 + 0.4}%"
         on:click={() => dispatch('remove')}>
        <div style="width: calc(100% - 16px);height:calc(100% - 16px);padding: 8px;font-size: 0.78em">
            <p>{data.title}</p>
            {#if data.where}
                <p style="font-size: 0.7em;font-weight: 300" class="one">
                    {data.where}
                </p>
            {/if}
            <p style="font-size: 0.6em;font-weight: 300;" class="one">
                {`${time.sh}:${time.sm.toString().padStart(2, '0')} - ${time.eh}:${time.em.toString().padStart(2, '0')}`}
            </p>
        </div>
        <div style="background:{color};position: absolute;left: 3px;width: 2px;top: 4px;bottom: 4px;border-radius: 4px"></div>
    </div>
{/each}

<style lang="scss">
  div {
    position: absolute;
    width: 19.2%;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  .hover {
    opacity: 0.5;
  }

  p {
    margin: 0 0 6px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>