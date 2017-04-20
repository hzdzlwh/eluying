/**
 * Created by lingchenxuan on 16/6/18.
 */

var Vue = require('vue1');
var util = require("util");
var modal = require("modal");
import http from 'http';
var restaurantMenu = require('../restaurantMenu');
require("bootstrap");
require("validation");


var auth = require('../../../common/auth');
import init from '../../../common/init';
init({
    id: auth.BUSINESS_ID,
});
$(function(){
    restaurantMenu.render();

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
                http.get('/catering/getBoardListFromRestaurant', { restId: restId })
                    .then(result => {
                        this.boards = result.data.list;
                    });
            },
            getRestaurants: function() {
                http.get('/catering/getRestaurantList', {})
                    .then(result => {
                        this.restName = result.data.list.filter(function(el) {
                            return el.restId == restId;
                        })[0].restName;
                    });
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
                http.get('/catering/deleteBoardsForRestaurant',
                    { restId: restId, boardId: this.boardIdWillDeleted })
                    .then(result => {
                        modal.somethingAlert('删除成功');
                        this.getBoards();
                    });
            },
            openResetDialog: function(board) {
                var restNames = this.getRestaurants();
                resetDialog.restName = this.restName;
                resetDialog.boardName = board.boardName;
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
                var host = http.getUrl('/catering/downloadAllBoardQrCodes');
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
                http.post('/catering/addBoardsForRestaurant',
                    {
                        nameList: JSON.stringify(nameList),
                        restId: restId,
                        seatNum: this.seatNum
                    })
                    .then(result => {
                        this.cancel();
                        table.getBoards();
                    });
            },
            boardNumCheck: function(index) {
                this.nameList.$set(index, this.nameList[index].replace(/\D/g,''));
            },
            editBoard: function() {
                this.submitted = true;
                if (this.boardName === '' || this.seatNum === '') {
                    return;
                }
                http.post('/catering/modifyBoardsForRestaurant',
                    {
                        boardName: this.boardName,
                        restId: restId,
                        seatNum: this.seatNum,
                        boardId: this.boardId
                    })
                    .then(result => {
                        this.cancel();
                        table.getBoards();
                    });
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
            boardName: '',
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
                http.get(url, params)
                    .then(result => {
                        table.getBoards();
                        $('#confirmResetDialog').modal('hide');
                    });
            },
            closeResetTwoCode: function() {
                $('#confirmResetDialog').modal('hide');
            }
        }
    });
});