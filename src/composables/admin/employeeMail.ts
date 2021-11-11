import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminEmployeeMailInterface {
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    localEmployeeMail: {
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
    updatePassword: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminEmployeeMail = (): UseAdminEmployeeMailInterface => {
    const { loadingState } = usePageLoading();

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localEmployeeMail.formObj = await client.get(
            `admin/employee/mail/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localEmployeeMail.formArr = await client.get(
            'admin/employee/mail/search'
        );

        loadingState.isActive = false;
    };

    const localEmployeeMail = reactive({
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false
    });

    const updatePassword = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/employee/mail/password/${id}`,
            values
        );

        if (response.error) {
            localEmployeeMail.formErrors = response.errors;
        } else {
            localEmployeeMail.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        getProfile,
        getSearch,
        localEmployeeMail,
        updatePassword
    };
};