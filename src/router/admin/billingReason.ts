import { useAuth } from "@/composables";
import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";

const section = 'Reason';

export const adminBillingReasonRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/billing/reason',
        redirect: {
            name: 'admin:billing:reason:search'
        },
        name: 'admin:billing:reason',
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
                path: 'create',
                name: 'admin:billing:reason:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/billing/reason/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_billing_reason.view_reason',
                        'admin_billing_reason.add_reason'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:billing:reason:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/billing/reason/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_billing_reason.view_reason'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:billing:reason:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/billing/reason/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_billing_reason.view_reason'
                    ]);
                }
            }
        ]
    };
};
