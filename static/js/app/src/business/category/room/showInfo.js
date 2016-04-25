var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("fileupload");
var showInfo = {

    changed: false,

    isLoading: true,
    coverIsLoading: true,
    detailIsLoading: true,

    setChanged: function () {
        this.changed = true;
    },
    //读取展示信息
    pullRoomShowInfo: function (id) {
        /*$.ajax({
            url: AJAXService.getUrl("pullShowInfoUrl"),
            data: {id: id},
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function (result) {
                showInfo.showRoomShowInfo(result.data);
            }
        })*/
        AJAXService.ajaxWithToken('get', '/category/pullShowInfoPC', {id: id}, function (result) {
            showInfo.isLoading = false;
            showInfo.coverIsLoading = false;
            showInfo.detailIsLoading = false;
            showInfo.showRoomShowInfo(result.data);
        });
    },

    //显示展示信息
    showRoomShowInfo: function (data) {
        data.fitNum && $("#roomShowFitNum").val(data.fitNum);
        data.area && $("#roomShowArea").val(data.area);
        data.bedType && $("#roomShowBed").val(data.bedType);
        data.remark && $("#roomShowDescription").val(data.remark);
        if (data.facilities.hotWater.status == 1) {
            $("#hotWaterY").prop("checked", true);
            $("#hotWaterDescription").val(data.facilities.hotWater.description);
            $("#hotWaterSpan").prevAll("div").removeClass("hide");
        } else {
            $("#hotWaterN").prop("checked", true);
            $("#hotWaterSpan").prevAll("div").addClass("hide");
        }
        if (data.facilities.breakfast.status == 1) {
            $("#breakfastY").prop("checked", true);
            $("#breakfastDescription").val(data.facilities.breakfast.description);
            $("#breakfastSpan").prevAll("div").removeClass("hide");
        } else {
            $("#breakfastN").prop("checked", true);
            $("#breakfastSpan").prevAll("div").addClass("hide");
        }
        if (data.facilities.bathroom.status == 1) {
            if (data.facilities.bathroom.description == "公共浴室") {
                $("#publicBathroom").prop("checked", true);
            } else {
                $("#independentBathroom").prop("checked", true);
            }
        } else {
            $("#bathroomN").prop("checked", true);
        }
        if (data.facilities.toilet.status == 1) {
            if (data.facilities.toilet.description == "公共厕所") {
                $("#publicToilet").prop("checked", true);
            } else {
                $("#independentToilet").prop("checked", true);
            }
        } else {
            $("#toiletN").prop("checked", true);
        }
        if (data.facilities.manager.status == 1) {
            $("#butlerY").prop("checked", true);
        } else {
            $("#butlerN").prop("checked", true);
        }
        if (data.facilities.network.status == 1) {
            $("#networkY").prop("checked", true);
            $("#networkSpan").prevAll("div").removeClass("hide");
            $("#networkDescription").val(data.facilities.network.description);
        } else {
            $("#networkN").prop("checked", true);
            $("#networkSpan").prevAll("div").addClass("hide");
        }
        if (data.extraFacilities != null) {
            var str = "";
            $.each(data.extraFacilities, function (index, element) {
                str += "<tr class='mainClass'><td>" + element.name + "</td></tr>"
            });
            $("#editDisplayInfo tbody").html(str);
            $("#editDisplayInfo .mainClass").on("click", function () {
                $("#editDisplayInfo .mainClass").removeClass("mainActive");
                $(this).addClass("mainActive");
                $("#editDisplayInfo .firstTwo .operateItem").removeClass("hide");
            });
        }
        if (data.coverUrl != null) {
            $(".cover .photoContainer").html("<img class='coverImg' height='205px' src='" + data.coverUrl + "' />");
            $(".cover .create").hide();
        } else {
            $(".cover .create").show();
            $(".cover .photoContainer").html("");
        }
        if (data.detailImgUrl != null) {
            var detailStr = "";
            $.each(data.detailImgUrl, function (index, element) {
                detailStr += "<img class='detailImg' height='102px' src='" + element + "' />"
            });
            $(".detail .photoContainer").html(detailStr);
            if ($(".detailImg").length >= 6) {
                $(".detail .create").hide();
            } else {
                $(".detail .create").show();
            }
        } else {
            $(".detail .create").show();
            $(".detail .photoContainer").html("");
        }
        //上传图片
        $("#cover").fileupload({
            url: AJAXService.getUrl2("uploadImageUrl"),
            send: function(){
                showInfo.coverIsLoading = true;
            },
            done: function (e, data) {
                var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
                result = JSON.parse(result);
                $(".cover .photoContainer").html("<img onclick='selectPhoto(this)' class='coverImg' height='205px' src='" + result.data.url + "' />");
                $(".cover .create").hide();
                $(".coverError").addClass("hide");
                showInfo.changed = true;
                showInfo.coverIsLoading = false;
            }
        });
        $("#detail").fileupload({
            url: AJAXService.getUrl2("uploadImageUrl"),
            send: function(){
                showInfo.detailIsLoading = true;
            },
            done: function (e, data) {
                var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
                result = JSON.parse(result);
                $(".detail .photoContainer").append("<img onclick='selectPhoto(this)' class='detailImg' height='102px' src='" + result.data.url + "' />");
                if ($(".detailImg").length >= 6) {
                    $(".detail .create").hide();
                }
                $(".detailError").addClass("hide");
                showInfo.changed = true;
                showInfo.detailIsLoading = false;
            }
        })
    },

//准备展示信息数据
    makeRoomShowInfo: function (that) {
        var detailImgUrl = [];
        $(".detailImg").each(function () {
            detailImgUrl.push($(this).attr("src"));
        });
        var extraFacilities = [];
        $("#editDisplayInfo .mainClass").each(function () {
            extraFacilities.push({
                name: $(this).find("td").html(),
                description: ""
            })
        });
        var facilities = {
            hotWater: {
                status: $("#hotWaterY").prop("checked") ? 1 : 0,
                description: $("#hotWaterY").prop("checked") ? $("#hotWaterDescription").val() : ""
            },
            breakfast: {
                status: $("#breakfastY").prop("checked") ? 1 : 0,
                description: $("#breakfastY").prop("checked") ? $("#breakfastDescription").val() : ""
            },
            bathroom: {
                status: $("#bathroomN").prop("checked") ? 0 : 1,
                description: $("#publicBathroom").prop("checked") ? "公共浴室" : ($("#independentBathroom").prop("checked") ? "独立浴室" : "")
            },
            toilet: {
                status: $("#toiletN").prop("checked") ? 0 : 1,
                description: $("#publicToilet").prop("checked") ? "公共厕所" : ($("#independentToilet").prop("checked") ? "独立厕所" : "")
            },
            manager: {
                status: $("#butlerY").prop("checked") ? 1 : 0,
                description: ""
            },
            network: {
                status: $("#networkY").prop("checked") ? 1 : 0,
                description: $("#networkY").prop("checked") ? $("#networkDescription").val() : ""
            }
        };
        var item = {
            area: $("#roomShowArea").val(),
            bedType: $("#roomShowBed").val(),
            coverUrl: $(".coverImg").attr("src"),
            detailImgUrl: JSON.stringify(detailImgUrl),
            extraFacilities: JSON.stringify(extraFacilities),
            fitNum: $("#roomShowFitNum").val(),
            remark: $("#roomShowDescription").val(),
            id: $("#roomCategoryList").find(".mainActive").find(".id").val(),
            facilities: JSON.stringify(facilities)
        };
        showInfo.sendRoomShowInfo(item, that);
    },

//选择图片
    selectPhoto: function (obj) {
        if ($(obj).hasClass("coverImg")) {
            $(obj).addClass("photoSelected");
            $("#editDisplayInfo .firstOne .operateItem").removeClass("hide");
        } else {
            $(".detailImg").removeClass("photoSelected");
            $(obj).addClass("photoSelected");
            $("#editDisplayInfo .second .operateItem").removeClass("hide");
        }
    },

    //发送展示信息
    sendRoomShowInfo: function (item, that) {
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

        "click .Y": function () {
            $(this).nextAll("div").removeClass("hide");
        },
        "click .N": function () {
            $(this).prevAll("div").addClass("hide");
        },

//编辑房间展示信息
        "click #editRoomDisplayInfoButton": function () {
            $("#editDisplayInfo h1").html("编辑展示信息-" + $(".mainActive td:eq(0) span").html());
            $(".detail .photoContainer").html("");
            $(".cover .photoContainer").html("");
            var id = $(".mainActive .id").val();
            showInfo.pullRoomShowInfo(id);
        },
//编辑展示信息确认
        "click #editRoomShowOk": function () {
            if (!$("#type form").valid()) {
                return;
            }
            if ($(".rightTab").parent().hasClass("active")) {
                if ($("#roomShowFitNum").val() == "") {
                    modal.somethingAlert("请填写可容纳人数");
                    return;
                }
                if ($("#roomShowArea").val() == "") {
                    modal.somethingAlert("请填写房间面积");
                    return;
                }
                if ($("#roomShowBed").val() == "") {
                    modal.somethingAlert("请填写床型");
                    return;
                }
            }
            if ($(".cover .photoContainer").html() == "") {
                $(".coverError").removeClass("hide");
                if ($(".rightTab").parent().hasClass("active")) {
                    modal.somethingAlert("请上传封面");
                }
                return
            }
            if ($(".detail .photoContainer").html() == "") {
                if ($(".rightTab").parent().hasClass("active")) {
                    modal.somethingAlert("请上传详细图片");
                }
                $(".detailError").removeClass("hide");
                return
            }
            var that = this;
            showInfo.makeRoomShowInfo(that);
            showInfo.changed = false;
        },
//新增设施确定
        "click #createFacilityOk": function () {
            if (!$("#createFacility form").valid()) {
                return;
            }
            var that = this;
            $("#editDisplayInfo tbody").append("<tr class='mainClass'><td>" + $("#createFacilityName").val() + "</td></tr>");
            $("#editDisplayInfo .mainClass").on("click", function () {
                $("#editDisplayInfo .mainClass").removeClass("mainActive");
                $(this).addClass("mainActive");
                $("#editDisplayInfo .firstTwo .operateItem").removeClass("hide");
            });
            showInfo.changed = true;
            modal.clearModal(that);
        },

//删除设施
        "click #deleteFacility": function () {
            $("#editDisplayInfo .mainActive").remove();
            $("#editDisplayInfo .operateItem").addClass("hide");
            showInfo.changed = true;
        },

//编辑设施
        "click #editFacilityButton": function () {
            $("#editFacilityName").val($("#editDisplayInfo .mainActive").find("td").html());
        },

//编辑设施确认
        "click #editFacilityOk": function () {
            if (!$("#editFacility form").valid()) {
                return;
            }
            var that = this;
            $("#editDisplayInfo .mainActive").find("td").html($("#editFacilityName").val());
            showInfo.changed = true;
            modal.clearModal(that);
        },

//删除封面
        "click #deleteCover": function () {
            $(".cover .photoSelected").remove();
            $("#editDisplayInfo .first .operateItem").addClass("hide");
            $(".cover .create").show();
            showInfo.changed = true;
        },

//删除详细图片
        "click #deleteDetail": function () {
            $(".detail .photoSelected").remove();
            $("#editDisplayInfo .second .operateItem").addClass("hide");
            $(".detail .create").show();
            showInfo.changed = true;
        },

        "click .create": function(e){
            if(showInfo.isLoading){
                e.preventDefault();
            }
        },
        "click .cover .create": function(e){
            if(showInfo.coverIsLoading){
                e.preventDefault();
            }
        },
        "click .detail .create": function(e){
            if(showInfo.detailIsLoading){
                e.preventDefault();
            }
        },

//替换详细图片
        "click #replaceDetail": function () {
            $("#replaceDetailImg").fileupload({
                url: AJAXService.getUrl2("uploadImageUrl"),
                done: function (e, data) {
                    var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
                    result = JSON.parse(result);
                    $(".detail .photoSelected").attr("src", result.data.url);
                }
            });
        },


//防呆
        "change #editDisplayInfo input": this.setChanged,

        "click #editDisplayInfoCancel": function () {
            var that = this;
            if (showInfo.changed) {
                var dialogConfig = {
                    title: "提醒",
                    message: "当前的修改尚未保存，您确定要离开此页面吗？"
                };
                var confirmCallback = function () {
                    modal.clearModal(that);
                    showInfo.changed = false
                };

                modal.confirmDialog(dialogConfig, confirmCallback);

            } else {
                modal.clearModal(that);
            }
        }
    }

};

module.exports = showInfo;