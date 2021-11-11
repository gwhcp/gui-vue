import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminEmployeeManageInterface {
    createAccount: (values: Record<string, unknown>) => Promise<void>;
    deleteAccount: (values: {
        id: string;
    }) => Promise<void>;
    getAccessLog: (id: string) => Promise<void>;
    getAccounts: () => Promise<void>;
    getPermissionsBase: () => Promise<void>;
    getPermissionsUser: (id: string) => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    localEmployeeManage: {
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
        permissionsBase: string[];
        permissionsUser: string[];
    };
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
        formObj: {},
        formSuccess: false,
        permissionsBase: [],
        permissionsUser: []
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
        getAccessLog,
        getAccounts,
        getPermissionsBase,
        getPermissionsUser,
        getProfile,
        localEmployeeManage,
        updatePermissions,
        updateProfile
    };
};