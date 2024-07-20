<script lang="ts">
    import {onMount} from "svelte";
    import {browser} from "$app/environment";
    import LectureList from "$lib/LectureList.svelte";
    import {Button, Option, IconButton, Select} from "nunui";
    import {darkMode} from "$lib";
    import Planner from "$lib/Planner.svelte";
    import TimeTable from "$lib/TimeTable.svelte";

    const ignoreSets = ['졸업연구', '개별연구', 'URP', '논문연구', '석사', '박사'];
    let year = 2024, term = 3, menu = 0;
    let data: any = {}, hover, innerWidth, loaded = false, list = [], plan = {}, deptMap = {};

    async function load(year, month) {
        list = [];
        const data = await fetch(`/result_${year}_${month}.json`).then(r => r.json());
        data.data = data.data.filter(i => !ignoreSets.some(x => i.title.includes(x)))

        const key = `${year}-${month}`;
        plan[key] = (plan[key] || []).map(i => data.data.find(x => x.code === i.code && x.group === i.group)).filter(i => i)
        list = data.data;
        deptMap = data.deptMap;
    }

    if (browser) onMount(async () => {
        try {
            plan = JSON.parse(localStorage.plan || '{}')
        } catch (e) {
        }
        loaded = true
    })

    function toggle(e) {
        const lect = e.detail;
        if (selected.includes(lect)) selected = selected.filter(i => i !== lect)
        else selected = [...selected, lect]
        plan = {...plan, [key]: selected}
    }

    $: mobile = innerWidth < 1100;
    $: if (loaded) localStorage.plan = JSON.stringify(plan);
    $: loaded && load(year, term);

    $: key = `${year}-${term}`;
    $: selected = plan[key] || (plan[key] = []);
</script>

<svelte:window bind:innerWidth></svelte:window>
<main>
    <header>
            <span style="font-size: 2.4em">
                <span style="font-size: 0.7em;">kaist/</span>TTL<span style="font-size: 0.8em;">/planner</span>
                <span style="font-size: 0.4em;color: var(--primary)"> 알파 버전. 참고로만 사용하세요!</span>
                <a href="/" style="font-size: 0.8em;position: relative;top: 6px"><Button small>시간표</Button></a>
            </span>
        <span>
                made by <a href="https://seorii.page">@seo-rii</a>
                <IconButton style="margin-left: 4px" icon={$darkMode ? 'dark_mode' : 'light_mode'}
                            on:click={() => $darkMode = !$darkMode}/>
            </span>
    </header>
    <article class:mobile>
        {#if !mobile || menu === 0}
            <div style="width: 600px;border-radius: 12px">
                {#if loaded}
                    <Planner {mobile} bind:plan/>
                {/if}
            </div>
        {/if}
        {#if !mobile || menu === 1}
            <div style="flex: 1;min-height: 400px;background: var(--surface);border-radius: 12px">
                <section style="position: relative;padding: 0 12px 12px 12px">
                    <LectureList {list} {deptMap} on:choose={toggle} timeSegments={[]}
                                 bind:selected bind:year bind:term {mobile}/>
                </section>
            </div>
        {/if}
        {#if mobile}
            <section style="display: flex;align-items: center;justify-content: space-around;padding-bottom: 12px">
                <Button icon="table" small on:click={() => menu = 0} outlined={menu !== 0}>플래너</Button>
                <Button icon="list" small on:click={() => menu = 1} outlined={menu !== 1} style="margin-left: 4px">
                    과목 목록
                </Button>
            </section>
        {/if}
    </article>
</main>

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
