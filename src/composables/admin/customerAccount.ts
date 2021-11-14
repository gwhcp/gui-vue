import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminCustomerAccountInterface {
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        address: string;
        city: string;
        company: null | number;
        country: string;
        date_from: string;
        email: string;
        first_name: string;
        id: number;
        is_active: boolean;
        last_login: null | string;
        last_name: string;
        primary_phone: string;
        secondary_phone: null | string;
        state: string;
        zipcode: string;
    }>;
    formSuccess: ComputedRef<boolean>;
    getAccessLog: (id: string) => Promise<void>;
    getAccounts: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminCustomerAccount = (): UseAdminCustomerAccountInterface => {
    const { loadingState } = usePageLoading();

    const formArr = computed(() => {
        return localCustomerAccount.formArr;
    });

    const formErrors = computed(() => {
        return localCustomerAccount.formErrors;
    });

    const formObj = computed(() => {
        return localCustomerAccount.formObj;
    });

    const formSuccess = computed(() => {
        return localCustomerAccount.formSuccess;
    });

    const getAccessLog = async (id: string) => {
        loadingState.isActive = true;

        localCustomerAccount.formArr = await client.get(
            `admin/customer/account/accesslog/${id}`
        );

        loadingState.isActive = false;
    };

    const getAccounts = async () => {
        loadingState.isActive = true;

        localCustomerAccount.formArr = await client.get(
            'admin/customer/account/search'
        );

        loadingState.isActive = false;
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localCustomerAccount.formObj = await client.get(
            `admin/customer/account/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const localCustomerAccount = reactive({
        formArr: [],
        formErrors: {},
        formObj: {
            address: '',
            city: '',
            comment_order: '',
            company: null,
            country: '',
            date_from: '',
            email: '',
            first_name: '',
            id: 0,
            is_active: false,
            is_staff: false,
            last_login: null,
            last_name: '',
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

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/customer/account/profile/${id}`,
            values
        );

        if (response.error) {
            localCustomerAccount.formErrors = response.errors;
        } else {
            localCustomerAccount.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getAccessLog,
        getAccounts,
        getProfile,
        updateProfile
    };
};