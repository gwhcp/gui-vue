import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminHardwareClientInterface {
    choices: ComputedRef<{
        domain: Record<string, string>;
        hardware_target: Record<string, string>;
        hardware_type: Record<string, string>;
        web: Record<string, string>;
    }>;
    createHardware: (values: Record<string, unknown>) => Promise<void>;
    deleteHardware: (values: {
        id: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        account_id: number;
        company: number;
        company_id: number;
        company_name: string;
        date_from: string;
        domain: string;
        domain_name: string;
        domain_id: number;
        hardware_type: string;
        hardware_type_name: string;
        id: number;
        in_queue: boolean;
        ip: string;
        ipaddress: string;
        ipaddress_pool_id: number;
        is_active: boolean;
        is_admin: boolean;
        is_bind: boolean;
        is_cp: boolean;
        is_domain: boolean;
        is_installed: boolean;
        is_mail: boolean;
        is_managed: boolean;
        is_mysql: boolean;
        is_postgresql: boolean;
        is_store: boolean;
        is_unmanaged: boolean;
        is_xmpp: boolean;
        server_type: string;
        target_type: string;
        web_type: string;
        web_type_name: string;
    }>;
    formSuccess: ComputedRef<boolean>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    installHardware: (id: string) => Promise<void>;
    installSuccess: ComputedRef<boolean>;
    installWarning: ComputedRef<boolean>;
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminHardwareClient = (): UseAdminHardwareClientInterface => {
    const { loadingState } = usePageLoading();

    const choices = computed(() => {
        return localHardwareClient.choices;
    });

    const createHardware = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/hardware/client/create',
            values
        );

        if (response.error) {
            localHardwareClient.formErrors = response.errors;
        } else {
            localHardwareClient.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteHardware = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/hardware/client/delete/${values.id}`
        );

        if (response.error) {
            localHardwareClient.formErrors = response.errors;
        } else {
            localHardwareClient.formArr = localHardwareClient.formArr.filter(item => item['id'] !== values.id);

            localHardwareClient.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const formArr = computed(() => {
        return localHardwareClient.formArr;
    });

    const formErrors = computed(() => {
        return localHardwareClient.formErrors;
    });

    const formObj = computed(() => {
        return localHardwareClient.formObj;
    });

    const formSuccess = computed(() => {
        return localHardwareClient.formSuccess;
    });

    const getChoices = async () => {
        localHardwareClient.choices = await client.get(
            'admin/hardware/client/choices'
        );
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localHardwareClient.formObj = await client.get(
            `admin/hardware/client/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localHardwareClient.formArr = await client.get(
            'admin/hardware/client/search'
        );

        loadingState.isActive = false;
    };

    const installHardware = async (id: string) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/hardware/client/install/${id}`,
            {
                'in_queue': true, // TODO move this to a model
                'is_installed': true
            }
        );

        if (response.error) {
            localHardwareClient.installSuccess = false;
            localHardwareClient.installWarning = true;
        } else {
            localHardwareClient.installSuccess = true;
            localHardwareClient.installWarning = false;
        }

        loadingState.isActive = false;
    };

    const installSuccess = computed(() => {
        return localHardwareClient.installSuccess;
    });

    const installWarning = computed(() => {
        return localHardwareClient.installWarning;
    });

    const localHardwareClient = reactive({
        choices: {
            domain: {},
            hardware_target: {},
            hardware_type: {},
            web: {}
        },
        formArr: [],
        formErrors: {},
        formObj: {
            account_id: 0,
            company: 0,
            company_id: 0,
            company_name: '',
            date_from: '',
            domain: '',
            domain_name: '',
            domain_id: 0,
            hardware_type: '',
            hardware_type_name: '',
            id: 0,
            in_queue: false,
            ip: '',
            ipaddress: '',
            ipaddress_pool_id: 0,
            is_active: false,
            is_admin: false,
            is_bind: false,
            is_cp: false,
            is_domain: false,
            is_installed: false,
            is_mail: false,
            is_managed: false,
            is_mysql: false,
            is_postgresql: false,
            is_store: false,
            is_unmanaged: false,
            is_xmpp: false,
            server_type: '',
            target_type: '',
            web_type: '',
            web_type_name: ''
        },
        formSuccess: false,
        installSuccess: false,
        installWarning: false
    });

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/hardware/client/profile/${id}`,
            values
        );

        if (response.error) {
            localHardwareClient.formErrors = response.errors;
        } else {
            localHardwareClient.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        choices,
        createHardware,
        deleteHardware,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getChoices,
        getProfile,
        getSearch,
        installHardware,
        installSuccess,
        installWarning,
        updateProfile
    };
};