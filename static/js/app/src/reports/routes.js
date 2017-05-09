/**
 * Created by lingchenxuan on 2017/1/9.
 */
import Router from 'vue-router';
import operation from './views/overview/operation.vue';
import container from './views/container.vue';
import channel from './views/overview/channel.vue';
import sale from './views/overview/sale.vue';
import accommodation from './views/accommodation.vue';
import childContainer from './views/childContainer.vue';
import food from './views/catering/operation/food.vue';
import restaurant from './views/catering/operation/restaurant.vue';
import statistics from './views/entertainment/operation/statistics.vue';
import detail from './views/entertainment/operation/detail.vue';
import retail from './views/retail.vue';
import flowChannels from './views/overview/flow/channels.vue';
import flowRecords from './views/overview/flow/records.vue';
import flowPrepiad from './views/overview/flow/prepaid.vue';
import insurance from './views/insurance.vue';
import auth from '../common/auth';

const insuranceAuth = auth.checkSwitch(auth.INSURANCE_ID);
export const routes = [
    {
        path: '/',
        redirect: '/overview',
        meta: {
            invisible: true
        }
    },
    {
        path: '/overview',
        redirect: '/overview/operation',
        component: container,
        meta: {
            name: '总览'
        },
        children: [
            {
                path: '/overview/operation',
                component: operation,
                meta: {
                    name: '运营'
                }
            },
            {
                path: '/overview/flow',
                meta: {
                    name: '流水'
                },
                component: childContainer,
                redirect: '/overview/flow/channels',
                children: [
                    {
                        path: '/overview/flow/channels',
                        component: flowChannels,
                        meta: {
                            name: '收款方式'
                        }
                    },
                    {
                        path: '/overview/flow/records',
                        component: flowRecords,
                        meta: {
                            name: '收款记录'
                        }
                    },
                    {
                        path: '/overview/flow/prepaid',
                        component: flowPrepiad,
                        meta: {
                            name: '预收账款'
                        }
                    }
                ]
            },
            {
                path: '/overview/sale',
                component: sale,
                meta: {
                    name: '销售'
                }
            },
            {
                path: '/overview/channel',
                component: channel,
                meta: {
                    name: '渠道'
                }
            }
        ]
    },
    {
        path: '/accommodation',
        meta: {
            name: '住宿'
        },
        component: accommodation
    },
    {
        path: '/catering',
        meta: {
            name: '餐饮'
        },
        component: container,
        redirect: '/catering/operation',
        children: [
            {
                path: '/catering/operation',
                meta: {
                    name: '运营'
                },
                redirect: '/catering/operation/restaurant',
                component: childContainer,
                children: [
                    {
                        path: '/catering/operation/restaurant',
                        meta: {
                            name: '餐厅统计'
                        },
                        component: restaurant
                    },
                    {
                        path: '/catering/operation/food',
                        meta: {
                            name: '菜品明细'
                        },
                        component: food
                    }
                ]
            }
        ]
    },
    {
        path: '/entertainment',
        meta: {
            name: '娱乐'
        },
        component: container,
        redirect: '/entertainment/operation',
        children: [
            {
                path: '/entertainment/operation',
                meta: {
                    name: '运营'
                },
                component: childContainer,
                redirect: '/entertainment/operation/statistics',
                children: [
                    {
                        path: '/entertainment/operation/statistics',
                        meta: {
                            name: '娱乐统计'
                        },
                        component: statistics
                    },
                    {
                        path: '/entertainment/operation/detail',
                        meta: {
                            name: '娱乐明细'
                        },
                        component: detail
                    }
                ]
            }
        ]
    },
    {
        path: '/retail',
        meta: {
            name: '商超'
        },
        component: retail
    },
    {
        path: '/insurance',
        meta: {
            name: '保险',
            invisible: !insuranceAuth
        },
        component: insurance
    }
];

(function mapChildren(routes) {
    routes.map(route => {
        if (route.children) {
            route.meta.children = route.children;
            mapChildren(route.children);
        }
    });
})(routes);

export const router = new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { x: 0, y: 0 };
    },
    base: '/view/reports/',
    linkActiveClass: 'active',
    routes
});
