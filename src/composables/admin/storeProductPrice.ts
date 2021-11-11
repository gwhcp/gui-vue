import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminStoreProductPriceInterface {
    createPrice: (values: Record<string, unknown>) => Promise<void>;
    deletePrice: (values: {
        id: string;
        productId: string;
    }) => Promise<void>;
    getProfile: (id: string, productId: string) => Promise<void>;
    getSearch: (id: string) => Promise<void>;
    localStoreProductPrice: {
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
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
        formObj: {},
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
        getProfile,
        getSearch,
        localStoreProductPrice,
        updateProfile
    };
};