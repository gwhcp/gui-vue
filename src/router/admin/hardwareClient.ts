import { useAuth } from "@/composables";
import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";

const section = 'Client Hardware';

export const adminHardwareClientRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/hardware/client',
        redirect: {
            name: 'admin:hardware:client:search'
        },
        name: 'admin:hardware:client',
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
                name: 'admin:hardware:client:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/hardware/client/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_hardware_client.view_server',
                        'admin_hardware_client.add_server'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:hardware:client:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/hardware/client/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_hardware_client.view_server'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:hardware:client:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/hardware/client/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_hardware_client.view_server'
                    ]);
                }
            }
        ]
    };
};
