var logout = require("logout");
var util = require("util");
var AJAXService = require("AJAXService");
var networkAction = require("networkAction");
var modal = require('modal');
var header = {
    showHeader : function(){
        var that = this;
        var headerStr = "<div class='header clearfloat'>" +
            "<div class='headerSwitch'>" +
            "<div class='avatorContainer'>" +
            "<p class='camp-name'>" + localStorage.getItem('campName') + "</p>" +
            "<img src='../../static/image/upload.png' class='upload'>" +
            "</div>" +
            "<dl id='headerSwitchCamp'>" +
            "<dd id='headerJoinNewNetwork'>＋ 加入新网络" +
            "</dd>" +
            "<dd id='headerCreateNetwork'>＋ 创建新网络" +
            "</dd>" +
            "</dl>" +
            "</div>" +
            "<ul>" +
            "<li><a id='categoryMenu' href='/view/category/room.html'>品类管理</a></li>" +
            "<li><a id='inventoryMenu' href='/view/inventory/room.html'>库存管理</a></li>" +
            "<li><a id='priceMenu' href='/view/price/room.html'>价格维护</a></li>" +
            "</ul>" +
            "<div class='right'>" +
            "<div class='userName'>" +
            "<span></span>" +
            "</div>" +
            "<div class='logout' style='display: none'>" +
            "<a href='javascript:void(0)' id='logout'>退出账户</a>" +
            "</div>" +
            "</div>" +
            "</div>"; +
        $("body").prepend(headerStr);
        //根据path激活active
        $(".userName").find("span").html(localStorage.getItem("userName"));
        var pathArray = window.location.pathname.split("/");
        var menu = pathArray[2];
        $("#" + menu + "Menu").addClass("active");
        util.bindDomAction(this.events);
        $.ajax({
            url: AJAXService.getUrl("/user/getPersonalInfoInNetwork"),
            success: function (data) {
                var campId = localStorage.getItem("campId");
                if(data.code == 1){
                    var result = data.data.camps;
                    var key = "";
                    var flag = false;
                    var object = {
                        created: "",
                        joined: ""
                    }
                    for(var i = 0; i < result.length; i++){
                        var item = result[i];
                        if(item.userType == 1){
                            key = "created";
                        }else{
                            key = "joined";
                        }
                        if(item.campId == campId){
                            flag = true;
                        }else{
                            flag = false;
                        }
                        object[key] += that.getItemHtml(item, flag);
                    }
                    if(object.created){
                        object.created = "<dt>我创建的</dt>"+ object.created +"<hr>";
                    }
                    if(object.joined){
                        object.joined = "<dt>我加入的</dt>"+object.joined+"<hr>";
                    }
                }
                $("#headerSwitchCamp").prepend(object.created+object.joined);
                $("#headerSwitchCamp .networkButton").click(function(){
                    var campId = $(this).attr("data-campId");
                    var campName = $(this).attr("data-campName");
                    $.ajax({
                        url: AJAXService.getUrl("/network/changeNetwork"),
                        data: {
                            campId: campId
                        },
                        success: function (data) {
                            if(data.code == 1){
                                localStorage.setItem("campId", campId);
                                localStorage.setItem("campName", campName);
                                window.location.reload();
                            }else if(data.code == 11002){
                                alert(data.msg);
                                logout.logout();
                            }else{
                                alert(data.msg);
                            }
                        }
                    })
                })
            }
        })
    },
    events: {
        "click #logout": function(e) {
            e.stopPropagation();
            logout.logout();
        },
        "click .userName": function(e) {
            e.stopPropagation();
            $(this).addClass('userName-active');
            $('.logout').show();
        },
        "click body": function() {
            $('.userName').removeClass('userName-active');
            $("#headerSwitchCamp").slideUp();
            $('.logout').hide();
        },
        "click #headerJoinNewNetwork": function () {
            networkAction.init("joinStep1",{}).modal("show");
        },
        "click #headerCreateNetwork": function () {
            networkAction.init("create",{}).modal("show");
        },
        "click .avatorContainer": function(e){
            e.stopPropagation();
            $("#headerSwitchCamp").slideToggle();
        }
    },
    getItemHtml: function(item, flag){
        var className = "networkButton";
        if(flag){
            className += " on";
        }else{
            className += "";
        }
        return "<dd class='"+className+"' data-campId='"+item.campId+"' data-campName='"+item.campName+"'>"+item.campName+"</dd>"
    }
};

module.exports = header;