import { useAuth } from "@/composables";
import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";

const section = 'Customer Orders';

export const adminCustomerOrderRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/customer/order',
        redirect: {
            name: 'admin:customer:order:search'
        },
        name: 'admin:customer:order',
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
                name: 'admin:customer:order:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/customer/order/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_customer_order.view_order'
                    ]);
                }
            },*/
            {
                path: 'search',
                name: 'admin:customer:order:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/customer/order/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_customer_order.view_order'
                    ]);
                }
            }
        ]
    };
};
