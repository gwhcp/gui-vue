import { client, usePageLoading } from "@/composables";
import { reactive } from "vue";

interface UseAdminCompanyXmppInterface {
    createAccount: (values: Record<string, unknown>) => Promise<void>;
    createGroup: (values: Record<string, unknown>) => Promise<void>;
    deleteAccount: (values: {
        id: string;
    }) => Promise<void>;
    deleteGroup: (values: {
        id: string;
    }) => Promise<void>;
    getChoices: () => Promise<void>;
    getProfile: (id: string) => Promise<void>;
    getSearchAccount: () => Promise<void>;
    getSearchGroup: () => Promise<void>;
    localCompanyXmpp: {
        choices: Record<string, unknown>;
        formArr: string[];
        formErrors: Record<string, unknown>;
        formObj: Record<string, unknown>;
        formSuccess: boolean;
        nonFieldFormError: boolean;
        nonFieldFormMessage: string;
    };
    updateProfile: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export const useAdminCompanyXmpp = (): UseAdminCompanyXmppInterface => {
    const { loadingState } = usePageLoading();

    const createAccount = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/company/xmpp/create',
            values
        );

        if (response.error) {
            localCompanyXmpp.formErrors = response.errors;
        } else {
            localCompanyXmpp.formSuccess = true;

            await client.get(
                'admin/company/xmpp/rebuild'
            );
        }

        loadingState.isActive = false;
    };

    const createGroup = async (values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.post(
            'admin/company/xmpp/create/group',
            values
        );

        if (response.error) {
            localCompanyXmpp.formErrors = response.errors;
        } else {
            localCompanyXmpp.formSuccess = true;
        }

        loadingState.isActive = false;
    };

    const deleteAccount = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/company/xmpp/delete/${values.id}`
        );

        if (response.error) {
            localCompanyXmpp.formErrors = response.errors;
        } else {
            localCompanyXmpp.formArr = localCompanyXmpp.formArr.filter(item => item['id'] !== values.id);

            localCompanyXmpp.formSuccess = true;

            await client.get(
                'admin/company/xmpp/rebuild'
            );
        }

        loadingState.isActive = false;

        return response.error;
    };

    const deleteGroup = async (values: {
        id: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.delete(
            `admin/company/xmpp/delete/group/${values.id}`
        );

        if (response.error) {
            if ('non_field_errors' in response.errors) {
                localCompanyXmpp.nonFieldFormError = true;
                localCompanyXmpp.nonFieldFormMessage = response.errors['non_field_errors'][0];
            } else {
                localCompanyXmpp.formErrors = response.errors;
            }
        } else {
            localCompanyXmpp.formArr = localCompanyXmpp.formArr.filter(item => item['id'] !== values.id);

            localCompanyXmpp.formErrors = '';
            localCompanyXmpp.formSuccess = true;
            localCompanyXmpp.nonFieldFormError = false;
            localCompanyXmpp.nonFieldFormMessage = '';
        }

        loadingState.isActive = false;

        return response.error;
    };

    const getChoices = async () => {
        localCompanyXmpp.choices = await client.get(
            'admin/company/xmpp/choices'
        );
    };

    const getProfile = async (id: string) => {
        loadingState.isActive = true;

        localCompanyXmpp.formObj = await client.get(
            `admin/company/xmpp/profile/${id}`
        );

        loadingState.isActive = false;
    };

    const getSearchAccount = async () => {
        loadingState.isActive = true;

        localCompanyXmpp.formArr = await client.get(
            'admin/company/xmpp/search'
        );

        loadingState.isActive = false;
    };

    const getSearchGroup = async () => {
        loadingState.isActive = true;

        localCompanyXmpp.formArr = await client.get(
            'admin/company/xmpp/search/group'
        );

        loadingState.isActive = false;
    };

    const localCompanyXmpp = reactive({
        choices: {},
        formArr: [],
        formErrors: {},
        formObj: {},
        formSuccess: false,
        nonFieldFormError: false,
        nonFieldFormMessage: ''
    });

    const updateProfile = async (id: string, values: Record<string, unknown>) => {
        loadingState.isActive = true;

        const response = await client.patch(
            `company/mail/password/${id}`,
            values
        );

        if (response.error) {
            localCompanyXmpp.formErrors = response.errors;
        } else {
            localCompanyXmpp.formSuccess = true;

            await client.get(
                'admin/company/xmpp/rebuild'
            );
        }

        loadingState.isActive = false;
    };

    return {
        createAccount,
        createGroup,
        deleteAccount,
        deleteGroup,
        getChoices,
        getProfile,
        getSearchAccount,
        getSearchGroup,
        localCompanyXmpp,
        updateProfile
    };
};