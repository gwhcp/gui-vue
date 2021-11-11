import { RouteInterface } from "@/router";

export const pagesRoutes = (requireUnauthenticated: () => void): RouteInterface => {
    return {
        path: '/pages',
        redirect: {
            name: 'pages:account:login'
        },
        name: 'pages',
        component: () => import('@/containers/TheContainerUnauthenticated.vue'),
        children: [
            {
                path: '403',
                name: 'pages:error:403',
                component: () => import('@/views/pages/TheError403.vue')
            },
            {
                path: '404',
                name: 'pages:error:404',
                component: () => import('@/views/pages/TheError404.vue')
            },
            {
                path: '408',
                name: 'pages:error:408',
                component: () => import('@/views/pages/TheError408.vue')
            },
            {
                path: '500',
                name: 'pages:error:500',
                component: () => import('@/views/pages/TheError500.vue')
            },
            {
                path: 'create',
                name: 'pages:account:create',
                component: () => import('@/views/pages/TheCreateAccount.vue'),
                beforeEnter: requireUnauthenticated
            },
            {
                path: 'login',
                name: 'pages:account:login',
                component: () => import('@/views/pages/TheLogin.vue'),
                beforeEnter: requireUnauthenticated
            }
        ]
    };
};
