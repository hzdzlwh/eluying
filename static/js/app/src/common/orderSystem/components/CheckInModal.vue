<template>
    <div>
        <div class="modal fade roomModals" id="checkIn" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">办理入住</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title"><span>房间信息</span></p>
                            <div class="items" v-if="roomsList && roomsList.length > 0">
                                <div class="item" v-for="(room, index) in roomsList">
                                    <div class="room-info">
                                        <div class="room-name">
                                            <span class="room-select-icon" :class="room.selected ? 'selected-icon' : 'notSelect-icon'" @click="toggleRoomSelectedState(room)">
                                            </span>
                                            <span class="room-icon"></span>
                                            <span>{{room.serialNum}}({{room.roomName}})</span>
                                            <span class="state-icon yellow">已预订</span>
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
                                    <CheckInPerson :personsObj="{id: index, persons: room.idCardList}" @addPerson="addPerson" @deletePerson="deletePerson" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <!-- <div>
                            <span class="footer-label">{{finalPrice >= 0 ? '需补金额:' : '需退金额:'}}<span class="order-price-num red">¥{{(Math.abs(finalPrice)).toFixed(2)}}</span></span>
                        </div> -->
                        <div @click="returnPreStep" class="btn-back"><img src="/static/image/modal/back.png" alt=""></div>
                        <div style="float:right">
                            <div class="dd-btn dd-btn-primary" @click="finishCheckIn">确认入住</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
import modal from 'modal';
import util from 'util';
import CheckInPerson from './CheckInPerson.vue';
import {
    mapState
} from 'vuex';
import { getOrderId } from '../utils/order';
import bus from '../../eventBus';
import http from 'http';
export default {
    data() {
        return {};
    },
    created() {
        bus.$on('changeOutOrInSelect', this.changeOutOrInSelect);
    },
    beforeDestroy() {
        bus.$off('changeOutOrInSelect', this.changeOutOrInSelect);
    },
    computed: {
        ...mapState({
            orderDetail: state => state.orderSystem.orderDetail,
            roomBusinessInfo: state => state.orderSystem.roomBusinessInfo
        }),
        roomsList() {
            if (this.roomBusinessInfo.roomOrderInfoList) {
                const rooms = this.roomBusinessInfo.roomOrderInfoList.filter((room) => {
                    return util.isSameDay(new Date(room.checkInDate), new Date()) || new Date(room.checkInDate) <= new Date();
                });
                rooms.forEach(item => {
                    this.$set(item, 'selected', true);
                        // 独立住宿订单和子订单只选择一个房间
                    const roomInfo = this.orderDetail.roomInfo;
                    if (roomInfo && roomInfo.roomId !== item.roomId) {
                        this.$set(item, 'selected', false);
                    }
                });
                return rooms;
            }
        }
    },
    methods: {
        changeOutOrInSelect(id) {
            if (this.roomBusinessInfo.roomOrderInfoList) {
                this.roomBusinessInfo.roomOrderInfoList.forEach((room) => {
                    if (room.roomId !== id) {
                        room.selected = false;
                    }
                });
            }
        },
        returnPreStep() {
            this.hideModal();
            bus.$emit('back');
        },
        hideModal() {
            $('#checkIn').modal('hide');
        },
        toggleRoomSelectedState(room) {
            room.selected = !room.selected;
        },
        addPerson(id, obj) {
            this.roomsList.forEach((item, index) => {
                if (index === id) {
                    if (item.idCardList && item.idCardList.length >= 20) {
                        modal.warn('一间房最多添加20个入住人');
                        return false;
                    }
                    if (item.idCardList) {
                        item.idCardList.push(obj);
                    } else {
                        item.idCardList = [];
                        item.idCardList.push(obj);
                    }
                }
            });
        },
        deletePerson(id, num) {
            this.roomsList.forEach((item, index) => {
                if (index === id) {
                    item.idCardList.splice(num, 1);
                }
            });
        },
        finishCheckIn() {
            const selectedRoom = this.roomsList.filter(room => {
                return room.selected;
            });
            if (selectedRoom.length <= 0) {
                modal.warn('请选择入住的房间！');
                return false;
            }
            let roomPersonValid = true;
            selectedRoom.forEach(item => {
                if (item.idCardList && item.idCardList.length > 0) {
                    item.idCardList.forEach(person => {
                        if (person.idCardNum === '' || person.name === '') {
                            roomPersonValid = false;
                        }
                    });
                }
            });
            if (!roomPersonValid) {
                modal.warn('请完善入住人信息！');
                return false;
            }
            const subOrderIds = [];
            if (this.roomBusinessInfo.roomOrderInfoList) {
                this.roomsList.forEach(item => {
                    if (item.selected) {
                        subOrderIds.push(item.roomOrderId);
                    }
                });
            }
            const rooms = this.roomsList.map(room => {
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
            const business = {
                functionType: 1,
                type: 0,
                orderId: this.roomBusinessInfo.orderId,
                rooms: JSON.stringify(rooms.filter((room) => {
                    return room;
                }))
            };
            http.get('/order/checkInOrCheckout', business).then(res => {
                $('#checkIn').modal('hide');
                bus.$emit('refreshView');
                bus.$emit('onShowDetail', { ...this.orderDetail, orderId: getOrderId(this.orderDetail) });
            });
                // bus.$emit('showCashier', { type: 'checkIn', business });
        }
    },
    components: {
        CheckInPerson
    }
};
</script>
