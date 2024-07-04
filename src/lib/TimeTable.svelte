<script lang="ts">
    import TableItem from "$lib/TableItem.svelte";
    import {Icon} from "nunui";

    export let selected, hover, mobile;
</script>

<main>
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
            {#each [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] as h}
                <span>{h}</span>
            {/each}
        </div>
        <div style="display: flex;position: relative;flex: 1;height: 100%">
            {#each selected as data}
                <TableItem {mobile} {data} on:remove={() => selected = selected.filter(x => x !== data)} {selected}/>
            {/each}
            {#if hover}
                <TableItem data={hover} hover {selected}/>
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
</style>