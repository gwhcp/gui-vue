import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Company Mail';

export const adminCompanyMailRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/company/mail',
        redirect: {
            name: 'admin:company:mail:search'
        },
        name: 'admin:company:mail',
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
                name: 'admin:company:mail:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/company/mail/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_mail.view_mail',
                        'admin_company_mail.add_mail'
                    ]);
                }
            },
            {
                path: 'password/:id',
                name: 'admin:company:mail:password',
                meta: {
                    label: 'Password',
                    section: section
                },
                component: () => import('@/views/admin/company/mail/ThePassword.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_mail.view_mail'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:company:mail:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/company/mail/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_mail.view_mail'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:company:mail:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/company/mail/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_company_mail.view_mail'
                    ]);
                }
            }
        ]
    };
};
