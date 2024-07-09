<script lang="ts">
    import {IconButton, Input, Option, Select, Table, Th} from "nunui";
    import Paginator from "$lib/Paginator.svelte";
    import otlMap from "$lib/otlMap";
    import TableTd from "$lib/TableTd.svelte";
    import {sort} from "fast-sort";

    export let list = [], favorites = [], deptMap = {}, hover, selected, mobile, year, term, timeSegments, selTime;

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

    $: _list = list.filter(i => {
        const l = (search || '').toLowerCase();
        return [i.title, i.code, ...i.prof, deptMap[i.dept]].map(i => (i || '').toLowerCase()).some(x => x.includes(l))
            && (i.dept === +dept || !dept)
            && (!type || (i.type || '').startsWith(type))
            && (!selTime || i.time.some(tt => tt.date === +selTime.split('-')[0] && tt.sh * 60 + tt.sm <= +selTime.split('-')[1] && tt.eh * 60 + tt.em > +selTime.split('-')[1]))
    })

    $: maxPage = Math.ceil(_list.length / itemPerPage);
    $: {
        let _ = [search, dept, type];
        page = 1;
    }
    $: {
        deptList = sort(Object.keys(deptMap)).asc(i => deptMap[i]);
    }

    $: itemPerPage = mobile ? 10 : 20
</script>

<div style="position: sticky;top: 0px;background:var(--surface);z-index: 10;padding-top: 12px">
    <header>
        {#if year}
            <Select bind:selected={year} placeholder="년도" {mobile}>
                {#each Array.from({length: 7}, (_, i) => 2024 - i) as y}
                    <Option title={y} data={y}/>
                {/each}
            </Select>
            <Select bind:selected={term} placeholder="학기" {mobile}>
                <Option title="봄" data={1}/>
                <Option title="여름" data={2}/>
                <Option title="가을" data={3}/>
                <Option title="겨울" data={4}/>
            </Select>
        {/if}
        <div style="min-width: 160px">
            <Input bind:value={search} placeholder="검색"/>
        </div>
        <Select bind:selected={dept} placeholder="학과" {mobile}>
            <main on:wheel|stopPropagation|passive on:touchmove|stopPropagation|passive
                  on:touchdown|stopPropagation|passive style="max-height: 80vh">
                <Option title="전체" data={null}/>
                {#each deptList as dept}
                    <Option title={deptMap[dept]} data={dept}/>
                {/each}
            </main>
        </Select>
        <Select bind:selected={type} placeholder="유형" {mobile} style="max-height: 80vh">
            <main on:wheel|stopPropagation|passive>
                <Option title="전체" data={null}/>
                {#each types as type}
                    <Option title={type} data={type}/>
                {/each}
            </main>
        </Select>
        <Select bind:selected={selTime} placeholder="시간 포함" {mobile}>
            <main on:wheel|stopPropagation|passive style="max-height: 80vh">
                <Option title="전체" data={null}/>
                {#each [0, 1, 2, 3, 4] as date}
                    {#each timeSegments as [s, e]}
                        {@const sh = Math.floor(s / 60)}
                        {@const sm = (s % 60).toString().padStart(2, '0')}
                        {@const eh = Math.floor(e / 60)}
                        {@const em = (e % 60).toString().padStart(2, '0')}
                        <Option title="{['월', '화', '수', '목', '금'][date]} {sh}:{sm} - {eh}:{em}" data="{date}-{s}"/>
                    {/each}
                {/each}
            </main>
        </Select>
    </header>

    <Paginator {maxPage} bind:page maxPageShow={mobile ? 3 : 8}/>
</div>

<Table minWidth="900">
    <tr>
        <Th width="3">학과</Th>
        <Th width="1.6">학점</Th>
        <Th width="2.6">코드</Th>
        <Th width="2">교수</Th>
        <Th width="6">과목 이름</Th>
        <Th width="4">수업 시간</Th>
        <Th width="4">강의실</Th>
        <Th width="2.7">유형</Th>
        <Th width="1">OTL</Th>
    </tr>
    {#each [...favorites, ..._list.slice((page - 1) * itemPerPage, page * itemPerPage)] as lect, i}
        {@const background = i < favorites.length ? 'var(--primary-light4)' : (selected.includes(lect) ? 'var(--secondary-light3)' : '')}
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
                <span>{lect.code}</span>
                {#if lect.group}
                    <span style="font-size: 0.8em">{lect.group}</span>
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

            <TableTd data={lect} bind:hover on:choose {background}>
                {lect.where}
            </TableTd>

            <TableTd data={lect} bind:hover on:choose {background}>
                {lect.type || ''}
            </TableTd>

            <TableTd data={lect} bind:hover on:choose {background}>
                {#if otlMap(lect.code)}
                    <a href="https://otl.sparcs.org/dictionary?startCourseId={otlMap(lect.code)}" target="_blank">
                        <IconButton open_in_new size="18"/>
                    </a>
                {/if}
            </TableTd>
        </tr>
    {/each}
</Table>

<style lang="scss">
  tr :global(td span) {
    display: initial !important;
  }

  header {
    display: flex;
    align-items: center;

    > :global(*) {
      width: 240px;
      margin: 0 12px 0 0 !important;
    }
  }

  p {
    margin: 0;
  }
</style>