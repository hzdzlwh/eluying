/*
* @Author: Tplant
* @Date:   2017-08-19 12:48:48
* @Last Modified by:   Tplant
* @Last Modified time: 2017-08-19 16:11:29
*/

import Router from 'vue-router';
import messageList from './components/messageList';
const routes = [
    {
        path: '/:id',
        component: messageList
    }
];

const router = new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { x: 0, y: 0 };
    },
    base: '/view/message/',
    linkActiveClass: 'active',
    routes
});

exports.router = router;
