<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {Button, Icon, List, OneLine, Paper, Tooltip} from "nunui";
    import otlMap from "$lib/otlMap";
    import {textfit} from 'svelte-textfit';
    import {compete} from "$lib/config";

    let parent;

    export let data, hover, list, mobile, levels, offset, capturing, maxHour, detail, year, term;

    const dispatch = createEventDispatcher();
    const start = 9 * 60;
    $: end = maxHour * 60;

    $: perc = (h, m) => {
        const time = h * 60 + m;
        return (time - start) / (end - start) * 100;
    }

    const materialColors = [
        "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3",
        "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39",
        "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E",
        "#607D8B",

        "#D32F2F",
        "#C62828",
        "#B71C1C",
        "#FF7043",
        "#F4511E",
        "#E64A19",
        "#FFEE58",
        "#FFEB3B",
        "#FDD835",
        "#66BB6A",
        "#4CAF50",
        "#388E3C",
        "#42A5F5",
        "#2196F3",
        "#1E88E5",
        "#AB47BC",
        "#8E24AA",
        "#7B1FA2",
        "#EC407A",
        "#D81B60",
        "#C2185B",
    ];

    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function getColorForSubject(subject) {
        const hash = hashString(subject);
        const colorIndex = hash % materialColors.length;
        return materialColors[colorIndex];
    }

    $: color = getColorForSubject(data.code + data.group);
    $: vsRaw = data.cap ? data.reg / data.cap : 0;
    $: vs = data.cap && data.reg ? (vsRaw < 0.1 ? '<0.1' : vsRaw.toFixed(1)) : ' - '

    function vscolor(vs) {
        if (!vs) return 'var(--surface)';
        const inter = [[0, '#8ae7f3'], [0.6, '#adee5d'], [1, '#f9f871'], [2, '#f97171']];
        if (vs < 0.1) return `color-mix(in srgb, ${inter[0][1]}, var(--surface) ${vs * 10}%)`;
        for (let i = 1; i < inter.length; i++) {
            if (vs < inter[i][0]) {
                return `color-mix(in srgb, color-mix(in srgb, ${inter[i - 1][1]}, ${inter[i][1]} ${((vs - inter[i - 1][0]) / (inter[i][0] - inter[i - 1][0]) * 100)}%), var(--surface) 50%)`;
            }
        }
        return `color-mix(in srgb, ${inter[inter.length - 1][1]}, var(--surface) 50%)`;
    }
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
                <div style="width: calc(100% - 16px);height:calc(100% - 16px);padding: 2px 6px 2px 8px;font-size: 0.78em;top: 0;"
                     slot="target" bind:this={parent}>
                    <p use:textfit={{height: 36, update: `${width}-${capturing}`,mode:"multi",max: 16, min: 11}}
                       style="margin-bottom: 4px;margin-top: 0;white-space: normal">
                        <span style="font-size: max(0.8em, 8px);opacity: 0.6;">{data.code}</span><br>
                        {data.title}
                    </p>
                    {#if data.where}
                        <p style="font-size: 0.7em;font-weight: 300;opacity: 0.6;margin-bottom: 2px"
                           use:textfit={{parent, update: `${width}-${capturing}`,mode:"single",max: 11, min: 7}}>
                            {data.where}
                        </p>
                    {/if}
                    <p style="font-size: 0.6em;font-weight: 300;opacity: 0.6;white-space: normal" class="one">
                        {`${time.sh}:${time.sm.toString().padStart(2, '0')} - ${time.eh}:${time.em.toString().padStart(2, '0')}`}
                    </p>
                    {#if compete}
                        <p style="font-size: 0.6em;font-weight: 300;opacity: 0.6;white-space: normal;background:{vscolor(vsRaw || 0)};border-radius: 2px;display:inline-block;padding: 2px">경쟁률 {vs}</p>
                    {/if}
                </div>
                <main style="padding: 12px">
                    <p style="font-weight: 500;font-size: 1.2em">
                        {data.title}
                        <span style="font-size: 0.76em;opacity: 0.8;font-weight: 300">{data.code}</span>
                        <span style="font-size: 0.66em;opacity: 0.8;font-weight: 300">{data.group}</span>
                    </p>
                    <p style="font-weight: 300;font-size: 0.8em">
                        <Icon readiness_score/>{data.credit}학점
                        {#if data.au}
                            / {data.au} AU
                        {/if}
                    </p>
                    <p style="font-weight: 300;font-size: 0.8em">
                        <Icon apartment/>{data.where}</p>
                    <p style="font-weight: 300;font-size: 0.8em">
                        <Icon person/>{data.prof}</p>
                    <p style="font-weight: 300;font-size: 0.8em">
                        <Icon account_circle/>{data.reg}/{data.cap}명 신청</p>
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
                                <OneLine icon="list" title="과목 개설 내역" on:click={() => detail = data}/>
                                <a href="https://cais.kaist.ac.kr/syllabusInfo?year={year}&term={term}&subject_no={data.kcode}&dept_id={data.dept}&lecture_class={data.group}"
                                   target="_blank" on:click|stopPropagation>
                                    <OneLine icon="description" title="실라버스"/>
                                </a>
                                <a href="https://otl.sparcs.org/dictionary?startCourseId={otlMap(data.code)}"
                                   target="_blank" on:click|stopPropagation>
                                    <OneLine icon="open_in_new" title="OTL 평가"/>
                                </a>
                                <OneLine icon="close" title="삭제" on:click={() => dispatch('remove')}/>
                            </List>
                        </article>
                    {/if}
                    {#if !mobile}
                        <Button small icon="list" on:click={(e) => {
                            e.stopPropagation()
                            detail = data
                        }}>과목 개설 내역
                        </Button>
                        <a href="https://cais.kaist.ac.kr/syllabusInfo?year={year}&term={term}&subject_no={data.kcode}&dept_id={data.dept}&lecture_class={data.group}"
                           target="_blank" on:click|stopPropagation>
                            <Button small icon="description">실라버스</Button>
                        </a>
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
        <div style="background:{color}aa;position: absolute;left: 3px;width: 2px;top: 4px;bottom: 4px;border-radius: 4px"></div>
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
    color: var(--on-surface);
    text-decoration: none;
  }

  .two {
    word-break: break-word;
    white-space: initial !important;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
  }
</style>