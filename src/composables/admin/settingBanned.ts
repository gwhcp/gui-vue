import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminSettingBannedInterface {
    choices: ComputedRef<Record<string, string>>;
    createBanned: (values: Record<string, unknown>) => Promise<void>;
    deleteBanned: (values: {
        id: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        banned_type: string;
        banned_type_name: string;
        date_from: string;
        id: number;
        name: string;
        status: string;
    }>;
    formSuccess: ComputedRef<boolean>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
}

export const useAdminSettingBanned = (): UseAdminSettingBannedInterface => {
    const { loadingState } = usePageLoading();

    const choices = computed(() => {
        return localSettingBanned.choices;
    });

    const createBanned = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/setting/banned/create',
            values
        );

        if (response.error) {
            localSettingBanned.formErrors = response.errors;
        } else {
            localSettingBanned.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteBanned = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/setting/banned/delete/${values.id}`
        );

        if (response.error) {
            localSettingBanned.formErrors = response.errors;
        } else {
            localSettingBanned.formArr = localSettingBanned.formArr.filter(item => item['id'] !== values.id);

            localSettingBanned.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const formArr = computed(() => {
        return localSettingBanned.formArr;
    });

    const formErrors = computed(() => {
        return localSettingBanned.formErrors;
    });

    const formObj = computed(() => {
        return localSettingBanned.formObj;
    });

    const formSuccess = computed(() => {
        return localSettingBanned.formSuccess;
    });

    const getChoices = async () => {
        localSettingBanned.choices = await client.get(
            'admin/setting/banned/choices'
        );
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localSettingBanned.formObj = await client.get(
            `admin/setting/banned/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localSettingBanned.formArr = await client.get(
            'admin/setting/banned/search'
        );

        loadingState.isActive = false;
    };

    const localSettingBanned = reactive({
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {
            banned_type: '',
            banned_type_name: '',
            date_from: '',
            id: 0,
            name: '',
            status: ''
        },
        formSuccess: false
    });

    return {
        choices,
        createBanned,
        deleteBanned,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getChoices,
        getProfile,
        getSearch
    };
};