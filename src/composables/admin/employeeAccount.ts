import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminEmployeeAccountInterface {
    getAccessLog: () => Promise<void>;
    getChoices: () => Promise<void>;
    getProfile: () => Promise<void>;
    localEmployeeAccount: {
        choices: Record<string, unknown>;
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
    updatePassword: (values: Record<string, unknown>) => Promise<void>;
    updateProfile: (values: Record<string, unknown>) => Promise<void>;
}

export const useAdminEmployeeAccount = (): UseAdminEmployeeAccountInterface => {
    const { loadingState } = usePageLoading();

    const getAccessLog = async () => {
        loadingState.isActive = true;

        localEmployeeAccount.formArr = await client.get(
            'admin/employee/account/accesslog'
        );

        loadingState.isActive = false;
    };

    const getChoices = async () => {
        localEmployeeAccount.choices = await client.get(
            'admin/employee/account/choices'
        );
    };

    const getProfile = async () => {
        loadingState.isActive = true;

        localEmployeeAccount.formObj = await client.get(
            'admin/employee/account/profile'
        );

        loadingState.isActive = false;
    };

    const localEmployeeAccount = reactive({
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false
    });

    const updatePassword = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            'admin/employee/account/password',
            values
        );

        if (response.error) {
            localEmployeeAccount.formErrors = response.errors;
        } else {
            localEmployeeAccount.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const updateProfile = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            'admin/employee/account/profile',
            values
        );

        if (response.error) {
            localEmployeeAccount.formErrors = response.errors;
        } else {
            localEmployeeAccount.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        getAccessLog,
        getChoices,
        getProfile,
        localEmployeeAccount,
        updatePassword,
        updateProfile
    };
};