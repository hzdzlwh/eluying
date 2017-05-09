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
        redirect: '/vip',
        meta: {
            invisible: true
        }
    },
    {
        path: '/non-vip',
        component: nonVip,
        meta: {
            name: '客户'
        }
    },
    {
        path: '/vip',
        redirect: '/vip/list',
        component: vip,
        meta: {
            name: '会员'
        },
        children: [
            {
                path: '/vip/list',
                component: list,
                meta: {
                    auth: hasAuth,
                    authName: '会员查看',
                    name: '会员列表'
                }
            },
            {
                path: '/vip/setting',
                component: setting,
                meta: {
                    name: '会员设置'
                }
            }
        ]
    },
    {
        path: '/company',
        component: company,
        meta: {
            auth: hasCompanyAuth,
            // auth: false,
            authName: '企业查看',
            name: '企业客户'
        }
    },
    {
        path: '/non-auth',
        component: NoAuth,
        meta: {
            invisible: true
        }
    }
];

(function mapChildren(routes) {
    routes.map( route => {
        if (route.children) {
            route.meta.children = route.children;
            mapChildren(route.children);
        }
    });
})(routes);

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
        router.push({ path: '/non-auth', query: { name: encodeURI(to.meta.authName) }, params: { userId: 123 }, meta: { userid: 123 } });
            // next({path:'/non-auth', params: {name: '132'},meta: {name: '132'} })
    } else {
        next();
    }
});
exports.router = router;
