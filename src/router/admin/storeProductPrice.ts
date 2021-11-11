import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Store Product Price';

export const adminStoreProductPriceRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/store/product/price',
        redirect: {
            name: 'admin:store:product:index'
        },
        name: 'admin:store:product:price', // TODO Try to get ID
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
                path: 'create/:productId/:type',
                name: 'admin:store:product:price:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/store/product/price/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_store_product_price.view_storeproductprice',
                        'admin_store_product_price.add_storeproductprice'
                    ]);
                }
            },
            {
                path: 'profile/:productId/:id/:type',
                name: 'admin:store:product:price:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/store/product/price/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_store_product_price.view_storeproductprice'
                    ]);
                }
            },
            {
                path: 'search/:productId/:type',
                name: 'admin:store:product:price:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/store/product/price/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_store_product_price.view_storeproductprice'
                    ]);
                }
            }
        ]
    };
};
