<template>
    <div>
        <div class="modal fade roomModals" id="checkOut" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">{{roomBusinessInfo.businessType === 2 ? '提前退房' : '办理退房'}}</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title" style="margin-bottom:0;"><span>房间信息</span></p>
                            <div v-for="(room, index) in roomBusinessInfo.roomOrderInfoList" class="add-bottom">
                                <div class="room-info">
                                    <div class="room-name">
                                        <span class="room-select-icon" :class="room.selected ? 'selected-icon' : 'notSelect-icon'" @click="toggleRoomSelectedState(room)">
                                            </span>
                                        <span class="room-icon"></span>
                                        <span>{{room.serialNum}}({{room.roomName}})</span>
                                        <span class="state-icon blue">已入住</span>
                                    </div>
                                    <div class="room-date">
                                        <label class="label-text" style="font-size:14px;color:#999999;">{{room.checkTypeStr}}</label>
                                        <span class="startDate">{{room.checkInTime}}</span>
                                        <span>~</span>
                                        <span class="endDate">{{room.checkOutTime}}</span>
                                        <label class="label-text" v-if="room.checkType === 1" style="font-size:14px;color:#999999;">{{`共${hourLength[index].hour}小时${hourLength[index].minute}分钟`}}</label>
                                        <label class="label-text" v-else style="font-size:14px;color:#999999;">{{`共${room.night}晚`}}</label>
                                        <div v-if="room.checkType === 1 && room.hourRoomSetting" style="font-size:12px;color:#999999;padding-top:10px;">
                                            <label>起步价格：</label>
                                            <span>￥{{`${room.hourRoomSetting.startPrice}/${room.hourRoomSetting.startDuration}小时`}}</span>
                                            <label style="margin-left:40px;">收费标准：</label>
                                            <span>￥{{`${room.hourRoomSetting.unitPrice}/${room.hourRoomSetting.unitDuration}小时`}}</span>
                                        </div>
                                    </div>
                                    <div class="room-fee" style="margin-right: 81px">
                                        <label class="label-text" style="font-size:14px;color:#999999;">订单金额</label>
                                        <span>{{`¥${room.totalPrice}`}}</span>
                                        <div v-if="room.checkType === 1" style="padding-top:10px;">
                                            <label style="font-size:14px;color:#999999;">实际房费</label>￥<input type="text" v-model.number="room.roomHoursPrice" @input="changeHourRoomPrice(room)" style="width:50px;height:24px;" class="dd-input">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content-item" v-if='roomBusinessInfo.businessType === 2'>
                            <p class="content-item-title"><span>今日房费</span></p>
                            <div class="dd-btn" :class=' tadayFeeType === 1 ? "dd-btn-primary" : "" ' @click="changeTadayFeeType(1)">全天房费</div>
                            <div class="dd-btn" :class=' tadayFeeType === 0.5 ? "dd-btn-primary" : "" ' @click="changeTadayFeeType(0.5)">半天房费</div>
                            <div class="dd-btn" :class='tadayFeeType === 0 ? "dd-btn-primary" : "" ' @click="changeTadayFeeType(0)">不收取</div>
                            <p style="    margin-top: 10px;">{{number}}个房间，共收取今日房费 ¥
                                <input type="number" v-model='totalFee' class="dd-input" @input='changeTotalFee'><span style="color:#999">(自定义今日房费将平均分配到每个房间)</span></p>
                        </div>
                        <div class="content-item" >
                            <p class="content-item-title"><span>订单总结</span></p>
                            <span>订单金额:<span>¥{{totalPrice}}</span></span>
                            <!-- <span style="margin-left: 24px">已收金额:<span>¥{{payed.toFixed(0)}}</span></span> -->
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div @click="returnPreStep" class="btn-back"><img src="/static/image/modal/back.png" alt=""></div>
                        <div>
                            <span class="footer-label">{{`${ (totalPrice  - payed) >= 0 ? '需补金额:' : '需退金额:'}`}}
                                <span class="order-price-num" :class="(totalPrice  - payed) >= 0 ? 'red' : 'green'">¥{{(Math.abs(totalPrice  - payed)).toFixed(2)}}</span>
                            </span>
                            <div class="dd-btn dd-btn-primary" @click="checkOut">确认退房</div>
                            <!-- <span class="footer-label">需退押金<span class="order-price-num green">¥{{deposit}}</span></span> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss" rel="stylesheet/scss">
.content-item .dd-btn {
    border: 1px solid #178ce6;
    border-radius: 2px;
}
.add-bottom{
    padding: 18px 0;
    border-bottom: 1px dashed #e6e6e6;
    &:last-child{
        border-bottom: none;
        padding-bottom: 0;
    }
}
</style>
<script>
import http from '../../http';
import modal from '../../modal';
import {
    mapState
} from 'vuex';
import bus from '../../eventBus';
import { mapActions } from 'vuex';
import type from '../store/types';
import types from '../store/types';
export default {
    data() {
        return {
            penalty: undefined,
            tadayFeeType: 1,
            totalFee: 0,
            backroomBusinessInfo: undefined,
            timeCount: true,
            subOrderIds: []
        };
    },
    computed: {
        ...mapState({
            orderDetail: state => state.orderSystem.orderDetail,
            roomBusinessInfo: state => state.orderSystem.roomBusinessInfo
        }),
        number() {
            let sum = 0;
            if (!this.roomBusinessInfo.roomOrderInfoList) {
                return sum;
            }
            this.roomBusinessInfo.roomOrderInfoList.map(
                    room => {
                        if (room.selected) {
                            sum += 1;
                        }
                    }
                );
            return Number(sum);
        },
        totalPrice() {
            let sum = 0;
            if (!this.roomBusinessInfo.roomOrderInfoList) {
                return sum;
            }
            this.roomBusinessInfo.roomOrderInfoList.map(
                    room => {
                        if (room.selected) {
                            sum += room.totalPrice;
                        }
                    }
                );
                // if (this.tadayFeeType !== undefined) {
                //     sum += this.tadayFee;
                // }
            return Number(sum.toFixed(2));
        },
        tadayFee() {
            let sum = 0;
            if (!this.roomBusinessInfo.roomOrderInfoList) {
                return sum;
            }
            if (this.tadayFeeType === undefined) {
                return Number(this.totalFee);
            }
            this.roomBusinessInfo.roomOrderInfoList.map(
                    room => {
                        if (room.selected) {
                            if (this.tadayFeeType === 0.5) {
                                sum += room.todayPriceHalf;
                            }
                            if (this.tadayFeeType === 1) {
                                sum += room.todayPrice;
                            }
                        }
                    }
                );
            return Number(sum.toFixed(2));
        },
        payed() {
            let sum = 0;
            if (!this.roomBusinessInfo.roomOrderInfoList) {
                return sum;
            }

            this.roomBusinessInfo.roomOrderInfoList.map(
                    room => {
                        if (room.selected) {
                            sum += room.payments.reduce((a, b) => {
                                if (b.type === 14) {
                                    return a + b.fee;
                                } else {
                                    return a;
                                }
                                // if (b.type === 0) {
                                //     return a + b.fee;
                                // } else if (b.type === 2) {
                                //     return a - b.fee;
                                // } else {
                                //     return a;
                                // }
                            }, 0);
                        }
                    }
                );
            return sum;
        },
        hourLength() {
            const res = [];
            this.roomBusinessInfo.roomOrderInfoList.forEach((room) => {
                res.push({
                    hour: Math.floor((new Date(room.checkOutTime).getTime() - new Date(room.checkInTime).getTime()) / 3600000),
                    minute: Math.floor(((new Date(room.checkOutTime).getTime() - new Date(room.checkInTime).getTime()) % 3600000) / 60000)
                });
            });
            return res;
        }
    },
    watch: {
        roomBusinessInfo() {
            this.backroomBusinessInfo = JSON.parse(JSON.stringify(this.roomBusinessInfo));
            this.roomBusinessInfo.roomOrderInfoList.map(
                    room => {
                        this.backroomBusinessInfo.roomOrderInfoList.map(
                            item => {
                                if (item.roomId === room.roomId && item.roomOrderId === room.roomOrderId) {
                                    if (this.tadayFeeType === 1) {
                                        room.totalPrice = Number(item.totalPrice) + Number(item.todayPrice);
                                    }
                                    if (this.tadayFeeType === 0.5) {
                                        room.totalPrice = Number(item.totalPrice) + Number(item.todayPriceHalf);
                                    }
                                    if (this.tadayFeeType === 0) {
                                        room.totalPrice = Number(item.totalPrice);
                                    }
                                }
                            }
                        );
                    }
                );
        },
        tadayFee() {
            this.totalFee = this.tadayFee;
        },
        tadayFeeType(n, o) {
                // if (!this.backroomBusinessInfo) {
                //     this.backroomBusinessInfo = JSON.parse(JSON.stringify(this.roomBusinessInfo));
                // }
            this.roomBusinessInfo.roomOrderInfoList.map(
                    room => {
                        this.backroomBusinessInfo.roomOrderInfoList.map(
                            item => {
                                if (item.roomId === room.roomId &&
                                    room.selected && item.roomOrderId === room.roomOrderId) {
                                    if (n === 1) {
                                        room.totalPrice = Number(item.totalPrice) + Number(item.todayPrice);
                                    }
                                    if (n === 0.5) {
                                        room.totalPrice = Number(item.totalPrice) + Number(item.todayPriceHalf);
                                    }
                                    if (n === 0) {
                                        room.totalPrice = Number(item.totalPrice);
                                    }
                                }
                            }
                        );
                    }
                );
        }
    },
    methods: {
        ...mapActions([type.LOAD_ROOM_BUSINESS_INFO]),
        changeTadayFeeType(TadayFeeType) {
            this.tadayFeeType = TadayFeeType;
        },
        changeTotalFee() {
            clearTimeout(this.timeCount);
            this.timeCount = setTimeout(() => {
                this.changeTotalFeefn();
            }, 500);
        },
        changeTotalFeefn() {
                // this.tadayFeeType = undefined;
                // const subOrderIds = [];
            this.subOrderIds = [];
            if (!this.backroomBusinessInfo) {
                this.backroomBusinessInfo = JSON.parse(JSON.stringify(this.roomBusinessInfo));
            }
            this.roomBusinessInfo.roomOrderInfoList.map(
                    room => {
                        if (room.selected) {
                            this.subOrderIds.push(room.roomOrderId);
                        }
                    }
                );
            http.get(' /room/getCustomCheckOutFee', {
                subOrderIds: JSON.stringify(this.subOrderIds),
                totalFee: this.totalFee
            })
                    .then(res => {
                        res.data.list.map(
                            item => {
                                this.roomBusinessInfo.roomOrderInfoList.map(
                                    room => {
                                        this.backroomBusinessInfo.roomOrderInfoList.map(
                                            backRoom => {
                                                if (room.selected && item.subOrderId === room.roomOrderId && backRoom.roomOrderId === room.roomOrderId) {
                                                    room.totalPrice = item.fee + backRoom.totalPrice;
                                                }
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    });
        },
        show() {
            this[types.LOAD_ROOM_BUSINESS_INFO]({ businessType: this.roomBusinessInfo.businessType }).then(res => {
                $('#checkOut').modal({
                    backdrop: 'static'
                });
            });
        },
        returnPreStep() {
            this.hideModal();
            bus.$emit('back');
                // bus.$emit('onShowDetail');
        },
        hideModal() {
            this.penalty = undefined;
            this.totalFee = 0;
            this.tadayFeeType = 1;
            this.subOrderIds = [];
            $('#checkOut').modal('hide');
        },
        toggleRoomSelectedState(room) {
            if (room.selected) {
                this.backroomBusinessInfo.roomOrderInfoList.map(
                        item => {
                            if (item.roomId === room.roomId && item.roomOrderId === room.roomOrderId) {
                                room.totalPrice = Number(item.totalPrice) + Number(item.todayPrice);
                            }
                        }
                    );
            }
            room.selected = !room.selected;
            this.tadayFeeType = 1;
        },
        checkOut() {
            let night = null;
            switch (this.tadayFeeType) {
                case 1:
                    night = 1;
                    break;
                case 0.5:
                    night = 2;
                    break;
                case 0:
                    night = 0;
                    break;
            }
            const rooms = [];
            this.roomBusinessInfo.roomOrderInfoList.map((room, index) => {
                this.backroomBusinessInfo.roomOrderInfoList.map(item => {
                    if (room.selected && room.roomId === item.roomId && item.roomOrderId === room.roomOrderId) {
                        rooms.push({
                            startDate: room.checkInDate,
                            endDate: room.checkOutDate,
                            idCardList: room.idCardList,
                            roomId: room.roomId,
                            roomOrderId: room.roomOrderId,
                            fee: room.checkType === 1 ? room.roomHoursPrice : room.totalPrice - item.totalPrice,
                            night: night
                        });
                    }
                });
            });
            const filterRooms = rooms.filter(room => {
                return room;
            });
            if (filterRooms.length <= 0) {
                modal.warn('请选择房间！');
                return false;
            }
            const business = {
                type: this.roomBusinessInfo.businessType,
                orderId: this.roomBusinessInfo.orderId,
                rooms: filterRooms
            };
            if (business.type === 2) {
                business.penalty = this.penalty;
            }

            if ((this.totalPrice + (this.penalty || 0) - this.payed) === 0) {
                const roomsFix = rooms;
                roomsFix.forEach(function(element, index) {
                    if (element === null) {
                        roomsFix.splice(index, 1);
                    }
                        // if (element.roomId === ) {}
                });
                    // 清理rooms里为null的值，如果要改回原来的用就行了
                http.get('/order/checkInOrCheckout', {
                    ...business,
                    rooms: JSON.stringify(roomsFix)
                })
                        .then(res => {
                            this.hideModal();
                            modal.success('退房成功');
                            bus.$emit('refreshView');
                            bus.$emit('onShowDetail', { type: this.orderDetail.orderType, orderId:  this.orderDetail.orderType === -1 ? this.orderDetail.orderId : this.orderDetail.roomOrderId });
                        });
            } else {
                if (this.penalty) {
                    business.penalty = Number(this.penalty);
                }
                business.functionType = 1;
                const todayFeeMap = [];
                this.roomBusinessInfo.roomOrderInfoList.map(
                        (room, index) => {
                            this.backroomBusinessInfo.roomOrderInfoList.map(
                                item => {
                                    if (item.roomId === room.roomId && room.selected && item.roomOrderId === room.roomOrderId) {
                                        todayFeeMap.push({
                                            fee: room.checkType === 1 ? room.roomHoursPrice : (room.totalPrice - item.totalPrice).toFixed(2),
                                            subOrderId: item.roomOrderId
                                        });
                                    }
                                }
                            );
                        }
                    );
                business.todayFeeMap = JSON.stringify(todayFeeMap);
                this.hideModal();
                    // this.$emit('showCashier', { type: 'checkOut', business });
                bus.$emit('showCashier', {
                    type: 'checkOut',
                    business
                });

                    // bus.$emit('showCashier', {
                    //     type: 'checkOut',
                    //     business
                    // });
                bus.$emit('changeBack', this.show);
            }
        },
        changeHourRoomPrice(room) {
            room.totalPrice = Number(room.roomHoursPrice) + room.extraPrice;
        }
    },
    components: {}
};
</script>
