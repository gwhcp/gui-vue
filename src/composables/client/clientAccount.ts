import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";
import { client as createClient, session as createSession } from "@/composables/client/create";

interface UseClientAccountInterface {
    createAccount: (values: Record<string, unknown>) => Promise<void>;
    getAccessLog: () => Promise<void>;
    getChoices: () => Promise<void>;
    getProfile: () => Promise<void>;
    initialize: () => void;
    localClientAccount: {
        choices: Record<string, unknown>;
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
    updatePassword: (values: Record<string, unknown>) => Promise<void>;
    updateProfile: (values: Record<string, unknown>) => Promise<void>;
}

export const useClientAccount = (): UseClientAccountInterface => {
    const { loadingState } = usePageLoading();

    const createAccount = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        initialize();

        const response = await createClient.post(
            'client/account/create',
            values
        );

        if (response.error) {
            localClientAccount.formErrors = response.errors;
        } else {
            localClientAccount.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const getAccessLog = async () => {
        loadingState.isActive = true;

        localClientAccount.formArr = await client.get(
            'client/account/accesslog'
        );

        loadingState.isActive = false;
    };

    const getChoices = async () => {
        localClientAccount.choices = await client.get(
            'client/account/choices'
        );
    };

    const getProfile = async () => {
        loadingState.isActive = true;

        localClientAccount.formObj = await client.get(
            'client/account/profile'
        );

        loadingState.isActive = false;
    };

    const initialize = () => {
        const token = process.env.VUE_APP_API_KEY;

        if (token) {
            createSession.defaults.headers.common['Authorization'] = `Token ${token}`;
        }
    };

    const localClientAccount = reactive({
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false
    });

    const updatePassword = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            'client/account/password',
            values
        );

        if (response.error) {
            localClientAccount.formErrors = response.errors;
        } else {
            localClientAccount.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const updateProfile = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            'client/account/profile',
            values
        );

        if (response.error) {
            localClientAccount.formErrors = response.errors;
        } else {
            localClientAccount.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        createAccount,
        getAccessLog,
        getChoices,
        getProfile,
        initialize,
        localClientAccount,
        updatePassword,
        updateProfile
    };
};