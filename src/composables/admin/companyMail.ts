import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminCompanyMailInterface {
    createMail: (values: Record<string, unknown>) => Promise<void>;
    deleteMail: (values: {
        id: string;
    }) => Promise<void>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    localCompanyMail: {
        choices: Record<string, unknown>;
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
    updatePassword: (id: string, values: Record<string, unknown>) => Promise<void>;
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminCompanyMail = (): UseAdminCompanyMailInterface => {
    const { loadingState } = usePageLoading();

    const createMail = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/company/mail/create',
            values
        );

        if (response.error) {
            localCompanyMail.formErrors = response.errors;
        } else {
            localCompanyMail.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteMail = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/company/mail/delete/${values.id}`
        );

        if (response.error) {
            localCompanyMail.formErrors = response.errors;
        } else {
            localCompanyMail.formArr = localCompanyMail.formArr.filter(item => item['id'] !== values.id);

            localCompanyMail.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const getChoices = async () => {
        localCompanyMail.choices = await client.get(
            'admin/company/mail/choices'
        );
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localCompanyMail.formObj = await client.get(
            `admin/company/mail/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localCompanyMail.formArr = await client.get(
            'admin/company/mail/search'
        );

        loadingState.isActive = false;
    };

    const localCompanyMail = reactive({
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false
    });

    const updatePassword = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/company/mail/password/${id}`,
            values
        );

        if (response.error) {
            localCompanyMail.formErrors = response.errors;
        } else {
            localCompanyMail.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/company/mail/profile/${id}`,
            values
        );

        if (response.error) {
            localCompanyMail.formErrors = response.errors;
        } else {
            localCompanyMail.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        createMail,
        deleteMail,
        getChoices,
        getProfile,
        getSearch,
        localCompanyMail,
        updatePassword,
        updateProfile
    };
};