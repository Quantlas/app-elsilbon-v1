import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import SiteLayout from '@/layout/SiteLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: SiteLayout,
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: () => import('@/components/Site/home/Home.vue')
                },
                {
                    path: '/article',
                    name: 'article',
                    component: () => import('@/components/Site/blog/Article.vue')
                }
            ]
        },
        {
            path: '/dashboard',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/carousel',
                    name: 'carousel',
                    component: () => import('@/views/pages/carousel/Carousel.vue')
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/pages/users/Users.vue')
                },
                {
                    path: '/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});

export default router;
