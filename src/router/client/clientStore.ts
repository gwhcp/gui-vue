import { useAuth } from "@/composables";
import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";

const section = 'Store';

export const clientStoreRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/client/store',
        redirect: {
            name: 'client:store:index'
        },
        name: 'client:store',
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

            if (accountProfile.value.is_staff) {
                return router.push({ name: 'pages:error:403' });
            }
        },
        children: [
            {
                path: 'checkout/:id',
                name: 'client:store:checkout',
                meta: {
                    label: 'Checkout',
                    section: section
                },
                component: () => import('@/views/client/store/TheCheckout.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'client_store.view_storeproduct'
                    ]);
                }
            },
            {
                path: 'index',
                name: 'client:store:index',
                meta: {
                    label: 'Products',
                    section: section
                },
                component: () => import('@/views/client/store/TheIndex.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'client_store.view_storeproduct'
                    ]);
                }
            },
            {
                path: 'product/domain',
                name: 'client:store:product:domain',
                meta: {
                    label: 'Domain Products',
                    section: section
                },
                component: () => import('@/views/client/store/TheProductDomain.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'client_store.view_storeproduct'
                    ]);
                }
            }
        ]
    };
};
