import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminCompanyDomainInterface {
    createDomain: (values: Record<string, unknown>) => Promise<void>;
    deleteDomain: (values: {
        id: string;
    }) => Promise<void>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    localCompanyDomain: {
        choices: Record<string, unknown>;
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
}

export const useAdminCompanyDomain = (): UseAdminCompanyDomainInterface => {
    const { loadingState } = usePageLoading();

    const createDomain = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/company/domain/create',
            values
        );

        if (response.error) {
            localCompanyDomain.formErrors = response.errors;
        } else {
            localCompanyDomain.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteDomain = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/company/domain/delete/${values.id}`
        );

        if (response.error) {
            localCompanyDomain.formErrors = response.errors;
        } else {
            localCompanyDomain.formArr = localCompanyDomain.formArr.filter(item => item['id'] !== values.id);

            localCompanyDomain.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const getChoices = async () => {
        localCompanyDomain.choices = await client.get(
            'admin/company/domain/choices'
        );
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localCompanyDomain.formObj = await client.get(
            `admin/company/domain/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localCompanyDomain.formArr = await client.get(
            'admin/company/domain/search'
        );

        loadingState.isActive = false;
    };

    const localCompanyDomain = reactive({
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false
    });

    return {
        createDomain,
        deleteDomain,
        getChoices,
        getProfile,
        getSearch,
        localCompanyDomain
    };
};