var util = require("util");
var AJAXService = require("AJAXService");
require("angular");

var constService = require("../services/constService");

var orderSearch = function(app){
    constService(app);
    app.controller("orderSearch", ['$rootScope', '$scope', 'constService', 
        function(rootScope, scope, constService){
        scope.searchKeyword = '';
        scope.searchResultPage = 0;
        scope.searchResultUnit = 10;
        scope.searchResultsNum = 0;
        scope.searchResults = [];
        scope.search = function(){
            AJAXService.ajaxWithToken('GET', 'orderSearchUrl', {
                keyword: scope.searchKeyword,
                page: scope.searchResultPage,
                searchType: 1,
            }, function(result){
                scope.searchResults = result.data.list;
                scope.searchResults.forEach(function(d){
                    d.classStr = constService.statusStr[d.orderState].classStr;
                    d.html = constService.statusStr[d.orderState].long;
                });
                scope.searchResultsNum = scope.searchResults.length;
                scope.$apply();
            });
        };
        scope.searchResultNextPage = function(){
            scope.searchResultPage++;
            scope.search();
        };
        scope.searchResultPreviousPage = function(){
            scope.searchResultNextPage && scope.searchResultPage--;
            scope.search();
        };
        scope.searchResultOnClick = function(){
            //TODO
        };
    }]);
};

module.exports = orderSearch;