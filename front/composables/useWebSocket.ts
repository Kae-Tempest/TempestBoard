import {onMounted, onUnmounted, ref} from 'vue';


export function useWebSocket(url: string, callback?: Function) {
    const socket = ref<WebSocket | null>(null);
    const isConnected = ref<Boolean>(false);
    const runtimeConfig = useRuntimeConfig();
    const receivedMessage = ref<String | null>(null);


    const sendMessage = (message: string) => {
        console.log(socket.value)
         if (socket.value && isConnected.value) {
            socket.value.send(message);
        }
    };

    const connectWebSocket = () => {
        socket.value = new WebSocket(`${runtimeConfig.public.wsBase}/${url}`);

        socket.value.onopen = () => {
            isConnected.value = true;
            console.log('WebSocket connected');
        };

        socket.value.onmessage = (event) => {
            if (callback) callback(event.data)
            else receivedMessage.value = event.data;
        };

        socket.value.onclose = () => {
            isConnected.value = false;
            console.log('WebSocket disconnected');
        };

        socket.value.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    };

    const disconnectWebSocket = () => {
        if (socket.value) {
            socket.value.close();
        }
    };

    onMounted(() => {
        connectWebSocket();
    });

    onUnmounted(() => {
        disconnectWebSocket();
    });

    return {
        sendMessage,
        receivedMessage,
        isConnected,
    };
}