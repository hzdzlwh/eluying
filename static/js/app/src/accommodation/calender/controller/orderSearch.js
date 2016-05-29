var util = require("util");
var AJAXService = require("AJAXService");
var modal = require("modal");
require("angular");

var constService = require("../services/constService");
var getDataService = require("../services/getDataService");

var orderSearch = function(app){
    constService(app);
    getDataService(app);
    app.controller("orderSearch", ['$rootScope', '$scope', 'constService', 'getDataService',
        function(rootScope, scope, constService, getDataService){
        scope.searchKeyword = '';
        scope.showResults = false;
        scope.searchResultPage = 1;
        scope.searchResultUnit = 5;
        scope.searchResultsNum = 0;
        scope.searchResults = [];
        scope.search = function(flag){
            if(flag){
                scope.searchResultPage = 1;
            }
            AJAXService.ajaxWithToken('GET', 'orderSearchPCUrl', {
                keyword: scope.searchKeyword,
                page: scope.searchResultPage,
                limit: scope.searchResultUnit,
                searchType: 1
            }, function(result){
                if(result.code === 1){
                    scope.showResults = true;
                    scope.searchResults = result.data.orderList;
                    scope.searchResults.forEach(function(d){
                        d.classStr = rootScope.statusStr[d.orderState].classStr;
                        d.html = rootScope.statusStr[d.orderState].long;
                    });
                    scope.searchResultsNum = result.data.orderAmount;
                    scope.$apply();
                }else{
                    modal.somethingAlert(result.msg);
                }
            });
        };
        scope.searchResultNextPage = function(){
            if(scope.searchResultPage * 5 >= scope.searchResultsNum){
                return false;
            }
            scope.searchResultPage++;
            scope.search();
        };
        scope.searchResultPreviousPage = function(){
            if(scope.searchResultPage === 1){
                return false;
            }
            scope.searchResultPage--;
            scope.search();
        };
        scope.searchResultOnClick = function(orderId){
            scope.showResults = false;
            getDataService.getOrderDetail(orderId, rootScope);
        };
    }]);
};

module.exports = orderSearch;