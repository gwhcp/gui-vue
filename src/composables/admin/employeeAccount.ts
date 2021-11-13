import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminEmployeeAccountInterface {
    choices: ComputedRef<{
        comment: Record<string, string>;
        timeformat: Record<string, string>;
        timezone: Record<string, string>;
    }>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        address: string;
        city: string;
        comment_order: string;
        company: null | number;
        confirmed_password: string;
        country: string;
        date_from: string;
        email: string;
        first_name: string;
        id: number;
        is_active: boolean;
        is_staff: boolean;
        last_login: null | string;
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

export const useAdminEmployeeAccount = (): UseAdminEmployeeAccountInterface => {
    const { loadingState } = usePageLoading();

    const choices = computed(() => {
        return localEmployeeAccount.choices;
    });

    const formArr = computed(() => {
        return localEmployeeAccount.formArr;
    });

    const formErrors = computed(() => {
        return localEmployeeAccount.formErrors;
    });

    const formObj = computed(() => {
        return localEmployeeAccount.formObj;
    });

    const formSuccess = computed(() => {
        return localEmployeeAccount.formSuccess;
    });

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
            company: null,
            confirmed_password: '',
            country: '',
            date_from: '',
            email: '',
            first_name: '',
            id: 0,
            is_active: false,
            is_staff: false,
            last_login: null,
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
        choices,
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