import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminCompanyCompanyInterface {
    createCompany: (values: Record<string, unknown>) => Promise<void>;
    deleteCompany: (values: {
        id: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        address: string;
        city: string;
        country: string;
        date_from: string;
        id: number;
        name: string;
        primary_phone: string;
        secondary_phone: null | string;
        state: string;
        zipcode: string;
    }>;
    formSuccess: ComputedRef<boolean>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
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

    const formArr = computed(() => {
        return localCompanyCompany.formArr;
    });

    const formErrors = computed(() => {
        return localCompanyCompany.formErrors;
    });

    const formObj = computed(() => {
        return localCompanyCompany.formObj;
    });

    const formSuccess = computed(() => {
        return localCompanyCompany.formSuccess;
    });

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
        formObj: {
            address: '',
            city: '',
            country: '',
            date_from: '',
            id: 0,
            name: '',
            primary_phone: '',
            secondary_phone: null,
            state: '',
            zipcode: ''
        },
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
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getProfile,
        getSearch,
        updateProfile
    };
};