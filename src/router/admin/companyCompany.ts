import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Company';

export const adminCompanyCompanyRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/company/company',
        redirect: {
            name: 'admin:company:company:search'
        },
        name: 'admin:company:company',
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
                name: 'admin:company:company:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/company/company/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_company.view_company',
                        'admin_company_company.add_company'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:company:company:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/company/company/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_company.view_company'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:company:company:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/company/company/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_company.view_company'
                    ]);
                }
            }
        ]
    };
};
