import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseClientBillingInterface {
    createBillingProfile: (values: Record<string, unknown>) => Promise<void>;
    deleteBillingProfile: (values: {
        id: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        address: string;
        city: string;
        country: string;
        credit_card_cvv2: number;
        credit_card_month: number;
        credit_card_name: string;
        credit_card_number: number;
        credit_card_year: number;
        date_from: string;
        id: number;
        items: string[];
        name: string;
        order: {
            id: number;
        };
        primary_phone: string;
        state: string;
        store_product: {
            name: string;
        };
        zipcode: string;
    }>;
    formSuccess: ComputedRef<boolean>;
    getProfile: (id: string) => Promise<void>;
    getProfileInvoice: (id: string, invoiceId: string) => Promise<void>;
    getSearch: () => Promise<void>;
    getSearchInvoice: (id: string) => Promise<void>;
    nonFieldFormError: ComputedRef<boolean>;
    nonFieldFormMessage: ComputedRef<string>;
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

    const formArr = computed(() => {
        return localClientBilling.formArr;
    });

    const formErrors = computed(() => {
        return localClientBilling.formErrors;
    });

    const formObj = computed(() => {
        return localClientBilling.formObj;
    });

    const formSuccess = computed(() => {
        return localClientBilling.formSuccess;
    });

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
        formObj: {
            address: '',
            city: '',
            country: '',
            credit_card_cvv2: 0,
            credit_card_month: 0,
            credit_card_name: '',
            credit_card_number: 0,
            credit_card_year: 0,
            date_from: '',
            id: 0,
            items: [],
            name: '',
            order: {
                id: 0
            },
            primary_phone: '',
            state: '',
            store_product: {
                name: ''
            },
            zipcode: ''
        },
        formSuccess: false,
        nonFieldFormError: false,
        nonFieldFormMessage: ''
    });

    const nonFieldFormError = computed(() => {
        return localClientBilling.nonFieldFormError;
    });

    const nonFieldFormMessage = computed(() => {
        return localClientBilling.nonFieldFormMessage;
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
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getProfile,
        getProfileInvoice,
        getSearch,
        getSearchInvoice,
        nonFieldFormError,
        nonFieldFormMessage,
        updateProfile
    };
};