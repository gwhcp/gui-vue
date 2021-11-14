import { useAuth } from "@/composables";
import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";

const section = 'Network Queue';

export const adminNetworkQueueRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/network/queue',
        redirect: {
            name: 'admin:network:queue:search'
        },
        name: 'admin:network:queue',
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
                name: 'admin:network:queue:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/network/queue/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_network_queue.view_queuestatus'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:network:queue:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/network/queue/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_network_queue.view_queuestatus'
                    ]);
                }
            }
        ]
    };
};
