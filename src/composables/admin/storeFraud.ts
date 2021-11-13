import { client, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminStoreFraudInterface {
    choices: ComputedRef<Record<string, string>>;
    createFraudString: (values: Record<string, unknown>) => Promise<void>;
    deleteFraudString: (values: {
        id: string;
    }) => Promise<void>;
    formArr: ComputedRef<string[]>;
    formErrors: ComputedRef<Record<string, unknown>>;
    formObj: ComputedRef<{
        date_from: string;
        fraud_type: string;
        fraud_type_name: string;
        id: number;
        is_active: boolean;
        name: string;
    }>;
    formSuccess: ComputedRef<boolean>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
}

export const useAdminStoreFraud = (): UseAdminStoreFraudInterface => {
    const { loadingState } = usePageLoading();

    const choices = computed(() => {
        return localStoreFraud.choices;
    });

    const createFraudString = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/store/fraud/create',
            values
        );

        if (response.error) {
            localStoreFraud.formErrors = response.errors;
        } else {
            localStoreFraud.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteFraudString = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/store/fraud/delete/${values.id}`
        );

        if (response.error) {
            localStoreFraud.formErrors = response.errors;
        } else {
            localStoreFraud.formArr = localStoreFraud.formArr.filter(item => item['id'] !== values.id);

            localStoreFraud.formSuccess = true;
        }

        loadingState.isActive = false;

        return response.error;
    };

    const formArr = computed(() => {
        return localStoreFraud.formArr;
    });

    const formErrors = computed(() => {
        return localStoreFraud.formErrors;
    });

    const formObj = computed(() => {
        return localStoreFraud.formObj;
    });

    const formSuccess = computed(() => {
        return localStoreFraud.formSuccess;
    });

    const getChoices = async () => {
        localStoreFraud.choices = await client.get(
            'admin/store/fraud/choices'
        );
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localStoreFraud.formObj = await client.get(
            `admin/store/fraud/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearch = async () => {
        loadingState.isActive = true;

        localStoreFraud.formArr = await client.get(
            'admin/store/fraud/search'
        );

        loadingState.isActive = false;
    };

    const localStoreFraud = reactive({
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {
            date_from: '',
            fraud_type: '',
            fraud_type_name: '',
            id: 0,
            is_active: false,
            name: ''
        },
        formSuccess: false
    });

    return {
        choices,
        createFraudString,
        deleteFraudString,
        formArr,
        formErrors,
        formObj,
        formSuccess,
        getChoices,
        getProfile,
        getSearch
    };
};