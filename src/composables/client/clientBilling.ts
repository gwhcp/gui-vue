import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseClientBillingInterface {
    createBillingProfile: (values: Record<string, unknown>) => Promise<void>;
    deleteBillingProfile: (values: {
        id: string;
    }) => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getProfileInvoice: (id: string, invoiceId: string) => Promise<void>;
    getSearch: () => Promise<void>;
    getSearchInvoice: (id: string) => Promise<void>;
    localClientBilling: {
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
        nonFieldFormError: boolean;
        nonFieldFormMessage: string;
    };
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useClientBilling = (): UseClientBillingInterface => {
    const { loadingState } = usePageLoading();

    const createBillingProfile = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'client/billing/create',
            values
        );

        localClientBilling.nonFieldFormError = false;

        if (response.error) {
            if ('non_field_errors' in response.errors) {
                localClientBilling.nonFieldFormError = true;
                localClientBilling.nonFieldFormMessage = response.errors['non_field_errors'];
            }

            localClientBilling.formErrors = response.errors;
        } else {
            localClientBilling.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteBillingProfile = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `client/billing/delete/${values.id}`
        );

        if (response.error) {
            localClientBilling.formErrors = response.errors;
        } else {
            localClientBilling.formArr = localClientBilling.formArr.filter(item => item['id'] !== values.id);

            localClientBilling.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localClientBilling.formObj = await client.get(
            `client/billing/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getProfileInvoice = async (id: string, invoiceId: string) => {
        loadingState.isActive = true;

        localClientBilling.formObj = await client.get(
            `client/billing/profile/invoice/${id}/${invoiceId}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localClientBilling.formArr = await client.get(
            'client/billing/search'
        );

        loadingState.isActive = false;
    };

    const getSearchInvoice = async (id: string) => {
        loadingState.isActive = true;

        localClientBilling.formArr = await client.get(
            `client/billing/search/invoice/${id}`
        );

        loadingState.isActive = false;
    };

    const localClientBilling = reactive({
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false,
        nonFieldFormError: false,
        nonFieldFormMessage: ''
    });

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `client/billing/profile/${id}`,
            values
        );

        if (response.error) {
            if ('non_field_errors' in response.errors) {
                localClientBilling.nonFieldFormError = true;

                localClientBilling.nonFieldFormMessage = response.errors['non_field_errors']
            } else {
                localClientBilling.formErrors = response.errors;
            }
        } else {
            localClientBilling.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        createBillingProfile,
        deleteBillingProfile,
        getProfile,
        getProfileInvoice,
        getSearch,
        getSearchInvoice,
        localClientBilling,
        updateProfile
    };
};