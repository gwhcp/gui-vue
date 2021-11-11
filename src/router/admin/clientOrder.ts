import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Client Orders';

export const adminClientOrderRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/client/order',
        redirect: {
            name: 'admin:client:order:search'
        },
        name: 'admin:client:order',
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
            /*{
                path: 'profile/:id',
                name: 'admin:client:order:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/client/order/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_client_order.view_order'
                    ]);
                }
            },*/
            {
                path: 'search',
                name: 'admin:client:order:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/client/order/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_client_order.view_order'
                    ]);
                }
            }
        ]
    };
};
