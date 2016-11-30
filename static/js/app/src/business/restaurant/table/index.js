/**
 * Created by lingchenxuan on 16/6/18.
 */

var Vue = require('vue1');
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
var AJAXService = require('AJAXService');
var restaurantMenu = require('../restaurantMenu');
require("bootstrap");
require("validation");


var auth = require('../../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);

$(function(){
    header.showHeader();
    leftMenu.showLeftMenu();
    restaurantMenu.render();
    util.mainContainer();
    modal.centerModals();
    var events = {

        "resize window": util.mainContainer,

    };

    util.bindDomAction(events);
    var restId = location.search.split('=')[1];
    var table = new Vue({
        el: '.restaurant-container',
        data: {
            boards: [],
            boardIdWillDeleted: undefined,
            restName: undefined,
            boardName: undefined,
        },
        created: function() {
            this.getBoards();
            this.getRestaurants();
        },
        methods: {
            getBoards: function() {
                AJAXService.ajaxWithToken('GET', '/catering/getBoardListFromRestaurant', { restId: restId }, function(result) {
                    this.boards = result.data.list;
                }.bind(this));
            },
            getRestaurants: function() {
                AJAXService.ajaxWithToken('GET', '/catering/getRestaurantList', {}, function(result) {
                    this.restName = result.data.list.filter(function(el) {
                        return el.restId == restId;
                    })[0].restName;
                }.bind(this));
            },
            openCreateDialog: function() {
                boardDialog.status = 'create';
                $('#boardDialog').modal('show');
            },
            openEditDialog: function(board) {
                boardDialog.status = 'edit';
                boardDialog.boardName = board.boardName;
                boardDialog.boardId = board.boardId;
                boardDialog.seatNum = board.seatNum;
                $('#boardDialog').modal('show');
            },
            openDeleteDialog: function(id) {
                this.boardIdWillDeleted = id;
                modal.confirmDialog(
                    {
                        okText: '删除',
                        message: '删除桌子之后，不可找回。',
                        showTitle: false
                    },
                    this.deleteBoard.bind(this))
            },
            deleteBoard: function() {
                AJAXService.ajaxWithToken('GET',
                    '/catering/deleteBoardsForRestaurant',
                    { restId: restId, boardId: this.boardIdWillDeleted },
                    function(result) {
                        if (result.code === 1) {
                            modal.somethingAlert('删除成功');
                            this.getBoards();
                        } else {
                            modal.confirmDialog({okText: '我知道了', message: result.msg, hasCancel: false});
                        }
                    }.bind(this));
            },
            openResetDialog: function(board) {
                var restNames = this.getRestaurants();
                resetDialog.restName = this.restName;
                resetDialog.boardId = board.boardId;
                resetDialog.boardUrl = board.qrCodeUrl;
                $('#resetDialog').modal('show');
            },
            volumeReset: function() {
                confirmResetDialog.tipsText = '全部桌位号';
                $('#confirmResetDialog').modal('show');
            },
        },

        computed: {
            volumeDownload: function() {
                var restId = location.search.split('=')[1];
                var campId = localStorage.getItem("campId");
                var uid = localStorage.getItem("uid");
                var host = AJAXService.getUrl2('/catering/downloadAllBoardQrCodes');
                let url = `${host}?campId=${campId}&uid=${uid}&terminal=5&version=12&timestamp=${(new Date()).valueOf()}&sign=${util.getSign()}&restId=${restId}`;
                return url;
            }
        },
    });

    var boardDialog = new Vue({
        el: '#boardDialog',
        data: {
            boardName: '',
            nameList: [],
            submitted: false,
            status: '',
            boardId: undefined,
            seatNum: ''
        },
        methods: {
            createBoard: function() {
                this.submitted = true;
                if ((this.boardName === '' && !this.nameList.length) || this.seatNum === '') {
                    return;
                }
                var nameList;
                var boardName = this.boardName;
                if (this.nameList.length) {
                    nameList = this.nameList.map(function(el) {
                        return boardName + el;
                    });
                } else {
                    nameList = [this.boardName];
                }
                AJAXService.ajaxWithToken('POST',
                    '/catering/addBoardsForRestaurant',
                    {
                        nameList: JSON.stringify(nameList),
                        restId: restId,
                        seatNum: this.seatNum
                    },
                    function (result) {
                        if (result.code === 1) {
                            this.cancel();
                            table.getBoards();
                        } else {
                            modal.somethingAlert(result.msg);
                        }
                    }.bind(this));
            },
            boardNumCheck: function(index) {
                this.nameList.$set(index, this.nameList[index].replace(/\D/g,''));
            },
            editBoard: function() {
                this.submitted = true;
                if (this.boardName === '' || this.seatNum === '') {
                    return;
                }
                AJAXService.ajaxWithToken('POST',
                    '/catering/modifyBoardsForRestaurant',
                    {
                        boardName: this.boardName,
                        restId: restId,
                        seatNum: this.seatNum,
                        boardId: this.boardId
                    },
                    function (result) {
                        if (result.code === 1) {
                            this.cancel();
                            table.getBoards();
                        } else {
                            modal.somethingAlert(result.msg);
                        }
                    }.bind(this));
            },
            addBoardNum: function() {
                var name;
                var length = this.nameList.length;
                if (length === 0) {
                    name = 1
                } else {
                    name = 1 + Number(this.nameList[length - 1]);
                }
                this.nameList.push(name);
            },
            closeBoardNum: function(index) {
                this.nameList.splice(index, 1);
            },
            cancel: function() {
                this.boardName = '';
                this.nameList = [];
                this.seatNum = '';
                this.submitted = false;
                $('#boardDialog').modal('hide');
            }
        }
    });

    var resetDialog = new Vue({
        el: '#resetDialog',
        data: {
            restName: '',
            boardId: undefined,
            boardUrl: '',
        },
        methods: {
            closeResetDialog: function() {
                $('#resetDialog').modal('hide');
            },
            resetTwoCode: function() {
                confirmResetDialog.tipsText = '原桌位号';
                confirmResetDialog.boardId = this.boardId;
                $('#confirmResetDialog').modal('show');
                $('#resetDialog').modal('hide');
            }
        },

    });

    var confirmResetDialog = new Vue({
        el: '#confirmResetDialog',
        data: {
            boardId: undefined,
            boardIdList: [],
            tipsText: ''
        },
        methods: {
            confirmResetTwoCode: function() {
                var params = {
                    restId: restId
                };
                var url;
                if (this.tipsText === '原桌位号') {
                    params.boardId = this.boardId;
                    url = '/catering/resetOneBoardQrCode';
                } else if (this.tipsText === '全部桌位号') {
                    params = params;
                    url = '/catering/resetAllBoardQrCode';
                }
                AJAXService.ajaxWithToken('GET', url, params, result => {
                    if(result.code === 1){
                        table.getBoards();
                        $('#confirmResetDialog').modal('hide');
                    } else {
                        modal.somethingAlert(result.msg);
                    }
                })
            },
            closeResetTwoCode: function() {
                $('#confirmResetDialog').modal('hide');
            }
        }
    });
});