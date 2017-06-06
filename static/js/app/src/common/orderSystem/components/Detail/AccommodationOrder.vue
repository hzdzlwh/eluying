<template>
    <div>
        <div class="content-item">
            <p class="content-item-title"><span>房间信息</span></p>
            <div class="items">
                <div class="item" v-for="item in rooms" v-if='rooms'>
                    <div class="room-info">
                        <div class="room-name">
                            <span class="room-icon"></span>
                            <span>{{(item.roomInfo
                            && item.roomInfo.roomNum) || item.serialNum
                                }}({{item.name || (item.roomInfo && item.roomInfo.roomName)}})</span>
                            <span class="state-icon"
                                  :class="getOrderState(item, 'color')"
                            >
                                {{getOrderState(item, 'text')}}
                            </span>
                        </div>
                        <div class="room-date">
                            <label class="label-text">入住</label>
                            <span class="startDate">{{item.startDate || item.roomInfo.checkInDate}}</span>
                            <span>~</span>
                            <span class="endDate">{{item.endDate || item.roomInfo.checkOutDate}}</span>
                            <label class="label-text">共{{item.duration}}晚</label>
                        </div>
                        <div>
                            <div class="room-fee room-fix">
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
                            <span class="single-order-btn" @click='modalShow(item.serviceId)'
                                  v-text="(showMoadl && !order.roonInfo) ? '查看': ''"
                                  :class="(showMoadl && !order.roonInfo) ? 'cursor' : ''">查看</span>
                        </div>
                        <span class="discount-info"
                              v-if="(item.showDiscount || (item.roomInfo && item.roomInfo.showDiscount))"
                              style="top: 20px">
                            <span>原价<span class="origin-price">¥{{ item.originPrice || item.roomInfo.originPrice}}</span></span>
                        <span class="discount-num">
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
