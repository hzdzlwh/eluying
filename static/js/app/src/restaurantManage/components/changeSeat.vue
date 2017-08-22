/**
 * @Author: lwh
 * @Date:   2017-08-12 13:01:30
 * @Last Modified by:   lwh
 * @Last Modified time: 2017-08-14 15:42:19
 */

<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="changeSeat">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span>修改桌位</span>
                    <button type="button" class="close" @click="hideModal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <div class="scroll-left">
                        <div class="left-container" ref="leftScroll">
                            <div class="scroller">
                                <ul>
                                    <li v-for="(area, index) in areas" @click="setScroll(index)" :class="{ 'active': currentIndex === index }">
                                        <span>{{area.name}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="scroll-right">
                        <div class="right-container" ref="rightScroll">
                            <div class="scroller">
                                <div v-for="area in tableList" class="area" ref="areaList">
                                    <h4>{{area.areaName}}</h4>
                                    <div class="area-wrapper">
                                        <div v-for="item in area.boardList" class="seat" :class="{'leisure': item.boardState === 0,
                                            'using': item.boardState === 1 && item.caterOrderId,
                                            'open-table': item.boardState === 1 && !item.caterOrderId,
                                            'select-table': item.selected}" @click="selectSeat(item)">
                                            <div class="state-twoCode" :class="{'state-twoCode-right': item.orderState !== 2 && item.orderState !== 4 }">
                                                <div class="state" :class="{'state-pending': item.orderState === 4 }" v-if="item.orderState === 2 || item.orderState === 4">{{orderState[item.orderState]}}</div>
                                                <div class="two-dimensionalcode" v-if="item.hasScan"></div>
                                            </div>
                                            <div class="seat-num">{{item.boardName}}</div>
                                            <div class="eating-time" v-if="item.orderState === 1">{{item.duration}}</div>
                                            <div class="reserve-time" v-if="item.time">预{{item.time}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-foot">
                    <div>
                        <div class="seats-num">已选择{{selectedBoard.length}}个桌位</div>
                        <div>
                            <span v-for="board in selectedBoard">{{board.boardName}} </span>
                        </div>
                    </div>
                    <div>
                        <button class="dd-btn dd-btn-ghost" @click="hideModal">取消</button>
                        <button class="dd-btn dd-btn-primary" @click="changeSeat">确定</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import http from '../../common/http';
import { mapState } from 'vuex';
import IScroll from 'iscroll';
import restBus from '../event.js';
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        openData: {
            type: Object
        }
    },
    data() {
        return {
            tableList: [],
            areas: [],
            orderState: ['预订', '使用中', '已结账', '', '待处理'],
            scrollY: 0,
            heightList: []
        };
    },
    created() {
    },
    computed: {
        ...mapState([
            'date',
            'restId'
        ]),
        currentIndex() {
            for (let i = 0; i < this.heightList.length; i ++) {
                const preHeight = this.heightList[i];
                const nextHeight = this.heightList[i + 1];
                if (!nextHeight || (this.scrollY >= preHeight && this.scrollY < nextHeight)) {
                    return i;
                }
            }
        },
        selectedBoard() {
            const tempArr = [];
            this.tableList.forEach(area => {
                area.boardList.forEach(board => {
                    if (board.selected) {
                        tempArr.push(board);
                    }
                });
            });
            return tempArr;
        }
    },
    methods: {
        setScroll(index) {
            this.rightScroll.scrollToElement(this.$refs.areaList[index], 300);
        },
        initScroll() {
            var _this = this;
            this.leftScroll = new IScroll(this.$refs.leftScroll, { probeType: 3, mouseWheel: true, scrollbars: false });
            this.rightScroll = new IScroll(this.$refs.rightScroll, { probeType: 3, mouseWheel: true, scrollbars: false });
            this.rightScroll.on('scroll', function() {
                _this.scrollY = Math.abs(this.y);
            });
        },
        calculateHeight() {
            const areaList = this.$refs.areaList;
            let height = 0;
            this.heightList.push(height);
            areaList.map(area => {
                height += area.clientHeight;
                this.heightList.push(height);
            });
        },
        changeSeat() {
            if (!this.openData.orderId) {      // 开台的换桌
                const params = { peopleNum: this.openData.peopleNum, restId: this.restId, boardLogIds: JSON.stringify(this.openData.list), boardIds: [] };
                this.selectedBoard.forEach(board => {
                    params.boardIds.push(board.boardId);
                });
                params.boardIds = JSON.stringify(params.boardIds);
                http.get('/board/openBoard', params).then(res => {
                    if (res.code === 1) {
                        this.hideModal();
                        restBus.$emit('refeshView');
                    }
                });
            } else {                           // 使用中的桌子换桌
                const params = { orderId: this.openData.orderId, caterOrderId: this.openData.caterOrderId, restId: this.restId };
                params.boardIds = [];
                this.tableList.forEach(area => {
                    area.boardList.forEach(board => {
                        if (board.selected) {
                            params.boardIds.push(board.boardId);
                        }
                    });
                });
                params.boardIds = JSON.stringify(params.boardIds);
                http.get('/catering/selectBoards', params).then(res => {
                    if (res.code === 1) {
                        this.hideModal();
                        restBus.$emit('refeshView');
                    }
                });
            }
        },
        selectSeat(board) {
            if (this.openData.orderState === 0) {    // 预约订单 可以选所有状态桌子
                this.$set(board, 'selected', !(board.selected));
            } else {    // 使用中、待处理...   只能选择空的和当前选择的
                if (board.boardState === 0 || board.oldSelect) {
                    this.$set(board, 'selected', !(board.selected));
                }
            }
        },
        getSeatList() {
            return new Promise((resolve, reject) => {
                http.get('/board/list', { date: this.date, restId: this.restId, isChange: true }).then(res => {
                    if (res.code === 1) {
                        this.tableList = [];
                        this.areas = [];
                        var borarList = res.data.list;
                        if (this.openData) {
                            this.openData.boardDetailResps.forEach(el => {
                                borarList.forEach(board => {
                                    if (board.boardId === el.boardId) {
                                        board.selected = true;
                                        board.oldSelect = true;
                                    }
                                });
                            });
                        }
                        borarList.map(item => {
                            const areaHasOrNot = this.areas.find(area => {
                                return area.id === item.areaId;
                            });
                            if (areaHasOrNot === undefined) {
                                this.areas.push({ id: item.areaId, name: item.areaName, selected: false });
                            }
                            var tableHasOrNot = this.tableList.find((table, index) => {
                                return table.areaId === item.areaId;
                            });
                            if (tableHasOrNot === undefined) {
                                this.tableList.push({
                                    areaId: item.areaId,
                                    areaName: item.areaName,
                                    boardList: [item]
                                });
                            } else {
                                tableHasOrNot.boardList.push(item);
                            }
                        });
                        resolve();
                    }
                });
            });
        },
        hideModal() {
            this.$emit('hideModal');
        }
    },
    watch: {
        visible(newValue) {
            this.getSeatList();
            var _this = this;
            if (newValue) {
                $('#changeSeat').modal('show');
                $('#changeSeat').on('shown.bs.modal', function() {
                    _this.initScroll();
                    _this.calculateHeight();
                });
            } else {
                $('#changeSeat').modal('hide');
            }
        },
        restId(newValue) {
            this.getSeatList().then(() => {
                this.$nextTick(() => {
                    // this.initScroll();
                    // this.calculateHeight();
                });
            });
        },
        openData(newValue) {
            if (newValue) {
                this.getSeatList();
            }
        }
    },
    components: {
        scroll
    }
};
</script>

<style lang="scss" scoped>
    #changeSeat{
        .modal-dialog{
            width: 760px;
            .modal-content{
                border-top: 4px solid #178ce6;
                padding: 0;
                .modal-header{
                    padding: 20px;
                    span{
                        font-size: 16px;
                        color: #666;
                    }
                }
                .modal-body{
                    padding: 16px 20px 0;
                    display: flex;
                    justify-content: space-between;
                    .scroll-left{
                        width: 104px;
                        height: 450px;
                        background: #f0f0f0;
                        border-radius: 8px;
                        padding: 0 8px;
                        .left-container{
                            height: 450px;
                            width: 88px;
                            overflow: hidden;
                            position: absolute;
                            z-index: 1;
                            .scroller{
                                position: absolute;
                                z-index: 1;
                                -webkit-tap-highlight-color: rgba(0,0,0,0);
                                width: 100%;
                                -webkit-transform: translateZ(0);
                                -moz-transform: translateZ(0);
                                -ms-transform: translateZ(0);
                                -o-transform: translateZ(0);
                                transform: translateZ(0);
                                -webkit-touch-callout: none;
                                -webkit-user-select: none;
                                -moz-user-select: none;
                                -ms-user-select: none;
                                user-select: none;
                                -webkit-text-size-adjust: none;
                                -moz-text-size-adjust: none;
                                -ms-text-size-adjust: none;
                                -o-text-size-adjust: none;
                                text-size-adjust: none;
                            }
                            ul{
                                li{
                                    line-height: 43px;
                                    text-align: center;
                                    border-bottom: 1px dashed #99a9bf;
                                    &.active{
                                        color: #178ce6;
                                    }
                                }
                            }
                        }
                    }
                    .scroll-right{
                        width: 600px;
                        .right-container{
                            height: 450px;
                            width: 600px;
                            overflow: hidden;
                            position: absolute;
                            z-index: 1;
                            .scroller{
                                position: absolute;
                                z-index: 1;
                                -webkit-tap-highlight-color: rgba(0,0,0,0);
                                width: 100%;
                                -webkit-transform: translateZ(0);
                                -moz-transform: translateZ(0);
                                -ms-transform: translateZ(0);
                                -o-transform: translateZ(0);
                                transform: translateZ(0);
                                -webkit-touch-callout: none;
                                -webkit-user-select: none;
                                -moz-user-select: none;
                                -ms-user-select: none;
                                user-select: none;
                                -webkit-text-size-adjust: none;
                                -moz-text-size-adjust: none;
                                -ms-text-size-adjust: none;
                                -o-text-size-adjust: none;
                                text-size-adjust: none;
                                .area{
                                    padding: 16px;
                                    background: #f0f0f0;
                                    margin-bottom: 16px;
                                    border-radius: 8px;
                                    h4{
                                        font-size: 24px;
                                        color: #178ce6;
                                    }
                                    .area-wrapper{
                                        display: flex;
                                        flex-wrap: wrap;
                                        .seat{
                                            width: 88px;
                                            height: 88px;
                                            border-radius: 8px;
                                            margin: 4px;
                                            box-shadow: 0 0 2px 0 rgba(0,0,0,0.3);
                                            position: relative;
                                            cursor: pointer;
                                            &:nth-child(6n+1){
                                                margin-left: 0;
                                            }
                                            &:nth-child(6n){
                                                margin-right: 0;
                                            }
                                            &.leisure{
                                                background: #ffffff;
                                            }
                                            &.using{
                                                background: #c6e5ff;
                                            }
                                            &.open-table{
                                                background: #ffe6c6;
                                            }
                                            &.select-table{
                                                border: 2px solid #178ce6;
                                            }
                                            .state-twoCode{
                                                display: flex;
                                                justify-content: space-between;
                                                padding: 6px 6px 0 0;
                                                position: absolute;
                                                width: 100%;
                                                &.state-twoCode-right{
                                                    justify-content: flex-end;
                                                }
                                                .two-dimensionalcode{
                                                    width: 16px;
                                                    height: 16px;
                                                    background: url('../../../../../image/two-dimensionalcode.png');
                                                }
                                                .state{
                                                    width: 50px;
                                                    height: 16px;
                                                    line-height: 16px;
                                                    border-radius: 0 8px 8px 0;
                                                    background: #178ce6;
                                                    font-size: 12px;
                                                    padding-left: 8px;
                                                    color: #fff;
                                                    position: relative;
                                                    &.state-pending{
                                                        background: #f24949;
                                                    }
                                                }
                                            }
                                            .seat-num{
                                                position: absolute;
                                                top: 29px;
                                                width: 100%;
                                                text-align: center;
                                                font-size: 14px;
                                                color: #333333;
                                                opacity: 0.87;
                                            }
                                            .eating-time{
                                                font-size: 12px;
                                                color: #999999;
                                                text-align: center;
                                                opacity: 0.87;
                                                position: absolute;
                                                top: 47px;
                                                width: 100%;
                                            }
                                            .reserve-time{
                                                width: 58px;
                                                height: 16px;
                                                font-size: 12px;
                                                color: #fff;
                                                background: #ffba75;
                                                text-align: center;
                                                margin-left: 15px;
                                                border-radius: 8px;
                                                position: absolute;
                                                top: 66px;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .modal-foot{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 9px 20px 12px;
                    text-align: left;
                    .seats-num{
                        color: #999;
                        font-size: 12px;
                    }
                }
            }
        }
    }
</style>
