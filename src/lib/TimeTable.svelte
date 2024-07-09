<script lang="ts">
    import TableItem from "$lib/TableItem.svelte";
    import {Card, Icon, Ripple} from "nunui";

    export let selected, hover, mobile, timeSegments, selTime;

    function time(h, m) {
        return h * 60 + m;
    }


    function perc(time) {
        const start = 9 * 60;
        const end = 24 * 60;
        return (time - start) / (end - start) * 100;
    }

    function overlap(a, b) {
        const as = time(a.sh, a.sm), ae = time(a.eh, a.em);
        const bs = time(b.sh, b.sm), be = time(b.eh, b.em);
        return a.date === b.date && ((as <= bs && bs < ae) || (as < be && be <= ae) || (bs <= as && ae <= be));
    }

    function getLevels(selected) {
        const levels = [], times = selected.map(i => i.time).flat();
        for (let i = 0; i < times.length; i++) {
            levels.push([times.slice(0, i).filter(x => overlap(x, times[i])).length, times.filter(x => overlap(x, times[i])).length]);
        }
        return levels;
    }

    $: _hover = selected.some(i => i === hover) ? null : hover;
    $: levels = getLevels(_hover ? [...selected, _hover] : selected);
    $: overlapExist = getLevels(selected).some(i => i[1] > 1);

    $: maxHour = 24 ?? Math.max(18, ...selected.map(i => i.time).flat().map(i => i.em ? i.eh + 1 : i.eh));
    $: hours = Array.from({length: maxHour - 9 + 1}, (_, i) => i + 9);

    $: console.log(timeSegments)
</script>

<main>
    {#if overlapExist}
        <Card flat secondary style="margin: 12px">
            <Icon error/>
            <span>시간이 겹치는 과목이 있어요.</span>
        </Card>
    {/if}
    <div style="padding: 12px;display: flex;align-items: baseline">
        <span style="font-size: 1.8em;font-weight: 300">
            <Icon table/>
            시간표
        </span>
        <span style="margin-left: auto;display: block;font-size: 0.8em;font-weight: 300">
            <span style="font-size: 1.4em;font-weight: 500">{selected.reduce((a, b) => a + b.credit, 0)}</span>학점 /
            <span style="font-size: 1.4em;font-weight: 500">{selected.length}</span>과목
        </span>
    </div>
    <div style="padding: 12px 12px 12px 72px;width: calc(100% - 84px);display: flex;align-items: center;justify-content: space-around;position: sticky;top: 0;background:var(--surface);z-index: 1;border-radius: 12px">
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
    </div>
    <div style="flex: 1;display: flex;align-items: center;padding: 12px 6px 24px 0">
        <div style="width: 60px;height: calc(100% + 9px);margin: -3px 0 -6px 0;display: flex;align-items: center;justify-content: space-between;flex-direction: column;font-weight: 300;font-size: 0.6em">
            {#each hours as h}
                <span>{h}</span>
            {/each}
        </div>
        <div style="display: flex;position: relative;flex: 1;height: 100%">
            {#each [0, 1, 2, 3, 4] as date}
                {#each timeSegments as [s, e]}
                    {@const key = `${date}-${s}`}
                    <div class="timeSelect" on:click={() => selTime = (selTime === key ? null : key)}
                         style="position: absolute;top: {perc(s)}%;height: {perc(e) - perc(s)}%;left: {date * 20 + 0.4}%">
                        <Ripple active={selTime === key} />
                    </div>
                {/each}
            {/each}

            {#each selected as data, i}
                <TableItem {mobile} {data} on:remove={() => selected = selected.filter(x => x !== data)} {selected}
                           {levels} offset={selected.slice(0, i).map(i => i.time).flat().length}/>
            {/each}
            {#if _hover}
                <TableItem data={hover} hover {selected} {levels} offset={selected.map(i => i.time).flat().length}/>
            {/if}
        </div>
    </div>
</main>

<style lang="scss">
  main {
    width: 100%;
    height: 100%;
    background: var(--surface);
    border-radius: 12px;
    position: relative;
    display: flex;
    flex-direction: column;
    font-size: 1.2em;
    font-weight: 500;
    min-height: 900px;
  }

  .timeSelect {
    width: 19.2%;
    background: transparent;
    border-radius: 12px;
    transition: background 0.1s;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
</style>