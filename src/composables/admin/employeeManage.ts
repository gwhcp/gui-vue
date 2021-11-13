import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminEmployeeManageInterface {
    createAccount: (values: Record<string, unknown>) => Promise<void>;
    deleteAccount: (values: {
        id: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        address: string;
        city: string;
        comment_order: string;
        company: null | number;
        country: string;
        date_from: string;
        email: string;
        first_name: string;
        id: number;
        is_active: boolean;
        is_staff: boolean;
        last_login: null | string;
        last_name: string;
        password: string;
        primary_phone: string;
        secondary_phone: null | string;
        state: string;
        time_format: number;
        time_zone: string;
        zipcode: string;
    }>;
    formSuccess: ComputedRef<boolean>;
    getAccessLog: (id: string) => Promise<void>;
    getAccounts: () => Promise<void>;
    getPermissionsBase: () => Promise<void>;
    getPermissionsUser: (id: string) => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    permissionsBase: ComputedRef<string[]>;
    permissionsUser: ComputedRef<string[]>;
    updatePermissions: (id: string, values: string[]) => Promise<void>;
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminEmployeeManage = (): UseAdminEmployeeManageInterface => {
    const { loadingState } = usePageLoading();

    const createAccount = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/employee/manage/create',
            values
        );

        if (response.error) {
            localEmployeeManage.formErrors = response.errors;
        } else {
            localEmployeeManage.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteAccount = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/employee/manage/delete/${values.id}`
        );

        if (response.error) {
            localEmployeeManage.formErrors = response.errors;
        } else {
            localEmployeeManage.formArr = localEmployeeManage.formArr.filter(item => item['id'] !== values.id);

            localEmployeeManage.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const formArr = computed(() => {
        return localEmployeeManage.formArr;
    });

    const formErrors = computed(() => {
        return localEmployeeManage.formErrors;
    });

    const formObj = computed(() => {
        return localEmployeeManage.formObj;
    });

    const formSuccess = computed(() => {
        return localEmployeeManage.formSuccess;
    });

    const getAccessLog = async (id: string) => {
        loadingState.isActive = true;

        localEmployeeManage.formArr = await client.get(
            `admin/employee/manage/accesslog/${id}`
        );

        loadingState.isActive = false;
    };

    const getAccounts = async () => {
        loadingState.isActive = true;

        localEmployeeManage.formArr = await client.get(
            'admin/employee/manage/search'
        );

        loadingState.isActive = false;
    };

    const getPermissionsBase = async () => {
        loadingState.isActive = true;

        const response = await client.get(
            'admin/employee/manage/permission/base'
        );

        const perms: any = [];

        for (const base of response) {
            perms.push({
                value: base['id'],
                label: base['name']
            })
        }

        localEmployeeManage.permissionsBase = perms;

        loadingState.isActive = false;
    };

    const getPermissionsUser = async (id: string) => {
        loadingState.isActive = true;

        const userPermissions = await client.get(
            `admin/employee/manage/permission/${id}`
        );

        localEmployeeManage.permissionsUser = userPermissions.user_permissions;

        loadingState.isActive = false;
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localEmployeeManage.formObj = await client.get(
            `admin/employee/manage/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const localEmployeeManage = reactive({
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
        formSuccess: false,
        permissionsBase: [],
        permissionsUser: []
    });

    const permissionsBase = computed(() => {
        return localEmployeeManage.permissionsBase;
    });

    const permissionsUser = computed(() => {
        return localEmployeeManage.permissionsUser;
    });

    const updatePermissions = async (id: string, values: string[]) => {
        loadingState.isActive = true;

        const perms: string[] = [];

        values.forEach((val: string) => {
            perms.push(val['value']);
        });

        const response = await client.patch(
            `admin/employee/manage/permission/${id}`,
            {
                'user_permissions': perms
            }
        );

        if (response.error) {
            localEmployeeManage.formErrors = response.errors;
        } else {
            localEmployeeManage.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/employee/manage/profile/${id}`,
            values
        );

        if (response.error) {
            localEmployeeManage.formErrors = response.errors;
        } else {
            localEmployeeManage.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        createAccount,
        deleteAccount,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getAccessLog,
        getAccounts,
        getPermissionsBase,
        getPermissionsUser,
        getProfile,
        permissionsBase,
        permissionsUser,
        updatePermissions,
        updateProfile
    };
};