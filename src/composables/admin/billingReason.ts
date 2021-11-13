import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminBillingReasonInterface {
    choices: ComputedRef<Record<string, string>>;
    createReason: (values: Record<string, unknown>) => Promise<void>;
    deleteReason: (values: {
        id: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        date_from: string;
        id: number;
        is_active: boolean;
        name: string;
        reason_type: string;
        reason_type_name: string;
    }>;
    formSuccess: ComputedRef<boolean>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
}

export const useAdminBillingReason = (): UseAdminBillingReasonInterface => {
    const { loadingState } = usePageLoading();

    const choices = computed(() => {
        return localBillingReason.choices;
    });

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

    const formArr = computed(() => {
        return localBillingReason.formArr;
    });

    const formErrors = computed(() => {
        return localBillingReason.formErrors;
    });

    const formObj = computed(() => {
        return localBillingReason.formObj;
    });

    const formSuccess = computed(() => {
        return localBillingReason.formSuccess;
    });

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
        formObj: {
            date_from: '',
            id: 0,
            is_active: false,
            name: '',
            reason_type: '',
            reason_type_name: ''
        },
        formSuccess: false
    });

    return {
        choices,
        createReason,
        deleteReason,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getChoices,
        getProfile,
        getSearch
    };
};