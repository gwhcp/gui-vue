import { useAuth } from "@/composables";
import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";

const section = 'Account';

export const clientAccountRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/client/account',
        redirect: {
            name: 'client:account:profile'
        },
        name: 'client:account',
        component: {
            render() {
                return h(resolveComponent('router-view'));
            }
        },
        beforeEnter: () => {
            const { globalAuth } = useAuth();

            const accountProfile = computed(() => {
                return JSON.parse(globalAuth.accountProfile);
            });

            if (accountProfile.value.is_staff) {
                return router.push({ name: 'pages:error:403' });
            }
        },
        children: [
            {
                path: 'accesslog',
                name: 'client:account:accesslog',
                meta: {
                    label: 'Access Logs',
                    section: section
                },
                component: () => import('@/views/client/account/TheAccessLog.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'client_account.view_accesslog'
                    ]);
                }
            },
            {
                path: 'password',
                name: 'client:account:password',
                meta: {
                    label: 'Change Password',
                    section: section
                },
                component: () => import('@/views/client/account/ThePassword.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'client_account.view_account'
                    ]);
                }
            },
            {
                path: 'profile',
                name: 'client:account:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/client/account/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'client_account.view_account'
                    ]);
                }
            }
        ]
    };
};
