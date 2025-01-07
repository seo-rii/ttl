<script lang="ts">
    import {ThemeProvider} from "nunui";
    import {browser} from "$app/environment";
    import {darkMode, locale} from "$lib";
    import GA from "./GA.svelte";

    let primary, secondary, surface, onPrimary, onSurface, onSecondary;
    let loading = true;

    $: {
        if ($darkMode) {
            [primary, secondary, surface, onSurface, onPrimary, onSecondary] = ["#bfc1ea", "#9dc5e6", "#1e202a", "#fff", "#13131f", "#fff"];
        } else {
            [primary, secondary, surface, onSurface, onPrimary, onSecondary] = ["#4e4f78", "#386d92", "#eff2f6", "#13131f", "#eff2f6", "#13131f"];
        }
    }

    if (browser) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) $darkMode = true;
    }
</script>

<svelte:head>
    {#if $darkMode}
        <style>
            html, body {
                background: lab(19.037 1.6185 -8.435);
            }
        </style>
    {:else}
        <style>
            html, body {
                background: lab(89.301 0.3207 -4.443);
            }
        </style>
    {/if}
</svelte:head>

<title>TTL</title>
<GA/>
<ThemeProvider {primary} {secondary} {surface} {onSurface} {onSecondary} {onPrimary}>
    {#key $locale}
        <slot/>
    {/key}
</ThemeProvider>

<style lang="scss">
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css");

  :global(*) {
    -webkit-tap-highlight-color: transparent;
  }

  :global(*)::selection {
    background: var(--primary) !important;
    color: var(--on-primary) !important;
  }

  :global(html, body, body > div, body > div > main) {
    height: 100%;
    margin: 0;
    padding: 0;
    font: normal 250 16px "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
    scroll-behavior: smooth;
    color: var(--on-surface);
    --nav: 64px;

    transition: background-color 0.3s ease, color 0.3s ease;
    --hl-linear: linear-gradient(120deg, var(--secondary-light2) 20%, var(--secondary-light3) 140%);
  }
</style>