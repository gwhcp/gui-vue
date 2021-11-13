import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseClientStoreInterface {
    createOrder: (values: Record<string, unknown>) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        billing_profile: number;
        domain: boolean;
        mail: boolean;
        mysql: boolean;
        postgresql: boolean;
        store_product_price: number;
    }>;
    formSuccess: ComputedRef<boolean>;
    getProductDomain: () => Promise<void>;
    getProductPrices: (productId: string) => Promise<void>;
    getProductTypes: () => Promise<void>;
    nonFieldFormError: ComputedRef<boolean>;
    nonFieldFormMessage: ComputedRef<string>;
}

export const useClientStore = (): UseClientStoreInterface => {
    const { loadingState } = usePageLoading();

    const createOrder = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'client/store/create',
            values
        );

        localClientStore.nonFieldFormError = false;

        if (response.error) {
            if ('non_field_errors' in response.errors) {
                localClientStore.nonFieldFormError = true;
                localClientStore.nonFieldFormMessage = response.errors['non_field_errors'];
            }

            localClientStore.formErrors = response.errors;
        } else {
            localClientStore.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const formArr = computed(() => {
        return localClientStore.formArr;
    });

    const formErrors = computed(() => {
        return localClientStore.formErrors;
    });

    const formObj = computed(() => {
        return localClientStore.formObj;
    });

    const formSuccess = computed(() => {
        return localClientStore.formSuccess;
    });

    const getProductDomain = async () => {
        loadingState.isActive = true;

        localClientStore.formArr = await client.get(
            'client/store/search/product/domain'
        );

        loadingState.isActive = false;
    };

    const getProductPrices = async (productId: string) => {
        loadingState.isActive = true;

        localClientStore.formArr = await client.get(
            `client/store/search/prices/${productId}`
        );

        loadingState.isActive = false;
    };

    const getProductTypes = async () => {
        loadingState.isActive = true;

        localClientStore.formObj = await client.get(
            'client/store/search/types'
        );

        loadingState.isActive = false;
    };

    const localClientStore = reactive({
        formArr: [],
        formErrors: {},
        formObj: {
            billing_profile: 0,
            domain: false,
            mail: false,
            mysql: false,
            postgresql: false,
            store_product_price: 0,
        },
        formSuccess: false,
        nonFieldFormError: false,
        nonFieldFormMessage: ''
    });

    const nonFieldFormError = computed(() => {
        return localClientStore.nonFieldFormError;
    });

    const nonFieldFormMessage = computed(() => {
        return localClientStore.nonFieldFormMessage;
    });

    return {
        createOrder,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getProductDomain,
        getProductPrices,
        getProductTypes,
        nonFieldFormError,
        nonFieldFormMessage
    };
};