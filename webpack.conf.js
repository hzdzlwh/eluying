/**
 * Created by lingchenxuan on 16/6/12.
 */
var webpack = require('webpack'),
    path = require('path');
var webpackConf =  {
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin('common.js')
    ],
    entry: {
        'login/login': './static/js/app/src/login/login.js',
        'login/login2': './static/js/app/src/login/login2.js',
        'price/roomEntry': './static/js/app/src/business/price/roomEntry.js',
        'price/foodETEntry': './static/js/app/src/business/price/foodETEntry.js',
        'inventory/room': './static/js/app/src/business/inventory/room.js',
        'inventory/food': './static/js/app/src/business/inventory/food.js',
        'inventory/entertainment': './static/js/app/src/business/inventory/entertainment.js',
        'category/roomEntry': './static/js/app/src/business/category/room/roomEntry.js',
        'category/foodEntry': './static/js/app/src/business/category/food/foodEntry.js',
        'category/ETEntry': './static/js/app/src/business/category/entertainment/ETEntry.js',
        'category/shopEntry': './static/js/app/src/business/category/shop/shopEntry.js',
        'salesite/info': './static/js/app/src/salesite/info/info.js',
        'salesite/operation': './static/js/app/src/salesite/operation/operation.js',
        'guest/source': './static/js/app/src/guest/source/source.js',
        'setting/method': './static/js/app/src/setting/method/method.js',
        'tips/noauth': './static/js/app/src/tips/noauth.js',
        'tips/noauthfora': './static/js/app/src/tips/noauthfora.js',
        'tips/noauthforvip': './static/js/app/src/tips/noauthforvip.js',
        'tips/upgrade': './static/js/app/src/tips/upgrade.js',
        'tips/expired': './static/js/app/src/tips/expired.js',
        'accommodation/calender': './static/js/app/src/accommodation/calender/calender.js',
        'manageVip/vip': './static/js/app/src/manageVip/vipItems/vip.js'
    },
    output: {
        filename: '[name].js',
        publicPath: './dist/'
    },
    module: {
        loaders: [
            {test: /\.html$/,  loader: 'raw-loader', exclude: [ path.join(__dirname, './view')] }
        ]
    },
    resolve: {
        extensions: ['.js', ''],
            alias: {
            cookie: path.join(__dirname, './static/js/lib/jquery.cookie.js'),
                jquery: path.join(__dirname, './static/js/lib/jquery.min.js'),
                jqueryui: path.join(__dirname, './static/js/lib/jquery-ui.min.js'),
                'datepicker-zh': path.join(__dirname, './static/js/lib/datepicker-zh-CN.js'),
                bootstrap: path.join(__dirname, './static/js/lib/bootstrap.min.js'),
                header: path.join(__dirname, './static/js/app/src/common/header.js'),
                leftMenu: path.join(__dirname, './static/js/app/src/common/leftMenu.js'),
                util: path.join(__dirname, './static/js/app/src/common/util.js'),
                logout: path.join(__dirname, './static/js/app/src/common/logout.js'),
                AJAXService: path.join(__dirname, './static/js/app/src/common/AJAXService.js'),
                accommodationPriceList: path.join(__dirname, './static/js/app/src/business/price/accommodationPriceList.js'),
                foodETPriceList: path.join(__dirname, './static/js/app/src/business/price/foodETPriceList.js'),
                trToggle: path.join(__dirname, './static/js/app/src/common/trToggle.js'),
                loginValidate: path.join(__dirname, './static/js/app/src/login/login.validate.js'),
                modal: path.join(__dirname, './static/js/app/src/common/modal.js'),
                validate: path.join(__dirname, './static/js/lib/jquery.validate.min.js'),
                validation: path.join(__dirname, './static/js/lib/validation.js'),
                seasonManage: path.join(__dirname, './static/js/app/src/business/price/seasonManage.js'),
                monthManage: path.join(__dirname, './static/js/app/src/business/price/monthManage.js'),
                floatInfo: path.join(__dirname, './static/js/app/src/common/floatInfo.js'),
                roomCategoryList: path.join(__dirname, './static/js/app/src/business/category/room/roomCategoryList.js'),
                fileupload: path.join(__dirname, './static/js/lib/jquery.fileupload.js'),
                'jquery.ui.widget': path.join(__dirname, './static/js/lib/jquery.ui.widget.js'),
                iframe: path.join(__dirname, './static/js/lib/jquery.iframe-transport.js'),
                networkAction: path.join(__dirname, './static/js/app/src/common/networkAction.js'),
                dsy: path.join(__dirname, './static/js/app/src/common/dsy.js'),
                angular: path.join(__dirname, './node_modules/angular/angular.min.js'),
        }
    }
};
module.exports = webpackConf;