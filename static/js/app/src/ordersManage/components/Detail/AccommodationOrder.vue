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

                            <span class="room-state-icon"
                                  :style="{background: getRoomOrFoodState(3, item).backgroundColor}"
                            >
                                                {{getRoomOrFoodState(3, item).text}}
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
                                            <span>原价<span
                                                    class="origin-price">¥{{ item.originPrice || item.roomInfo.originPrice}}</span></span>
                        <span class="discount-num">
                                                {{ item.showDiscount || (item.roomInfo && item.roomInfo.showDiscount)}}
                                            </span>
                        </span>
                    </div>
                    <div class="room-user" v-for="user in (item.idCardList || item.idCardsList)">
                        <span class="user-icon"></span>
                        <span class="user-name">{{user.name}}</span>
                        <div class="card-type">
                            <label class="label-text">{{ID_CARD_TYPE[user.idCardType]}}</label>
                            <span>{{user.idCardNum}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .room-fix {
        display: inline-block;
        cursor: pointer;
    }
</style>
<script>
    import {
        ID_CARD_TYPE,
        ORDER_TYPE
    } from '../../constant';
    import bus from '../../../common/eventBus';
    export default {
        props: {
            order: {
                type: Object,
                default: undefined
            },
            showMoadl: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                ID_CARD_TYPE,
                ORDER_TYPE
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
            getRoomOrFoodState(type, item) {
                let state;
                if (item.roomInfo) {
                    state = item.roomInfo.state;
                } else {
                    state = item.state;
                }
                switch (state) {
                    case 0:
                        return {
                            text: '预',
                            backgroundColor: '#ffba75'
                        };
                    case 1:
                        return {
                            text: '住',
                            backgroundColor: '#82beff'
                        };
                    case 2:
                        return {
                            text: '退',
                            backgroundColor: '#bfbfbf'
                        };
                    case 3:
                        return {
                            text: '消',
                            backgroundColor: '#bfbfbf'
                        };
                    default:
                        return {};
                }
            },
            modalShow(id) {
                bus.$emit('onShowDetail', {
                    orderId: id,
                    type: 3
                });
            }
        }
    };
</script>
