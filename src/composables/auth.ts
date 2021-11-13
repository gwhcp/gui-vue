import { client, session, usePageLoading } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAuthInterface {
    formErrors: ComputedRef<string>;
    formSuccess: ComputedRef<boolean>;
    getAccountProfile: () => {
        address: string;
        city: string;
        comment_order: string;
        country: string;
        date_from: string;
        email: string;
        first_name: string;
        id: number;
        is_active: boolean;
        is_staff: boolean;
        last_login: string;
        primary_phone: string;
        secondary_phone: string;
        state: string;
        time_format: number;
        time_zone: string;
        zipcode: string;
    };
    globalAuth: {
        accountProfile: string;
        permissions: string;
        token: string;
    };
    hasPerm: (permission: string) => boolean;
    hasPermForm: (permission: string) => void;
    initialize: () => void;
    login: (values: {
        email: string;
        password: string;
    }) => void;
    nonFieldFormError: ComputedRef<boolean>;
    nonFieldFormMessage: ComputedRef<string>;
    removeToken: () => void;
}

const globalAuth = reactive({
    accountProfile: '',
    permissions: '',
    token: ''
});

const accountProfile = 'ACCOUNT_PROFILE_KEY';
const accountPermissions = 'ACCOUNT_PERMISSIONS_KEY';
const tokenStorageKey = 'TOKEN_STORAGE_KEY';

export const useAuth = (): UseAuthInterface => {
    const { loadingState } = usePageLoading();

    const formErrors = computed(() => {
        return localAuth.formErrors;
    });

    const formSuccess = computed(() => {
        return localAuth.formSuccess;
    });

    const getAccountProfile = () => {
        return JSON.parse(globalAuth.accountProfile);
    }

    const hasPerm = (permission: string) => {
        const perm = JSON.parse(globalAuth.permissions);

        return perm.includes(permission);
    };

    const hasPermForm = (permission: string) => {
        const form = <HTMLFormElement>document.querySelector('form');

        const perm = JSON.parse(globalAuth.permissions);

        if (!perm.includes(permission)) {
            Array.from(form.elements).forEach((input) => {
                input.setAttribute('disabled', 'true');
            });
        }
    };

    const initialize = () => {
        const token = localStorage.getItem(tokenStorageKey);

        if (token) {
            localStorage.setItem(tokenStorageKey, token);

            session.defaults.headers.common['Authorization'] = `Token ${token}`;

            globalAuth.token = token;

            globalAuth.accountProfile = <string>localStorage.getItem(accountProfile);

            globalAuth.permissions = <string>localStorage.getItem(accountPermissions);
        }
    };

    const localAuth = reactive({
        formErrors: '',
        formSuccess: false,
        nonFieldFormError: false,
        nonFieldFormMessage: ''
    });

    const login = async (values: {
        email: string;
        password: string;
    }) => {
        loadingState.isActive = true;

        const response = await client.post(
            'rest-auth/login/',
            values
        );

        if (response.error) {
            if ('non_field_errors' in response.errors) {
                localAuth.nonFieldFormError = true;
                localAuth.nonFieldFormMessage = response.errors['non_field_errors'][0];
            } else {
                localAuth.formErrors = response.errors;
            }
        } else {
            localStorage.setItem(tokenStorageKey, response.key);

            session.defaults.headers.common['Authorization'] = `Token ${response.key}`;

            globalAuth.token = response.key;

            const responseProfile = await client.get(
                'login/profile'
            );

            if (responseProfile === false) {
                loadingState.isActive = false;

                localAuth.nonFieldFormError = true;
                localAuth.nonFieldFormMessage = 'You do not have permission to login.';

                return await removeToken();
            }

            if (!responseProfile.error) {
                localStorage.setItem(accountProfile, JSON.stringify(responseProfile));

                globalAuth.accountProfile = JSON.stringify(responseProfile);

                localAuth.formSuccess = true;
            }

            const responsePerm = await client.get(
                'login/permissions'
            );

            if (!responsePerm.error) {
                const permissions = [];

                for (const item of responsePerm) {
                    permissions.push(item.perm);
                }

                localStorage.setItem(accountPermissions, JSON.stringify(permissions));

                globalAuth.permissions = JSON.stringify(permissions);

                localAuth.formSuccess = true;
            }
        }

        loadingState.isActive = false;
    };

    const nonFieldFormError = computed(() => {
        return localAuth.nonFieldFormError;
    });

    const nonFieldFormMessage = computed(() => {
        return localAuth.nonFieldFormMessage;
    });

    const removeToken = async () => {
        localStorage.removeItem(tokenStorageKey);

        delete session.defaults.headers.common['Authorization'];

        globalAuth.accountProfile = '';
        globalAuth.permissions = '';
        globalAuth.token = '';

        await client.post(
            'rest-auth/logout/',
            {}
        );
    };

    return {
        formErrors,
        formSuccess,
        getAccountProfile,
        globalAuth,
        hasPerm,
        hasPermForm,
        initialize,
        login,
        nonFieldFormError,
        nonFieldFormMessage,
        removeToken
    };
};