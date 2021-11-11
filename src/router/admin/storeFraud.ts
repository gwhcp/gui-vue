import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Fraud';

export const adminStoreFraudRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/store/fraud',
        redirect: {
            name: 'admin:store:fraud:search'
        },
        name: 'admin:store:fraud',
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
                name: 'admin:store:fraud:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/store/fraud/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_store_fraud.view_fraudstring',
                        'admin_store_fraud.add_fraudstring'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:store:fraud:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/store/fraud/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_store_fraud.view_fraudstring'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:store:fraud:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/store/fraud/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_store_fraud.view_fraudstring'
                    ]);
                }
            }
        ]
    };
};
