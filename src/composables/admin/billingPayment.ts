import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminBillingPaymentInterface {
    createPaymentGateway: (values: Record<string, unknown>) => Promise<void>;
    deletePaymentGateway: (values: {
        id: string;
    }) => Promise<void>;
    getAuthentication: (id: string, merchant: string) => Promise<void>;
    getChoices: () => Promise<void>;
    getMethod: (id: string, merchant: string) => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    localBillingPayment: {
        choices: Record<string, unknown>;
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
        nonFieldFormError: boolean;
        nonFieldFormMessage: string;
    };
    updateAuthentication: (id: string, merchant: string, values: Record<string, unknown>) => Promise<void>;
    updateMethod: (id: string, merchant: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminBillingPayment = (): UseAdminBillingPaymentInterface => {
    const { loadingState } = usePageLoading();

    const createPaymentGateway = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/billing/payment/create',
            values
        );

        if (response.error) {
            localBillingPayment.formErrors = response.errors;
        } else {
            localBillingPayment.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deletePaymentGateway = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/billing/payment/delete/${values.id}`
        );

        if (response.error) {
            localBillingPayment.formErrors = response.errors;
        } else {
            localBillingPayment.formArr = localBillingPayment.formArr.filter(item => item['id'] !== values.id);

            localBillingPayment.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const getAuthentication = async (id: string, merchant: string) => {
        loadingState.isActive = true;

        localBillingPayment.formObj = await client.get(
            `admin/billing/payment/${merchant}/${id}/authentication`
        );

        loadingState.isActive = false;
    };

    const getChoices = async () => {
        localBillingPayment.choices = await client.get(
            'admin/billing/payment/choices'
        );
    };

    const getMethod = async (id: string, merchant: string) => {
        loadingState.isActive = true;

        localBillingPayment.formObj = await client.get(
            `admin/billing/payment/${merchant}/${id}/method`
        );

        loadingState.isActive = false;
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localBillingPayment.formObj = await client.get(
            `admin/billing/payment/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localBillingPayment.formArr = await client.get(
            'admin/billing/payment/search'
        );

        loadingState.isActive = false;
    };

    const localBillingPayment = reactive({
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false,
        nonFieldFormError: false,
        nonFieldFormMessage: ''
    });

    const updateAuthentication = async (id: string, merchant: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/billing/payment/${merchant}/${id}/authentication`,
            values
        );

        if (response.error) {
            localBillingPayment.formErrors = response.errors;
        } else {
            localBillingPayment.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const updateMethod = async (id: string, merchant: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/billing/payment/${merchant}/${id}/method`,
            values
        );

        if (response.error) {
            if ('non_field_errors' in response.errors) {
                localBillingPayment.nonFieldFormError = true;

                localBillingPayment.nonFieldFormMessage = response.errors['non_field_errors'][0]
            } else {
                localBillingPayment.formErrors = response.errors;
            }
        } else {
            localBillingPayment.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        createPaymentGateway,
        deletePaymentGateway,
        getAuthentication,
        getChoices,
        getMethod,
        getProfile,
        getSearch,
        localBillingPayment,
        updateAuthentication,
        updateMethod
    };
};