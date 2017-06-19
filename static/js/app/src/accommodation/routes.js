/**
 * Created by lingchenxuan on 2017/1/9.
 */
import Router from 'vue-router';
import Calendar from './views/Calendar.vue';
import Orders from './views/Orders.vue';
import nowOrders from './views/nowOrders.vue';
import dailyContainer from './views/dailyContainer';
import preManage from './views/preManage';
import houseTable from './views/houseTable';
export const routes = [
    {
        path: '/',
        redirect: '/calendar'
    },
    {
        path: '/calendar',
        component: Calendar
    },
    {
        path: '/orders',
        component: Orders
    },
    {
        path: '/nowOrders',
        redirect: '/nowOrders/houseMap',
        component: dailyContainer,
        children: [
            {
                path: '/nowOrders/houseMap',
                component: nowOrders
            },
            {
                path: '/nowOrders/preManage',
                component: preManage
            },
            {
                path: '/nowOrders/houseTable',
                component: houseTable
            }
        ]
    }
];

export const router = new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { x: 0, y: 0 };
    },
    base: '/view/accommodation/',
    linkActiveClass: 'active',
    routes
});
