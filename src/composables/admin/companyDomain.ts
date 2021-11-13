import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminCompanyDomainInterface {
    choices: ComputedRef<Record<string, string>>;
    createDomain: (values: Record<string, unknown>) => Promise<void>;
    deleteDomain: (values: {
        id: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        account: null | number;
        company: number;
        company_name: string;
        date_from: string;
        id: number;
        in_queue: boolean;
        ipaddress_pool: null | number;
        is_active: boolean;
        manage_dns: boolean;
        name: string;
        ns: string[];
        related_to: null | number;
    }>;
    formSuccess: ComputedRef<boolean>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
}

export const useAdminCompanyDomain = (): UseAdminCompanyDomainInterface => {
    const { loadingState } = usePageLoading();

    const choices = computed(() => {
        return localCompanyDomain.choices;
    });

    const createDomain = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/company/domain/create',
            values
        );

        if (response.error) {
            localCompanyDomain.formErrors = response.errors;
        } else {
            localCompanyDomain.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteDomain = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/company/domain/delete/${values.id}`
        );

        if (response.error) {
            localCompanyDomain.formErrors = response.errors;
        } else {
            localCompanyDomain.formArr = localCompanyDomain.formArr.filter(item => item['id'] !== values.id);

            localCompanyDomain.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const formArr = computed(() => {
        return localCompanyDomain.formArr;
    });

    const formErrors = computed(() => {
        return localCompanyDomain.formErrors;
    });

    const formObj = computed(() => {
        return localCompanyDomain.formObj;
    });

    const formSuccess = computed(() => {
        return localCompanyDomain.formSuccess;
    });

    const getChoices = async () => {
        localCompanyDomain.choices = await client.get(
            'admin/company/domain/choices'
        );
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localCompanyDomain.formObj = await client.get(
            `admin/company/domain/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localCompanyDomain.formArr = await client.get(
            'admin/company/domain/search'
        );

        loadingState.isActive = false;
    };

    const localCompanyDomain = reactive({
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {
            account: 0,
            company: 0,
            company_name: '',
            date_from: '',
            id: 0,
            in_queue: false,
            ipaddress_pool: null,
            is_active: false,
            manage_dns: false,
            name: '',
            ns: [],
            related_to: null
        },
        formSuccess: false
    });

    return {
        choices,
        createDomain,
        deleteDomain,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getChoices,
        getProfile,
        getSearch
    };
};