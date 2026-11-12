// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	var __TTL_BUILD_VERSIONS__: Record<string, string>;

	namespace App {
		interface Error {
			message: string;
			diagnostic?: {
				schema: string;
				fingerprint: string;
				build: Record<string, string>;
			};
		}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
