import {createToast} from 'mosha-vue-toastify';

export const useHandleError = (error: string) => {
    const err = JSON.parse(error)
    if (err.code === 403 && err.detail == "Authentication credentials were not provided.") {
        navigateTo('/login');
        createToast(
            {title: 'Unauthorized', description: "Could not verify user."},
            {showIcon: 'true', timeout: 5000, type: 'danger', transition: 'bounce'}
        )
        return
    }

    switch (err.code) {
        case 400:
            createToast(
                {title: 'An Error has occurred!', description: err.detail},
                {showIcon: 'true', timeout: 5000, type: 'danger', transition: 'bounce'}
            )
            break;
        case 404:
            createToast(
                {title: 'Not Found!', description: err.detail},
                {showIcon: 'true', timeout: 5000, type: 'danger', transition: 'bounce'}
            )
            break;
        case 409:
            createToast(
                {title: 'Conflict!', description: err.detail},
                {showIcon: 'true', timeout: 5000, type: 'warning', transition: 'bounce'}
            )
            break;
        case 403:
            createToast(
                {title: 'Forbidden!'},
                {showIcon: 'true', timeout: 5000, type: 'danger', transition: 'bounce'}
            )
            break;
        case 401:
            createToast(
                {title: 'Unauthorized!'},
                {showIcon: 'true', timeout: 5000, type: 'danger', transition: 'bounce'}
            )
            break;
        case 500:
            createToast(
                {title: 'An Error has occurred!'},
                {showIcon: 'true', timeout: 5000, type: 'danger', transition: 'bounce'}
            )
            break;
        default:
            createToast(
                {title: 'An Error has occurred!'},
                {showIcon: 'true', timeout: 5000, type: 'warning', transition: 'bounce'}
            )
            break
    }
}