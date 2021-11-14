import { useAuth } from "@/composables";
import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";

const section = 'Customer Account';

export const adminCustomerAccountRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/customer/account',
        redirect: {
            name: 'admin:customer:account:search'
        },
        name: 'admin:customer:account',
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

            if (!accountProfile.value.is_staff) {
                return router.push({ name: 'pages:error:403' });
            }
        },
        children: [
            {
                path: 'accesslog/:id',
                name: 'admin:customer:account:accesslog',
                meta: {
                    label: 'Access Logs',
                    section: section
                },
                component: () => import('@/views/admin/customer/account/TheAccessLog.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_customer_account.view_accesslog'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:customer:account:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/customer/account/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_customer_account.view_account'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:customer:account:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/customer/account/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_customer_account.view_account'
                    ]);
                }
            }
        ]
    };
};
