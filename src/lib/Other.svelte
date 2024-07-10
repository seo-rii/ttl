<script lang="ts" context="module">
    let pr = null;
</script>

<script lang="ts">
    import {Card, Icon, IconButton} from "nunui";
    import {browser} from "$app/environment";
    import otlMap from "$lib/otlMap";

    export let detail;
    let otherMap = {};

    if (!pr && browser) pr = fetch('/other.json').then(r => r.json())

    $: if (pr) pr.then(r => otherMap = r)

    $: defTitle = otherMap[detail.code]?.[0]
</script>

<Card primary flat>
    <div style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 12px">
        <span style="font-size: 1.2em">{detail.code} {detail.title}</span>
        <IconButton close on:click={() => detail = null}/>
    </div>
    <p>누르면 실라버스로 이동합니다.</p>
    {#if defTitle}
        {#each otherMap[detail.code][1] as [key, history]}
            {@const term = key % 10}
            {@const year = (key - term) / 10 + 2000}
            <div style="display: flex;align-items: center">
                <h3>{year}-{term}</h3>
                <div style="display: flex;flex-wrap: wrap;flex: 1">
                    {#each history as h}
                        {@const syllabus = `https://cais.kaist.ac.kr/syllabusInfo?year=${year}&term=${term}&subject_no=${detail.kcode}&dept_id=${detail.dept}&lecture_class=${h[0]}`}
                        <a href={syllabus} target="_blank">
                            <Card outlined style="margin-right: 4px" ripple>
                                {#if h[0]}
                                    {h[0]} -
                                {/if}
                                {h[1]}
                                {#if h[2]}
                                    <br>{h[2]}
                                {/if}
                                <Icon open_in_new/>
                            </Card>
                        </a>
                    {/each}
                </div>
            </div>
        {/each}
    {/if}
</Card>

<style lang="scss">
  h3 {
    margin: 4px 8px 4px 0;
    font-weight: 300;
  }

  p {
    margin: 0;
  }

  a {
    text-decoration: none;
    color: var(--on-surface);
  }
</style>