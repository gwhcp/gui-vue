import { useAuth } from "@/composables";
import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";

const section = 'Company Domain';

export const adminCompanyDomainRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/company/domain',
        redirect: {
            name: 'admin:company:domain:search'
        },
        name: 'admin:company:domain',
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
                name: 'admin:company:domain:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/company/domain/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_domain.view_domain',
                        'admin_company_domain.add_domain'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:company:domain:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/company/domain/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_domain.view_domain'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:company:domain:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/company/domain/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_domain.view_domain'
                    ]);
                }
            }
        ]
    };
};
