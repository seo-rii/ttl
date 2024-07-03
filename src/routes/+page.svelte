<script lang="ts">
    import {onMount} from "svelte";
    import {browser} from "$app/environment";
    import LectureList from "$lib/LectureList.svelte";
    import TimeTable from "$lib/TimeTable.svelte";
    import {Icon} from "nunui";

    const ignoreSets = ['졸업연구', '개별연구', 'URP', '논문연구', '석사', '박사'];
    let data: any = {}, selected = [], hover, innerWidth;
    const st = new Set();

    if (browser) onMount(async () => {
        data = await fetch('/result.json').then(r => r.json());
        data.data = data.data.filter(i => !ignoreSets.some(x => i.title.includes(x)))
        for (const item of data.data) item.time.map(i => {
            st.add(i.sh * 100 + i.sm);
            st.add(i.eh * 100 + i.em);
            st.add(i.date)
        });
    })

    function toggle(e) {
        const lect = e.detail;
        if (selected.includes(lect)) selected = selected.filter(i => i !== lect)
        else selected = [...selected, lect]
    }

    $: mobile = innerWidth < 1100;
</script>

<svelte:window bind:innerWidth></svelte:window>
{#if data?.version}
    <main>
        <header>
            <span style="font-size: 2.4em">
                <Icon table/>
                <span style="font-size: 0.7em;">kaist/</span>TTL
                <span style="font-size: 1rem">
                    DB 버전 : {new Date(data.version).toLocaleString()}
                </span>
            </span>
            <span>made by <a href="https://seorii.page">@seo-rii</a></span>
        </header>
        <article class:mobile>
            <div style="width: 600px;">
                <TimeTable {hover} bind:selected/>
            </div>
            <div style="flex: 1;min-height: 400px;background: var(--surface);border-radius: 12px">
                <section style="position: relative;padding: 0 12px 12px 12px">
                    <LectureList list={data.data} deptMap={data.deptMap} on:choose={toggle} bind:hover/>
                </section>
            </div>
        </article>
    </main>
{:else}
    로드 중...
{/if}

<style lang="scss">
  header {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
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