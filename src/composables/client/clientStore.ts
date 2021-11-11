import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseClientStoreInterface {
    createOrder: (values: Record<string, unknown>) => Promise<void>;
    getProductDomain: () => Promise<void>;
    getProductPrices: (productId: string) => Promise<void>;
    getProductTypes: () => Promise<void>;
    localClientStore: {
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
        nonFieldFormError: boolean;
        nonFieldFormMessage: string;
    };
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
        formObj: {},
        formSuccess: false,
        nonFieldFormError: false,
        nonFieldFormMessage: ''
    });

    return {
        createOrder,
        getProductDomain,
        getProductPrices,
        getProductTypes,
        localClientStore
    };
};