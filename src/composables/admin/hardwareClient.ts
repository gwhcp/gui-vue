import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminHardwareClientInterface {
    createHardware: (values: Record<string, unknown>) => Promise<void>;
    deleteHardware: (values: {
        id: string;
    }) => Promise<void>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    installHardware: (id: string) => Promise<void>;
    localHardwareClient: {
        choices: Record<string, unknown>;
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
        installSuccess: boolean;
        installWarning: boolean;
    };
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminHardwareClient = (): UseAdminHardwareClientInterface => {
    const { loadingState } = usePageLoading();

    const createHardware = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/hardware/client/create',
            values
        );

        if (response.error) {
            localHardwareClient.formErrors = response.errors;
        } else {
            localHardwareClient.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteHardware = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/hardware/client/delete/${values.id}`
        );

        if (response.error) {
            localHardwareClient.formErrors = response.errors;
        } else {
            localHardwareClient.formArr = localHardwareClient.formArr.filter(item => item['id'] !== values.id);

            localHardwareClient.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const getChoices = async () => {
        localHardwareClient.choices = await client.get(
            'admin/hardware/client/choices'
        );
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localHardwareClient.formObj = await client.get(
            `admin/hardware/client/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localHardwareClient.formArr = await client.get(
            'admin/hardware/client/search'
        );

        loadingState.isActive = false;
    };

    const installHardware = async (id: string) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/hardware/client/install/${id}`,
            {
                'in_queue': true, // TODO move this to a model
                'is_installed': true
            }
        );

        if (response.error) {
            localHardwareClient.installSuccess = false;
            localHardwareClient.installWarning = true;
        } else {
            localHardwareClient.installSuccess = true;
            localHardwareClient.installWarning = false;
        }

        loadingState.isActive = false;
    };

    const localHardwareClient = reactive({
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false,
        installSuccess: false,
        installWarning: false
    });

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/hardware/client/profile/${id}`,
            values
        );

        if (response.error) {
            localHardwareClient.formErrors = response.errors;
        } else {
            localHardwareClient.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        createHardware,
        deleteHardware,
        getChoices,
        getProfile,
        getSearch,
        installHardware,
        localHardwareClient,
        updateProfile
    };
};