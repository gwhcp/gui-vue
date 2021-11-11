import { useAuth } from "@/composables/auth";
import {
    adminBillingPaymentRoutes,
    adminBillingReasonRoutes,
    adminClientOrderRoutes,
    adminCompanyCompanyRoutes,
    adminCompanyDnsRoutes,
    adminCompanyDomainRoutes,
    adminCompanyMailRoutes,
    adminCompanyXmppRoutes,
    adminEmployeeAccountRoutes,
    adminEmployeeMailRoutes,
    adminEmployeeManageRoutes,
    adminEmployeeXmppRoutes,
    adminHardwareClientRoutes,
    adminHardwareCompanyRoutes,
    adminNetworkPoolRoutes,
    adminNetworkQueueRoutes,
    adminSettingBannedRoutes,
    adminSettingEmailRoutes,
    adminStoreFraudRoutes,
    adminStoreProductDomainRoutes,
    adminStoreProductPriceRoutes,
    adminStoreProductRoutes
} from "@/router/admin";

import { clientAccountRoutes, clientBillingRoutes, clientStoreRoutes } from "@/router/client";

import { pagesRoutes } from "@/router/pages";
import { RendererElement } from "vue";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

export interface RouteInterface {
    path: string;
    redirect: {
        name: string;
    };
    name: string;
    component: RendererElement;
    beforeEnter?: () => void;
    children: Array<RouteRecordRaw>;
}

const checkPermission = () => {
    const { globalAuth } = useAuth();

    const test = (permissions: string[]) => {
        permissions.forEach(val => {
            if (!JSON.parse(globalAuth.permissions).includes(val)) {
                return router.push({ name: 'pages:error:403' });
            }
        });
    }

    return (test);
};

const requireAuthenticated = () => {
    const { globalAuth, initialize } = useAuth();

    initialize();

    if (globalAuth.token === '') {
        return router.push({ name: 'pages:account:login' });
    }
};

const redirectLogout = () => {
    const { removeToken } = useAuth();

    removeToken();

    return router.push({ name: 'pages:account:login' });
};

const requireUnauthenticated = () => {
    const { globalAuth } = useAuth();

    if (globalAuth.token !== '') {
        return router.push({ name: 'dashboard' });
    }
};

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: {
            name: 'dashboard'
        },
        name: 'home',
        meta: {
            label: 'Home'
        },
        component: () => import('@/containers/TheContainer.vue'),
        beforeEnter: requireAuthenticated,
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                meta: {
                    label: 'Dashboard'
                },
                component: () => import('@/views/TheDashboard.vue')
            },
            adminBillingPaymentRoutes(checkPermission),
            adminBillingReasonRoutes(checkPermission),
            adminClientOrderRoutes(checkPermission),
            adminCompanyCompanyRoutes(checkPermission),
            adminCompanyDnsRoutes(checkPermission),
            adminCompanyDomainRoutes(checkPermission),
            adminCompanyMailRoutes(checkPermission),
            adminCompanyXmppRoutes(checkPermission),
            adminEmployeeAccountRoutes(checkPermission),
            adminEmployeeMailRoutes(checkPermission),
            adminEmployeeManageRoutes(checkPermission),
            adminEmployeeXmppRoutes(checkPermission),
            adminHardwareClientRoutes(checkPermission),
            adminHardwareCompanyRoutes(checkPermission),
            adminNetworkPoolRoutes(checkPermission),
            adminNetworkQueueRoutes(checkPermission),
            adminSettingBannedRoutes(checkPermission),
            adminSettingEmailRoutes(checkPermission),
            adminStoreFraudRoutes(checkPermission),
            adminStoreProductRoutes(checkPermission),
            adminStoreProductDomainRoutes(checkPermission),
            adminStoreProductPriceRoutes(checkPermission),
            clientAccountRoutes(checkPermission),
            clientBillingRoutes(checkPermission),
            clientStoreRoutes(checkPermission)
        ]
    },
    {
        path: '/logout',
        name: 'logout',
        beforeEnter: redirectLogout,
        component: () => import('@/views/pages/TheLogin.vue')
    },
    {
        // will match everything and if it's not found, redirect to 404
        path: '/:pathMatch(.*)*',
        redirect: {
            name: 'pages:error:404'
        }
    },
    pagesRoutes(requireUnauthenticated)
];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    scrollBehavior() {
        // always scroll to top
        return { top: 0 }
    },
    routes
});

export default router;
