import {ContentType} from "~/enums/content-type.enum";
import {ResponseType} from "~/enums/response-type.enum";
import {useHandleError} from "~/composables/useHandleError";

interface CustomRequestInit extends RequestInit {
    query?: Record<string, any>;
    json?: RequestInit["body"] | Record<string, any>;
}

export async function useCustomFetch<T>(
    url: string,
    options?: CustomRequestInit,
    contentType = ContentType.applicationJson,
    responseType = ResponseType.json,
) {

    const {apiBase} = useRuntimeConfig().public;

    const newURL = new URL(`${apiBase}${url}`)

    const query = new URLSearchParams({
        ...(options?.query !== undefined && options.query)
    })

    newURL.search = query.toString();
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

    const resp = await fetch(newURL, {
        ...options,
        headers,
        credentials: "include",
    })

    if (!resp.ok) {
        const errorDetails = await resp.json();
        useHandleError(JSON.stringify({code: resp.status, detail: errorDetails.detail}))
        throw new Error(JSON.stringify({code: resp.status, detail: errorDetails.detail}));

    }
    if (resp.ok && resp.statusText === "No Content") {
        return resp.statusText
    }
    if (resp.ok && resp.status === 204 || resp.ok && resp.status === 202) {
        try {
            return resp.json()
        } catch (e) {
            return resp.statusText
        }
    }

    return resp.json()

}