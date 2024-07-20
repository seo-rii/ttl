<script lang="ts">
    import {Button, OneLine, Option, Select, Card, Checkbox} from "nunui";
    import Maehwasu from "$lib/maehwasu.js";
    import PlanOne from "$lib/PlanOne.svelte";
    import {sort} from "fast-sort";

    export let plan;
    export let mobile = false;

    let year = plan.year || 2024;
    let dept = plan.dept || null;

    let sub = plan.sub || null;
    let double = plan.double || null;
    let deep = plan.deep || false;
    let creative = plan.creative || [];

    $: plan.year = year;
    $: plan.dept = dept;

    $: plan.sub = sub;
    $: plan.double = double;
    $: plan.deep = deep;
    $: plan.creative = creative;

    const majors = [
        ["AE", "항공우주공학과"],
        ["BiS", "바이오및뇌공학과"],
        ["BS", "생명과학과"],
        ["BTM", "기술경영학부"],
        ["CBE", "생명화학공학과"],
        ["CE", "건설및환경공학과"],
        ["CH", "화학과"],
        ["CS", "전산학부"],
        ["EE", "전기및전자공학부"],
        ["ID", "산업디자인학과"],
        ["IE", "산업및시스템공학과"],
        ["MAS", "수리과학과"],
        ["ME", "기계공학과"],
        ["MS", "신소재공학과"],
        ["NQE", "원자력및양자공학과"],
        ["PH", "물리학과"],
        ["TS", "융합인재학부"]
    ]

    $: planner = new Maehwasu({
        major: dept || '',
        minor: sub || '',
        doubleMajor: double || '',
        isAdvancedMajor: deep,
        is_individually_designed: false,
    }, year).requiredCredits()

    $: my = new Maehwasu({
        major: dept || '',
        minor: sub || '',
        doubleMajor: double || '',
        isAdvancedMajor: deep,
        is_individually_designed: false,
    }, year).completedCredits(Object.keys(plan).map(i => i.includes('-') ? plan[i] : []).flat())
</script>

<main>
    <div class="row" style="padding-bottom: 0">
        <Card primary flat style="width: 100%">
            <span style="margin: 0">플래너는 김민우 님이 개발한 <a href="https://github.com/jadehaus/UCE-KAIST-Public/tree/main"
                                                       target="_blank">매화수</a>의 공식을 사용합니다.</span>
        </Card>
    </div>
    <div class="row">
        <Select bind:selected={year} placeholder="입학년도" {mobile}>
            {#each Array.from({length: 7}, (_, i) => 2024 - i) as y}
                <Option title={y} data={y}/>
            {/each}
        </Select>
        <Select bind:selected={dept} placeholder="학과" {mobile}>
            {#each majors as item}
                <Option title={item[1]} data={item[0]}/>
            {/each}
        </Select>
    </div>
    <div class="row" style="margin-top: -36px">
        <div style="flex: 1">
            <Select bind:selected={double} placeholder="복수전공" {mobile}>
                <Option title="없음" data={null}/>
                {#each majors as item}
                    <Option title={item[1]} data={item[0]}/>
                {/each}
            </Select>
        </div>
        <div style="flex: 1">
            <Select bind:selected={sub} placeholder="부전공" {mobile}>
                <Option title="없음" data={null}/>
                {#each majors as item}
                    <Option title={item[1]} data={item[0]}/>
                {/each}
            </Select>
        </div>
        <div style="flex: 1">
            <div style="position: relative;top: 12px">
                <Checkbox bind:checked={deep} label="심화전공"/>
            </div>
        </div>
    </div>
    <div class="row" style="padding: 0 12px">
        <Card outlined style="width: 100%">
            <PlanOne title="전체" my={my.total} total={planner.total}/>
            <PlanOne title="AU" my={my.mandatoryAu} total={planner.mandatoryAu}/>
            <PlanOne title="기초필수" my={my.mandatoryBasic} total={planner.mandatoryBasic}/>
            <PlanOne title="기초선택" my={my.electiveBasic} total={planner.electiveBasic}/>
            <PlanOne title="전공" my={my.major} total={planner.major}/>
            <PlanOne title="복수/부전공" my={my.otherMajor} total={planner.otherMajor}/>
            <PlanOne title="연구" my={my.research} total={planner.research}/>
            <PlanOne title="인문" my={my.humanities} total={planner.humanities}/>
            <PlanOne title="교양필수" my={my.mandatoryGeneral} total={planner.mandatoryGeneral}/>
        </Card>
    </div>
    <div>
        {#each sort(Object.keys(plan)).desc() as key}
            {#if key.includes('-') && plan[key]?.length}
                <Card secondary flat>
                    <p style="margin: 0 0 4px 0;color:var(--primary);font-weight: 500;font-size:1.2em">{key}</p>
                    <div class="row" style="padding: 0">
                        {#each plan[key] as item}
                            <Button small outlined on:click={() => plan[key] = plan[key].filter(i => i !== item)}>
                                {item.title}
                            </Button>
                        {/each}
                    </div>
                </Card>
            {/if}
        {/each}
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
    font-size: 0.92em;
    //font-weight: 500;
    min-height: 900px;
    overflow-y: scroll;
  }

  .row {
    display: flex;
    align-items: center;
    width: calc(100% - 24px);
    flex-wrap: wrap;
  }

  div {
    padding: 12px;
  }
</style>
