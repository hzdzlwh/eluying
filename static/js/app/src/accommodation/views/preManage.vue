<template>
    <div style="display: flex;">
        <dayOrderLeft>
            <DateSelect slot="timePicker" :defaultDate="defaultStartDate" @change='changeDate' :width='185' :disabledDate='true' />
        </dayOrderLeft>
        <div class="content">
            <p>当日到店预定</p>
            <div class="table-content">
                <table style="border: none;border-top: 4px solid #178ce6;">
                    <colgroup>
                        <col width="130">
                        <col width="77">
                        <col width="89">
                        <col width="295">
                        <col width="284">
                        <col width="90">
                        <col width="92">
                        <col width="125">
                        <col width="118">
                    </colgroup>
                    <tr style="background: #f0f0f0; height: 53px;">
                        <th>订单详情</th>
                        <th>数量</th>
                        <th>入住类型</th>
                        <th>房号</th>
                        <th>入住时间</th>
                        <th>状态</th>
                        <th>联系人</th>
                        <th>手机号</th>
                        <th>操作</th>
                    </tr>
                </table>
                <div class="tbody-item" v-for="item in orderLists">
                    <table>
                        <colgroup>
                            <col width="130">
                            <col width="77">
                            <col width="89">
                            <col width="295">
                            <col width="284">
                            <col width="90">
                            <col width="92">
                            <col width="125">
                            <col width="118">
                        </colgroup>
                        <tr style="background: #f0f0f0;">
                            <td style="text-align: left; padding-left: 20px; color: #999999;" colspan="9">订单号：{{item.orderNum}} <span style="margin-left: 32px;">{{item.creationTime}}</span></td>
                        </tr>
                        <tr v-for="(row, index) in item.roomTypes">
                            <td>{{row.typeName}}</td>
                            <td>{{row.count}}</td>
                            <td>{{checkTypes[row.checkType]}}</td>
                            <td>
                                <span v-for="(room, roomIndex) in row.rooms">{{room.roomNum}}<em v-if="roomIndex !== row.rooms.length - 1">、</em></span>
                                <span style="color: #178ce6; cursor: pointer;" @click="arrangeHouse($event, item, index)">排房</span>
                            </td>
                            <td>{{row.startTime}}~{{row.endTime}} 共{{row.night}}晚</td>
                            <td><span style="background: #ffba75; color: #fff; padding: 2px 4px; font-size: 12px;">已预定</span></td>
                            <td style="color: #999999;" v-if="index === 0" :rowspan="item.roomTypes.length" :class="{leftBorder: item.roomTypes.length !== 1}">{{item.customerName}}</td>
                            <td style="color: #999999;" v-if="index === 0" :rowspan="item.roomTypes.length" :class="{rightBorder: item.roomTypes.length !== 1}">{{item.customerPhone}}</td>
                            <td style="color: #178ce6; cursor: pointer;" v-if="index === 0" :rowspan="item.roomTypes.length"><span @click="showOrder(item)">详情</span>/<span @click="checkIn(item)">入住</span></td>
                        </tr>
                    </table>
                </div>
            </div>
            <div v-show="showSelectHouse" class="selectable-house" ref="selectableHouse">
                <div class="selectable-area" v-for="item in selectRoomLists">
                    <h4>{{item.areaName}}</h4>
                    <div class="room-container">
                        <div class="room" :class="{selected: room.checked}" v-for="room in item.rooms" @click="changeSelect(room)">{{room.roomNum}}</div>
                    </div>
                </div>
                <div v-if="selectRoomLists.length === 0">房间都已被占用</div>
                <div class="btn-container">
                    <button style="margin-right: 10px;" class="dd-btn dd-btn-primary" @click="showSelectHouse = false">取消</button><button class="dd-btn dd-btn-primary" @click="setSelectRoom">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import dayOrderLeft from '../components/dayOrderLeft.vue';
    import DateSelect from '../components/DateSelect.vue';
    import http from '../../common/http';
    import modal from '../../common/modal';
    import bus from '../../common/eventBus';
    import { mapActions, mapState } from 'vuex';
    import types from '../../common/orderSystem/store/types';

    export default {
        data() {
            return {
                defaultStartDate: undefined,
                date: new Date(),
                orderLists: [],
                selectRoomLists: [],
                checkTypes: ['正常入住', '钟点房', '自用房', '免费房'],
                showSelectHouse: false,
                roomInfo: {},
                orderRoomNum: 0
            };
        },
        computed: {
            ...mapState({ order: state => state.orderSystem.orderDetail }),
            selectRoomNum() {
                var num = 0;
                this.selectRoomLists.forEach(res => {
                    res.rooms.forEach(r => {
                        if (r.checked === true) {
                            num ++;
                        }
                    });
                });
                return num;
            }
        },
        components: {
            dayOrderLeft,
            DateSelect
        },
        methods: {
            ...mapActions([types.LOAD_ORDER_DETAIL]),
            changeDate(date) {
                this.date = date;
            },
            getLists() {
                http.get('/room/getBookListByDate', { date: this.date }).then(res => {
                    if (res.code === 1) {
                        this.orderLists = res.data.list;
                    }
                });
            },
            showOrder(item) {
                bus.$emit('onShowDetail', {
                    type: item.orderType,
                    orderId: item.orderType === -1 ? item.orderId : item.roomOrderId
                });
            },
            checkIn(item) {
                this[types.LOAD_ORDER_DETAIL]({ orderId: item.orderId }).then(res => {
                    bus.$emit('editOrder', 'checkIn', this.order);
                });
            },
            arrangeHouse(event, item, index) {
                this.orderRoomNum = item.roomTypes[index].count;
                this.roomInfo.checkType = item.roomTypes[index].checkType;
                this.roomInfo.endTime = item.roomTypes[index].endTime;
                this.roomInfo.startTime = item.roomTypes[index].startTime;
                this.roomInfo.orderId = item.orderId;
                this.roomInfo.orderType = item.orderType;
                this.roomInfo.typeId = item.roomTypes[index].typeId;
                http.get('/room/getSelectRoomList', { checkType: item.roomTypes[index].checkType, date: this.date, endTime: item.roomTypes[index].endTime, orderId: item.orderId, orderType: item.orderType, startTime: item.roomTypes[index].startTime, typeId: item.roomTypes[index].typeId }).then(res => {
                    if (res.code === 1) {
                        this.selectRoomLists = res.data.list;
                        this.$refs.selectableHouse.style.top = (event.pageY - 48) + 'px';
                        this.$refs.selectableHouse.style.left = (event.pageX - 500) + 'px';
                        this.showSelectHouse = true;
                    }
                });
            },
            changeSelect(room) {
                room.checked = !room.checked;
                if (this.selectRoomNum > this.orderRoomNum) {
                    modal.warn('所选房间数量大于需排房房间数量');
                    room.checked = !room.checked;
                }
            },
            setSelectRoom() {
                const sendData = { ...this.roomInfo, date: this.date };
                const temp = [];
                this.selectRoomLists.map((area) => {
                    for (const i in area.rooms) {
                        temp.push({ checked: area.rooms[i].checked, roomId: area.rooms[i].roomId, roomOrderId: area.rooms[i].roomOrderId });
                    }
                });
                sendData.rooms = JSON.stringify(temp);
                http.get('/room/setSelectRoomList', sendData).then(res => {
                    if (res.code === 1) {
                        this.showSelectHouse = false;
                        this.getLists();
                    }
                });
            }
        },
        watch: {
            date() {
                this.getLists();
            }
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .content{
        flex: 1;
        padding: 50px 0 0 32px;
        position: relative;
        p{
            font-size: 18px;
            color: #178ce6;
            margin: 30px 0 20px 0;
        }
        .table-content{
            table{
                box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.15);
                border-radius: 2px;
            }
            tr{
                height: 37px;
                th{
                    text-align: center;
                    font-weight: bold;
                }
                td{
                    color: #666666;
                    border-top: 1px solid #ccc;
                    text-align: center;
                    &.leftBorder{
                        border-left: 1px solid #ccc;
                    }
                    &.rightBorder{
                        border-right: 1px solid #ccc;
                    }
                }
            }
            .tbody-item{
                margin-top: 20px;
            }
        }
        .selectable-house{
            width: 632px;
            padding: 8px;
            position: absolute;
            background: #fafafa;
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.15);
            &:after, &:before{
                bottom: 100%;
                left: 50%;
                border: solid transparent;
                content: '';
                height: 0;
                width: 0;
                position: absolute;
                pointer-events: none;
            }
            &:after{
                border-color: rgba(214, 240, 238, 0);
                border-bottom-color: #fff;
                border-width: 8px;
                margin-left: -8px;
            }
            &:before{
                border-color: rgba(214, 240, 238, 0);
                border-bottom-color: #e6e6e6;
                border-width: 10px;
                margin-left: -10px;
            }
            .selectable-area{
                margin-top: 10px;
                span{
                    line-height: 30px;
                    width: 120px;
                    font-size: 16px;
                }
                .room-container{
                    flex: 1;
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 8px;
                    .room{
                        width: 58px;
                        height: 22px;
                        margin: 2px;
                        text-align: center;
                        background: #43b18a;
                        line-height: 22px;
                        border-radius: 4px;
                        padding: 0px 4px;
                        cursor: pointer;
                        color: #fff;
                    }
                    .room:nth-child(10n+1){
                        margin-left: 0;
                    }
                    .room:nth-child(10n){
                        margin-right: 0;
                    }
                    .selected{
                        border: 2px solid rgba(23,140,230,1);
                        line-height: 18px;
                        border-radius: 4px;
                        background-color: rgba(159,214,194,1)
                    }
                }
            }
            .btn-container{
                text-align: right;
                margin: 8px -8px 0;
                border-top: 1px solid #e6e6e6;
                padding: 8px 8px 0 0;
            }
        }
    }
</style>
