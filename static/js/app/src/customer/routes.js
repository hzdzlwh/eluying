/**
 * Created by lingchenxuan on 2017/3/20.
 */
import vip, { list, setting } from './views/vip';
import company from './views/company/index.vue';
import nonVip from './views/non-vip/index.vue';
import Router from 'vue-router';

export const routes = [
    {
        path: '/',
        redirect: '/vip'
    },
    {
        path: '/vip',
        redirect: '/vip/list',
        component: vip,
        meta: {
            step: 1
        },
        children: [
            {
                path: '/vip/list',
                component: list
            },
            {
                path: '/vip/setting',
                component: setting
            },
        ]
    },
    {
        path: '/company',
        component: company,
        meta: {
            step: 2
        },

    },
    {
        path: '／non-vip',
        component: nonVip,
        meta: {
            step: 3
        },
    }
];

export const router = new Router({
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        return savedPosition ? savedPosition : { x: 0, y: 0 };
    },
    base: '/view/customer/',
    linkActiveClass: 'active',
    routes
});