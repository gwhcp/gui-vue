import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminHardwareCompanyInterface {
    choices: ComputedRef<{
        domain: Record<string, string>;
        hardware_target: Record<string, string>;
    }>;
    createHardware: (values: Record<string, unknown>) => Promise<void>;
    deleteHardware: (values: {
        id: string;
    }) => Promise<void>;
    domainsAllowed: ComputedRef<string[]>;
    domainsBase: ComputedRef<string[]>;
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
    getBaseDomain: () => Promise<void>;
    getChoices: () => Promise<void>;
    getDomain: (id: string) => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    installHardware: (id: string) => Promise<void>;
    installSuccess: ComputedRef<boolean>;
    installWarning: ComputedRef<boolean>;
    nonFieldFormError: ComputedRef<boolean>;
    nonFieldFormMessage: ComputedRef<string>;
    updateDomain: (id: string, values: Record<string, unknown>) => Promise<void>;
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminHardwareCompany = (): UseAdminHardwareCompanyInterface => {
    const { loadingState } = usePageLoading();

    const choices = computed(() => {
        return localHardwareCompany.choices;
    });

    const createHardware = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/hardware/company/create',
            values
        );

        if (response.error) {
            localHardwareCompany.formErrors = response.errors;
        } else {
            localHardwareCompany.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteHardware = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/hardware/company/delete/${values.id}`
        );

        if (response.error) {
            localHardwareCompany.formErrors = response.errors;
        } else {
            localHardwareCompany.formArr = localHardwareCompany.formArr.filter(item => item['id'] !== values.id);

            localHardwareCompany.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const domainsAllowed = computed(() => {
        return localHardwareCompany.domainsAllowed;
    });

    const domainsBase = computed(() => {
        return localHardwareCompany.domainsBase;
    });

    const formArr = computed(() => {
        return localHardwareCompany.formArr;
    });

    const formErrors = computed(() => {
        return localHardwareCompany.formErrors;
    });

    const formObj = computed(() => {
        return localHardwareCompany.formObj;
    });

    const formSuccess = computed(() => {
        return localHardwareCompany.formSuccess;
    });

    const getBaseDomain = async () => {
        loadingState.isActive = true;

        await getChoices();

        const domains: any = [];

        for (const [key, value] of Object.entries(localHardwareCompany.choices)) {
            domains.push({
                value: parseInt(key, 10),
                label: value
            })
        }

        localHardwareCompany.domainsBase = domains;

        loadingState.isActive = false;
    };

    const getChoices = async () => {
        localHardwareCompany.choices = await client.get(
            'admin/hardware/company/choices'
        );
    };

    const getDomain = async (id: string) => {
        loadingState.isActive = true;

        const response = await client.get(
            `admin/hardware/company/domain/${id}`
        );

        localHardwareCompany.domainsAllowed = response.allowed;

        loadingState.isActive = false;
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localHardwareCompany.formObj = await client.get(
            `admin/hardware/company/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localHardwareCompany.formArr = await client.get(
            'admin/hardware/company/search'
        );

        loadingState.isActive = false;
    };

    const installHardware = async (id: string) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/hardware/company/install/${id}`,
            {
                'in_queue': true, // TODO move this to a model
                'is_installed': true
            }
        );

        if (response.error) {
            localHardwareCompany.installSuccess = false;
            localHardwareCompany.installWarning = true;
        } else {
            localHardwareCompany.installSuccess = true;
            localHardwareCompany.installWarning = false;
        }

        loadingState.isActive = false;
    };

    const installSuccess = computed(() => {
        return localHardwareCompany.installSuccess;
    });

    const installWarning = computed(() => {
        return localHardwareCompany.installWarning;
    });

    const localHardwareCompany = reactive({
        choices: {
            domain: {},
            hardware_target: {}
        },
        domainsAllowed: [],
        domainsBase: [],
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
        installWarning: false,
        nonFieldFormError: false,
        nonFieldFormMessage: ''
    });

    const nonFieldFormError = computed(() => {
        return localHardwareCompany.nonFieldFormError;
    });

    const nonFieldFormMessage = computed(() => {
        return localHardwareCompany.nonFieldFormMessage;
    });

    const updateDomain = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/hardware/company/domain/${id}`,
            {
                'allowed': values.allowed
            }
        );

        if (response.error) {
            if ('allowed' in response.errors) {
                localHardwareCompany.nonFieldFormError = true;
                localHardwareCompany.nonFieldFormMessage = response.errors['allowed'][0];
            } else {
                localHardwareCompany.formErrors = response.errors;
            }
        } else {
            localHardwareCompany.formErrors = '';
            localHardwareCompany.formSuccess = true;
            localHardwareCompany.nonFieldFormError = false;
            localHardwareCompany.nonFieldFormMessage = '';
        }

        if (response.error) {
            localHardwareCompany.formErrors = response.errors;
        } else {
            localHardwareCompany.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/hardware/company/profile/${id}`,
            values
        );

        if (response.error) {
            localHardwareCompany.formErrors = response.errors;
        } else {
            localHardwareCompany.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        choices,
        createHardware,
        deleteHardware,
        domainsAllowed,
        domainsBase,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getChoices,
        getBaseDomain,
        getDomain,
        getProfile,
        getSearch,
        installHardware,
        installSuccess,
        installWarning,
        nonFieldFormError,
        nonFieldFormMessage,
        updateDomain,
        updateProfile
    };
};