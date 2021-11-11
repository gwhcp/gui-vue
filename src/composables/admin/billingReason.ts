import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminBillingReasonInterface {
    createReason: (values: Record<string, unknown>) => Promise<void>;
    deleteReason: (values: {
        id: string;
    }) => Promise<void>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    localBillingReason: {
        choices: Record<string, unknown>;
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
}

export const useAdminBillingReason = (): UseAdminBillingReasonInterface => {
    const { loadingState } = usePageLoading();

    const createReason = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/billing/reason/create',
            values
        );

        if (response.error) {
            localBillingReason.formErrors = response.errors;
        } else {
            localBillingReason.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteReason = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/billing/reason/delete/${values.id}`
        );

        if (response.error) {
            localBillingReason.formErrors = response.errors;
        } else {
            localBillingReason.formArr = localBillingReason.formArr.filter(item => item['id'] !== values.id);

            localBillingReason.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const getChoices = async () => {
        localBillingReason.choices = await client.get(
            'admin/billing/reason/choices'
        );
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localBillingReason.formObj = await client.get(
            `admin/billing/reason/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localBillingReason.formArr = await client.get(
            'admin/billing/reason/search'
        );

        loadingState.isActive = false;
    };

    const localBillingReason = reactive({
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false
    });

    return {
        createReason,
        deleteReason,
        getChoices,
        getProfile,
        getSearch,
        localBillingReason
    };
};