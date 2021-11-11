import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminEmployeeXmppInterface {
    getProfile: () => Promise<void>;
    localEmployeeXmpp: {
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
    updateProfile: (values: Record<string, unknown>) => Promise<void>;
}

export const useAdminEmployeeXmpp = (): UseAdminEmployeeXmppInterface => {
    const { loadingState } = usePageLoading();

    const getProfile = async () => {
        loadingState.isActive = true;

        localEmployeeXmpp.formObj = await client.get(
            'admin/employee/xmpp/profile'
        );

        loadingState.isActive = false;
    };

    const localEmployeeXmpp = reactive({
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false
    });

    const updateProfile = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            'admin/employee/xmpp/profile',
            values
        );

        if (response.error) {
            localEmployeeXmpp.formErrors = response.errors;
        } else {
            localEmployeeXmpp.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        getProfile,
        localEmployeeXmpp,
        updateProfile
    };
};