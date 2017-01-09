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
                                            <span class="room-select-icon"
                                                  :class="room.selected ? 'selected-icon' : 'notSelect-icon'"
                                                  @click="toggleRoomSelectedState(room)"
                                            >
                                            </span>
                                            <span class="room-icon"></span>
                                            <span>{{room.roomName}}({{room.serialNum}})</span>
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
                                    <CheckInPerson
                                            :personsObj="{id: index, persons: room.idCardList}"
                                            @addPerson="addPerson"
                                            @deletePerson="deletePerson"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">{{`${finalPrice >= 0 ? '需补金额:' : '需退金额:'}`}}<span class="order-price-num red">{{`¥${finalPrice}`}}</span></span>
                        </div>
                        <div class="dd-btn dd-btn-primary" @click="finishCheckIn">去收银</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import AJAXService from 'AJAXService';
    import modal from 'modal';
    import CheckInPerson from './CheckInPerson.vue';
    import { mapState } from 'vuex';
    export default{
        data(){
            return{}
        },
        computed: {
            ...mapState(['roomBusinessInfo']),
            roomsList() {
                if (this.roomBusinessInfo.roomOrderInfoList) {
                    this.roomBusinessInfo.roomOrderInfoList.map(item => {
                        this.$set(item, 'selected', true);
                    });
                    return this.roomBusinessInfo.roomOrderInfoList;
                }
            },
            finalPrice() {
                let price  = 0;
                if (this.roomBusinessInfo.roomOrderInfoList) {
                    this.roomBusinessInfo.roomOrderInfoList.forEach(item => {
                        if (item.selected) {
                            item.payments.forEach(pay => {
                                if (pay.type === 15) {
                                    price += pay.fee;
                                }
                            });
                        }
                    });
                }
                return price;
            }
        },
        methods:{
            hideModal() {
                $('#checkIn').modal('hide');
            },
            toggleRoomSelectedState(room) {
                room.selected = !room.selected;
            },
            addPerson(id, obj) {
                this.roomBusinessInfo.roomOrderInfoList.forEach((item, index) => {
                    if (index === id) {
                        if(item.idCardList){
                            item.idCardList.push(obj);
                        } else {
                            item.idCardList = [];
                            item.idCardList.push(obj);
                        }
                    }
                });
            },
            deletePerson(id, num) {
                this.roomBusinessInfo.roomOrderInfoList.forEach((item, index) => {
                    if (index === id) {
                        item.idCardList.splice(num, 1);
                    }
                });
            },
            finishCheckIn() {
                let orderId = this.roomBusinessInfo.orderId;
                let subOrderIds = [];
                if (this.roomBusinessInfo.roomOrderInfoList) {
                    this.roomBusinessInfo.roomOrderInfoList.forEach(item => {
                        if (item.selected) {
                            subOrderIds.push(item.roomOrderId);
                        }
                    });
                }
                const rooms = this.roomBusinessInfo.roomOrderInfoList.map(room => {
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
                const business = {
                    functionType: 1,
                    type: 0,
                    orderId: this.roomBusinessInfo.orderId,
                    rooms: rooms
                };
                $('#checkIn').modal('hide');
                this.$emit('showCashier', { type: 'checkIn', business });
            }
        },
        components:{
            CheckInPerson
        }
    }
</script>
