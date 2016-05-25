var util = require("util");
require("angular");

var getDataService = require("../services/getDataService");

var orderEditService = function(app){
    getDataService(app);
    app.service("orderEditService", ['getDataService', function(getDataService){
        this.resetOrderEdit = function(){
            return {}
        };
    }]);
};

module.exports = orderEditService;