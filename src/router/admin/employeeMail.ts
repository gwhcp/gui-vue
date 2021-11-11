import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";
import { useAuth } from "@/composables";

const section = 'Employee Mail';

export const adminEmployeeMailRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/employee/mail',
        redirect: {
            name: 'admin:employee:mail:search'
        },
        name: 'admin:employee:mail',
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
                path: 'password/:id',
                name: 'admin:employee:mail:password',
                meta: {
                    label: 'Password',
                    section: section
                },
                component: () => import('@/views/admin/employee/mail/ThePassword.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_employee_mail.view_mail'
                    ]);
                }
            },
            {
                path: 'profile/:id',
                name: 'admin:employee:mail:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/employee/mail/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_employee_mail.view_mail'
                    ]);
                }
            },
            {
                path: 'search',
                name: 'admin:employee:mail:search',
                meta: {
                    label: 'Search',
                    section: section
                },
                component: () => import('@/views/admin/employee/mail/TheSearch.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_employee_mail.view_mail'
                    ]);
                }
            }
        ]
    };
};
