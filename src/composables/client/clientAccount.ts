import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseClientAccountInterface {
    choices: ComputedRef<{
        comment: Record<string, string>;
        timeformat: Record<string, string>;
        timezone: Record<string, string>;
    }>;
    createAccount: (values: Record<string, unknown>) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        address: string;
        city: string;
        comment_order: string;
        confirmed_password: string;
        country: string;
        date_from: string;
        email: string;
        first_name: string;
        id: number;
        last_name: string;
        old_password: string;
        password: string;
        primary_phone: string;
        secondary_phone: null | string;
        state: string;
        time_format: number;
        time_zone: string;
        zipcode: string;
    }>;
    formSuccess: ComputedRef<boolean>;
    getAccessLog: () => Promise<void>;
    getChoices: () => Promise<void>;
    getProfile: () => Promise<void>;
    updatePassword: (values: Record<string, unknown>) => Promise<void>;
    updateProfile: (values: Record<string, unknown>) => Promise<void>;
}

export const useClientAccount = (): UseClientAccountInterface => {
    const { loadingState } = usePageLoading();

    const choices = computed(() => {
        return localClientAccount.choices;
    });

    const createAccount = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
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

    const formArr = computed(() => {
        return localClientAccount.formArr;
    });

    const formErrors = computed(() => {
        return localClientAccount.formErrors;
    });

    const formObj = computed(() => {
        return localClientAccount.formObj;
    });

    const formSuccess = computed(() => {
        return localClientAccount.formSuccess;
    });

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

    const localClientAccount = reactive({
        choices: {
            comment: {},
            timeformat: {},
            timezone: {}
        },
        formArr: [],
        formErrors: {},
        formObj: {
            address: '',
            city: '',
            comment_order: '',
            confirmed_password: '',
            country: '',
            date_from: '',
            email: '',
            first_name: '',
            id: 0,
            last_name: '',
            old_password: '',
            password: '',
            primary_phone: '',
            secondary_phone: null,
            state: '',
            time_format: 12,
            time_zone: '',
            zipcode: ''
        },
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
        choices,
        createAccount,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getAccessLog,
        getChoices,
        getProfile,
        updatePassword,
        updateProfile
    };
};