import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminSettingBannedInterface {
    createBanned: (values: Record<string, unknown>) => Promise<void>;
    deleteBanned: (values: {
        id: string;
    }) => Promise<void>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    localSettingBanned: {
        choices: Record<string, unknown>;
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
}

export const useAdminSettingBanned = (): UseAdminSettingBannedInterface => {
    const { loadingState } = usePageLoading();

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
        formObj: {},
        formSuccess: false
    });

    return {
        createBanned,
        deleteBanned,
        getChoices,
        getProfile,
        getSearch,
        localSettingBanned
    };
};