/**
 * Created by lingchenxuan on 16/6/12.
 */
var webpack = require('webpack');
var config = require('./config');
var path = require('path');
var webpackConf = {
    devtool: 'inline-source-map',
    node: {
        fs: 'empty'
    },
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin('common.js')
    ],
    entry: config.js,
    output: {
        filename: '[name].js',
        publicPath: './dist/'
    },
    eslint: {
        failOnWarning: false,
        failOnError: false
    },
    module: {
        preLoaders: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint',
                include: [
                    path.join(__dirname, './static/js/app/src/customer'),
                    path.join(__dirname, './static/js/app/src/ordersManage'),
                    path.join(__dirname, './static/js/app/src/accommodation'),
                    //path.join(__dirname, './static/js/app/src/reports')
                ]
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: [path.join(__dirname, './static/js/app/src'), path.join(__dirname, './node_modules/dd-vue-component/src')]
            },
            { test: /\.html$/, loader: 'raw-loader', exclude: [path.join(__dirname, './view')] },
            { test: /\.vue$/, loader: 'vue' },
            { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
            { test: /\.css$/, loaders: ['style', 'css'] },
            { test: /\.(png|jpg|woff|woff2|eot|ttf|svg|gif)/, loader: 'url-loader?limit=100000' }
        ]
    },
    vue: {
        loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader'
        }
    },
    resolve: {
        extensions: ['.js', '.vue', ''],
        alias: {
            vue1: path.join(__dirname, './static/js/lib/vue.1.0.26.js'),
            vue: 'vue/dist/vue.js',
            cookie: path.join(__dirname, './static/js/lib/jquery.cookie.js'),
            jqueryui: path.join(__dirname, './static/js/lib/jquery-ui.min.js'),
            'datepicker-zh': path.join(__dirname, './static/js/lib/datepicker-zh-CN.js'),
            bootstrap: path.join(__dirname, './static/js/lib/bootstrap.min.js'),
            header: path.join(__dirname, './static/js/app/src/common/header'),
            leftMenu: path.join(__dirname, './static/js/app/src/common/leftMenu'),
            util: path.join(__dirname, './static/js/app/src/common/util.js'),
            logout: path.join(__dirname, './static/js/app/src/common/logout.js'),
            http: path.join(__dirname, './static/js/app/src/common/http.js'),
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
            angular: path.join(__dirname, './node_modules/angular/angular.min.js')
        }
    }
};
module.exports = webpackConf;
