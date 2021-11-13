import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminSettingEmailInterface {
    choices: ComputedRef<Record<string, string>>;
    createEmailTemplate: (values: Record<string, unknown>) => Promise<void>;
    deleteEmailTemplate: (values: {
        id: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        body: string;
        date_from: string;
        id: number;
        sender: string;
        subject: string;
        template: string;
        template_name: string;
    }>;
    formSuccess: ComputedRef<boolean>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminSettingEmail = (): UseAdminSettingEmailInterface => {
    const { loadingState } = usePageLoading();

    const choices = computed(() => {
        return localSettingEmail.choices;
    });

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

    const formArr = computed(() => {
        return localSettingEmail.formArr;
    });

    const formErrors = computed(() => {
        return localSettingEmail.formErrors;
    });

    const formObj = computed(() => {
        return localSettingEmail.formObj;
    });

    const formSuccess = computed(() => {
        return localSettingEmail.formSuccess;
    });

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
        formObj: {
            body: '',
            date_from: '',
            id: 0,
            sender: '',
            subject: '',
            template: '',
            template_name: ''
        },
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
        choices,
        createEmailTemplate,
        deleteEmailTemplate,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getChoices,
        getProfile,
        getSearch,
        updateProfile
    };
};