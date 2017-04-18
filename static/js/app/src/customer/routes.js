/**
 * Created by lingchenxuan on 2017/3/20.
 */
import vip from './views/vip';
import company from './views/company/index.vue';
import nonVip from './views/non-vip/index.vue';
import Router from 'vue-router';
import list from './views/vip/list.vue';
import setting from './views/vip/setting.vue';
import auth from '../common/auth';
import NoAuth from './components/no-auth.vue';
const hasAuth = auth.checkModule(auth.VIP_ID);
const hasCompanyAuth = auth.checkModule(auth.COMPANY_ID, auth.COMPANY_VIEW_ID);

export const routes = [
    {
        path: '/',
        redirect: '/vip'
    },
    {
        path: '/vip',
        redirect: '/vip/list',
        component: vip,
        children: [
            {
                path: '/vip/list',
                component: list,
                meta: {
                    auth: hasAuth,
                    authName: '会员查看'
                }
            },
            {
                path: '/vip/setting',
                component: setting
            }
        ]
    },
    {
        path: '/company',
        component: company,
        meta: {
            auth: hasCompanyAuth,
            // auth: false,
            authName: '企业查看'
        }
    },
    {
        path: '/non-vip',
        component: nonVip
    },
    {
        path: '/non-auth',
        component: NoAuth
    }
];

const router = new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { x: 0, y: 0 };
    },
    base: '/view/customer/',
    linkActiveClass: 'active',
    routes
});
router.beforeEach((to, from, next) => {
    if (to.meta.auth === false) {
        router.push({ path: '/non-auth', query: { name: encodeURI(to.meta.authName) }, params: { userId: 123 }, meta: { userid: 123 }});
            // next({path:'/non-auth', params: {name: '132'},meta: {name: '132'} })
    } else {
        next();
    }
});
exports.router = router;
