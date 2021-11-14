import { useAuth } from "@/composables";
import router, { RouteInterface } from "@/router";
import { computed, h, resolveComponent } from "vue";

const section = 'Employee XMPP';

export const adminEmployeeXmppRoutes = (checkPermission: () => (permissions: string[]) => void): RouteInterface => {
    return {
        path: '/admin/employee/xmpp',
        redirect: {
            name: 'admin:employee:xmpp:profile'
        },
        name: 'admin:employee:xmpp',
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
                path: 'profile',
                name: 'admin:employee:xmpp:profile',
                meta: {
                    label: 'Profile',
                    section: section
                },
                component: () => import('@/views/admin/employee/xmpp/TheProfile.vue'),
                beforeEnter: () => {
                    checkPermission()([
                        'admin_employee_xmpp.view_prosodyaccount'
                    ]);
                }
            }
        ]
    };
};
