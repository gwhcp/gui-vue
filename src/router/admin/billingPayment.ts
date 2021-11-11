import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Payment Gateway';

export const adminBillingPaymentRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/billing/payment',
        redirect: {
            name: 'admin:billing:payment:search'
        },
        name: 'admin:billing:payment',
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
                path: 'authorize/:id/authentication',
                name: 'admin:billing:payment:authorize:authentication',
                meta: {
                    label: 'Authentication',
                    section: section
                },
                component: () => import('@/views/admin/billing/payment/authorize/TheAuthentication.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_billing_payment.view_paymentgateway'
                    ]);
                }
            },
            {
                path: 'authorize/:id/method',
                name: 'admin:billing:payment:authorize:method',
                meta: {
                    label: 'Payment Method',
                    section: section
                },
                component: () => import('@/views/admin/billing/payment/authorize/TheMethod.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_billing_payment.view_paymentgateway'
                    ]);
                }
            },
            {
                path: 'create',
                name: 'admin:billing:payment:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/billing/payment/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_billing_payment.view_paymentgateway',
                        'admin_billing_payment.add_paymentgateway'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:billing:payment:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/billing/payment/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_billing_payment.view_paymentgateway'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:billing:payment:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/billing/payment/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_billing_payment.view_paymentgateway'
                    ]);
                }
            }
        ]
    };
};
