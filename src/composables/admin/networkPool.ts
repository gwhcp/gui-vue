import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminNetworkPoolInterface {
    createPool: (values: Record<string, unknown>) => Promise<void>;
    deletePool: (values: {
        id: string;
    }) => Promise<void>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    localNetworkPool: {
        choices: Record<string, unknown>;
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminNetworkPool = (): UseAdminNetworkPoolInterface => {
    const { loadingState } = usePageLoading();

    const createPool = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/network/pool/create',
            values
        );

        if (response.error) {
            localNetworkPool.formErrors = response.errors;
        } else {
            localNetworkPool.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deletePool = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/network/pool/delete/${values.id}`
        );

        if (response.error) {
            localNetworkPool.formErrors = response.errors;
        } else {
            localNetworkPool.formArr = localNetworkPool.formArr.filter(item => item['id'] !== values.id);

            localNetworkPool.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const getChoices = async () => {
        localNetworkPool.choices = await client.get(
            'admin/network/pool/choices'
        );
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localNetworkPool.formObj = await client.get(
            `admin/network/pool/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localNetworkPool.formArr = await client.get(
            'admin/network/pool/search'
        );

        loadingState.isActive = false;
    };

    const localNetworkPool = reactive({
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false
    });

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/network/pool/profile/${id}`,
            values
        );

        if (response.error) {
            localNetworkPool.formErrors = response.errors;
        } else {
            localNetworkPool.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        createPool,
        deletePool,
        getChoices,
        getProfile,
        getSearch,
        localNetworkPool,
        updateProfile
    };
};