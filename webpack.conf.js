/**
 * Created by lingchenxuan on 16/6/12.
 */
var webpack = require('webpack'),
    config = require('./config'),
    path = require('path');
    // HappyPack = require('happypack');
var webpackConf =  {
    devtool: 'inline-source-map',
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        // new HappyPack({ id: 'js', threads: 4 })
    ],
    entry: config.js,
    output: {
        filename: '[name].js',
        publicPath: './dist/'
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel', include: [path.join(__dirname, './static/js/app/src'), path.join(__dirname, './node_modules/dd-vue-component/src')]},
            {test: /\.html$/,  loader: 'raw-loader', exclude: [ path.join(__dirname, './view')] },
            {test: /\.vue$/, loader: 'vue'},
            {test: /\.scss$/, loaders: ['style', 'css', 'sass']},
            {test: /\.css$/, loaders: ['style', 'css']},
            {test: /\.(png|jpg|woff|woff2|eot|ttf|svg)/, loader: 'url-loader?limit=100000'}
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', ''],
        alias: {
            vue1: path.join(__dirname, './static/js/lib/vue.1.0.26.js'),
            vue: 'vue/dist/vue.js',
            cookie: path.join(__dirname, './static/js/lib/jquery.cookie.js'),
            jquery: path.join(__dirname, './static/js/lib/jquery.min.js'),
            jqueryui: path.join(__dirname, './static/js/lib/jquery-ui.min.js'),
            'datepicker-zh': path.join(__dirname, './static/js/lib/datepicker-zh-CN.js'),
            bootstrap: path.join(__dirname, './static/js/lib/bootstrap.min.js'),
            header: path.join(__dirname, './static/js/app/src/common/header'),
            leftMenu: path.join(__dirname, './static/js/app/src/common/leftMenu'),
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