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
$(function() {
    restaurantMenu.render();

    var restId = location.search.split('=')[1];
    var table = new Vue({
        el: '.restaurant-container',
        data: {
            boards: [],
            deleatType: undefined,
            restName: undefined,
            boardName: undefined,
            desList: [],
            deletArr: [{
                title: '删除区域',
                text: '删除区域后，区域中的桌子将被一起删除',
                url: '/catering/delBoardArea'
            }, {
                title: '删除桌型',
                text: '删除桌型后，该桌型的桌子将被一起删除',
                url: '/catering/delBoardKind'
            },
            {
                title: '删除桌型',
                text: '删除桌型后，该桌型的桌子将被一起删除',
                url: '/catering/deleteBoardsForRestaurant'
            }
            ],
            deleteId: undefined
        },
        created: function() {
            this.getBoards();
            this.getRestaurants();
            this.getDes();
        },
        methods: {
            getBoards: function() {
                http.get('/catering/getBoardListFromRestaurant', { restId: restId })
                    .then(result => {
                        const list = result.data.list;
                        const boardshash = {};
                        list.forEach(function(el) {
                            if (boardshash[el.areaId] === undefined) {
                                boardshash[el.areaId] = {};
                                boardshash[el.areaId].areaId = el.areaId;
                                boardshash[el.areaId].areaName = el.areaName;
                                boardshash[el.areaId].list = {};
                            }
                            if (boardshash[el.areaId].list[el.kindId] === undefined) {
                                boardshash[el.areaId].list[el.kindId] = {};
                                boardshash[el.areaId].list[el.kindId].kindName = el.kindName;
                                boardshash[el.areaId].list[el.kindId].kindId = el.kindId;
                                boardshash[el.areaId].list[el.kindId].list = [];
                            }
                            boardshash[el.areaId].list[el.kindId].list.push(el);
                        });
                        this.boards = boardshash;
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
            getDes: function() {
                http.get('/catering/getBoardKinds', { restId: restId })
                    .then(result => {
                        this.desList = result.data.list;
                    });
            },
            openCreateDialog: function(areas) {
                boardDialog.areaId = areas.areaId;
                boardDialog.status = 'create';
                boardDialog.selectType = this.desList;
                boardDialog.boardId = areas.boardId;
                boardDialog.areaName = areas.areaName;
                boardDialog.areaselect = this.boards;
                $('#boardDialog').modal('show');
            },
            openEditDialog: function(board) {
                boardDialog.status = 'edit';
                boardDialog.areaName = board.areaName;
                boardDialog.boardName = board.boardName;
                boardDialog.boardId = board.boardId;
                boardDialog.selectDes = board.kindId;
                boardDialog.areaId = board.areaId;
                boardDialog.seatNum = board.seatNum;
                boardDialog.nameList = [board.serialNum];
                boardDialog.selectType = this.desList;
                boardDialog.areaselect = this.boards;
                $('#boardDialog').modal('show');
            },
            openDeleteDialog: function(type, id) {
                this.deleatType = type;
                this.deleteId = id;
                modal.confirm({
                        okText: '确定',
                        message: this.deletArr[type].text,
                        showTitle: false
                    },
                    this.deleteBoard)
            },
            deleteBoard: function() {
                let parms;
                if (this.deleatType) {
                    parms = { kindId: this.deleteId, restId: restId };
                } else {
                    parms = { areaId: this.deleteId, restId: restId };
                }
                http.get(this.deletArr[this.deleatType].url, parms)
                    .then(result => {
                        modal.success('删除成功');
                            this.getDes();
                            this.getBoards();
                    });
            },
            deleteNoConfirm: function (id) {
                http.get('/catering/deleteBoardsForRestaurant', {boardId:id ,restId:restId})
                    .then(result => {
                        modal.success('删除成功');
                            this.getBoards();
                            this.getDes();
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
            openSingleDialog: function(selectType, data = {}, name) {
                confirmAreaDialog.selectType = selectType;
                confirmAreaDialog.ajaxdata = data;
                if (name) {
                    confirmAreaDialog.inputtext = name;
                } else {
                    confirmAreaDialog.inputtext = undefined;
                }
                $('#confirmAreaDialog').modal('show');
            },
            volumeReset: function(id) {
                if (id) {
                    confirmResetDialog.areaId = id;
                    confirmResetDialog.tipsText = '该区域桌子';

                } else {
                    confirmResetDialog.tipsText = '全部桌位号';
                }
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
            areaId: undefined,
            areaName: undefined,
            seatNum: '',
            selectType: [],
            selectDes: undefined,
            boardId: undefined,
            areaselect: []
        },
        watch: {
            selectType(val) {
                if (val) {
                    if (!this.selectDes) {
                        this.selectDes = val[0].kindId;
                    }
                }
            }
        },
        methods: {
            createBoard: function() {
                this.submitted = true;
                if ((this.boardName === '' && !this.nameList.length) || this.seatNum === '') {
                    return;
                }
                var boardName = this.boardName;
                http.post('/catering/addBoardsForRestaurant', {
                        areaId: this.areaId,
                        kindId: this.selectDes,
                        nameList: this.boardName,
                        restId: restId,
                        seatNum: this.seatNum,
                        serialNums: JSON.stringify(this.nameList)
                    })
                    .then(result => {
                        this.cancel();
                        table.getBoards();
                    });
            },
            boardNumCheck: function(index) {
                this.nameList.$set(index, this.nameList[index].replace(/\D/g, ''));
            },
            editBoard: function() {
                this.submitted = true;
                if (this.boardName === '' || this.seatNum === '' ) {
                    return;
                }
                http.post('/catering/modifyBoardsForRestaurant', {
                        areaId: this.areaId,
                        boardId: this.boardId,
                        boardName: this.boardName,
                        kindId: this.selectDes,
                        restId: restId,
                        seatNum: this.seatNum,
                        serialNum: this.nameList[0]
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
                    http.post('/catering/getMaxSerialNum', {
                        restId: restId,
                        kindId: this.selectDes
                    })
                    .then(result => {
                        name = result.data.num + 1;
                        this.nameList.push(name);
                    });
                } else {
                    this.nameList.push(1 + Number(this.nameList[length - 1]));
                }
                
            },
            closeBoardNum: function(index) {
                this.nameList.splice(index, 1);
            },
            cancel: function() {
                this.boardName = '';
                this.nameList = [];
                this.seatNum = '';
                // this.selectType = [];
                this.selectDes = this.selectType[0].kindId;
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
            desSelect: []
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
            tipsText: '',
            areaId: undefined
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
                }
                if (this.tipsText === '全部桌位号') {
                    params = params;
                    url = '/catering/resetAllBoardQrCode';
                }
                if (this.tipsText === '该区域桌子') {
                    params.areaId = this.areaId;
                    url = ' /catering/resetAllBoardQrCode';
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
    var confirmAreaDialog = new Vue({
        el: '#confirmAreaDialog',
        data: {
            showtext: [{
                title: '新增区域',
                msgtitle: '区域名称',
                url: '/catering/addBoardArea'
            }, {
                title: '新增桌型',
                msgtitle: ' 桌型名称',
                url: '/catering/addBoardKind'
            }, {
                title: '编辑区域',
                msgtitle: '区域名称',
                url: '/catering/modiBoardArea'
            }, {
                title: '编辑桌型',
                msgtitle: '桌型名称',
                url: '/catering/modiBoardKind'
            }],
            selectType: 0,
            inputtext: undefined,
            ajaxdata: undefined
        },
        methods: {
            edit: function() {
                if (!this.inputtext) {
                    modal.warn('不能为空');
                }
                const params = {
                    restId: location.search.split('=')[1],
                    campId: localStorage.getItem('campId'),
                    name: this.inputtext,
                    ...this.ajaxdata
                };
                http.get(this.showtext[this.selectType].url, params)
                    .then(result => {
                        if (this.selectType === 0 || this.selectType === 2) {
                            table.getBoards();
                        } else {
                            table.getBoards();
                            table.getDes();
                        }
                        $('#confirmAreaDialog').modal('hide');
                    });
            },
            cancel: function() {
                $('#confirmAreaDialog').modal('hide');
            }
        }
    });
});
