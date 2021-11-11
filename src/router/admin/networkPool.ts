import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'IP Address Pool';

export const adminNetworkPoolRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/network/pool',
        redirect: {
            name: 'admin:network:pool:search'
        },
        name: 'admin:network:pool',
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
                name: 'admin:network:pool:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/network/pool/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_network_pool.view_ipaddresssetup',
                        'admin_network_pool.add_ipaddresssetup'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:network:pool:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/network/pool/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_network_pool.view_ipaddresssetup'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:network:pool:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/network/pool/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_network_pool.view_ipaddresssetup'
                    ]);
                }
            }
        ]
    };
};
