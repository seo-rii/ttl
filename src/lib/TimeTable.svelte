<script lang="ts">
    import TableItem from "$lib/TableItem.svelte";
    import {Button, Card, CircularProgress, Icon, IconButton, Input, Paper, Ripple} from "nunui";
    import {createEventDispatcher, tick} from "svelte";
    import {toPng} from 'html-to-image';
    import qrcode from 'qrcode';
    import {goto} from "$app/navigation";
    import {darkMode} from "$lib/index";

    const dispatch = createEventDispatcher();

    export let selected, hover, mobile, timeSegments, selTime, shared, detail, year, term;
    let name = '', capturing = false, shareUrl = '', shareQr = '';

    function time(h, m) {
        return h * 60 + m;
    }


    $: perc = (time) => {
        const start = 9 * 60;
        const end = maxHour * 60;
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

    $: maxHour = Math.max(18, ...selected.map(i => i.time).flat().map(i => i.em ? i.eh + 1 : i.eh));
    $: hours = Array.from({length: maxHour - 9 + 1}, (_, i) => i + 9);

    let container;

    async function capture() {
        capturing = true;
        await tick();
        await new Promise(r => setTimeout(r, 100));
        toPng(container, {quality: 0.95}).then((dataUrl) => {
            const link = document.createElement('a');
            link.download = 'TTL.jpeg';
            link.href = dataUrl;
            link.click();
            name = '';
            capturing = false;
        });
    }

    async function openShare() {
        shareUrl = 'https://ttl.seorii.page#' + btoa(JSON.stringify(selected.map(i => ({
            code: i.code,
            group: i.group
        }))));
        qrcode.toDataURL(shareUrl, {
            color: {dark: $darkMode ? '#fff' : '#000', light: '#00000000'},
            width: 280
        }, (err, url) => {
            shareQr = url;
        })
    }

    $: credit = selected.reduce((a, b) => a + b.credit, 0)
    $: au = selected.reduce((a, b) => a + b.au, 0)
</script>

<main class:capturing bind:this={container}>
    {#if overlapExist && !capturing}
        <Card flat secondary style="margin: 12px">
            <Icon error/>
            <span>시간이 겹치는 과목이 있어요.</span>
        </Card>
    {/if}
    <div style="padding: 12px;display: flex;align-items: baseline">
        <span style="font-size: 1.6em;font-weight: 300">
            <Icon icon={shared ? 'share' : 'table'}/>
            {name ? name + '의' : ''}
            {#if shared && !name}
                공유된
            {/if}
            시간표
        </span>
        <span style="margin-left: auto;display: block;font-size: 0.8em;font-weight: 300">
            <span style="font-size: 1.4em;font-weight: 500">{credit}</span>학점 /
            {#if au}
                <span style="font-size: 1.4em;font-weight: 500">{au}</span>AU /
            {/if}
            <span style="font-size: 1.4em;font-weight: 500">{selected.length}</span>과목

            {#if !capturing}
                <Paper right xstack bottom mobile={mobile}>
                    <IconButton download slot="target"/>
                    <div style="padding: 12px !important;position: relative">
                        <p style="margin-top: 0">이름이 뭐에요?</p>
                        <div>
                            <Input bind:value={name} placeholder="이름" autofocus fullWidth on:submit={capture}/>
                        </div>
                        <div style="display: flex;justify-content: flex-end;margin-top: 12px">
                            <Button small transparent on:click={capture}>저장</Button>
                        </div>
                    </div>
                </Paper>
                {#if !shared}
                    <Paper left xstack bottom width="300px" mobile={mobile}>
                        <IconButton share on:click={openShare} slot="target"/>
                        <div style="padding: 12px">
                            <h2 style="margin: 4px 0">
                                공유
                            </h2>
                            <p style="margin: 12px 0 4px 0">아래 QR코드를 공유하세요.</p>
                            <div style="display: flex;justify-content: center">
                                <img src={shareQr} alt="QR"/>
                            </div>
                            <p>또는, 아래 링크를 복사해서 공유하세요.</p>
                            <Input readonly placeholder="URL" value={shareUrl} trailingIcon="content_copy"
                                   trailingHandler={() => {
                                navigator.clipboard.writeText(shareUrl);
                                alert('복사되었습니다.');
                            }} fullWidth/>
                        </div>
                    </Paper>
                {:else}
                    <IconButton edit on:click={() => dispatch('apply')}/>
                    <IconButton close on:click={() => goto('#')}/>
                {/if}
                <span/>
            {/if}
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
            {#if !capturing}
                {#each [0, 1, 2, 3, 4] as date}
                    {#each timeSegments as [s, e]}
                        {@const key = `${date}-${s}`}
                        {#if e <= maxHour * 60}
                            <div class="timeSelect" on:click={() => selTime = (selTime === key ? null : key)}
                                 style="position: absolute;top: {perc(s)}%;height: {perc(e) - perc(s)}%;left: {date * 20 + 0.4}%">
                                <Ripple active={selTime === key}/>
                            </div>
                        {/if}
                    {/each}
                {/each}
            {/if}

            {#each selected as data, i}
                <TableItem {mobile} {data} on:remove={() => !shared && (selected = selected.filter(x => x !== data))}
                           {selected} {capturing} {maxHour} bind:detail {year} {term}
                           {levels} offset={selected.slice(0, i).map(i => i.time).flat().length}/>
            {/each}
            {#if _hover && !capturing}
                <TableItem {maxHour} data={hover} hover {selected} {levels} {year} {term}
                           offset={selected.map(i => i.time).flat().length}/>
            {/if}
        </div>
    </div>
</main>
{#if capturing}
    <div class="full" style="flex-direction: column">
        <p>캡쳐 중... 잠시만 기다리세요.</p>
        <CircularProgress indeterminate/>
    </div>
{/if}

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

  .capturing {
    position: fixed;
    width: 720px !important;
    height: 1000px !important;
    left: 0 !important;
    top: 0 !important;
    border-radius: 0 !important;
  }

  .full {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface);
  }
</style>