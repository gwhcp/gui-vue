import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminHardwareCompanyInterface {
    createHardware: (values: Record<string, unknown>) => Promise<void>;
    deleteHardware: (values: {
        id: string;
    }) => Promise<void>;
    getBaseDomain: () => Promise<void>;
    getChoices: () => Promise<void>;
    getDomain: (id: string) => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    installHardware: (id: string) => Promise<void>;
    localHardwareCompany: {
        choices: Record<string, unknown>;
        domainsBase: string[];
        domainsAllowed: string[];
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
        installSuccess: boolean;
        installWarning: boolean;
        nonFieldFormError: boolean;
        nonFieldFormMessage: string;
    };
    updateDomain: (id: string, values: Record<string, unknown>) => Promise<void>;
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminHardwareCompany = (): UseAdminHardwareCompanyInterface => {
    const { loadingState } = usePageLoading();

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

    const localHardwareCompany = reactive({
        choices: {},
        domainsBase: [],
        domainsAllowed: [],
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false,
        installSuccess: false,
        installWarning: false,
        nonFieldFormError: false,
        nonFieldFormMessage: ''
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
        createHardware,
        deleteHardware,
        getChoices,
        getBaseDomain,
        getDomain,
        getProfile,
        getSearch,
        installHardware,
        localHardwareCompany,
        updateDomain,
        updateProfile
    };
};