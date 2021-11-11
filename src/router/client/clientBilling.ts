import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Billing Profile';

export const clientBillingRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/client/billing',
        redirect: {
            name: 'client:billing:search'
        },
        name: 'client:billing',
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
                path: 'create',
                name: 'client:billing:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/client/billing/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'client_billing.view_billingprofile',
                        'client_billing.add_billingprofile'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'client:billing:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/client/billing/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'client_billing.view_billingprofile'
                    ]);
                }
            },
            {
                path: 'profile/invoice/:id/:invoice_id',
                name: 'client:billing:invoice:profile',
                meta: {
                    label: 'Invoice Profile',
                    section: section
                },
                component: () => import('@/views/client/billing/invoice/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'client_billing.view_billinginvoice'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'client:billing:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/client/billing/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'client_billing.view_billingprofile'
                    ]);
                }
            },
            {
                path: 'search/invoice/:id',
                name: 'client:billing:invoice:search',
                meta: {
                    label: 'Search Invoices',
                    section: section
                },
                component: () => import('@/views/client/billing/invoice/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'client_billing.view_billinginvoice'
                    ]);
                }
            }
        ]
    };
};
