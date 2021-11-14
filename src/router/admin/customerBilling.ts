import { useAuth } from "@/composables";
import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";

const section = 'Customer Billing Profile';

export const adminCustomerBillingRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/customer/billing',
        redirect: {
            name: 'admin:customer:billing:search'
        },
        name: 'admin:customer:billing',
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
                path: 'profile/:id',
                name: 'admin:customer:billing:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/customer/billing/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_customer_billing.view_billingprofile'
                    ]);
                }
            },
            {
                path: 'profile/invoice/:id/:invoice_id',
                name: 'admin:customer:billing:invoice:profile',
                meta: {
                    label: 'Invoice Profile',
                    section: section
                },
                component: () => import('@/views/admin/customer/billing/invoice/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_customer_billing.view_billinginvoice'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:customer:billing:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/customer/billing/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_customer_billing.view_billingprofile'
                    ]);
                }
            },
            {
                path: 'search/invoice/:id',
                name: 'admin:customer:billing:invoice:search',
                meta: {
                    label: 'Search Invoices',
                    section: section
                },
                component: () => import('@/views/admin/customer/billing/invoice/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_customer_billing.view_billinginvoice'
                    ]);
                }
            }
        ]
    };
};
