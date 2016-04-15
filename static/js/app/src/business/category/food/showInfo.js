/**
 * Created by lingchenxuan on 16/1/10.
 */
var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("fileupload");

var showInfo = {
    //读取展示信息
    pullFoodShowInfo: function (id) {
        /*$.ajax({
            url: AJAXService.getUrl("pullShowInfoUrl"),
            data: {id: id},
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function (result) {
                showInfo.showFoodShowInfo(result.data);
            }
        })*/
        AJAXService.ajaxWithToken('get','/category/pullShowInfoPC',{id: id},function (result) {
            showInfo.showFoodShowInfo(result.data);
        });
    },

//显示展示信息
    showFoodShowInfo: function (data) {
        if (data.coverUrl != null) {
            $(".cover .photoContainer").html("<img onclick='selectPhoto(this)' class='coverImg' height='205px' src='" + data.coverUrl + "' />");
            $(".cover .create").hide();
        } else {
            $(".cover .photoContainer").html("");
            $(".cover .create").show();
        }
        if (data.detailImgUrl != null) {
            var detailStr = "";
            $.each(data.detailImgUrl, function (index, element) {
                detailStr += "<img class='detailImg' height='102px' src='" + element + "' />"
            });
            $(".detail .photoContainer").html(detailStr);
            if ($(".detailImg").length == 6) {
                $(".detail .create").hide();
            } else {
                $(".detail .create").show();
            }
        } else {
            $(".detail .photoContainer").html("");
            $(".detail .create").show();
        }
        //上传图片
        $("#cover").fileupload({
            url: AJAXService.getUrl2("uploadImageUrl"),
            done: function (e, data) {
                var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
                result = JSON.parse(result);
                $(".cover .photoContainer").html("<img class='coverImg' height='205px' src='" + result.data.url + "' />");
                $(".cover .create").hide();
                $(".coverError").addClass("hide");
            }
        });
        $("#detail").fileupload({
            url: AJAXService.getUrl2("uploadImageUrl"),
            done: function (e, data) {
                var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
                result = JSON.parse(result);
                $(".detail .photoContainer").append("<img onclick='selectPhoto(this)' class='detailImg' height='102px' src='" + result.data.url + "' />");
                if ($(".detailImg").length == 6) {
                    $(".detail .create").hide();
                }
                $(".detailError").addClass("hide");
            }
        })
    },

//准备展示信息数据
    makeFoodShowInfo: function (that) {
        var detailImgUrl = [];
        $(".detailImg").each(function () {
            detailImgUrl.push($(this).attr("src"));
        });
        var item = {
            coverUrl: $(".coverImg").attr("src"),
            detailImgUrl: JSON.stringify(detailImgUrl),
            id: $(".categoryGrid").find(".mainActive").find(".id").val()
        };
        showInfo.sendFoodShowInfo(item, that);
    },

//选择图片
    selectPhoto: function (obj) {
        if ($(obj).hasClass("coverImg")) {
            $(obj).addClass("photoSelected");
            $("#editDisplayInfo .first .operateItem").removeClass("hide");
        } else {
            $(".detailImg").removeClass("photoSelected");
            $(obj).addClass("photoSelected");
            $("#editDisplayInfo .second .operateItem").removeClass("hide");
        }
    },

//发送展示信息
    sendFoodShowInfo: function (item, that) {
        /*$.ajax({
            url: AJAXService.getUrl("editShowInfoUrl"),
            data: item,
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function (result) {
                if (util.errorHandler(result)) {
                    modal.clearModal(that);
                }
            }
        })*/
        AJAXService.ajaxWithToken('post','/category/modifyShowInfoPC',item,function (result) {
            if (util.errorHandler(result)) {
                modal.clearModal(that);
            }
        });
    },

    events: {
        "click #editDisplayInfo .coverImg": function(){
            var that = this;
            showInfo.selectPhoto(that)
        },
        "click #editDisplayInfo .detailImg": function(){
            var that = this;
            showInfo.selectPhoto(that)
        },
        //编辑展示信息
        "click #editFoodShowInfoButton": function () {
            $("#editDisplayInfo h1").html("编辑展示信息-" + $(".mainActive td:eq(0)").html());
            $(".detail .photoContainer").html("");
            $(".cover .photoContainer").html("");
            var id = $(".mainActive .id").val();
            showInfo.pullFoodShowInfo(id);
        },

//删除封面
        "click #deleteCover": function () {
            $(".cover .photoSelected").remove();
            $("#editDisplayInfo .first .operateItem").addClass("hide");
            $(".cover .create").show();
        },

//替换封面
        "click #replaceCover": function () {
            $("#cover").click();
        },

//删除详细图片
        "click #deleteDetail": function () {
            $(".detail .photoSelected").remove();
            $("#editDisplayInfo .second .operateItem").addClass("hide");
            $(".detail .create").show();
        },

//替换详细图片
        "click #replaceDetail": function () {
            $("#replaceDetailImg").click();
            $("#replaceDetailImg").fileupload({
                url: AJAXService.getUrl2("uploadImageUrl"),
                done: function (e, data) {
                    var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
                    result = JSON.parse(result);
                    $(".detail .photoSelected").attr("src", result.data.url);
                }
            });
        },

        "click .cover .create": function () {
            $("#cover").click();
        },
        "click .detail .create": function () {
            $("#detail").click();
        },

//编辑展示信息确认
        "click #editFoodShowOk": function () {
            if ($(".cover .photoContainer").html() == "") {
                $(".coverError").removeClass("hide");
                return
            }
            if ($(".detail .photoContainer").html() == "") {
                $(".detailError").removeClass("hide");
                return
            }
            var that = this;
            showInfo.makeFoodShowInfo(that);
        }
    }
};

module.exports = showInfo;