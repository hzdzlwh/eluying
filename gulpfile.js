var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
    webpack = require("webpack"),
    gulpWebpack = require("webpack-stream"),
    path = require("path"),
    gutil = require("gulp-util"),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "./",
            index: "login.html"
		}
	});
});


gulp.task('styles',function(){
	return sass('static/sass/main.scss', {style: 'compressed'})
		.pipe(autoprefixer('last 3 version'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('static/css'))
		.pipe(notify({title:'好棒啊！',message:'css编译完成，站起来活动活动'}))
        .pipe(reload({stream: true}));
});

gulp.task('webpack', function(){
    return gulp.src('static/js/app/src/entry.js')
        .pipe(gulpWebpack({
            plugins: [
                new webpack.ProvidePlugin({
                    "$": 'jquery',
                    "jQuery": 'jquery'
                }),
                new webpack.optimize.CommonsChunkPlugin('common.js')
            ],
            entry: {
                "login/login": "./static/js/app/src/login/login.js",
                "price/roomEntry": "./static/js/app/src/price/roomEntry.js",
                "price/foodETEntry": "./static/js/app/src/price/foodETEntry.js",
                "inventory/room": "./static/js/app/src/inventory/room.js",
                "inventory/food": "./static/js/app/src/inventory/food.js",
                "inventory/entertainment": "./static/js/app/src/inventory/entertainment.js",
                "category/roomEntry": "./static/js/app/src/category/room/roomEntry.js",
                "category/foodEntry": "./static/js/app/src/category/food/foodEntry.js",
                "category/ETEntry": "./static/js/app/src/category/entertainment/ETEntry.js"
            },
            output: {

                filename: "[name].js",
                publicPath: "./dist/"
            },
            resolve: {
                extensions: ['.js', ""],
                alias: {
                    cookie: path.join(__dirname,"./static/js/lib/jquery.cookie.js"),
                    jquery: path.join(__dirname,"./static/js/lib/jquery.min.js"),
                    jqueryui: path.join(__dirname,"./static/js/lib/jquery-ui.min.js"),
                    "datepicker-zh": path.join(__dirname,"./static/js/lib/datepicker-zh-CN.js"),
                    bootstrap: path.join(__dirname,"./static/js/lib/bootstrap.min.js"),
                    header: path.join(__dirname,"./static/js/app/src/common/header.js"),
                    leftMenu: path.join(__dirname,"./static/js/app/src/common/leftMenu.js"),
                    util: path.join(__dirname,"./static/js/app/src/common/util.js"),
                    logout: path.join(__dirname,"./static/js/app/src/common/logout.js"),
                    AJAXService: path.join(__dirname,"./static/js/app/src/common/AJAXService.js"),
                    accommodationPriceList: path.join(__dirname,"./static/js/app/src/price/accommodationPriceList.js"),
                    foodETPriceList: path.join(__dirname,"./static/js/app/src/price/foodETPriceList.js"),
                    trToggle: path.join(__dirname,"./static/js/app/src/common/trToggle.js"),
                    loginValidate: path.join(__dirname,"./static/js/app/src/login/login.validate.js"),
                    modal: path.join(__dirname,"./static/js/app/src/common/modal.js"),
                    validate: path.join(__dirname,"./static/js/lib/jquery.validate.min.js"),
                    validation: path.join(__dirname,"./static/js/lib/validation.js"),
                    seasonManage: path.join(__dirname, "./static/js/app/src/price/seasonManage.js"),
                    monthManage: path.join(__dirname, "./static/js/app/src/price/monthManage.js"),
                    floatInfo: path.join(__dirname, "./static/js/app/src/common/floatInfo.js"),
                    roomCategoryList: path.join(__dirname, "./static/js/app/src/category/room/roomCategoryList.js"),
                    fileupload: path.join(__dirname,"./static/js/lib/jquery.fileupload.js"),
                    "jquery.ui.widget": path.join(__dirname,"./static/js/lib/jquery.ui.widget.js"),
                    iframe: path.join(__dirname,"./static/js/lib/jquery.iframe-transport.js")
                }
            },
        devtool: "sourcemap"
        }, null, function(err, stats) {
            if(err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({
            }));
        }, webpack))
        .pipe(gulp.dest('static/js/app/dist/'))
        .pipe(reload({stream: true}))
        .pipe(notify({title:'好棒啊！',message:'<%= file.relative %>编译完成，站起来活动活动'}));
});



gulp.task('watch',function(){
	gulp.watch('static/sass/**/*.scss',['styles']);
	gulp.watch('static/js/app/src/**/*.js',['webpack']);
	gulp.watch("**/*.html").on('change', reload);
});

gulp.task('default',['watch'],function(){
	gulp.start('browser-sync');
	gulp.start('styles');
	gulp.start('webpack');
	gulp.start('watch');
});