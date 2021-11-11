import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminStoreFraudInterface {
    createFraudString: (values: Record<string, unknown>) => Promise<void>;
    deleteFraudString: (values: {
        id: string;
    }) => Promise<void>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearch: () => Promise<void>;
    localStoreFraud: {
        choices: Record<string, unknown>;
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
    };
}

export const useAdminStoreFraud = (): UseAdminStoreFraudInterface => {
    const { loadingState } = usePageLoading();

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
        formObj: {},
        formSuccess: false
    });

    return {
        createFraudString,
        deleteFraudString,
        getChoices,
        getProfile,
        getSearch,
        localStoreFraud
    };
};