<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {Button, Icon, List, OneLine, Paper, Tooltip} from "nunui";
    import otlMap from "$lib/otlMap";

    export let data, hover, list, mobile, levels, offset;

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

{#each data.time as time, i}
    {@const top = perc(time.sh, time.sm)}
    {@const bot = perc(time.eh, time.em)}
    {@const height = bot - top}
    {@const left = time.date * 20 + 0.4 + levels?.[offset + i]?.[0] * 20 / levels?.[offset + i]?.[1]}
    {@const width = 20 / levels?.[offset + i]?.[1] - 0.8}
    <div style:background="{color}11"
         class:hover style:top="{top + 0.2}%"
         style:height="{height - 0.4}%" style:left="{left}%" style:width="{width}%"
         on:click={() => !mobile && dispatch('remove')}>
        {#key selected}
            <svelte:component this={mobile ? Paper : Tooltip} left xstack bottom {mobile}>
                <div style="width: calc(100% - 16px);height:calc(100% - 16px);padding: 8px;font-size: 0.78em;top: 0;"
                     slot="target">
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
                <main style="padding: 12px">
                    <p style="font-weight: 500;font-size: 1.2em">
                        {data.title}
                        <span style="font-size: 0.76em;opacity: 0.8;font-weight: 300">{data.code}</span>
                    </p>
                    <p style="font-weight: 300;font-size: 0.8em">
                        <Icon apartment/>{data.where}</p>
                    <p style="font-weight: 300;font-size: 0.8em">
                        <Icon person/>{data.prof}</p>
                    <p style="font-weight: 300;font-size: 0.8em">
                        <span><Icon timer/>시간</span><br>
                    <ul>
                        {#each data.time as time}
                            <li>
                                {['월', '화', '수', '목', '금', '토', '일'][time.date]}
                                {`${time.sh}:${time.sm.toString().padStart(2, '0')} - ${time.eh}:${time.em.toString().padStart(2, '0')}`}
                            </li>
                        {/each}
                    </ul>

                    <hr>
                    {#if mobile}
                        <article style="font-size: 16px;font-weight: 300;margin: 0 -12px">
                            <List>
                                <a href="https://otl.sparcs.org/dictionary?startCourseId={otlMap(data.code)}"
                                   target="_blank"
                                   on:click|stopPropagation>
                                    <OneLine icon="open_in_new" title="OTL 평가"/>
                                </a>
                                <OneLine icon="close" title="삭제" on:click={() => dispatch('remove')}/>
                            </List>
                        </article>
                    {/if}
                    {#if !mobile && otlMap(data.code)}
                        <a href="https://otl.sparcs.org/dictionary?startCourseId={otlMap(data.code)}" target="_blank"
                           on:click|stopPropagation>
                            <Button small icon="open_in_new">OTL 평가</Button>
                        </a>
                    {/if}
                </main>
            </svelte:component>
        {/key}
        <div style="background:{color};position: absolute;left: 3px;width: 2px;top: 4px;bottom: 4px;border-radius: 4px"></div>
    </div>
{/each}

<style lang="scss">
  div {
    position: absolute;
    border-radius: 4px;
    cursor: pointer;
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

  ul {
    font-size: 0.7em;
    margin: 0 0 12px 0;
  }

  a {
    display: block;
    color: initial;
    text-decoration: none;
  }
</style>