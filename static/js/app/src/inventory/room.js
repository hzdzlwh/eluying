/**
 * Created by huwanqi on 15/12/26.
 */
var AJAXService = require("AJAXService");
var util = require("util");
var leftMenu = require("leftMenu");
var header = require("header");
var trToggle = require("trToggle");

$(document).ready(function(){
    /*
    initialize public modules
     */
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();

    trToggle();

    $.ajax({
        url: AJAXService.getUrl("getCategoriesAndInventoriesUrl"),
        dataFilter: function (result) {
            return AJAXService.sessionValidate(result);
        },
        success: function(result){
            console.log(result);
        }
    })

});