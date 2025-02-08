import {ContentType} from "~/enums/content-type.enum";
import {ResponseType} from "~/enums/response-type.enum";
import {useHandleError} from "~/composables/useHandleError";

interface CustomRequestInit extends RequestInit {
    query?: Record<string, any>;
    json?: RequestInit["body"] | Record<string, any>;
}

// Global error state
const isErrorShown = ref(false);
const errorTimeout = ref<NodeJS.Timeout | null>(null);

// Reset error state after some time
const resetErrorState = () => {
    if (errorTimeout.value) {
        clearTimeout(errorTimeout.value);
    }
    errorTimeout.value = setTimeout(() => {
        isErrorShown.value = false;
    }, 5000); // Match toast timeout
};

export async function useCustomFetch<T>(
    url: string,
    options?: CustomRequestInit,
    contentType = ContentType.applicationJson,
    responseType = ResponseType.json,
) {
    const {apiBase} = useRuntimeConfig().public;
    const newURL = new URL(`${apiBase}${url}`)

    // Handle query parameters
    if (options?.query) {
        const query = new URLSearchParams();
        Object.entries(options.query).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query.append(key, String(value));
            }
        });
        newURL.search = query.toString();
    }

    // Handle request body
    if (options?.json !== undefined && options?.json !== null) {
        options.body = JSON.stringify(options.json);
    }

    let headers = {
        Accept: "application/json",
        "Content-Type": contentType,
        'X-CSRFToken': useCookie('csrftoken').value
    };

    // When uploading a file, the content type should be removed
    // Response should be json and data should be sent as formData
    if (contentType === ContentType.applicationMultipartFormData) {
        delete headers["Content-Type"];
    }

    if (options?.headers) {
        headers = {
            ...headers,
            ...options.headers,
        };
    }

    try {
        const resp = await fetch(newURL, {
            ...options,
            headers,
            credentials: "include",
        })
        if (resp.status === 204) return resp.statusText as T

        if (!resp.ok) {
            let errorDetail: string;
            try {
                const errorData = await resp.json();
                errorDetail = errorData.detail || resp.statusText;
            } catch (e) {
                errorDetail = resp.statusText;
            }

            // Format error message for useHandleError
            const errorMessage = JSON.stringify({
                code: resp.status,
                detail: errorDetail
            });

            // Only show error if no error is currently shown
            if (!isErrorShown.value) {
                isErrorShown.value = true;
                useHandleError(errorMessage);
                resetErrorState();
            }

            throw new Error(errorMessage);
        }

        // Handle successful response based on responseType
        if (responseType === ResponseType.json) {
            return await resp.json();
        } else if (responseType === ResponseType.blob) {
            return await resp.blob() as T;
        } else if (responseType === ResponseType.text) {
            return await resp.text() as T;
        }

        return await resp.json()

    } catch (error) {
        // Handle network errors
        if (error instanceof Error) {
            try {
                // Check if the error is already formatted
                JSON.parse(error.message);
                if (!isErrorShown.value) {
                    isErrorShown.value = true;
                    useHandleError(error.message);
                    resetErrorState();
                }
                throw error;
            } catch (e) {
                // If error is not formatted, create a new formatted error
                if (!isErrorShown.value) {
                    const formattedError = JSON.stringify({
                        code: 500,
                        detail: error.message || 'Network error occurred'
                    });
                    isErrorShown.value = true;
                    useHandleError(formattedError);
                    resetErrorState();
                    throw new Error(formattedError);
                }
            }
        }

        // Handle unknown errors
        if (!isErrorShown.value) {
            const unknownError = JSON.stringify({
                code: 500,
                detail: 'An unexpected error occurred'
            });
            isErrorShown.value = true;
            useHandleError(unknownError);
            resetErrorState();
            throw new Error(unknownError);
        }

        throw error;
    }
}