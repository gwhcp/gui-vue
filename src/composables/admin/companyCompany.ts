import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminCompanyCompanyInterface {
    createCompany: (values: Record<string, unknown>) => Promise<void>;
    deleteCompany: (values: {
        id: string;
    }) => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    localCompanyCompany: {
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminCompanyCompany = (): UseAdminCompanyCompanyInterface => {
    const { loadingState } = usePageLoading();

    const createCompany = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/company/company/create',
            values
        );

        if (response.error) {
            localCompanyCompany.formErrors = response.errors;
        } else {
            localCompanyCompany.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteCompany = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/company/company/delete/${values.id}`
        );

        if (response.error) {
            localCompanyCompany.formErrors = response.errors;
        } else {
            localCompanyCompany.formArr = localCompanyCompany.formArr.filter(item => item['id'] !== values.id);

            localCompanyCompany.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localCompanyCompany.formObj = await client.get(
            `admin/company/company/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localCompanyCompany.formArr = await client.get(
            'admin/company/company/search'
        );

        loadingState.isActive = false;
    };

    const localCompanyCompany = reactive({
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false
    });

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/company/company/profile/${id}`,
            values
        );

        if (response.error) {
            localCompanyCompany.formErrors = response.errors;
        } else {
            localCompanyCompany.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        createCompany,
        deleteCompany,
        getProfile,
        getSearch,
        localCompanyCompany,
        updateProfile
    };
};