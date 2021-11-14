import { useAuth } from "@/composables";
import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";

const section = 'Email Template';

export const adminSettingEmailRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/setting/email',
        redirect: {
            name: 'admin:setting:email:search'
        },
        name: 'admin:setting:email',
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
                name: 'admin:setting:email:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/setting/email/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_setting_email.view_emailtemplate',
                        'admin_setting_email.add_emailtemplate'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:setting:email:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/setting/email/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_setting_email.view_emailtemplate'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:setting:email:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/setting/email/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_setting_email.view_emailtemplate'
                    ]);
                }
            }
        ]
    };
};
