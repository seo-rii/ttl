import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { createRequire } from 'node:module';

export default defineConfig(({ command }) => {
	if (command === 'build') {
		const projectRequire = createRequire(import.meta.url);
		const viteRequire = createRequire(projectRequire.resolve('vite/package.json'));
		const rollupVersion = viteRequire('rollup/package.json').version;
		if (rollupVersion !== '4.64.5') {
			throw new Error(`Rollup 4.64.5 is required for Svelte 4 SSR; found ${rollupVersion}. Reinstall dependencies with the repository's Rollup overrides before building.`);
		}
	}

	return { plugins: [sveltekit()] };
});
