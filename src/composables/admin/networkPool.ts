import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminNetworkPoolInterface {
    choices: ComputedRef<Record<string, string>>;
    createPool: (values: Record<string, unknown>) => Promise<void>;
    deletePool: (values: {
        id: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        assigned: string;
        assigned_name: string;
        broadcast: null | string;
        date_from: string;
        id: number;
        ip_available: number;
        ip_total: number;
        ip_type: number;
        is_active: boolean;
        name: string;
        netmask: null | string;
        network: string;
        subnet: number;
    }>;
    formSuccess: ComputedRef<boolean>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminNetworkPool = (): UseAdminNetworkPoolInterface => {
    const { loadingState } = usePageLoading();

    const choices = computed(() => {
        return localNetworkPool.choices;
    });

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

    const formArr = computed(() => {
        return localNetworkPool.formArr;
    });

    const formErrors = computed(() => {
        return localNetworkPool.formErrors;
    });

    const formObj = computed(() => {
        return localNetworkPool.formObj;
    });

    const formSuccess = computed(() => {
        return localNetworkPool.formSuccess;
    });

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
        formObj: {
            assigned: '',
            assigned_name: '',
            broadcast: null,
            date_from: '',
            id: 0,
            ip_available: 0,
            ip_total: 0,
            ip_type: 0,
            is_active: false,
            name: '',
            netmask: null,
            network: '',
            subnet: 0
        },
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
        choices,
        createPool,
        deletePool,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getChoices,
        getProfile,
        getSearch,
        updateProfile
    };
};