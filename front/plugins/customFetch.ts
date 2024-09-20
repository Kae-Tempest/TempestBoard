export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const $customFetch = $fetch.create({
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
            'X-CSRFToken': useCookie('csrftoken').value || ''  // Include CSRF token in headers
        },
        onRequest({request, options, error}) {
            options.headers = {'X-CSRFToken': useCookie('csrftoken').value || ''}
        },
        onResponse({response}) {},
        onResponseError({response, error}) {
            if (response.status === 401 || response.status === 403) {
                navigateTo('/login')
            }
        }
    })
    // Expose to useNuxtApp().$customFetch
    return {
        provide: {
            customFetch: $customFetch
        }
    }
})