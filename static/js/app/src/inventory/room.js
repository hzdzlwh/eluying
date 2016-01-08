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
        data:{
            date: '2016-01-01',
            type: 0
        },
        dataFilter: function (result) {
            return AJAXService.sessionValidate(result);
        },
        success: function(result){
            console.log(result);
        }
    })

});