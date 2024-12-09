<script lang="ts">
    import {Button, Card, Input, Option, SegmentButton} from "nunui";
    export let year, term, selected, mobile;

    let name = '', place = '', sh = 9, sm = 0, eh = 12, em = 0, date = 0;

    const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    const minutes = [0, 15, 30, 45];
</script>


<p style="margin-top: 0">수동 시간표 추가</p>
<Input placeholder="제목" bind:value={name} fullWidth/>
<Input placeholder="장소" bind:value={place} fullWidth/>
<Input placeholder="시작 시간" type="number" min="6" max="24" bind:value={sh} fullWidth/>
<Input placeholder="시작 분" type="number" min="0" max="59" bind:value={sm} fullWidth/>
<Input placeholder="종료 시간" type="number" min="6" max="24" bind:value={eh} fullWidth/>
<Input placeholder="종료 분" type="number" min="0" max="59" bind:value={em} fullWidth/>
<SegmentButton small bind:selected={date} data={['월', '화', '수', '목', '금']} fullWidth/>

<Button on:click={() => {
    selected = [...selected, {custom: true, title: name, credit: 0, where: place, time: [{sh, sm, eh, em, date}]}];
    name = '';
    place = '';
    sh = 9;
    sm = 0;
    eh = 12;
    em = 0;
}}>추가</Button>