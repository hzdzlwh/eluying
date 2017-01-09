/**
 * Created by lingchenxuan on 2017/1/9.
 */
import Router from 'vue-router';
export const routes = [
    {
        path: '/',
        redirect: '/overview',
        meta: {
            invisible: true
        },
    },
    {
        path: '/overview',
        redirect: '/overview/operation',
        meta: {
            name: '总览'
        },
        children: [
            {
                path: 'operation',
                meta: {
                    name: '运营'
                },
            },
            {
                path: 'flow',
                meta: {
                    name: '流水'
                },
            },
            {
                path: 'sale',
                meta: {
                    name: '销售'
                },
            },
            {
                path: 'channel',
                meta: {
                    name: '渠道'
                },
            }
        ]
    },
    {
        path: '/accommodation',
        meta: {
            name: '住宿'
        },
    },
    {
        path: '/catering',
        meta: {
            name: '餐饮'
        },
        redirect: '/catering/operation',
        children: [
            {
                path: 'operation',
                meta: {
                    name: '运营'
                },
            }
        ]
    },
    {
        path: '/entertainment',
        meta: {
            name: '娱乐'
        },
        redirect: '/entertainment/operation',
        children: [
            {
                path: 'operation',
                meta: {
                    name: '运营'
                }
            }
        ]
    },
    {
        path: '/retail',
        meta: {
            name: '商超'
        }
    }
];

export const router = new Router({
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        return savedPosition ? savedPosition : { x: 0, y: 0 };
    },
    base: '/view/reports/',
    linkActiveClass: 'active',
    routes
});