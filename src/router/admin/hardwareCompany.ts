import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Company Hardware';

export const adminHardwareCompanyRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/hardware/company',
        redirect: {
            name: 'admin:hardware:company:search'
        },
        name: 'admin:hardware:company',
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
                name: 'admin:hardware:company:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/hardware/company/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_hardware_company.view_server',
                        'admin_hardware_company.add_server'
                    ]);
                }
            },
            {
                path: 'domain/:id',
                name: 'admin:hardware:company:domain',
                meta: {
                    label: 'Authorized Domains',
                    section: section
                },
                component: () => import('@/views/admin/hardware/company/TheDomain.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_hardware_company.view_server'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:hardware:company:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/hardware/company/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_hardware_company.view_server'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:hardware:company:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/hardware/company/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_hardware_company.view_server'
                    ]);
                }
            }
        ]
    };
};
