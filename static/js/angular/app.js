var app = angular.module('app', ['ngRoute', 'UIModule']);
app.config(function($routeProvider){
    $routeProvider
        .when('/home', {
            templateUrl: 'view/home.html'
        })
        .when('/category/room', {
            templateUrl: 'view/category/room.html'
        })
        .when('/category/entertainment', {
            templateUrl: 'view/category/entertainment.html'
        })
        .when('/category/food', {
            templateUrl: 'view/category/food.html'
        })
        .when('/category/shop', {
            templateUrl: 'view/category/shop.html'
        })
        .otherwise({
            redirectTo: '/home'
        })
})