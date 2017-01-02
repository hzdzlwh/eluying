<template>
    <div>
        <div class="modal fade roomModals" id="checkOut" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">办理退房</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title"><span>房间信息</span></p>
                            <div v-for="room in rooms.roomOrderInfoList">
                                <div class="room-info">
                                    <div class="room-name">
                                            <span class="room-select-icon"
                                                  :class="room.selected ? 'selected-icon' : 'notSelect-icon'"
                                                  @click="toggleRoomSelectedState(room)"
                                            >
                                            </span>
                                        <span class="room-icon"></span>
                                        <span>{{room.roomName}}</span>
                                        <span class="room-state-icon" style="background: #ffba75">预</span>
                                    </div>
                                    <div class="room-date">
                                        <label class="label-text">入住</label>
                                        <span class="startDate">{{room.checkInDate.slice(5)}}</span>
                                        <span>~</span>
                                        <span class="endDate">{{room.checkOutDate.slice(5)}}</span>
                                        <label class="label-text">{{`共${room.night}晚`}}</label>
                                    </div>
                                    <div class="room-fee" style="margin-right: 81px">
                                        <label class="label-text">房费</label>
                                        <span>{{`¥${room.totalPrice}`}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content-item" v-if="rooms.type === 2">
                            <p class="content-item-title"><span>订单总结</span></p>
                            <span>订单金额:<span>¥{{totalPrice}}</span></span>
                            <span style="margin-left: 24px">已付金额:<span>¥{{payed}}</span></span>
                        </div>
                        <div class="content-item" v-if="rooms.type === 2">
                            <p class="content-item-title"><span>违约信息</span></p>
                            <span>提前退房部分房价：￥{{noCheckInMoney}}</span>
                            <span>提前退房违约金：</span>
                            <input v-model="penalty" type="text" class="dd-input" placeholder="请输入违约金">
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">{{`${finalPrice >= 0 ? '需补金额:' : '需退金额:'}`}}<span class="order-price-num red">{{`¥${finalPrice}`}}</span></span>
                            <span class="footer-label">需退押金<span class="order-price-num green">¥{{deposit}}</span></span>
                        </div>
                        <div class="dd-btn dd-btn-primary" @click="checkOut">确认退房</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import AJAXService from '../../common/AJAXService';
    import modal from '../../common/modal';
    export default{
        props:{
            rooms:{
                type: Object,
                default: {}
            }
        },
        data(){
            return{
                penalty: undefined
            }
        },
        computed: {
            totalPrice() {
                let sum = 0;
                if (!this.rooms.roomOrderInfoList) {
                    return sum;
                }

                this.rooms.roomOrderInfoList.map(
                    room => {
                        if (room.selected) {
                            sum += room.totalPrice;
                        }
                    }
                )

                return sum;
            },
            payed() {
                let sum = 0;
                if (!this.rooms.roomOrderInfoList) {
                    return sum;
                }

                this.rooms.roomOrderInfoList.map(
                    room => {
                        if (room.selected) {
                            sum += room.payments.reduce((a, b) => {
                                if (b.type === 0) {
                                    return a + b.fee;
                                } else {
                                    return a;
                                }
                            }, 0);
                        }
                    }
                )

                return sum;
            },
            finalPrice() {
                let price  = 0;
                if (this.rooms.roomOrderInfoList) {
                    this.rooms.roomOrderInfoList.forEach(item => {
                        if (item.selected) {
                            item.payments.forEach(pay => {
                                if (pay.type === 15) {
                                    price += pay.fee;
                                }
                            });
                        }
                    });
                }

                return price + this.penalty ? this.penalty : 0;
            },
            deposit() {
                return this.rooms.deposit - this.rooms.depositRefund;
            },
            noCheckInMoney() {
                let sum = 0;
                if (!this.rooms.roomOrderInfoList) {
                    return sum;
                }

                this.rooms.roomOrderInfoList.map(
                    room => {
                        if (room.selected) {
                            sum += room.noCheckInMoney;
                        }
                    }
                )

                return sum;
            }
        },
        methods:{
            hideModal(){
                $('#checkOut').modal('hide');
            },
            toggleRoomSelectedState(room) {
                room.selected = !room.selected;
            },
            checkOut() {
                if (this.deposit === 0 && this.finalPrice === 0) {
                    const rooms = this.rooms.roomOrderInfoList.map(room => {
                        if (room.selected) {
                            return {
                                startDate: room.checkInDate,
                                endDate: room.checkOutDate,
                                idCardList: room.idCardList,
                                roomId: room.roomId,
                                roomOrderId: room.roomOrderId
                            }
                        }
                    });
                    AJAXService.ajaxWithToken('GET', '/order/checkInOrCheckout', {type: this.rooms.type, orderId: this.rooms.orderId, rooms: JSON.stringify(rooms)})
                        .then(res => {
                            if (res.code === 1) {
                                $('#checkOut').modal('hide');
                                $('#orderDetail').modal('show');
                            } else {
                                modal.somethingAlert(res.msg);
                            }
                        })
                } else {
                    this.$emit('changeCashierType', 'checkOut');
                    let orderId = this.rooms.orderId;
                    let subOrderIds = [];
                    if (this.rooms.roomOrderInfoList) {
                        this.rooms.roomOrderInfoList.forEach(item => {
                            if (item.selected) {
                                subOrderIds.push(item.roomOrderId);
                            }
                        });
                    }
                    let params = { operationType: 1, orderId: this.rooms.orderId, orderType: -1, subOrderIds: JSON.stringify(subOrderIds), penalty: this.penalty };
                    AJAXService.ajaxWithToken('GET', '/order/getOrderPayment', params )
                        .then(res => {
                            if (res.code === 1) {
                                this.$emit('changePayMents', res.data);
                                $('#Cashier').modal('show');
                                $('#checkOut').modal('hide');
                            } else {
                                modal.somethingAlert(res.msg);
                            }
                        });
                }
            }
        },
        components:{}
    }
</script>
