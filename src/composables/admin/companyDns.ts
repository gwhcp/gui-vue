import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminCompanyDnsInterface {
    choices: ComputedRef<{
        ns: Record<string, number>;
        zone: Record<string, string>;
    }>;
    createRecord: (values: Record<string, unknown>) => Promise<void>;
    deleteRecord: (values: {
        domain: string;
        id: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        company: number;
        company_name: string;
        data: string;
        host: string;
        id: number;
        manage_dns: boolean;
        mx_priority: null | number;
        name: string;
        ns: string[];
        record_type: string;
    }>;
    formSuccess: ComputedRef<boolean>;
    getChoices: () => Promise<void>;
    getNameserverBase: () => Promise<void>;
    getNameserverDomain: (id: string) => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    getSearchRecord: (id: string) => Promise<void>;
    nameserverBase: ComputedRef<string[]>;
    nameserverDomain: ComputedRef<string[]>;
    updateNameserver: (id: string, values: string[]) => Promise<void>;
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminCompanyDns = (): UseAdminCompanyDnsInterface => {
    const { loadingState } = usePageLoading();

    const choices = computed(() => {
        return localCompanyDns.choices;
    });

    const createRecord = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/company/dns/create',
            values
        );

        if (response.error) {
            localCompanyDns.formErrors = response.errors;
        } else {
            localCompanyDns.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteRecord = async (values: {
        domain: string;
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/company/dns/delete/${values.domain}/${values.id}`
        );

        if (response.error) {
            localCompanyDns.formErrors = response.errors;
        } else {
            localCompanyDns.formArr = localCompanyDns.formArr.filter(item => item['id'] !== values.id);

            localCompanyDns.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const formArr = computed(() => {
        return localCompanyDns.formArr;
    });

    const formErrors = computed(() => {
        return localCompanyDns.formErrors;
    });

    const formObj = computed(() => {
        return localCompanyDns.formObj;
    });

    const formSuccess = computed(() => {
        return localCompanyDns.formSuccess;
    });

    const getChoices = async () => {
        localCompanyDns.choices = await client.get(
            'admin/company/dns/choices'
        );
    };

    const getNameserverBase = async () => {
        loadingState.isActive = true;

        await getChoices();

        const ns: any = [];

        for (const [key, value] of Object.entries(localCompanyDns.choices['ns'])) {
            ns.push({
                value: parseInt(key, 10),
                label: value
            });
        }

        localCompanyDns.nameserverBase = ns;

        loadingState.isActive = false;
    };

    const getNameserverDomain = async (id: string) => {
        loadingState.isActive = true;

        const response = await client.get(
            `admin/company/dns/ns/${id}`
        );

        localCompanyDns.nameserverDomain = response.ns;

        loadingState.isActive = false;
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localCompanyDns.formObj = await client.get(
            `admin/company/dns/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localCompanyDns.formArr = await client.get(
            'admin/company/dns/search'
        );

        loadingState.isActive = false;
    };

    const getSearchRecord = async (id: string) => {
        loadingState.isActive = true;

        localCompanyDns.formArr = await client.get(
            `admin/company/dns/search/${id}`
        );

        loadingState.isActive = false;
    };

    const localCompanyDns = reactive({
        choices: {
            ns: {},
            zone: {}
        },
        formArr: [],
        formErrors: {},
        formObj: {
            company: 0,
            company_name: '',
            data: '',
            host: '',
            id: 0,
            manage_dns: false,
            mx_priority: null,
            name: '',
            ns: [],
            record_type: ''
        },
        formSuccess: false,
        nameserverBase: [],
        nameserverDomain: []
    });

    const nameserverBase = computed(() => {
        return localCompanyDns.nameserverBase;
    });

    const nameserverDomain = computed(() => {
        return localCompanyDns.nameserverDomain;
    });

    const updateNameserver = async (id: string, values: string[]) => {
        loadingState.isActive = true;

        const ns: string[] = [];

        values.forEach((val: string) => {
            ns.push(val['value']);
        });

        const response = await client.patch(
            `admin/company/dns/ns/${id}`,
            {
                'ns': ns
            }
        );

        if (response.error) {
            localCompanyDns.formErrors = response.errors;
        } else {
            localCompanyDns.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/company/dns/profile/${id}`,
            values
        );

        if (response.error) {
            localCompanyDns.formErrors = response.errors;
        } else {
            localCompanyDns.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        choices,
        createRecord,
        deleteRecord,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getChoices,
        getNameserverBase,
        getNameserverDomain,
        getProfile,
        getSearch,
        getSearchRecord,
        nameserverBase,
        nameserverDomain,
        updateNameserver,
        updateProfile
    };
};