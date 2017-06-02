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
                            <p class="content-item-title"><span>房间信息</span></p>
                            <div v-for="room in roomBusinessInfo.roomOrderInfoList">
                                <div class="room-info">
                                    <div class="room-name">
                                            <span class="room-select-icon"
                                                  :class="room.selected ? 'selected-icon' : 'notSelect-icon'"
                                                  @click="toggleRoomSelectedState(room)"
                                            >
                                            </span>
                                        <span class="room-icon"></span>
                                        <span>{{room.serialNum}}({{room.roomName}})</span>
                                        <span class="room-state-icon" style="background: #82beff">住</span>
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
                        <div class="content-item">
                            <p class="content-item-title"><span>今日房费</span></p>
                            <div class="dd-btn" :class=' tadayFee === 1 ? "dd-btn-primary" : "" ' @click="tadayFee = 1">全天房费</div>
                            <div class="dd-btn" :class=' tadayFee === 0.5 ? "dd-btn-primary" : "" ' @click="tadayFee = 0.5">半天房费</div>
                            <div class="dd-btn" :class='tadayFee === 0 ? "dd-btn-primary" : "" ' @click="tadayFee = 0">不收取</div>
                        </div>
                        <div class="content-item" v-if="roomBusinessInfo.businessType === 2">
                            <p class="content-item-title"><span>订单总结</span></p>
                            <span>订单金额:<span>¥{{totalPrice}}</span></span>
                            <span style="margin-left: 24px">已收金额:<span>¥{{payed}}</span></span>
                        </div>
                    <!--     <div class="content-item" v-if="roomBusinessInfo.businessType === 2">
                            <p class="content-item-title"><span>违约信息</span></p>
                            <span style="margin-right: 24px">提前退房部分房价：￥{{noCheckInMoney}}</span>
                            <span>提前退房违约金：</span>
                            <input v-model="penalty" type="number" class="dd-input" placeholder="请输入违约金">
                        </div> -->
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">{{`${ (totalPrice + (Number(penalty) || 0) - payed) >= 0 ? '需补金额:' : '需退金额:'}`}}
                                <span class="order-price-num" :class="(totalPrice + (Number(penalty) || 0) - payed) >= 0 ? 'red' : 'green'">¥{{(Math.abs(totalPrice + (Number(penalty) || 0) - payed)).toFixed(2)}}</span>
                            </span>
                            <!-- <span class="footer-label">需退押金<span class="order-price-num green">¥{{deposit}}</span></span> -->
                        </div>
                        <div><div class="dd-btn dd-btn-primary" style="margin-right:20px" @click="returnPreStep">返回</div><div class="dd-btn dd-btn-primary" @click="checkOut">确认退房</div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import http from '../../http';
    import modal from '../../modal';
    import { mapState } from 'vuex';
    import bus from '../../eventBus';
    export default{
        data() {
            return {
                penalty: undefined,
                tadayFee: 1
            };
        },
        computed: {
            ...mapState({
                orderDetail: state => state.orderSystem.orderDetail,
                roomBusinessInfo: state => state.orderSystem.roomBusinessInfo
            }),
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
                                if (b.type === 0) {
                                    return a + b.fee;
                                } else if (b.type === 2) {
                                    return a - b.fee;
                                } else {
                                    return a;
                                }
                            }, 0);
                        }
                    }
                );
                return sum;
            }
            // deposit() {
            //     return this.roomBusinessInfo.deposit - this.roomBusinessInfo.depositRefund;
            // },
            // noCheckInMoney() {
            //     let sum = 0;
            //     if (!this.roomBusinessInfo.roomOrderInfoList) {
            //         return sum;
            //     }

            //     this.roomBusinessInfo.roomOrderInfoList.map(
            //         room => {
            //             if (room.selected) {
            //                 sum += room.noCheckInMoney;
            //             }
            //         }
            //     );

            //     return sum;
            // }
        },
        methods: {
            show() {
                $('#checkOut').modal({ backdrop: 'static' });
            },
            returnPreStep() {
                this.hideModal();
                bus.$emit('back');
                // bus.$emit('onShowDetail');
            },
            hideModal() {
                this.penalty = undefined;
                $('#checkOut').modal('hide');
            },
            toggleRoomSelectedState(room) {
                room.selected = !room.selected;
            },
            checkOut() {
                const rooms = this.roomBusinessInfo.roomOrderInfoList.map(room => {
                    if (room.selected) {
                        return {
                            startDate: room.checkInDate,
                            endDate: room.checkOutDate,
                            idCardList: room.idCardList,
                            roomId: room.roomId,
                            roomOrderId: room.roomOrderId
                        };
                    }
                });
                const filterRooms = rooms.filter(room => { return room; });
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
                    });
                    // 清理rooms里为nu l l的值，如果要改回原来的用就行了
                    http.get('/order/checkInOrCheckout', {
                        ...business,
                        rooms: JSON.stringify(roomsFix)
                    })
                        .then(res => {
                            this.hideModal();
                            modal.success('退房成功');
                            bus.$emit('refreshView');
                            bus.$emit('showOrder', this.orderDetail.orderId);
                        });
                } else {
                    business.penalty = Number(this.penalty);
                    business.functionType = 1;
                    this.hideModal();
                    // this.$emit('showCashier', { type: 'checkOut', business });
                    bus.$emit('showCashier', { type: 'checkOut', business });
                    bus.$emit('changeBack', this.show);
                }
            }
        },
        components: {}
    };
</script>
