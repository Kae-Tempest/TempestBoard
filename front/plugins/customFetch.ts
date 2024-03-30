export default defineNuxtPlugin(() => {
    const userAuth = useCookie('token')
    const config = useRuntimeConfig()
    const csrftoken = useCookie('csrftoken')

    const $customFetch = $fetch.create({
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
            'X-CSRFToken': csrftoken.value || '' // Include CSRF token in headers
        },
        onRequest({request, options, error}) {
            options.headers = options.headers || {}
        },
        onResponse({response}) {
            // response._data = new myBusinessResponse(response._data)
        },
        onResponseError({response}) {
            if (response.status === 401 || response.status === 403) {
                return navigateTo('/login')
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