var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var searchService = function(app){
    app.service("searchService", ["$rootScope", function(rootScope){
        this.init = function(){
            rootScope.searchKeyword = '';
            rootScope.searchResultPage = 0;
            rootScope.searchResultUnit = 5;
        };
        this.search = function(){

        };
        this.searchResultNextPage = function(){};
        this.searchResultPreviousPage = function(){};
        this.searchResultOnClick = function(){};
    }]);
};

module.exports = searchService;