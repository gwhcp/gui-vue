import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Employee';

export const adminEmployeeAccountRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/employee/account',
        redirect: {
            name: 'admin:employee:account:profile'
        },
        name: 'admin:employee:account',
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
                path: 'accesslog',
                name: 'admin:employee:account:accesslog',
                meta: {
                    label: 'Access Logs',
                    section: section
                },
                component: () => import('@/views/admin/employee/account/TheAccessLog.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_employee_account.view_accesslog'
                    ]);
                }
            },
            {
                path: 'password',
                name: 'admin:employee:account:password',
                meta: {
                    label: 'Change Password',
                    section: section
                },
                component: () => import('@/views/admin/employee/account/ThePassword.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_employee_account.view_account'
                    ]);
                }
            },
            {
                path: 'profile',
                name: 'admin:employee:account:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/employee/account/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_employee_account.view_account'
                    ]);
                }
            }
        ]
    };
};
