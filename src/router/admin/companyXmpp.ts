import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Company XMPP';

export const adminCompanyXmppRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/company/xmpp',
        redirect: {
            name: 'admin:company:xmpp:search'
        },
        name: 'admin:company:xmpp',
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
                name: 'admin:company:xmpp:create',
                meta: {
                    label: 'Create Account',
                    section: section
                },
                component: () => import('@/views/admin/company/xmpp/TheCreateAccount.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_xmpp.view_prosodyaccount',
                        'admin_company_xmpp.add_prosodyaccount'
                    ]);
                }
            },
            {
                path: 'create/group',
                name: 'admin:company:xmpp:create:group',
                meta: {
                    label: 'Create Group',
                    section: section
                },
                component: () => import('@/views/admin/company/xmpp/TheCreateGroup.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_xmpp.view_prosodyaccount',
                        'admin_company_xmpp.add_prosodyaccount'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:company:xmpp:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/company/xmpp/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_xmpp.view_prosodyaccount'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:company:xmpp:search',
                meta: {
                    label: 'Search Accounts',
                    section: section
                },
                component: () => import('@/views/admin/company/xmpp/TheSearchAccount.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_xmpp.view_prosodyaccount'
                    ]);
                }
            },
            {
                path: 'search/group',
                name: 'admin:company:xmpp:search:group',
                meta: {
                    label: 'Search Groups',
                    section: section
                },
                component: () => import('@/views/admin/company/xmpp/TheSearchGroup.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_xmpp.view_prosodyaccount'
                    ]);
                }
            }
        ]
    };
};
