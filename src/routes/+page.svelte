<script lang="ts">
    import {onMount} from "svelte";
    import {browser} from "$app/environment";
    import LectureList from "$lib/LectureList.svelte";
    import TimeTable from "$lib/TimeTable.svelte";
    import {Button, CircularProgress, Icon, IconButton} from "nunui";
    import {darkMode} from "$lib";
    import {sort} from "fast-sort";
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import {year as _year, term as _term, selectable} from "$lib/config";


    let year = _year, term = _term;
    $: key = `${year}_${term}`
    const ignoreSets = ['개별연구'];
    let data: any = {}, selected = [], hover, innerWidth, loaded = false, timeSegments = [], selTime, favorites = [],
        shared = null, detail = null;

    $: filter = (li) => li.map(i => i.custom ? i : data.data.find(x => (x.code === i.code || x.old === i.code) && x.group === i.group)).filter(i => i);
    $: {
        if ($page.url.hash?.length > 1 && data.data) {
            shared = JSON.parse(atob($page.url.hash.slice(1)))
            shared = filter(shared)
        } else shared = null;
    }

    async function update(key: string) {
        loaded = false;
        const timeSet = new Set();
        data = await fetch(`/result_${key}.json`).then(r => r.json());
        data.data = data.data.filter(i => !ignoreSets.some(x => i.title.includes(x)))
        selected = JSON.parse(localStorage[key + 'data'] || '[]')
        favorites = JSON.parse(localStorage[key + 'fav'] || '[]')
        selected = filter(selected)
        favorites = filter(favorites)

        for (const i of data.data) {
            for (const t of i.time) {
                const s = t.sh * 60 + t.sm, e = t.eh * 60 + t.em;
                timeSet.add(s);
                timeSet.add(e);
            }
        }
        const timeList = sort(Array.from(timeSet)).asc().filter(x => x >= 9 * 60);
        timeSegments = [];
        for (let i = 1; i < timeList.length; i++) timeSegments.push([timeList[i - 1], timeList[i]]);
        timeSegments = timeSegments;

        loaded = true
    }

    let mounted = false;
    if (browser) onMount(async () => {
        mounted = true
    })

    $: if (mounted) update(key);

    function toggle(e) {
        selTime = null;
        const lect = e.detail;
        if (selected.includes(lect)) selected = selected.filter(i => i !== lect)
        else selected = [...selected, lect]
    }

    $: mobile = innerWidth < (shared ? 1300 : 1100);
    $: if (loaded) localStorage[key + 'data'] = JSON.stringify(selected);
    $: if (loaded) localStorage[key + 'fav'] = JSON.stringify(favorites);
    $: if (selTime) menu = (shared ? 2 : 1);
    $: if (detail) menu = (shared ? 2 : 1);

    let menu = 0;

    $: width = shared ? 520 : 620;
</script>

<svelte:window bind:innerWidth></svelte:window>
{#if data?.version}
    <main>
        <header>
            <span style="font-size: 2.4em">
                <span style="font-size: 0.7em;">kaist/</span>TTL
                {#if !mobile}
                    <span style="font-size: 1rem">
                        DB 버전 : {new Date(data.version).toLocaleString()}
                    </span>
                {/if}
                <a href="/plan" style="font-size: 0.8em;position: relative;top: 6px"><Button small>플래너</Button></a>
            </span>
            <span>
                made by <a href="https://seorii.page">@seo-rii</a>
                <IconButton style="margin-left: 4px" icon={$darkMode ? 'dark_mode' : 'light_mode'}
                            on:click={() => $darkMode = !$darkMode}/>
            </span>
        </header>
        <article class:mobile>
            {#if (!mobile || menu === 0) && shared}
                <div style="width: {width}px;border-radius: 12px">
                    <TimeTable shared selected={shared} {mobile} timeSegments={[]} on:apply={() => {
                        selected = shared;
                        goto('#');
                    }} {year} {term}/>
                </div>
            {/if}
            {#if !mobile || menu === (shared ? 1 : 0)}
                <div style="width: {width}px;border-radius: 12px">
                    <TimeTable {hover} bind:selected {mobile} {timeSegments} bind:selTime bind:detail {year} {term}/>
                </div>
            {/if}
            {#if !mobile || menu === (shared ? 2 : 1)}
                <div style="flex: 1;min-height: 400px;background: var(--surface);border-radius: 12px">
                    <section style="position: relative;padding: 0 12px 12px 12px">
                        <div style="margin: 6px 0 -6px 0">
                            {#each selectable as time}
                                {@const syear = +time.slice(0, 4)}
                                {@const sterm = +time.slice(5)}
                                <Button small flat style="margin: 4px" on:click={() => {
                                    year = syear;
                                    term = sterm;
                                }} outlined={year !== syear || term !== sterm}>
                                    {syear}년 {['', '봄', '여름', '가을', '겨울'][sterm]}학기
                                </Button>
                            {/each}
                        </div>
                        {#key key}
                            <LectureList list={data.data} deptMap={data.deptMap} on:choose={toggle} bind:hover
                                        bind:selected {mobile} {timeSegments} bind:selTime bind:favorites bind:detail
                                        bind:year bind:term hideTerm/>
                        {/key}
                    </section>
                </div>
            {/if}
            {#if mobile}
                <section
                        style="display: flex;align-items: center;justify-content: center;padding-bottom: 12px;width: 100vw;background: var(--primary-light5);padding-top: 12px">
                    {#if shared}
                        <IconButton icon="share" flat on:click={() => menu = 0} active={menu === 0} label="공유된 시간표"/>
                        <div style="width: 4px"/>
                    {/if}
                    <IconButton icon="table" flat on:click={() => menu = (shared ? 1 : 0)}
                                active={menu === (shared ? 1 : 0)} label="시간표"/>
                    <div style="width: 4px"/>
                    <IconButton icon="list" flat on:click={() => menu = (shared ? 2 : 1)}
                                active={menu === (shared ? 2 : 1)} label="과목 목록"/>
                </section>
            {/if}
        </article>
    </main>
{:else}
    <main>
        <CircularProgress indeterminate/>
    </main>
{/if}

<style lang="scss">
  header {
    width: 90%;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 12px 0;
    height: 46px;

    a {
      color: var(--on-surface);
    }
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  article {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    &.mobile {
      flex-direction: column;
      flex: 1;
    }
  }

  main {
    width: 100%;
    height: 100%;
  }

  article {
    width: 90%;
    height: calc(90% - 40px);
    position: relative;
  }

  div {
    height: 100%;
    position: relative;
    margin: 12px;
    overflow-y: auto;
    max-width: 100%;
  }
</style>