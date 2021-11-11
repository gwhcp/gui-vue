import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Banned Item';

export const adminSettingBannedRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/setting/banned',
        redirect: {
            name: 'admin:setting:banned:search'
        },
        name: 'admin:setting:banned',
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
                name: 'admin:setting:banned:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/setting/banned/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_setting_banned.view_banned',
                        'admin_setting_banned.add_banned'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:setting:banned:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/setting/banned/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_setting_banned.view_banned'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:setting:banned:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/setting/banned/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_setting_banned.view_banned'
                    ]);
                }
            }
        ]
    };
};
