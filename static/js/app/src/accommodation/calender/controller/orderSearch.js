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
        scope.searchResultUnit = 5;
        scope.searchResultsNum = 0;
        scope.searchResults = [];
        scope.search = function(){
            AJAXService.ajaxWithToken('GET', 'orderSearchPCUrl', {
                keyword: scope.searchKeyword,
                page: scope.searchResultPage,
                limit: scope.searchResultUnit,
                searchType: 1
            }, function(result){
                scope.searchResults = result.data.orderList;
                scope.searchResults.forEach(function(d){
                    d.classStr = rootScope.statusStr[d.orderState].classStr;
                    d.html = rootScope.statusStr[d.orderState].long;
                });
                scope.searchResultsNum = result.data.orderAmount;
                scope.$apply();
            });
        };
        scope.searchResultNextPage = function(){
            (scope.searchResultPage+1) * scope.searchResultUnit < scope.searchResultsNum
            && scope.searchResultPage++;
            scope.search();
        };
        scope.searchResultPreviousPage = function(){
            scope.searchResultPage > 0 && scope.searchResultPage--;
            scope.search();
        };
        scope.searchResultOnClick = function(){
            //TODO
        };
    }]);
};

module.exports = orderSearch;