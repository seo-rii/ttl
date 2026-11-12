import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { createRequire } from 'node:module';

const projectRequire = createRequire(import.meta.url);
const viteRequire = createRequire(projectRequire.resolve('vite/package.json'));
const diagnosticVersions = {
	kit: projectRequire('@sveltejs/kit/package.json').version,
	svelte: projectRequire('svelte/package.json').version,
	vite: projectRequire('vite/package.json').version,
	rollup: viteRequire('rollup/package.json').version
};

export default defineConfig({
	define: { 'globalThis.__TTL_BUILD_VERSIONS__': JSON.stringify(diagnosticVersions) },
	plugins: [sveltekit()]
});
