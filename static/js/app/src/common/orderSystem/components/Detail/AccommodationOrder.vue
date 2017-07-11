<template>
    <div>
        <div class="content-item">
            <p class="content-item-title">
                <span>房间信息</span>
                <span class="content-item-discount" v-if="order.discountPlan">折扣方案：<span>{{order.discountPlan}}</span></span>
            </p>
            <div class="items">
                <div class="item" v-for="item in rooms" v-if='rooms'>
                    <div class="room-info">
                        <div class="room-name">
                            <span class="room-icon"></span>
                            <span>{{type === ORDER_TYPE.ACCOMMODATION ? (item.roomInfo && item.roomInfo.roomNum) : item.serialNum}}</span>
                            <span v-if="!((type === ORDER_TYPE.ACCOMMODATION && !(item.roomInfo && item.roomInfo.roomNum)) || (type === ORDER_TYPE.COMBINATION && !item.serialNum))">({{item.name || (item.roomInfo && item.roomInfo.roomName)}})</span>
                            <span v-if="(type === ORDER_TYPE.ACCOMMODATION && !(item.roomInfo && item.roomInfo.roomNum)) || (type === ORDER_TYPE.COMBINATION && !item.serialNum)">{{item.name || (item.roomInfo && item.roomInfo.roomName)}}</span>&nbsp;
                            <span style="color: #2bb267" v-if="(type === ORDER_TYPE.ACCOMMODATION && !(item.roomInfo && item.roomInfo.roomNum)) || (type === ORDER_TYPE.COMBINATION && !item.serialNum)">未排房</span>
                            <span style="color: #999;margin: 0 32px" v-if="(item.roomInfo && item.roomInfo.checkTypeStr) || item.checkTypeStr">{{(item.roomInfo && item.roomInfo.checkTypeStr) || item.checkTypeStr}}</span>
                            <span class="state-icon"
                                  :class="getOrderState(item, 'color')"
                            >
                                {{getOrderState(item, 'text')}}
                            </span>
                        </div>
                        <div class="room-date">
                            <label class="label-text">到达</label>
                            <span class="startDate " :class='{roomTimeOut: item.startTimeOut || (item.roomInfo && item.roomInfo.startTimeOut)}'>{{item.startDate || item.roomInfo.checkInDate}}
                            <!-- <span class="timeOut" v-if='item.startTimeOut'>已超时</span>  -->
                            </span>
                            <span>~</span>
                            <label class="label-text">离开</label>
                            <span class="endDate " :class='{roomTimeOut: item.endTimeOut || (item.roomInfo && item.roomInfo.endTimeOut)}'>{{item.endDate || item.roomInfo.checkOutDate}}
                            <!-- <span class="timeOut" v-if='item.endTimeOut'>已超时</span>    -->
                            </span>
                            <label class="label-text">共{{item.checkType === 1 ? getHAndMs (item.checkInLength || (item.roomInfo && item.roomInfo.checkInLength)) : (item.duration + '晚')}}</label>
                        </div>
                        <div class="room-time roomTimeOut" v-if='item.startTimeOut || item.endTimeOut || (item.roomInfo && item.roomInfo.startTimeOut) || (item.roomInfo && item.roomInfo.endTimeOut)' >
                            超时未{{(item.startTimeOut || (item.roomInfo && item.roomInfo.startTimeOut)) ? '入住' : ''}}{{(item.endTimeOut || (item.roomInfo && item.roomInfo.endTimeOut)) ? '退房' : ''}}
                        </div>
                        <div style="display: flex">
                            <span class="single-order-btn" @click='modalShow(item.serviceId)'
                                  v-text="(showMoadl && !order.roonInfo) ? '查看': ''"
                                  :class="(showMoadl && !order.roonInfo) ? 'cursor' : ''">查看</span>
                        </div>
                    </div>
                    <div style="position: relative;padding-left: 41px;margin-top: 10px">
                        <div class="room-fee room-fix" style="margin-right: 20px">
                            <label class="label-text">房费</label>
                            <span>¥{{item.fee === undefined ? item.roomInfo.totalPrice : item.fee }}</span>
                            <div class="orderDetailModal-roomPriceList">
                                <dl class="price-item"
                                    v-for="priceItem in (item.datePriceList || item.roomInfo.datePriceList)">
                                    <dt>{{priceItem.date.slice(5)}}</dt>
                                    <dd>¥{{priceItem.dateFee}}</dd>
                                </dl>
                            </div>
                        </div>
                        <span class="discount-info"
                              
                              style="position: static;">
                            <span v-if="(item.showDiscount || (item.roomInfo && item.roomInfo.showDiscount)) || (item.checkType === 2 || item.checkType === 3)">原价<span class="origin-price">¥{{ item.originPrice || item.roomInfo.originPrice}}</span></span>
                        <span class="discount-num" v-if="(item.showDiscount || (item.roomInfo && item.roomInfo.showDiscount))">
                            {{ item.showDiscount || (item.roomInfo && item.roomInfo.showDiscount)}}
                        </span>
                        </span>
                    </div>
                    <div class="room-user" v-for="(user, index) in (item.idCardList || item.idCardsList)">
                        <span class="user-icon"></span>
                        <span class="user-name">{{user.name}}</span>
                        <div class="card-type">
                            <label class="label-text">{{ID_CARD_TYPE[user.idCardType]}}</label>
                            <span>{{user.idCardNum}}</span>
                            <span v-if="index === 0" class="living-persons-detail" @click="showPersonsDetailModal(item)">入住人详情</span>
                        </div>
                    </div>
                    <div class="extra-items" v-if="item.extraItems && item.extraItems.length > 0">
                        <div class="extra-items-title">
                            <span class="extra-item-icon"></span>
                            <span>其他消费</span>
                        </div>
                        <div class="extra-items-content">
                            <div v-for="extra in item.extraItems">
                                <div class="extra-items-date">{{extra.date}}</div>
                                <div>
                                    <div class="extra-items-row" v-for="good in extra.itemList">
                                        <span class="extra-items-name">{{good.goodsName}}</span>
                                        <span class="extra-items-num">x{{good.amount}}</span>
                                        <span>￥{{good.subtotal}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <persons-detail
                :id="id"
                :type="type"
                :orderId="orderId"
                :roomOrderId="roomOrderId"
                :show="showPersonsDetail"
                :editAble="editAble"
                @closePersonsDetail="closePersonsDetail">
        </persons-detail>
    </div>
</template>
<style scoped>
    .endDate, .startDate{
        position: relative;
    }
    .roomTimeOut{
        color: red
    }
    .room-fix {
        display: inline-block;
        cursor: pointer;
    }
    .living-persons-detail {
        color: #4a90e2;
        cursor: pointer;
        margin-left: 12px;
    }
</style>
<script>
    import {
        ID_CARD_TYPE,
        ORDER_TYPE,
        ORDER_STATE_TEXT
    } from '../../../../ordersManage/constant';
    import bus from '../../../eventBus';
    import personsDetail from '../personsDetail.vue';
    import { getHAndMs } from '../../../util.js';
    export default {
        props: {
            order: {
                type: Object,
                default: undefined
            },
            showMoadl: {
                type: Boolean,
                default: true
            },
            id: Number,
            type: Number
        },
        data() {
            return {
                ID_CARD_TYPE,
                ORDER_TYPE,
                orderId: undefined,
                roomOrderId: undefined,
                showPersonsDetail: false,
                personsList: [],
                editAble: true
            };
        },
        computed: {
            rooms() {
                if (this.order.rooms) {
                    return this.order.rooms;
                }
                return [this.order];
            }
        },
        methods: {
            getHAndMs,
            getOrderState(room, prop) {
                const state = room.roomInfo ? room.roomInfo.state : room.state;
                if (state === undefined || !ORDER_STATE_TEXT[ORDER_TYPE.ACCOMMODATION][state]) {
                    return '';
                }

                return ORDER_STATE_TEXT[ORDER_TYPE.ACCOMMODATION][state][prop];
            },
            modalShow(id) {
                bus.$emit('onShowDetail', {
                    orderId: id,
                    type: 3
                });
            },
            showPersonsDetailModal(room) {
                this.orderId = room.orderId;
                this.roomOrderId = room.roomOrderId;
                this.showPersonsDetail = true;
                const state = room.roomInfo ? room.roomInfo.state : room.state;
                this.editAble = state !== 2 && state !== 3;
            },
            closePersonsDetail() {
                this.showPersonsDetail = false;
            }
        },
        components: {
            personsDetail
        }
    };
</script>
