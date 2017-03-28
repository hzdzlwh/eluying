<template>
    <div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <div class="header-container" v-if="order.orderState">
                            <span class="header-text">{{title}}</span>
                            <span class="order-state-angle" :style="{ borderColor: ORDER_STATUS_ICON[order.orderState]['borderColor']}"></span>
                            <span class="order-state" :style="{ background: ORDER_STATUS_ICON[order.orderState]['backgroundColor']}"
                                  v-text="ORDER_STATUS_ICON[order.orderState]['text']">
                            </span>
                        </div>
                        <div class="header-container">
                            <span class="header-tools" @click="openPrint(order)">打印</span>
                            <span class="header-tools" v-if="!readOnly && (order.orderState === 2 || order.orderState === 3)" @click="editOrder">编辑订单</span>
                            <span class="header-tools" v-if="!readOnly && order.orderState === 2" @click="cancelOrder">取消订单</span>
                            <span class="close-icon" @click="hideModal"></span>
                        </div>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title"><span>客户信息</span></p>
                            <div class="userInfo-items">
                                <div class="userInfo-item">
                                    <label class="label-text">联系人</label>
                                    <span>{{ order.customerName }}</span>
                                </div>
                                <div class="userInfo-item vip-level-container">
                                    <label class="label-text">手机号</label>
                                    <span>{{ order.customerPhone }}</span>
                                    <span v-if="order.isVip">
                                        <span class="vip-level-img" style="top: 0;"></span>
                                        <span class="vip-level-tip" style="top: 0;">{{ order.vipLevel }}</span>
                                    </span>
                                </div>
                                <div class="userInfo-item" style="margin-right: 115px">
                                    <label class="label-text">客源渠道</label>
                                    <span>{{ order.origin }}</span>
                                </div>
                            </div>
                        </div>
                        <slot></slot>
                        <div class="content-item">
                            <div class="content-item-title" style="justify-content: flex-start">
                                <span style="margin-right: 4px">收银信息</span>
                                <div class="info-icon">
                                    <div class="info-content" style="right: 0;transform: translateX(100%)">
                                        <p class="info-title">收银信息</p>
                                        <p class="money-item">
                                            <span class="money-type">订单金额</span>
                                            <span class="money-num">¥{{findTypePrice(order.payments, 13)}}</span>
                                        </p>
                                        <p class="money-item item-indent money-sub-item">
                                            <span class="money-type">商品总价</span>
                                            <span class="money-num">¥{{findTypePrice(order.payments, 10)}}</span>
                                        </p>
                                        <p class="money-item item-indent money-sub-item" v-if="findTypePrice(order.payments, 5) > 0">
                                            <span class="money-type">优惠</span>
                                            <span class="money-num">-¥{{Math.abs(findTypePrice(order.payments, 5))}}</span>
                                        </p>
                                        <p class="money-item item-indent money-sub-item" v-if="findTypePrice(order.payments, 11) > 0">
                                            <span class="money-type">取消订单</span>
                                            <span class="money-num">-¥{{Math.abs(findTypePrice(order.payments, 11))}}</span>
                                        </p>
                                        <p class="money-item item-indent money-sub-item" v-for="item in filterPayMents(order.payments, 12, 12)">
                                            <span class="money-type">{{item.payChannel}}</span>
                                            <span class="money-num">¥{{item.fee}}</span>
                                        </p>
                                        <p class="money-item money-type-border" v-if="findTypePrice(order.payments, 4) > 0">
                                            <span class="money-type">违约金</span>
                                            <span class="money-num">¥{{findTypePrice(order.payments, 4)}}</span>
                                        </p>
                                        <p class="money-item money-type-border">
                                            <span class="money-type">{{findTypePrice(order.payments, 14) >= 0 ? '已付金额' : '已退金额'}}</span>
                                            <span class="money-num">¥{{Math.abs(findTypePrice(order.payments, 14))}}</span>
                                        </p>
                                        <p class="money-item item-indent money-sub-item" v-for="item in filterPayMents(order.payments, 0, 2)">
                                            <span class="money-type">{{`${dateFormat(item.creationTime)} ${item.payChannel}`}}</span>
                                            <span class="money-num">{{`${item.type === 2 ? '-' : ''}¥${item.fee}`}}</span>
                                        </p>
                                        <p class="money-item money-type-border">
                                            <span class="money-type">{{findTypePrice(order.payments, 15) >= 0 ? '需补金额' : '需退金额'}}</span>
                                            <span class="money-num">¥{{Math.abs(findTypePrice(order.payments, 15))}}</span>
                                        </p>
                                        <p class="money-item money-type-border">
                                            <span class="money-type">需退押金</span>
                                            <span class="money-num">¥{{findTypePrice(order.payments, 16)}}</span>
                                        </p>
                                        <p class="money-item item-indent money-sub-item" v-for="item in filterPayMents(order.payments, 1, 3)">
                                            <span class="money-type">{{`${dateFormat(item.creationTime)} ${item.payChannel}`}}</span>
                                            <span class="money-num">{{`${item.type === 3 ? '-' : ''}¥${item.fee}`}}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="footer-price">
                                <span class="order-price-text">
                                    订单金额:
                                    <span class="order-price-num grey">
                                    ¥{{findTypePrice(order.payments, 13)}}
                                    </span>
                                </span>
                                <span class="order-price-text" v-if="findTypePrice(order.payments, 4) > 0">
                                    违约金:
                                    <span class="order-price-num grey">
                                        ¥{{findTypePrice(order.payments, 4)}}
                                    </span>
                                </span>
                                <span class="order-price-text">
                                    {{findTypePrice(order.payments, 14) >= 0 ? '已付金额:' : '已退金额:'}}
                                    <span class="order-price-num grey">
                                        ¥{{Math.abs(findTypePrice(order.payments, 14))}}
                                    </span>
                                </span>
                                <span class="order-price-text">
                                    {{findTypePrice(order.payments, 15) >= 0 ? '需补金额:' : '需退金额:'}}
                                    <span class="order-price-num red">
                                        ¥{{Math.abs(findTypePrice(order.payments, 15))}}
                                    </span>
                                </span>
                                <span class="order-price-text">
                                    需退押金:
                                    <span class="order-price-num green">
                                        ¥{{findTypePrice(order.payments, 16)}}
                                    </span>
                                </span>
                            </div>
                            <p class="order-info">
                                <span class="order-info-text">订单号:{{order.orderNum}}</span>
                                <span class="order-info-operator" style="margin-left: 24px">办理员工:{{order.operatorName}}</span>
                            </p>
                        </div>
                    </div>
                    <div class="roomModals-footer" v-if="!readOnly">
                        <div style="width: 100%;">
                            <div class="order-btns">
                                <div class="dd-btn dd-btn-primary order-btn" v-if="getRoomsState.checkInAble"
                                     @click="checkInOrCheckOut(0)">
                                    办理入住
                                </div>
                                <div class="dd-btn dd-btn-primary order-btn" @click="checkInOrCheckOut(2)"
                                     v-if="getRoomsState.checkOutAdAble">
                                    提前退房
                                </div>
                                <div class="dd-btn dd-btn-primary order-btn" @click="checkInOrCheckOut(1)"
                                     v-if="getRoomsState.checkOutAble">
                                    办理退房
                                </div>
                                <div class="dd-btn dd-btn-primary order-btn" @click="showCashier"
                                     v-if="findTypePrice(order.payments, 15) !== 0 || findTypePrice(order.payments, 16) !== 0">
                                    收银
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
<style lang="sass" type="text/css" rel="stylesheet/scss">
    @import "~dd-common-css/src/variables";
    #orderDetail {
    .label-text {
        color: #999999;
    }
    }
    .small-font {
        font-size: $font-size-sm;
        color: $gary-dark;
    }
    .normal-font {
        font-size: $font-size-base;
        color: $gary-daker;
        font-weight: normal;
    }
    .roomModals {
    .grey {
        color: #666666;
    }
    .green {
        color: #00af10;
    }
    .red {
        color: #f24949;
    }
    .header-container {
        display: flex;
        align-items: center;
    }
    .order-state-angle {
        margin-left: 16px;
        border-right: 12px solid;
        border-top: 11px solid;
        border-bottom: 11px solid;
    }
    .order-state {
        color: #ffffff;
        font-size: $font-size-sm;
        display: inline-flex;
        width: 40px;
        height: 22px;
        justify-content: center;
        align-items: center;
        border-radius: 1px;
        padding-right: 3px;
    }
    .header-tools {
        color: $blue;
        font-size: $font-size-sm;
        cursor: pointer;
        margin-right: 16px;
    }
    .item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 13px;
    &:not(:last-child) {
         padding-bottom: 15px;
         margin-bottom: 16px;
         border-bottom: 1px dotted #e6e6e6;
     }
    }
    .item-content {
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }
    .user-name {
        width: 124px;
    }
    .room-date {
    .startDate, .endDate {
        margin: 0 14px;
    }
    }
    .room-info {
        justify-content: space-between;
        position: relative;
    }
    .room-info, .room-name, .room-user, .play-item, .food-item {
        display: flex;
        align-items: center;
    }
    .room-user {
        margin-top: 12px;
    }
    .room-state-icon, .food-state-icon {
        width: 16px;
        height: 16px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        font-size: 10px;
        border-radius: 2px;
        margin-left: 4px;
    }
    .orderDetailModal-shop-item {
        display: flex;
    }
    .room-fee:hover{
    .orderDetailModal-roomPriceList {
        display: flex;
    }
    }
    .orderDetailModal-roomPriceList {
        display: none;
        flex-wrap: wrap;
        position: absolute;
        max-width: 491px;
        right: 81px;
        padding: 8px 8px 8px 0;
        background: #fafafa;
        box-shadow: 0 0 5px 0;
        border-radius: 2px;
        max-height: 100px;
        overflow-y: auto;
        z-index: 9;
    &:before {
         display: table;
         content: " ";
         line-height: 0;
     }
    .price-item {
        width: 60px;
        margin-left: 8px;
    dt {
        color: #999999;
        font-size: 12px;
    }
    dd {
        height: 24px;
    }
    }
    }
    .user-icon {
        width: 16px;
        height: 15px;
        background: url("../../../../../image/modal/room_modal_user.png");
        background-size: contain;
        margin-right: 25px;
    }
    .food-icon {
        width: 14px;
        height: 18px;
        background: url("../../../../../image/modal/room_modal_food.png");
        background-size: contain;
        margin-right: 25px;
    }
    .info-icon {
        position: relative;
        cursor: pointer;
        width: 16px;
        height: 16px;
        background: url("../../../../../image/modal/room_modal_info.png");
        background-size: contain;
    }
    .info-content {
    @extend .normal-font;
        width: 274px;
        margin: 0;
        position: absolute;
        bottom: 0;
        display: none;
        transform: translateX(-100%);
        max-height: 230px;
        overflow-y: scroll;
        background: #fafafa;
        border-radius: 2px;
        box-shadow: 0 0 5px 0;
        padding: 8px;
    &::-webkit-scrollbar {
         width: 0;
     }
    .item-indent {
        padding-left: 16px;
    }
    .dish-discount-icon {
        font-size: 10px;
        color: #ffffff;
        display: inline-flex;
        background:#ffba75;
        border-radius:2px;
        width:17px;
        height:16px;
        margin-left: 5px;
        align-items: center;
        justify-content: center;
    }
    dish-name-container {
        width: 170px;
        display: inline-flex;
        justify-content: flex-start;
        align-items: center;
    }
    .dish-name {
        display: inline-block;
        width: 140px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .dish-numAndPrice {
        flex-grow: 1;
        display: inline-flex;
        justify-content: space-between;
    }
    .info-title {
    @extend .normal-font;
        width: 100%;
        text-align: center;
        margin-bottom: 8px;
    }
    .food-sub-item {
        display: flex;
    }
    .money-item {
        display: flex;
        justify-content: space-between;
    }
    .money-sub-item {
        color: #999999;
    }
    .deskNum {
    @extend .small-font;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
    }
    .foodTime {
    @extend .small-font;
        margin-bottom: 8px;
    }
    .food-container {
        padding: 8px 0;
        border-top: 1px solid #e6e6e6;
    }
    .money-container {
        padding: 8px 0;
        border-top: 1px solid #e6e6e6;
    }
    .money-type-border {
        border-top: 1px solid #e6e6e6;
    }
    .operator-container {
    @extend .small-font;
        padding-top: 8px;
        border-top: 1px solid #e6e6e6;
    }
    }
    .order-price-text {
        color: $gary-daker;
        font-size: $font-size-base;
        margin-right: 24px;
    }
    .order-price-num {
        font-size: $font-size-lg;
        font-weight: bold;
        margin-left: 4px;
    }
    .order-btns {
        display: flex;
        justify-content: flex-end;
    .order-btn {
        margin-left: 24px;
    }
    }
    .content-item {
    .order-info {
        color: #999999;
        font-size: $font-size-sm;
        margin-bottom: 16px;
    }
    .info-icon {
    &:hover {
    .info-content {
        display: block;
    }
    }
    }
    }
    }
</style>
<script>
    import { ORDER_TYPE, ORDER_STATUS_ICON } from '../constant';
    export default{
        data() {
            return {
                readOnly: true,
                ORDER_STATUS_ICON
            };
        },
        props: {
            type: Number,
            order: Object
        },
        computed: {
            title() {
                switch (this.order.orderType) {
                    case ORDER_TYPE.ACCOMMODATION:
                        return '住宿订单';
                    case ORDER_TYPE.CATERING:
                        return '餐饮订单';
                    case ORDER_TYPE.COMBINATION:
                        return '组合订单';
                    case ORDER_TYPE.RETAIL:
                        return '商超订单';
                    case ORDER_TYPE.ENTERTAINMENT:
                        return '娱乐订单';
                    default:
                        return '订单详情';
                }
            }
        },
        watch: {
        },
        methods: {
            hideModal() {
                this.$emit('onClose');
            },
            /**
             * 计算各种类型的收费金额
             * @param type
             * @returns {number}
             */
            findTypePrice(arr, type) {
                let price = 0;
                if (arr) {
                    arr.forEach(item => {
                        if (item.type === type) {
                            price += item.fee;
                        }
                    });
                }
                return Math.abs(price.toFixed(2));
            },
            filterPayMents(arr, type1,type2) {
                let newPayMents = [];
                if (arr) {
                    arr.forEach(item => {
                        if (item.type === type1 || item.type === type2) {
                            newPayMents.push(item);
                        }
                    });
                }
                return newPayMents;
            },
        }
    };
</script>
