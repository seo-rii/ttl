<script lang="ts">
    import {Button, Card, IconButton, Input, OneLine, Option, Paper, Select, Table, Th, List} from "nunui";
    import Paginator from "$lib/Paginator.svelte";
    import otlMap from "$lib/otlMap";
    import TableTd from "$lib/TableTd.svelte";
    import {sort} from "fast-sort";
    import Scrolling from "$lib/Scrolling.svelte";
    import Other from "$lib/Other.svelte";
    import {compete} from "$lib/config";

    export let list = [], favorites = [], deptMap = {}, hover, selected, mobile, year, term, timeSegments, selTime,
        detail, hideTerm;

    const types = [
        "기초필수",
        "기초선택",
        "전공필수",
        "전공선택",
        "교양필수",
        "인문사회선택",
        "공통필수",
        "자유선택",
    ];
    let page = 1, search = '', dept, deptList = [], type = null;

    $: _list = sort(list.map(i => ({
        ...i, vs: i.cap ? (i.reg / i.cap) : 0
    })).filter(i => {
        const l = (search || '').toLowerCase();
        return (!l || [i.title, ...i.prof, deptMap[i.dept]].map(i => (i || '').toLowerCase()).some(x => l.split('').every(i => x.includes(i))) || [i.code, i.old].map(i => (i || '').toLowerCase()).some(x => x.includes(l)))
            && (i.dept === +dept || !dept)
            && (!type || (i.type || '').startsWith(type))
            && (!selTime || i.time.some(tt => tt.date === +selTime.split('-')[0] && tt.sh * 60 + tt.sm <= +selTime.split('-')[1] && tt.eh * 60 + tt.em > +selTime.split('-')[1]))
    }))[way % 2 ? 'desc' : 'asc'](i => i[['code', 'code', 'vs', 'vs'][way % 4] || 'code']);

    $: maxPage = Math.ceil(_list.length / itemPerPage);
    $: {
        let _ = [search, dept, type, selTime];
        page = 1;
    }
    $: {
        deptList = sort(Object.keys(deptMap)).asc(i => deptMap[i]);
    }

    $: itemPerPage = 20

    function vscolor(vs) {
        if (!vs) return 'var(--on-surface)';
        const inter = [[0, '#8ae7f3'], [0.6, '#adee5d'], [1, '#f9f871'], [2, '#f97171']];
        if (vs < 0.1) return `color-mix(in srgb, ${inter[0][1]}, var(--on-surface) ${vs * 10}%)`;
        for (let i = 1; i < inter.length; i++) {
            if (vs < inter[i][0]) {
                return `color-mix(in srgb, color-mix(in srgb, ${inter[i - 1][1]}, ${inter[i][1]} ${((vs - inter[i - 1][0]) / (inter[i][0] - inter[i - 1][0]) * 100)}%), var(--on-surface) 20%)`;
            }
        }
        return `color-mix(in srgb, ${inter[inter.length - 1][1]}, var(--on-surface) 20%)`;
    }

    $: [sTime, eTime] = timeSegments.find(i => i[0] === +selTime?.slice?.(2)) || []
    $: sHour = Math.floor(sTime / 60)
    $: sMin = (sTime % 60).toString().padStart(2, '0')
    $: eHour = Math.floor(eTime / 60)
    $: eMin = (eTime % 60).toString().padStart(2, '0')
    $: tForm = `${sHour}:${sMin} - ${eHour}:${eMin}`

    let way = 0
    $: if (way >= 4) way = 0
</script>

<div style="position: sticky;top: 0px;background:var(--surface);z-index: 10;padding-top: 12px">
    <header>
        {#if year && !hideTerm}
            <div class="item">
                <Select bind:selected={year} placeholder="년도" {mobile}>
                    {#each Array.from({length: 12}, (_, i) => 2024 - i) as y}
                        <Option title={y} data={y}/>
                    {/each}
                </Select>
            </div>
            <div class="item">
                <Select bind:selected={term} placeholder="학기" {mobile}>
                    <Option title="봄" data={1}/>
                    <Option title="여름" data={2}/>
                    <Option title="가을" data={3}/>
                    <Option title="겨울" data={4}/>
                </Select>
            </div>
        {/if}
        <div style="flex: 1;min-width: 160px">
            <Input bind:value={search} placeholder="검색" fullWidth/>
        </div>
        <div class="item" style="flex: 1">
            <Select bind:selected={dept} placeholder="학과" {mobile} fullWidth>
                <main on:wheel|stopPropagation|passive on:touchmove|stopPropagation|passive
                      on:touchdown|stopPropagation|passive style="max-height: 80vh">
                    <Option title="전체" data={null}/>
                    {#each deptList as dept}
                        <Option title={deptMap[dept]} data={dept}/>
                    {/each}
                </main>
            </Select>
        </div>
        <div class="item" style="flex: 0.6">
            <Select bind:selected={type} placeholder="유형" {mobile} style="max-height: 80vh;min-width: 100px" fullWidth>
                <main on:wheel|stopPropagation|passive>
                    <Option title="전체" data={null}/>
                    {#each types as type}
                        <Option title={type} data={type}/>
                    {/each}
                </main>
            </Select>
        </div>
        <!--        <div style="flex: 0.6">-->
        <!--            <Paper right xstack bottom>-->
        <!--                <Button icon="add" slot="target" style="min-width: 74px">커스텀</Button>-->
        <!--                sdfsdfdsf-->
        <!--            </Paper>-->
        <!--        </div>-->
    </header>

    <Paginator {maxPage} bind:page maxPageShow={mobile ? 3 : 8}>
        <div style="margin: -8px 0 6px 0;display: flex;align-items: center">
            <Paper left xstack bottom>
                <Button small outlined icon="timer" slot="target"
                        round>{!selTime ? '전체' : ['월', '화', '수', '목', '금'][+selTime[0]] + tForm}</Button>
                <List>
                    {#each [0, 1, 2, 3, 4] as date}
                        {#each timeSegments as [s, e]}
                            {@const sh = Math.floor(s / 60)}
                            {@const sm = (s % 60).toString().padStart(2, '0')}
                            {@const eh = Math.floor(e / 60)}
                            {@const em = (e % 60).toString().padStart(2, '0')}
                            {@const key = `${date}-${s}`}
                            <OneLine title="{['월', '화', '수', '목', '금'][date]} {sh}:{sm} - {eh}:{em}"
                                     on:click={() => selTime = (selTime === key ? null : key)}
                                     active={selTime === key}/>
                        {/each}
                    {/each}
                </List>
            </Paper>
            <Button outlined round icon={way %2 ? "arrow_downward" : "arrow_upward"} small style="margin-left: 4px"
                    on:click={() => way++}>{['과목코드', '과목코드', '경쟁률', '경쟁률'][way]}</Button>
        </div>
    </Paginator>
</div>

{#if detail}
    <Other bind:detail/>
{:else}
    <Table minWidth="900">
        <tr>
            <Th width="3.2">학과</Th>
            <Th width="1.8">학점</Th>
            <Th width="3.6">코드</Th>
            <Th width="2.4">교수</Th>
            <Th width="6">과목 이름</Th>
            <Th width="4.4">수업 시간</Th>
            {#if compete}
                <Th width="4.2">경쟁률</Th>
            {/if}
            <Th width="2.7">유형</Th>
            <Th width="3.8">실라버스/OTL</Th>
        </tr>
        {#each [...favorites, ...selected, ..._list.slice((page - 1) * itemPerPage, page * itemPerPage).filter(i => !selected.includes(i))] as lect, i}
            {@const background = i < favorites.length ? 'var(--primary-light6)' : (selected.includes(lect) ? 'var(--secondary-light6)' : '')}
            {@const vsRaw = lect.cap ? (lect.reg / lect.cap) : 0}
            {@const vs = lect.cap && lect.reg ? (vsRaw < 0.1 ? '<0.1' : vsRaw.toFixed(1)) : ' - '}
            {@const color = vscolor(vsRaw || 0)}
            <tr>
                <TableTd data={lect} bind:hover on:choose {background}>
                    <IconButton favorite size="18" on:click={(e) => {
                    e.stopPropagation();
                    if(favorites.includes(lect)) favorites = favorites.filter(i => i !== lect)
                    else favorites = [...favorites, lect]
                }} active={favorites.includes(lect)}/>
                    {deptMap[lect.dept]}
                </TableTd>

                <TableTd data={lect} bind:hover on:choose {background}>
                    {lect.credit}
                </TableTd>

                <TableTd data={lect} bind:hover on:choose {background}>
                    <IconButton list size="18" on:click={(e) => {
                    detail = lect;
                    e.stopPropagation();
                }}/>
                    <span style="display: inline-block">{lect.code}</span>
                    {#if lect.group}
                        <span style="font-size: 0.8em;display: inline-block">{lect.group}</span>
                    {/if}
                </TableTd>

                <TableTd data={lect} bind:hover on:choose {background}>
                    {lect.prof}
                </TableTd>

                <TableTd data={lect} bind:hover on:choose {background}>
                    {lect.title}
                </TableTd>

                <TableTd data={lect} bind:hover on:choose {background}>
                    {#each lect.time as time}
                        <p>
                            {['월', '화', '수', '목', '금', '토', '일'][time.date]}
                            {`${time.sh}:${time.sm.toString().padStart(2, '0')} - ${time.eh}:${time.em.toString().padStart(2, '0')}`}
                        </p>
                    {/each}
                </TableTd>

                {#if compete}
                    <TableTd data={lect} bind:hover on:choose {background} oneline>
                        <Scrolling>
                            <div style="color: {color} !important">{vs} ({lect.reg}/{lect.cap})</div>
                        </Scrolling>
                    </TableTd>
                {/if}

                <TableTd data={lect} bind:hover on:choose {background} online>
                    {lect.type || ''}
                </TableTd>

                <TableTd data={lect} bind:hover on:choose {background}>
                    <div style="display: flex">
                        {#if lect.kcode}
                            <a href="https://cais.kaist.ac.kr/syllabusInfo?year={year}&term={term}&subject_no={lect.kcode}&dept_id={lect.dept}&lecture_class={lect.group}"
                               target="_blank" on:click|stopPropagation>
                                <IconButton description size="18" tooltip="실라버스" right xstack bottom/>
                            </a>
                        {/if}
                        {#if otlMap(lect.code)}
                            <a href="https://otl.sparcs.org/dictionary?startCourseId={otlMap(lect.code)}"
                               target="_blank" on:click|stopPropagation>
                                <IconButton open_in_new size="18" tooltip="OTL" right xstack bottom/>
                            </a>
                        {/if}
                    </div>
                </TableTd>
            </tr>
        {/each}
    </Table>
{/if}

<style lang="scss">
  tr {
    font-size: 0.92em;

    :global(td) {
      padding: 10px 4px !important;
    }
  }

  tr :global(td span) {
  }

  header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    > :global(*) {
      width: 240px;
      margin: 0 12px 4px 0 !important;
    }
  }

  p {
    margin: 0;
  }

  .item {
    min-width: 100px;
    flex: 1;
    margin-top: -16px !important;
    margin-bottom: 4px !important;
  }
</style>