/**
 * Created by lingchenxuan on 2017/1/9.
 */
import Router from 'vue-router';
import Calendar from './views/Calendar.vue';
import Orders from './views/Orders.vue';

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
