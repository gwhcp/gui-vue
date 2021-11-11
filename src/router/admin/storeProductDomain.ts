import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Store Domain Product';

export const adminStoreProductDomainRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/store/product/domain',
        redirect: {
            name: 'admin:store:product:domain:search'
        },
        name: 'admin:store:product:domain',
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
                name: 'admin:store:product:domain:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/store/product/domain/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_store_product.view_storeproduct',
                        'admin_store_product.add_storeproduct'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:store:product:domain:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/store/product/domain/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_store_product.view_storeproduct'
                    ]);
                }
            },
            {
                path: 'resource/:id',
                name: 'admin:store:product:domain:resource',
                meta: {
                    label: 'Resource',
                    section: section
                },
                component: () => import('@/views/admin/store/product/domain/TheResource.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_store_product.view_storeproduct'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:store:product:domain:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/store/product/domain/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_store_product.view_storeproduct'
                    ]);
                }
            }
        ]
    };
};
