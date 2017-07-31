<template>
    <div>
        <div class="modal fade roomModals" id="checkOut" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">预订人数</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title" style="margin-bottom:0;"><span>房间信息</span></p>
                            <table v-touch:tap="typing" v-touch:long="longTab">
                                <tbody>
                                    <tr>
                                        <td>7</td>
                                        <td>8</td>
                                        <td>9</td>
                                        <td data-code='D' rowspan="2">
                                            <icon name='del' />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>4</td>
                                        <td>5</td>
                                        <td>6</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>2</td>
                                        <td>3</td>
                                        <td data-code='K' rowspan="2" :class="{active: activeOk}">{{ okText || 'OK' }}</td>
                                    </tr>
                                    <tr>
                                        <td>{{ point ? '.' : '' }}</td>
                                        <td>0</td>
                                        <td data-code='F'>
                                            <icon name="keyfold" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="roomModals-footer">
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

.add-bottom {
    padding: 18px 0;
    border-bottom: 1px dashed #e6e6e6;
    &:last-child {
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
                            if (item.roomId === room.roomId) {
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
                                room.selected) {
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
                        if (item.roomId === room.roomId) {
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
                    if (room.selected && room.roomId === item.roomId) {
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
                        bus.$emit('onShowDetail', { type: this.orderDetail.orderType, orderId: this.orderDetail.orderType === -1 ? this.orderDetail.orderId : this.orderDetail.roomOrderId });
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
                                if (item.roomId === room.roomId && room.selected) {
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