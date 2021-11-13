import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminStoreProductPriceInterface {
    createPrice: (values: Record<string, unknown>) => Promise<void>;
    deletePrice: (values: {
        id: string;
        productId: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        base_price: string;
        billing_cycle: number;
        date_from: string;
        id: number;
        is_active: boolean;
        is_hidden: boolean;
        setup_price: string;
        store_product: number;
        store_product_id: number;
    }>;
    formSuccess: ComputedRef<boolean>;
    getProfile: (id: string, productId: string) => Promise<void>;
    getSearch: (id: string) => Promise<void>;
    updateProfile: (id: string, productId: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminStoreProductPrice = (): UseAdminStoreProductPriceInterface => {
    const { loadingState } = usePageLoading();

    const createPrice = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/store/product/price/create',
            values
        );

        if (response.error) {
            localStoreProductPrice.formErrors = response.errors;
        } else {
            localStoreProductPrice.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deletePrice = async (values: {
        id: string;
        productId: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/store/product/price/delete/${values.productId}/${values.id}`
        );

        if (response.error) {
            localStoreProductPrice.formErrors = response.errors;
        } else {
            localStoreProductPrice.formArr = localStoreProductPrice.formArr.filter(item => item['id'] !== values.id);

            localStoreProductPrice.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const formArr = computed(() => {
        return localStoreProductPrice.formArr;
    });

    const formErrors = computed(() => {
        return localStoreProductPrice.formErrors;
    });

    const formObj = computed(() => {
        return localStoreProductPrice.formObj;
    });

    const formSuccess = computed(() => {
        return localStoreProductPrice.formSuccess;
    });

    const getProfile = async (id: string, productId: string) => {
        loadingState.isActive = true;

        localStoreProductPrice.formObj = await client.get(
            `admin/store/product/price/profile/${productId}/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async (id: string) => {
        loadingState.isActive = true;

        localStoreProductPrice.formArr = await client.get(
            `admin/store/product/price/search/${id}`
        );

        loadingState.isActive = false;
    };

    const localStoreProductPrice = reactive({
        formArr: [],
        formErrors: {},
        formObj: {
            base_price: '0.00',
            billing_cycle: 0,
            date_from: '',
            id: 0,
            is_active: false,
            is_hidden: false,
            setup_price: '0.00',
            store_product: 0,
            store_product_id: 0
        },
        formSuccess: false
    });

    const updateProfile = async (id: string, productId: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/store/product/price/profile/${productId}/${id}`,
            values
        );

        if (response.error) {
            localStoreProductPrice.formErrors = response.errors;
        } else {
            localStoreProductPrice.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        createPrice,
        deletePrice,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getProfile,
        getSearch,
        updateProfile
    };
};