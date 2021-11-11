import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminCompanyDnsInterface {
    createRecord: (values: Record<string, unknown>) => Promise<void>;
    deleteRecord: (values: {
        domain: string;
        id: string;
    }) => Promise<void>;
    getChoices: () => Promise<void>;
    getNameserverBase: () => Promise<void>;
    getNameserverDomain: (id: string) => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    getSearchRecord: (id: string) => Promise<void>;
    localCompanyDns: {
        choices: Record<string, unknown>;
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
        nameserverBase: string[];
        nameserverDomain: string[];
    };
    updateNameserver: (id: string, values: string[]) => Promise<void>;
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminCompanyDns = (): UseAdminCompanyDnsInterface => {
    const { loadingState } = usePageLoading();

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
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false,
        nameserverBase: [],
        nameserverDomain: []
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
        createRecord,
        deleteRecord,
        getChoices,
        getNameserverBase,
        getNameserverDomain,
        getProfile,
        getSearch,
        getSearchRecord,
        localCompanyDns,
        updateNameserver,
        updateProfile
    };
};