/**
 * Created by ss on 16/3/18.
 */

import http from './http';
var htmlMaker = require("../../../../tpl/createNetwork.js");
var modal = require('modal');
var auth = require('./auth');
var network = {
	status: {
		CREATE_NETWORK: "create",
		JOIN_NETWORK1: "joinStep1",
		JOIN_NETWORK: "joinStep2",
		CREATE_SUCCESS: "createSuccess"
	},
	init: function(status,arg){
		var that = this;
		//先把html输出到页面上
		if($("#"+status).length){
			$("#"+status).remove();
		}
		$("body").append(htmlMaker.getHtml(status,arg));
		var resultDom = $("#"+status);
		//绑定事件
		switch(status){
			case this.status.CREATE_NETWORK:
				var confirmHandler = function (networkName, department, position) {
					http.post("/network/createNetwork",{
						department: department,
						networkName: networkName,
						position: position
					})
						.then(function (data) {
							var  result= data.data;
							//创建成功
							resultDom.modal("hide");
							that.init(that.status.CREATE_SUCCESS, result.camp).modal("show");
                        });
				}
				resultDom.find(".createNetworkButton").click(function () {
					var post = {};
					post.networkName = resultDom.find(".networkName").val();
					post.department = resultDom.find(".department").val();
					post.position = resultDom.find(".position").val();
					if(post.networkName.length > 20){
						alert("网络名称不能大于20个字符");
						return false;
					}
					if(post.department.length > 10){
						alert("部门名称不能大于10个字符");
						return false;
					}
					if(post.position.length > 10){
						alert("支付名称不能大于10个字符");
						return false;
					}
					confirmHandler(post.networkName, post.department, post.position);
				});
				resultDom.find("input.networkName").on("input", function () {
					var value = $(this).val();
					if(value.length > 20){
						$(this).val(value.substr(0,20))
					}
				})
				resultDom.find("input.department").on("input", function () {
					var value = $(this).val();
					if(value.length > 10){
						$(this).val(value.substr(0,10))
					}
				})
				resultDom.find("input.position").on("input", function () {
					var value = $(this).val();
					if(value.length > 10){
						$(this).val(value.substr(0,10))
					}
				})
				break;
			case this.status.JOIN_NETWORK1:
				var that = this;
				resultDom.find(".createNetworkButton").click(function () {
					var networkNum = resultDom.find(".networkId").val();
					http.get("/network/getNetworkInfo",{
						networkNum: networkNum
					})
						.then(function (data) {
							var result = data.data.camp;
							resultDom.modal("hide");
							that.init(that.status.JOIN_NETWORK,result).modal("show");
                        });
				});
				break;
			case this.status.JOIN_NETWORK:
				var that = this;
				resultDom.find(".createNetworkButton").click(function () {
					var networkNum = resultDom.find(".networkNum").val();
					var department = resultDom.find(".department").val();
					var position = resultDom.find(".position").val();
					http.get("/network/applyJoinNetwork",{
						networkNum: networkNum,
						department: department,
						position: position
					})
						.then(function(data){
                            alert("申请已发送至该网络，请耐心等待审核");
                        })
				});
				resultDom.find("input.department").on("input", function () {
					var value = $(this).val();
					if(value.length > 10){
						$(this).val(value.substr(0,10))
					}
				})
				resultDom.find("input.position").on("input", function () {
					var value = $(this).val();
					if(value.length > 10){
						$(this).val(value.substr(0,10))
					}
				})
				break;
			case this.status.CREATE_SUCCESS:
				$(".createNetworkButton").click(function () {
					var campId = resultDom.find("input[name='campId']").val();
					var campName = resultDom.find("input[name='campName']").val();
					http.post("/homepage/changeCamp",{campId: campId})
						.then(function (data) {
                            localStorage.setItem("campId", campId);
                            localStorage.setItem("campName", campName);
                            auth.saveUserInfo(data.data);
                            window.location.href = "/view/accommodation";
                        });
				})
				break;
		}
		return resultDom;
	}
}
module.exports = network;