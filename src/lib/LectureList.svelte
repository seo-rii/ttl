<script lang="ts">
    import {IconButton, Input, Option, Select, Table, Th} from "nunui";
    import Paginator from "$lib/Paginator.svelte";
    import otlMap from "$lib/otlMap";
    import TableTd from "$lib/TableTd.svelte";

    export let list = [], deptMap = {}, hover, selected;

    const itemPerPage = 20;
    let page = 1, search = '', dept, deptList = [];

    $: _list = list.filter(i => {
        const l = (search || '').toLowerCase();
        return [i.title, i.code, ...i.prof].map(i => (i || '').toLowerCase()).some(x => x.includes(l))
            && (i.dept === +dept || !dept)
    })

    $: maxPage = Math.ceil(_list.length / itemPerPage);
    $: {
        void search, dept;
        page = 1;
    }
    $: {
        deptList = Object.keys(deptMap);
        deptList.sort((x, y) => deptMap[x] < deptMap[y] ? 1 : 0)
    }
</script>

<div style="position: sticky;top: 0px;background:var(--surface);z-index: 10;padding-top: 12px">
    <header>
        <div>
            <Input bind:value={search} placeholder="검색"/>
        </div>
        <Select bind:selected={dept} placeholder="학과">
            {#each deptList as dept}
                <Option title={deptMap[dept]} data={dept}/>
            {/each}
        </Select>
    </header>

    <Paginator {maxPage} bind:page/>
</div>

<Table minWidth="900">
    <tr>
        <Th width="2">학과</Th>
        <Th width="2">코드</Th>
        <Th width="1.6">교수</Th>
        <Th width="6">과목 이름</Th>
        <Th width="4">수업 시간</Th>
        <Th width="4">강의실</Th>
        <Th width="1">OTL</Th>
    </tr>
    {#each _list.slice((page - 1) * itemPerPage, page * itemPerPage) as lect}
        {@const background = selected.includes(lect) ? 'var(--secondary-light3)' : ''}
        <tr>
            <TableTd data={lect} bind:hover on:choose {background}>
                {deptMap[lect.dept]}
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