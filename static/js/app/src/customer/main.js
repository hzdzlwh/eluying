/**
 * Created by lingchenxuan on 2017/3/20.
 */
import Vue from 'vue';
import 'bootstrap';
import App from './App';
import { router } from './routes';
import Router from 'vue-router';
import auth from '../common/auth';
import NoAuth from '../common/components/noAuth.vue';
import init from '../common/init';

init({
    leftMenu: false
});
const hasAuth = auth.checkAccess(auth.VIP_ID);

hasAuth && Vue.use(Router);
const app = hasAuth
    ? new Vue({
        router,
        ...App
    })
    : new Vue({
        render: h => <NoAuth tips="您还没有查看统计报表的权限，请找创建人申请权限。" />,
        components: {
            NoAuth
        }
    });

document.addEventListener('DOMContentLoaded', () => {
    app.$mount('#app');
});
