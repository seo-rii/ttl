<script lang="ts">
    import {page} from '$app/stores'
    import {browser} from "$app/environment";

    const page_title = 'TTL';
    const __GA = import.meta.env.VITE_GA;

    declare const gtag;
    if (browser) window._GA_ = __GA;
    let path = '';

    $: if (browser && typeof gtag !== 'undefined' && path !== $page.url.pathname) {
        path = $page.url.pathname;
        gtag('config', __GA, {
            page_title,
            page_path: $page.url.pathname,
        })
    }
</script>

<svelte:head>
    <script async src="https://www.googletagmanager.com/gtag/js?id={__GA}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js', new Date());gtag('config',window._GA_);function gads(){setTimeout(()=>{try{(window.adsbygoogle||[]).push({})}catch(e){}},500)}</script>
</svelte:head>