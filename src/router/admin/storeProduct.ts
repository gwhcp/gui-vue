import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Store Product';

export const adminStoreProductRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/store/product',
        redirect: {
            name: 'admin:store:product:index'
        },
        name: 'admin:store:product',
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
                path: 'index',
                name: 'admin:store:product:index',
                meta: {
                    label: 'Dashboard',
                    section: section
                },
                component: () => import('@/views/admin/store/product/TheIndex.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_store_product.view_storeproduct'
                    ]);
                }
            }
        ]
    };
};
