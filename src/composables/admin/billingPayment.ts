import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminBillingPaymentInterface {
    choices: ComputedRef<{
        company: Record<string, string>;
        merchant: Record<string, string>;
        method: Record<string, string>;
    }>;
    createPaymentGateway: (values: Record<string, unknown>) => Promise<void>;
    deletePaymentGateway: (values: {
        id: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        company: string;
        date_from: string;
        has_amex: boolean;
        has_discover: boolean;
        has_mastercard: boolean;
        has_visa: boolean;
        id: number;
        in_test_mode: boolean;
        is_active: boolean;
        login_id: string;
        merchant: string;
        merchant_name: string;
        payment_gateway_id: number;
        payment_method: string;
        payment_method_name: string;
        transaction_key: string;
        transaction_type: string;
    }>;
    formSuccess: ComputedRef<boolean>;
    getAuthentication: (id: string, merchant: string) => Promise<void>;
    getChoices: () => Promise<void>;
    getMethod: (id: string, merchant: string) => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    nonFieldFormError: ComputedRef<boolean>;
    nonFieldFormMessage: ComputedRef<string>;
    updateAuthentication: (id: string, merchant: string, values: Record<string, unknown>) => Promise<void>;
    updateMethod: (id: string, merchant: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminBillingPayment = (): UseAdminBillingPaymentInterface => {
    const { loadingState } = usePageLoading();

    const choices = computed(() => {
        return localBillingPayment.choices;
    });

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

    const formArr = computed(() => {
        return localBillingPayment.formArr;
    });

    const formErrors = computed(() => {
        return localBillingPayment.formErrors;
    });

    const formObj = computed(() => {
        return localBillingPayment.formObj;
    });

    const formSuccess = computed(() => {
        return localBillingPayment.formSuccess;
    });

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
        choices: {
            company: {},
            merchant: {},
            method: {}
        },
        formArr: [],
        formErrors: {},
        formObj: {
            company: '',
            date_from: '',
            has_amex: false,
            has_discover: false,
            has_mastercard: false,
            has_visa: false,
            id: 0,
            in_test_mode: false,
            is_active: false,
            login_id: '',
            merchant: '',
            merchant_name: '',
            payment_gateway_id: 0,
            payment_method: '',
            payment_method_name: '',
            transaction_key: '',
            transaction_type: ''
        },
        formSuccess: false,
        nonFieldFormError: false,
        nonFieldFormMessage: ''
    });

    const nonFieldFormError = computed(() => {
        return localBillingPayment.nonFieldFormError;
    });

    const nonFieldFormMessage = computed(() => {
        return localBillingPayment.nonFieldFormMessage;
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
        choices,
        createPaymentGateway,
        deletePaymentGateway,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getAuthentication,
        getChoices,
        getMethod,
        getProfile,
        getSearch,
        nonFieldFormError,
        nonFieldFormMessage,
        updateAuthentication,
        updateMethod
    };
};