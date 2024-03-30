import {ref} from 'vue'

const isRefresh = ref(false);

export function useRefreshData() {
    return {
        isRefresh,
    }
}