import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminStoreProductDomainInterface {
    createProduct: (values: Record<string, unknown>) => Promise<void>;
    deleteProduct: (values: {
        id: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        bandwidth: number;
        company: string;
        company_id: number;
        company_name: string;
        cron_tab: number;
        date_from: string;
        diskspace: number;
        domain: number;
        ftp_user: number;
        hardware_type: string;
        hardware_type_name: string;
        has_cron: boolean;
        has_domain: boolean;
        has_mail: boolean;
        has_mysql: boolean;
        has_postgresql: boolean;
        id: number;
        ipaddress: number;
        ipaddress_type: string;
        is_active: boolean;
        is_managed: boolean;
        mail_account: number;
        mail_list: number;
        mysql_database: number;
        mysql_user: number;
        name: string;
        postgresql_database: number;
        postgresql_user: number;
        product_type: string;
        product_type_name: string;
        sub_domain: number;
        web_type: string;
    }>;
    formSuccess: ComputedRef<boolean>;
    getProfile: (id: string) => Promise<void>;
    getResource: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
    updateResource: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminStoreProductDomain = (): UseAdminStoreProductDomainInterface => {
    const { loadingState } = usePageLoading();

    const createProduct = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/store/product/domain/create',
            values
        );

        if (response.error) {
            localStoreProductDomain.formErrors = response.errors;
        } else {
            localStoreProductDomain.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteProduct = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/store/product/domain/delete/${values.id}`
        );

        if (response.error) {
            localStoreProductDomain.formErrors = response.errors;
        } else {
            localStoreProductDomain.formArr = localStoreProductDomain.formArr.filter(item => item['id'] !== values.id);

            localStoreProductDomain.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const formArr = computed(() => {
        return localStoreProductDomain.formArr;
    });

    const formErrors = computed(() => {
        return localStoreProductDomain.formErrors;
    });

    const formObj = computed(() => {
        return localStoreProductDomain.formObj;
    });

    const formSuccess = computed(() => {
        return localStoreProductDomain.formSuccess;
    });

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localStoreProductDomain.formObj = await client.get(
            `admin/store/product/domain/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getResource = async (id: string) => {
        loadingState.isActive = true;

        localStoreProductDomain.formObj = await client.get(
            `admin/store/product/domain/resource/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localStoreProductDomain.formArr = await client.get(
            'admin/store/product/domain/search'
        );

        loadingState.isActive = false;
    };

    const localStoreProductDomain = reactive({
        formArr: [],
        formErrors: {},
        formObj: {
            bandwidth: 0,
            company: '',
            company_id: 0,
            company_name: '',
            cron_tab: 0,
            date_from: '',
            diskspace: 0,
            domain: 0,
            ftp_user: 0,
            hardware_type: '',
            hardware_type_name: '',
            has_cron: false,
            has_domain: false,
            has_mail: false,
            has_mysql: false,
            has_postgresql: false,
            id: 0,
            ipaddress: 0,
            ipaddress_type: '',
            is_active: false,
            is_managed: false,
            mail_account: 0,
            mail_list: 0,
            mysql_database: 0,
            mysql_user: 0,
            name: '',
            postgresql_database: 0,
            postgresql_user: 0,
            product_type: '',
            product_type_name: '',
            sub_domain: 0,
            web_type: ''
        },
        formSuccess: false
    });

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/store/product/domain/profile/${id}`,
            values
        );

        if (response.error) {
            localStoreProductDomain.formErrors = response.errors;
        } else {
            localStoreProductDomain.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const updateResource = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `admin/store/product/domain/resource/${id}`,
            values
        );

        if (response.error) {
            localStoreProductDomain.formErrors = response.errors;
        } else {
            localStoreProductDomain.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    return {
        createProduct,
        deleteProduct,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getProfile,
        getResource,
        getSearch,
        updateProfile,
        updateResource
    };
};