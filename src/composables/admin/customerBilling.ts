import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminCustomerBillingInterface {
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

export const useAdminCustomerBilling = (): UseAdminCustomerBillingInterface => {
    const { loadingState } = usePageLoading();

    const formArr = computed(() => {
        return localCustomerBilling.formArr;
    });

    const formErrors = computed(() => {
        return localCustomerBilling.formErrors;
    });

    const formObj = computed(() => {
        return localCustomerBilling.formObj;
    });

    const formSuccess = computed(() => {
        return localCustomerBilling.formSuccess;
    });

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localCustomerBilling.formObj = await client.get(
            `admin/customer/billing/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getProfileInvoice = async (id: string, invoiceId: string) => {
        loadingState.isActive = true;

        localCustomerBilling.formObj = await client.get(
            `admin/customer/billing/profile/invoice/${id}/${invoiceId}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localCustomerBilling.formArr = await client.get(
            'admin/customer/billing/search'
        );

        loadingState.isActive = false;
    };

    const getSearchInvoice = async (id: string) => {
        loadingState.isActive = true;

        localCustomerBilling.formArr = await client.get(
            `admin/customer/billing/search/invoice/${id}`
        );

        loadingState.isActive = false;
    };

    const localCustomerBilling = reactive({
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
        return localCustomerBilling.nonFieldFormError;
    });

    const nonFieldFormMessage = computed(() => {
        return localCustomerBilling.nonFieldFormMessage;
    });

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/customer/billing/profile/${id}`,
            values
        );

        if (response.error) {
            if ('non_field_errors' in response.errors) {
                localCustomerBilling.nonFieldFormError = true;

                localCustomerBilling.nonFieldFormMessage = response.errors['non_field_errors']
            } else {
                localCustomerBilling.formErrors = response.errors;
            }
        } else {
            localCustomerBilling.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
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