/**
 * Created by lingchenxuan on 2017/2/17.
 */
module.exports = {
    css: [
        'static/sass/main.scss',
        'static/sass/order/orders/orders.scss',
        'static/sass/vip/setting.scss'
    ],
    js: {
        'login/login': './static/js/app/src/login/login.js',
        'price/roomEntry': './static/js/app/src/business/price/roomEntry.js',
        'price/foodETEntry': './static/js/app/src/business/price/foodETEntry.js',
        'inventory/room': './static/js/app/src/business/inventory/room.js',
        'inventory/food': './static/js/app/src/business/inventory/food.js',
        'inventory/entertainment': './static/js/app/src/business/inventory/entertainment.js',
        'category/roomEntry': './static/js/app/src/business/category/room/roomEntry.js',
        'category/foodEntry': './static/js/app/src/business/category/food/foodEntry.js',
        'category/ETEntry': './static/js/app/src/business/category/entertainment/ETEntry.js',
        'category/shopEntry': './static/js/app/src/business/category/shop/shopEntry.js',
        'other/room': './static/js/app/src/business/other/other.js',
        'salesite/info': './static/js/app/src/salesite/info/info.js',
        'salesite/operation': './static/js/app/src/salesite/operation/operation.js',
        'guest/source': './static/js/app/src/guest/source/source.js',
        'setting/method': './static/js/app/src/setting/method/method.js',
        'tips/noauth': './static/js/app/src/tips/noauth.js',
        'tips/noauthfora': './static/js/app/src/tips/noauthfora.js',
        'tips/noauthforvip': './static/js/app/src/tips/noauthforvip.js',
        'tips/upgrade': './static/js/app/src/tips/upgrade.js',
        'tips/expired': './static/js/app/src/tips/expired.js',
        'ordersManage/orders': './static/js/app/src/ordersManage/orders.js',
        'accommodation': './static/js/app/src/accommodation/main.js',
        'manageVip/vip': './static/js/app/src/manageVip/vipItems/vip.js',
        'restaurant/restaurant': './static/js/app/src/business/restaurant/restaurant/index.js',
        'restaurant/table': './static/js/app/src/business/restaurant/table',
        'restaurant/dishes': './static/js/app/src/business/restaurant/dishes',
        'codesite/operation': './static/js/app/src/codesite/operation/operation.js',
        'linesite/operation': './static/js/app/src/linesite/operation/operation.js',
        'salesite/detail': './static/js/app/src/salesite/detail/detail.js',
        'reports/reports': './static/js/app/src/reports/main.js',
        'manageVip/setting': './static/js/app/src/manageVip/setting.js',
        'customer/customer': './static/js/app/src/customer/main.js'
    },
    html: ['./static/tpl/feature.html'],
    port: 3000,
    devServer: '//www.dingdandao.com:3443',
    testServer: '//www.dingdandao.com:1443',
    SPA: [
        { url: '/view/reports', path: '/view/reports/index.html' },
        { url: '/view/customer', path: '/view/customer/index.html' }
    ]
};