/**
 * Created by lingchenxuan on 2017/1/6.
 */
import Vue from 'vue';
import 'bootstrap';
import header from 'header';
import App from './App';
import {router} from './routes';
import Router from 'vue-router';
import store from './store';
import auth from '../common/auth';
import NoAuth from '../common/components/noAuth.vue';

const hasAuth = auth.checkAccess(auth.REPORT_ID);

hasAuth && Vue.use(Router);
const app = hasAuth
    ? new Vue({
        store,
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
    header.showHeader();
    app.$mount('#app');
});