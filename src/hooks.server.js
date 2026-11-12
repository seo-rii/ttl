let observedStateReferenceError = false;

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const response = await resolve(event);
    const headers = new Headers(response.headers);
    headers.set('x-ttl-diagnostic-build', JSON.stringify(globalThis.__TTL_BUILD_VERSIONS__));
    // Old bundlers can skip a failed module's initialization on warm requests.
    // Remember only this known error flag; retain no request or exception data.
    if (observedStateReferenceError) headers.set('x-ttl-diagnostic-state-error', '1');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error }) {
    console.error(error);

    if (error instanceof ReferenceError && error.message === '$state is not defined') {
        observedStateReferenceError = true;
    }

    // Return a one-way identifier, never the exception message or stack.
    const signature = error instanceof Error ? `${error.name}\0${error.message}` : typeof error;
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(signature));
    const fingerprint = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    const build = globalThis.__TTL_BUILD_VERSIONS__;

    return {
        message: 'Internal Error',
        diagnostic: { schema: 'ttl-runtime-v1', fingerprint, build }
    };
}
