import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminNetworkQueueInterface {
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    localNetworkQueue: {
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
    retryQueue: (id: string) => Promise<void>;
}

export const useAdminNetworkQueue = (): UseAdminNetworkQueueInterface => {
    const { loadingState } = usePageLoading();

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        const response = await client.get(
            `admin/network/queue/profile/${id}`
        );

        localNetworkQueue.formArr = response.queue_items;
        localNetworkQueue.formObj = response.queue_status;

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localNetworkQueue.formArr = await client.get(
            'admin/network/queue/search'
        );

        loadingState.isActive = false;
    };

    const localNetworkQueue = reactive({
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false
    });

    const retryQueue = async (id: string) => {
        loadingState.isActive = true;

        const response = await client.patch(
            'admin/network/queue/retry',
            {
                queue_status: id
            }
        );

        if (response.error) {
            localNetworkQueue.formErrors = response.errors;
        } else {
            localNetworkQueue.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        getProfile,
        getSearch,
        localNetworkQueue,
        retryQueue
    };
};