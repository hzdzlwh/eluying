require("angular");
var AJAXService = require("../../../common/AJAXService");
var modal = require("../../../common/modal");
var util = require("util");
var idcObj = require("../ieidc");

var roomPeopleCtrl = function(app) {
    app.controller('roomPeopleCtrl', ['$rootScope', '$scope', 'checkinService', 'getDataService',
        function(rootScope, scope, checkinService, getDataService) {
            scope.idCardList = [];
            scope.serviceId = '';
            scope.roomName = '房间';
            scope.$on('showRoomPeopleModal', function(ev, idCardList, serviceId, orderId, roomName) {
                scope.orderId = orderId;
                scope.roomName = roomName;
                scope.serviceId = serviceId;
                idCardList = idCardList || [];
                ev.currentScope.idCardList = idCardList.map(function(el) {
                    el.selectedIdLabel = ['身份证', '军官证', '通行证', '护照', '其他'][el.idCardType];
                    return Object.assign({}, el);
                });
            });

            scope.$on('read', function(ev, name, num) {
                var person = {
                    name: name,
                    idCardNum: num,
                    selectedIdLabel: '身份证',
                    selectedId: 0,
                    read: true,
                }
                scope.idCardList.push(person);
                $("#showRoomPeopleModal .readBtn").html('读卡添加');
                $(".readBtn").removeClass('ing');
            });

            scope.changeIds = function(method, methodLabel, person){
                person.selectedId = method;
                person.selectedIdLabel = methodLabel;
                person.idCardNum = null;
                person.readable = (methodLabel === '身份证');
                $(".select1_options").hide();
            };

            scope.addPerson = function() {
                scope.idCardList.push({
                    idCardType: 0
                });
            };

            scope.closeRoomPeopleDialog = function() {
                $('#roomPeopleModal').modal('hide');
                scope.submitted = false;
            };

            scope.beginReadId = function(){
                var mode = $("#roomPeopleModal .readBtn").html();
                if(mode === '读卡添加'){
                    $("#roomPeopleModal .readBtn").html('正在读卡');
                    $("#roomPeopleModal .readBtn").addClass('ing');
                    setTimeout(function(){
                        idcObj.init();
                        idcObj.read(3, rootScope);
                    }, 500)
                }else{
                    
                }
            };

            scope.checkDuplication = function(num, index) {
                return scope.idCardList.some((el, id) => {
                    if (index === id) {
                        return false;
                    } else {
                        return el.idCardNum === num;
                    }
                });
            }

            scope.submit = function() {
                if (scope.roomPeopleForm.$invalid) {
                    scope.submitted = true;
                    return
                }
                var idCardList = scope.idCardList.map(function(el) {
                    return {
                        name: el.name,
                        idCardType: el.selectedId || '0',
                        idCardNum: el.idCardNum,
                    }
                });
                var data = {
                    serviceId: scope.serviceId,
                    idCardList: JSON.stringify(idCardList),
                }
                AJAXService.ajaxWithToken('post', '/room/updateCheckInUsers', data, function(res) {
                    if (res.code === 1) {
                        $('#roomPeopleModal').modal('hide');
                        scope.submitted = false;
                        getDataService.getOrderDetailAndRest(scope.orderId, rootScope)
                        var room = rootScope.checkin.rooms.find(el => el.serviceId === scope.serviceId);
                        room.idCardList = scope.idCardList;
                        rootScope.$apply();
                            //  .then(function() {
                            //      rootScope.checkin = checkinService.resetCheckin(rootScope);
                            //      rootScope.$apply();
                            //  });
                    } else {
                        modal.somethingAlert(res.msg);
                    }
                })
            };

            scope.deletePerson = function(i) {
                scope.idCardList = scope.idCardList.slice(0, i).concat(scope.idCardList.slice(i + 1));
            }
    }])
};

module.exports = roomPeopleCtrl;