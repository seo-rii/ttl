<script lang="ts">
    import {onMount} from "svelte";
    import {browser} from "$app/environment";
    import LectureList from "$lib/LectureList.svelte";
    import TimeTable from "$lib/TimeTable.svelte";
    import {Button, CircularProgress, Icon, IconButton} from "nunui";
    import {darkMode} from "$lib";

    const ignoreSets = ['졸업연구', '개별연구', 'URP', '논문연구', '석사', '박사'];
    let data: any = {}, selected = [], hover, innerWidth, loaded = false;
    const st = new Set();

    if (browser) onMount(async () => {
        data = await fetch('/result.json').then(r => r.json());
        data.data = data.data.filter(i => !ignoreSets.some(x => i.title.includes(x)))
        for (const item of data.data) item.time.map(i => {
            st.add(i.sh * 100 + i.sm);
            st.add(i.eh * 100 + i.em);
            st.add(i.date)
        });
        selected = JSON.parse(localStorage.data || '[]')
        loaded = true
    })

    function toggle(e) {
        const lect = e.detail;
        if (selected.includes(lect)) selected = selected.filter(i => i !== lect)
        else selected = [...selected, lect]
    }

    $: mobile = innerWidth < 1100;
    $: if (loaded) localStorage.data = JSON.stringify(selected);

    let menu = 0;
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
            </span>
            <span>
                made by <a href="https://seorii.page">@seo-rii</a>
                <IconButton style="margin-left: 4px" icon={$darkMode ? 'dark_mode' : 'light_mode'} on:click={() => $darkMode = !$darkMode}/>
            </span>
        </header>
        <article class:mobile>
            {#if !mobile || menu === 0}
                <div style="width: 600px;border-radius: 12px">
                    <TimeTable {hover} bind:selected {mobile}/>
                </div>
            {/if}
            {#if !mobile || menu === 1}
                <div style="flex: 1;min-height: 400px;background: var(--surface);border-radius: 12px">
                    <section style="position: relative;padding: 0 12px 12px 12px">
                        <LectureList list={data.data} deptMap={data.deptMap} on:choose={toggle} bind:hover
                                     bind:selected {mobile}/>
                    </section>
                </div>
            {/if}
            {#if mobile}
                <section style="display: flex;align-items: center;justify-content: space-around;padding-bottom: 12px">
                    <Button icon="table" small on:click={() => menu = 0} outlined={menu !== 0}>시간표</Button>
                    <Button icon="list" small on:click={() => menu = 1} outlined={menu !== 1} style="margin-left: 4px">과목 목록</Button>
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
    width: 100vw;
    height: 100vh;
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