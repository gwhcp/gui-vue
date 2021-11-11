import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Employee';

export const adminEmployeeManageRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/employee/manage',
        redirect: {
            name: 'admin:employee:manage:search'
        },
        name: 'admin:employee:manage',
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
                path: 'accesslog/:id',
                name: 'admin:employee:manage:accesslog',
                meta: {
                    label: 'Access Logs',
                    section: section
                },
                component: () => import('@/views/admin/employee/manage/TheAccessLog.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_employee_manage.view_accesslog'
                    ]);
                }
            },
            {
                path: 'create',
                name: 'admin:employee:manage:create',
                meta: {
                    label: 'Create',
                    section: section
                },
                component: () => import('@/views/admin/employee/manage/TheCreate.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_employee_manage.view_account',
                        'admin_employee_manage.add_account'
                    ]);
                }
            },
            {
                path: 'permission/:id',
                name: 'admin:employee:manage:permission',
                meta: {
                    label: 'User Permissions',
                    section: section
                },
                component: () => import('@/views/admin/employee/manage/ThePermission.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'auth.view_permission'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:employee:manage:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/employee/manage/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_employee_manage.view_account'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:employee:manage:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/employee/manage/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_employee_manage.view_account'
                    ]);
                }
            }
        ]
    };
};
