<script lang="ts">
    import {SegmentButton} from "nunui";

    export let maxPage, page = 1, list, left, full;
    let clientWidth = 0;

    $: _maxPageShow = 10;
    $: maxPageShow = _maxPageShow >= 5 ? Math.floor(_maxPageShow / 5) * 5 : _maxPageShow;
    let showPrev = false, showNext = false;

    $: beginPage = Math.floor((page - 1) / maxPageShow) * maxPageShow + 1;
    $: showPrev = true;
    $: showNext = beginPage + maxPageShow <= maxPage;
    $: pages = [...(showPrev ? ['<<', '<'] : []), ...Array.from({length: maxPageShow}, (_, i) => beginPage + i).filter(i => i <= maxPage), ...(showNext ? ['>', '>>'] : [])];
</script>

<main bind:clientWidth class:left>
    <div>
        <slot/>
        <SegmentButton small data={pages} selected={page - beginPage + showPrev * 2} nullable={false} on:select={(e)=>{
            if(showPrev && e.detail === 0) {
                page = -1;
                page = 1;
            }
            else if(showNext && maxPageShow + showPrev * 2 + showNext * 2 - 1 === e.detail) page = maxPage;
            else page = beginPage + e.detail - showPrev * 2;
            if(page < 1) page = 1;
        }}/>
    </div>
</main>

<style lang="scss">
  main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0;

    div {
      display: flex;
      flex-direction: column;
    }

    &.left {
      align-items: flex-start;
    }

    :global(*) {
      --bop: 0.092 !important;
    }
  }
</style>