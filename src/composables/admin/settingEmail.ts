import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminSettingEmailInterface {
    createEmailTemplate: (values: Record<string, unknown>) => Promise<void>;
    deleteEmailTemplate: (values: {
        id: string;
    }) => Promise<void>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    localSettingEmail: {
        choices: Record<string, unknown>;
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminSettingEmail = (): UseAdminSettingEmailInterface => {
    const { loadingState } = usePageLoading();

    const createEmailTemplate = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/setting/email/create',
            values
        );

        if (response.error) {
            localSettingEmail.formErrors = response.errors;
        } else {
            localSettingEmail.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteEmailTemplate = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/setting/email/delete/${values.id}`
        );

        if (response.error) {
            localSettingEmail.formErrors = response.errors;
        } else {
            localSettingEmail.formArr = localSettingEmail.formArr.filter(item => item['id'] !== values.id);

            localSettingEmail.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const getChoices = async () => {
        localSettingEmail.choices = await client.get(
            'admin/setting/email/choices'
        );
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localSettingEmail.formObj = await client.get(
            `admin/setting/email/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localSettingEmail.formArr = await client.get(
            'admin/setting/email/search'
        );

        loadingState.isActive = false;
    };

    const localSettingEmail = reactive({
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false
    });

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/setting/email/profile/${id}`,
            values
        );

        if (response.error) {
            localSettingEmail.formErrors = response.errors;
        } else {
            localSettingEmail.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        createEmailTemplate,
        deleteEmailTemplate,
        getChoices,
        getProfile,
        getSearch,
        localSettingEmail,
        updateProfile
    };
};