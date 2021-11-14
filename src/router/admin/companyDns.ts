import { useAuth } from "@/composables";
import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";

const section = 'Company DNS';

export const adminCompanyDnsRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/company/dns',
        redirect: {
            name: 'admin:company:dns:search'
        },
        name: 'admin:company:dns',
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
                path: 'create/:id',
                name: 'admin:company:dns:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/company/dns/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_dns.view_dnszone',
                        'admin_company_dns.add_dnszone'
                    ]);
                }
            },
            {
                path: 'ns/:id',
                name: 'admin:company:dns:ns',
                meta: {
                    label: 'Nameserver',
                    section: section
                },
                component: () => import('@/views/admin/company/dns/TheNs.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_dns.view_dnszone'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:company:dns:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/company/dns/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_dns.view_dnszone'
                    ]);
                }
            },
            {
                path: 'records/:id',
                name: 'admin:company:dns:records',
                meta: {
                    label: 'Search Records',
                    section: section
                },
                component: () => import('@/views/admin/company/dns/TheSearchRecord.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_dns.view_dnszone'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:company:dns:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/company/dns/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_dns.view_dnszone'
                    ]);
                }
            }
        ]
    };
};
