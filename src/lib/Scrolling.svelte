<script lang="ts">
    import {Button, Icon} from "nunui";
    import {fade} from "svelte/transition";
    import {tweened} from "svelte/motion";
    import {cubicInOut} from "svelte/easing";

    export let toolbar = false, manualScroll = false, autoScroll = !manualScroll,
        backgroundSize = manualScroll ? 60 : 140, fill = false, style = '';
    const scrollDelta = tweened(0, {duration: 0, easing: cubicInOut});
    let clientWidth = 1, contentWidth = 1, content, scrollWidth = 0, enableScroll = false;
    let client;

    $: setTimeout(() => scrollWidth = clientWidth - (toolbar ? 20 : 0), 50);
    $: setTimeout(() => enableScroll = contentWidth > scrollWidth, 50);
    $: _enableScroll = contentWidth > scrollWidth
    $: setTimeout(() => $scrollDelta = Math.max(0, contentWidth - scrollWidth), 50);
</script>

<main bind:clientWidth style:--backgroundSize="{backgroundSize}px" {style} bind:this={client}>
    <div class="content" bind:this={content} class:manualScroll>
        <span bind:clientWidth={contentWidth} class:scroll={autoScroll && $scrollDelta > 1} class:fill
              style:--delta="{-$scrollDelta}px" style:--time="{4000}ms">
            <slot/>
        </span>
    </div>
    {#if manualScroll && enableScroll}
        <div class="lBackground" transition:fade|local={{duration: 200}}></div>
        <div class="ltoolbar" transition:fade|local={{duration: 200}}>
            {#if manualScroll}
                <Button active small outlined style="position: relative;top: -3px;" on:click={()=>{
                    content.scrollLeft -= 100;
                }}>
                    <Icon chevron_left/>
                </Button>
            {/if}
            <slot name="toolbar"/>
        </div>
    {/if}
    {#if (toolbar || manualScroll) && enableScroll}
        <div class="rBackground" transition:fade|local={{duration: 200}}></div>
        <div class="toolbar" transition:fade|local={{duration: 200}}>
            {#if manualScroll}
                <Button active small outlined style="position: relative;top: -3px;" on:click={()=>{
                    content.scrollLeft += 100;
                }}>
                    <Icon chevron_right/>
                </Button>
            {/if}
            <slot name="toolbar"/>
        </div>
    {/if}
</main>

<style lang="scss">
  main {
    position: relative;
    white-space: nowrap;
    width: 100%;
  }

  .content {
    position: relative;
    width: 100%;

    &.manualScroll {
      overflow-x: scroll;
      scroll-behavior: smooth;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  span {
    display: inline-block;
    width: fit-content;
    transition: transform var(--time) ease-in-out;

    &.scroll {
      animation: scroll var(--time) ease-in-out infinite;
      animation-play-state: running;
    }

    &:hover {
      animation-play-state: paused;
    }

    &.fill {
      min-width: 100%;
    }
  }

  .toolbar {
    position: absolute;
    right: 10px;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .ltoolbar {
    position: absolute;
    left: 10px;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .rBackground {
    position: absolute;
    height: calc(100% + 40px);
    top: -20px;
    width: var(--backgroundSize);
    right: 0;
    background: radial-gradient(100% 50% ellipse at 100% 50%, var(--primary-light2) -60%, transparent 90%);
  }

  .lBackground {
    position: absolute;
    height: calc(100% + 40px);
    top: -20px;
    width: var(--backgroundSize);
    left: 0;
    background: radial-gradient(100% 50% ellipse at 0% 50%, var(--primary-light2) -60%, transparent 90%);
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    60% {
      transform: translateX(var(--delta));
    }
    80% {
      transform: translateX(var(--delta));
    }
    90% {
      transform: translateX(0);
    }
  }
</style>