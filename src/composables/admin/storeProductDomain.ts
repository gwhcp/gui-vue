import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminStoreProductDomainInterface {
    createProduct: (values: Record<string, unknown>) => Promise<void>;
    deleteProduct: (values: {
        id: string;
    }) => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getResource: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    localStoreProductDomain: {
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
    updateResource: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminStoreProductDomain = (): UseAdminStoreProductDomainInterface => {
    const { loadingState } = usePageLoading();

    const createProduct = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/store/product/domain/create',
            values
        );

        if (response.error) {
            localStoreProductDomain.formErrors = response.errors;
        } else {
            localStoreProductDomain.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteProduct = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/store/product/domain/delete/${values.id}`
        );

        if (response.error) {
            localStoreProductDomain.formErrors = response.errors;
        } else {
            localStoreProductDomain.formArr = localStoreProductDomain.formArr.filter(item => item['id'] !== values.id);

            localStoreProductDomain.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localStoreProductDomain.formObj = await client.get(
            `admin/store/product/domain/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getResource = async (id: string) => {
        loadingState.isActive = true;

        localStoreProductDomain.formObj = await client.get(
            `admin/store/product/domain/resource/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localStoreProductDomain.formArr = await client.get(
            'admin/store/product/domain/search'
        );

        loadingState.isActive = false;
    };

    const localStoreProductDomain = reactive({
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false
    });

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/store/product/domain/profile/${id}`,
            values
        );

        if (response.error) {
            localStoreProductDomain.formErrors = response.errors;
        } else {
            localStoreProductDomain.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const updateResource = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/store/product/domain/resource/${id}`,
            values
        );

        if (response.error) {
            localStoreProductDomain.formErrors = response.errors;
        } else {
            localStoreProductDomain.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        localStoreProductDomain,
        createProduct,
        deleteProduct,
        getProfile,
        getResource,
        getSearch,
        updateProfile,
        updateResource
    };
};