import {createToast} from 'mosha-vue-toastify';
import type {User} from "~/types/global";
import {useUserStore} from "~/stores/useUserStore";

export const useHandleError = (error: string) => {
    const err = JSON.parse(error)
    let user: User | null = useUserStore().getUser;
    if (err.code === 403 && err.detail == "Authentication credentials were not provided." && user) {
        navigateTo('/login');
        createToast(
            {title: 'Unauthorized', description: "Could not verify user."},
            {showIcon: 'true', timeout: 5000, type: 'danger', transition: 'bounce'}
        )
        return
    }

    if (err.code === 403 && !user) {
        navigateTo('/login');
        return;
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