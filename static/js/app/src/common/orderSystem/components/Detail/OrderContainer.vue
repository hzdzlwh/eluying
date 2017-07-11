<template>
    <div>
        <div class="modal fade roomModals" id="orderDetail" role="dialog" data-backdrop="static">
            <div v-if="order.orderId" class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <div class="header-container">
                            <span style="margin-right: 10px" v-if="type !== ORDER_TYPE.COMBINATION">
                                <img v-if="type === ORDER_TYPE.ACCOMMODATION" src="/static/image/room-icon.png">
                                <img v-if="type === ORDER_TYPE.ENTERTAINMENT" src="/static/image/ent-icon.png">
                                <img v-if="type === ORDER_TYPE.CATERING" src="/static/image/food-icon.png">
                                <img v-if="type === ORDER_TYPE.RETAIL" src="/static/image/shop-icon.png">
                            </span>
                            <span class="header-text">{{title}}</span>
                            <span v-if="order.orderState !== undefined || order.state !== undefined" class="order-state" :class="orderStateColor">
                                {{orderStateText}}
                            </span>
                        </div>
                        <div class="header-container">
                            <span class="header-tools"
                                  v-if="order.insuranceInfoList && order.insuranceInfoList.length > 0"
                                  @click="openInsurance">查看保单({{order.insuranceInfoList.length}})</span>
                            <span class="header-tools"
                                  v-if="order.type !== ORDER_TYPE.COMBINATION && order.isCombinationOrder"
                                  @click="showCombinationOrder">查看组合订单</span>
                            <a class="header-tools" target="_blank" :href="printUrl">打印</a>
                            <span class="header-tools"
                                  v-if="order.editAble"
                                  @click="editOrder">编辑订单</span>
                            <span class="header-tools"
                                  v-if='order.resettleAble'
                                  @click="resetOrder">反结账</span>
                            <span class="header-tools" v-if="order.cancelAble" @click="cancelOrder">取消订单</span>
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
                                    <span style="position: relative">
                                        <span>{{ order.customerPhone }}</span>
                                        <span v-if="order.isVip">
                                            <span class="vip-level-img" style="top: 0;"></span>
                                            <span class="vip-level-tip" style="top: 0;">{{ order.vipLevel }}</span>
                                        </span>
                                    </span>
                                </div>
                                <div class="userInfo-item">
                                    <label class="label-text">客源渠道</label>
                                    <span>{{ order.origin }}</span>
                                </div>
                                <div v-if="order.originId === -4 || order.discountChannel === 4 || order.discountChannel === 1" class="userInfo-item">
                                    <label class="label-text">会员卡</label>
                                    <span>{{ order.discountRelatedName || '不使用' }}</span>
                                </div>
                            </div>
                        </div>
                        <slot></slot>
                        <div class="content-item" v-if="this.order.type !== ORDER_TYPE.RETAIL">
                            <p class="content-item-title"><span>备注信息</span></p>
                            <div>{{ order.remark || '无' }}</div>
                            <div v-if="order.imgUrls">
                                <a class="remark-img" v-for="pic in order.imgUrls" :href="pic.raw" data-gallery>
                                    <img :src="pic.thumb">
                                </a>
                            </div>
                        </div>
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
                                        <p class="money-item item-indent money-sub-item" v-if="findTypePrice(order.payments, 17) != 0">
                                            <span class="money-type">零头处理</span>
                                            <span class="money-num">
                                                ¥{{findTypePrice(order.payments, 17) > 0 ? '-' : ''}}{{Math.abs(findTypePrice(order.payments, 17))}}
                                            </span>
                                        </p>
                                        <p class="money-item item-indent money-sub-item"
                                           v-if="findTypePrice(order.payments, 5) > 0">
                                            <span class="money-type">优惠</span>
                                            <span class="money-num">¥-{{Math.abs(
                                                findTypePrice(order.payments, 5))}}</span>
                                        </p>
                                        <p class="money-item item-indent money-sub-item"
                                           v-if="findTypePrice(order.payments, 11) > 0">
                                            <span class="money-type">取消订单</span>
                                            <span class="money-num">¥-{{Math.abs(
                                                findTypePrice(order.payments, 11))}}</span>
                                        </p>
                                        <p class="money-item item-indent money-sub-item"
                                           v-for="item in filterPayMents(order.payments, 12, 12)">
                                            <span class="money-type">{{item.payChannel}}</span>
                                            <span class="money-num">¥{{item.fee}}</span>
                                        </p>
                                        <p class="money-item money-type-border"
                                           v-if="findTypePrice(order.payments, 4) > 0">
                                            <span class="money-type">违约金</span>
                                            <span class="money-num">¥{{findTypePrice(order.payments, 4)}}</span>
                                        </p>
                                        <p class="money-item money-type-border">
                                            <span class="money-type">{{findTypePrice(order.payments, 14) >= 0 ? '已收金额'
                                                : '已退金额'}}</span>
                                            <span class="money-num">¥{{Math.abs(
                                                findTypePrice(order.payments, 14))}}</span>
                                        </p>
                                        <p class="money-item item-indent money-sub-item"
                                           v-for="item in filterPayMents(order.payments, 0, 2, 6)">
                                            <span class="money-type">{{`${dateFormat(
                                                item.creationTime)} ${item.payChannel}`}}</span>
                                            <span class="money-num">¥{{`${item.type === 2 ? '-'
                                                : ''}${item.fee}`}}</span>
                                        </p>
                                        <p class="money-item money-type-border">
                                            <span class="money-type">{{findTypePrice(order.payments, 15) >= 0 ? '需补金额'
                                                : '需退金额'}}</span>
                                            <span class="money-num">¥{{Math.abs(
                                                findTypePrice(order.payments, 15))}}</span>
                                        </p>
                                       <!--  <p class="money-item money-type-border">
                                            <span class="money-type">需退押金</span>
                                            <span class="money-num">¥{{findTypePrice(order.payments, 16)}}</span>
                                        </p> -->
                                        <p class="money-item item-indent money-sub-item"
                                           v-for="item in filterPayMents(order.payments, 1, 3)">
                                            <span class="money-type">{{`${dateFormat(
                                                item.creationTime)} ${item.payChannel}`}}</span>
                                            <span class="money-num">¥{{`${item.type === 3 ? '-'
                                                : ''}${item.fee}`}}</span>
                                        </p>
                                    </div>
                                </div>
                                <span style="color: #178ce6; cursor: pointer; font-weight: normal;margin-left: 16px" @click="openCashDetail">收银明细</span>
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
                                    {{findTypePrice(order.payments, 14) >= 0 ? '已收金额:' : '已退金额:'}}
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
                               <!--  <span class="order-price-text">
                                    需退押金:
                                    <span class="order-price-num green">
                                        ¥{{findTypePrice(order.payments, 16)}}
                                    </span>
                                </span> -->
                            </div>
                            <p class="order-info">
                                <span class="order-info-text">订单号:{{order.orderNum || order.serialNum}}</span>
                                <span class="order-info-operator"
                                      v-if="type !== ORDER_TYPE.ENTERTAINMENT"
                                      style="margin-left: 24px">办理员工:{{order.operatorName || order.operator || order.reserveName}}</span>
                            </p>
                            <p class="order-info">
                                <template v-for="item in orderDates">
                                    <span v-if="item.date" style="margin-right: 24px">{{item.name}}:{{item.date}}</span>
                                </template>
                            </p>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div style="width: 100%;">
                            <div class="order-btns">
                                <span v-if="this.order.roomInfo || this.order.rooms && this.order.rooms.length > 0">
                                    <div class="dd-btn dd-btn-primary order-btn" v-if="((order.type !== ORDER_TYPE.COMBINATION && order.isCombinationOrder) || (order.type === ORDER_TYPE.ACCOMMODATION && !order.isCombinationOrder)) && getRoomsState.transform" @click='editOrder("transform")'
                                        >
                                        转正常入住
                                    </div>
                                    <div class="dd-btn dd-btn-primary order-btn" v-if="order.cancelSelectRoomsAble"
                                         @click="cancelSelectRooms">
                                        取消排房
                                    </div>
                                    <div class="dd-btn dd-btn-primary order-btn" @click="autoSelectRooms"
                                         v-if="order.autoSelectRoomsAble">
                                        自动排房
                                    </div>
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
                                </span>
                                <div class="dd-btn dd-btn-primary order-btn" @click="reGetMoney"
                                     v-if="orderState === 8">重新结账</div>
                                <div class="dd-btn dd-btn-primary order-btn" @click="showCashier('collect')"
                                     v-if="(type === ORDER_TYPE.COMBINATION && ( orderState === 2 || orderState === 3 ||orderState === 8 )) || (type === ORDER_TYPE.ACCOMMODATION && (orderState === 0 || orderState === 1 || orderState === 8))">
                                    收银
                                </div>
                                <div class="dd-btn dd-btn-primary order-btn" @click="showCashier('orderDetail')"
                                     v-if="order.isSettle === false && order.orderType === -1 && (type === ORDER_TYPE.COMBINATION)">
                                    结算
                                </div>
                                <div class="dd-btn dd-btn-primary order-btn" @click="showCashier('orderDetail')"
                                     v-if="(findTypePrice(order.payments, 15) !== 0 || findTypePrice(order.payments, 16) !== 0) && orderState !== 8 && (type !== ORDER_TYPE.ACCOMMODATION && type !== ORDER_TYPE.COMBINATION)">
                                    收银
                                    <!-- 娱乐商超 -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Insurance :order="order"/>
        <CashDetail :show="cashDetailShow" :onClose="closeCashDetail" :order="order"/>
        <div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls">
            <div class="slides"></div>
            <h3 class="title"></h3>
            <a class="prev">‹</a>
            <a class="next">›</a>
            <a class="close">×</a>
            <ol class="indicator"></ol>
        </div>
    </div>
</template>
<style lang="scss">
    @import "~dd-common-css/src/variables";

    .blueimp-gallery {
        background: rgba(0,0,0,.8)!important;
    }
    .remark-img {
        display: inline-block;
        margin-right: 8px;
        margin-top: 11px;
        img {
            height: 72px;
        }
    }

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
        .single-order-btn {
            width: 30px;
            height: 19px;
            margin-left: 51px;
            display: inline-flex;
            align-items: center;
            font-size: 14px;
            color: #178ce6;
        }
        .cursor {
            cursor: pointer;
        }
        .header-container {
            display: flex;
            align-items: center;
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
            position: relative;
            margin-left: 32px;
            &::before {
                position: absolute;
                content: '';
                display: inline-block;
                border-right: 12px solid;
                border-top: 11px solid transparent;
                border-bottom: 11px solid transparent;
                border-left: 0;
                left: -12px;
            }
            &.yellow {
                background: #ffba75;
                &::before {
                    border-right-color: #ffba75;
                }
            }
            &.grey {
                background: #bfbfbf;
                &::before {
                    border-right-color: #bfbfbf;
                }
            }
            &.blue {
                background: #82beff;
                &::before {
                    border-right-color: #82beff;
                }
            }
            &.red {
                background: #f27979;
                &::before {
                    border-right-color: #f27979;
                }
            }
            &.green {
                background: #62d99d;
                &::before {
                    border-right-color: #62d99d;
                }
            }
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
        .room-info {
            justify-content: space-between;
            position: relative;
        }
        .room-info, .room-name, .room-user, .play-item, .food-item {
            display: flex;
            align-items: flex-start;
        }
        .room-user {
            margin-top: 12px;
        }
        .state-icon {
            padding: 2px 4px;;
            color: #fff;
            border-radius: 2px;
            margin-left: 4px;
            font-size: 12px;
            &.yellow {
                background: #ffba75;
            }
            &.grey {
                background: #bfbfbf;
            }
            &.blue {
                background: #82beff;
            }
            &.red {
                background: #f27979;
            }
            &.green {
                background: #62d99d;
            }
        }
        .orderDetailModal-shop-item {
            display: flex;
        }
        .room-fee:hover {
            .orderDetailModal-roomPriceList {
                display: flex;
            }
        }
        .orderDetailModal-roomPriceList {
            display: none;
            flex-wrap: wrap;
            position: absolute;
            max-width: 491px;
            left: 41px;
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
            background: url("../../../../../../../image/modal/room_modal_user.png");
            background-size: contain;
            margin-right: 25px;
        }
        .extra-item-icon {
            width: 15px;
            height: 18px;
            background: url("../../../../../../../image/modal/room_modal_extra.png");
            background-size: contain;
            margin-right: 25px;
        }
        .food-icon {
            width: 14px;
            height: 18px;
            background: url("../../../../../../../image/modal/room_modal_food.png");
            background-size: contain;
            margin-right: 25px;
        }
        .info-icon {
            position: relative;
            cursor: pointer;
            width: 16px;
            height: 16px;
            background: url("../../../../../../../image/modal/room_modal_info.png");
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
                background: #ffba75;
                border-radius: 2px;
                width: 17px;
                height: 16px;
                margin-left: 5px;
                align-items: center;
                justify-content: center;
            }
            .dish-name-container {
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

    .valid {
        position: absolute;
        font-size: $font-size-sm;
        color: #999999;
        right: 140px;
    }

    .error {
        position: absolute;
        font-size: $font-size-sm;
        color: #f24949;
    }

    .shopItem-border-style {
        padding-bottom: 15px;
        margin-bottom: 16px;
        border-bottom: 1px dotted #e6e6e6;
    }

    .roomModals {
        box-sizing: border-box;
        font-size: $font-size-base;
        color: $gary-daker;
        .modal-dialog {
            width: 908px;
        }
        .modal-content {
            border-top: 4px solid #178ce6;
            border-radius: 2px;
            box-shadow: 0 0 5px 0;
            padding: 0;
            // margin-top: 0 !important;
        }
    }

    .roomModals-header {
        width: 100%;
        height: 53px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
        .close-icon {
            display: inline-block;
            width: 14px;
            height: 14px;
            background: url("../../../../../../../image/modal/room_modal_close.png");
            background-size: contain;
            cursor: pointer;
        }
        .header-text {
            font-size: $font-size-lg;
            color: $gary-daker;
            font-weight: bold;
        }
    }

    .roomModals-body {
        width: 100%;
        max-height: 534px;
        overflow-y: auto;
        overflow-x: hidden;
        label {
            margin: 0;
        }
        input {
            width: 120px;
        }
        .room-category {
            width: 60px;
            margin-left: 4px;
            input {
                width: 100%;
            }
        }
        .content-item {
            padding: 18px 24px;
            border-top: 1px solid $gary-light;
        }
        .content-item-discount {
            font-size: 14px;
            font-weight: normal;
        }
        .increase-container {
            font-size: $font-size-base;
            font-weight: normal;
            color: $blue;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
        }
        .increase-icon {
            height: 16px;
            width: 16px;
            background: url("../../../../../../../image/modal/room_modal_incre.png");
            background-size: contain;
            margin-right: 4px;
            cursor: pointer;
        }
        .vip-level-img {
            display: inline-block;
            height: 15px;
            width: 17px;
            position: absolute;
            right: 0;
            top: 4px;
            transform: translateX(100%);
            background: url("../../../../../../../image/modal/vip_level_img.png");
            background-size: contain;
            &:hover + .vip-level-tip {
                display: inline-flex;
            }
        }
        .vip-level-container {
            position: relative;
        }
        .vip-level-tip {
            display: none;
            position: absolute;
            top: 4px;
            right: -17px;
            padding: 0 2px;
            transform: translateX(100%);
            background: #fafafa;
            box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
            height: 19px;
            z-index: 1;
        }
        .userInfo-items {
            position: relative;
            display: flex;
            align-items: center;
        }
        .userInfo-item {
            margin-right: 32px;
            min-width: 165px;
            &:last-of-type {
                margin-right: 0;
            }
        }
        .userVip-list {
            position: absolute;
            background: #fafafa;
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.15);
            border-radius: 2px;
            width: 261px;
            max-height: 120px;
            overflow-y: scroll;
            top: 26px;
            z-index: 100;
            &::-webkit-scrollbar {
                width: 0;
            }
        }
        .userVip-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #666666;
            font-size: 12px;
            padding: 2px 8px;
            cursor: pointer;
            &:hover {
                background: #e1effa;
            }
            .vip-level {
                display: inline-flex;
                align-items: center;
                width: 80px;
            }
            .vip-level-text {
                display: inline-block;
                max-width: 70px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .userInfo-phone {
            position: relative;
        }
        .content-item-discount {
            font-size: 14px;
            font-weight: normal;
            .dd-select-input::placeholder {
            color: #666;
            }
        }
        .enter-icon {
            width: 18px;
            height: 15px;
            background: url("../../../../../../../image/modal/room_modal_enter.png");
            background-size: contain;
            margin-right: 14px;
        }
        .enterDate-container {
            input {
                width: 110px;
            }
        }
        .room-select-icon {
            width: 16px;
            height: 16px;
            background-size: contain;
            margin-right: 16px;
            cursor: pointer;
        }
        .room-icon {
            width: 16px;
            height: 15px;
            background: url("../../../../../../../image/modal/room_modal_home.png");
            background-size: contain;
            margin-right: 25px;
        }
        .registerInfoModal-roomPrice {
            display: flex;
            align-items: center;
        }
        .fee-container {
            position: relative;
            display: inline-block;
        }
        .fee-symbol {
            position: absolute;
            left: 8px;
            top: 3px;
            z-index: 10;
        }
        .fee-input {
            padding-left: 16px;
            width: 90px;
        }
        .discount-info {
            display: inline-flex;
            position: absolute;
            font-size: 12px;
            color: #999999;
            top: 30px;
            right: 0;
            min-width: 104px;
            justify-content: flex-start;
            align-items: center;
        }
        .origin-price {
            text-decoration: line-through;
        }
        .discount-num {
            display: inline-flex;
            padding: 0 5px;
            color: #ffffff;
            background: #f5a623;
            border-radius: 2px;
        }
        .registerInfoModal-roomPriceList {
            display: flex;
            flex-wrap: wrap;
            position: absolute;
            max-width: 491px;
            right: 0;
            top: 30px;
            padding: 8px 8px 8px 0;
            background: #fafafa;
            box-shadow: 0 0 5px 0;
            border-radius: 2px;
            max-height: 100px;
            overflow-y: auto;
            z-index: 11;
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
        .selected-icon {
            background: url("../../../../../../../image/modal/room_modal_selected.png");
        }
        .notSelect-icon {
            background: url("../../../../../../../image/modal/room_modal_notSelect.png");
        }
        .time-container {
            margin-left: 2px;
        }
        .time-container, .enterDate-container, .enterDate {
            display: inline-block;
        }
        .shop-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 13px;
            position: relative;
            &:not(:last-child) {
                padding-bottom: 15px;
                margin-bottom: 16px;
                border-bottom: 1px dotted #e6e6e6;
            }
        }
        .registerRoom-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        }
        .registerRoom-container {
            display: flex;
            flex-direction: column;
            padding-left: 13px;
            &:not(:last-child) {
                padding-bottom: 15px;
                margin-bottom: 16px;
                border-bottom: 1px dotted #e6e6e6;
            }
            .checkInPerson-person {
                padding-left: 0;
                .checkInPerson-person-icon {
                    margin-right: 25px;
                }
            }
            .checkInPerson-btns {
                padding-left: 41px;
            }
        }
        .shop-icon {
            width: 16px;
            height: 15px;
            background: url("../../../../../../../image/modal/room_modal_cart.png");
            background-size: contain;
            margin-right: 16px;
        }
        .shop-item-content {
            padding-top: 3px;
            flex-grow: 1;
            position: relative;
            display: flex;
            justify-content: space-between;
            .useless-tip {
                bottom: -16px;
            }
        }
        .shop-item-count {
            width: 240px;
        }
        .shop-item-price {
            display: inline-block;
            margin-left: 24px;
        }
        .delete-icon {
            margin-left: 16px;
            width: 16px;
            height: 16px;
            background: url("../../../../../../../image/modal/room_modal_delete.png");
            background-size: contain;
            cursor: pointer;
        }
        .delete-icon-like {
            margin-left: 16px;
            width: 16px;
            height: 16px;
            display: inline-block;
        }
        .remark-items {
            position: relative;
            textarea {
                width: 100%;
                height: 65px;
                resize: none;
            }
        }
        .valid-remark-tip {
            @extend .valid;
            right: 0;
        }
        .error-phone-tip {
            @extend .error;
            left: 45px;
        }
        .dd-select {
            display: inline-block;
        }
        .dd-select-menu {
            overflow-y: auto;
            max-height: 120px;
            .dd-select-option {
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

    .content-item-title {
        display: flex;
        justify-content: space-between;
        font-size: $font-size-sm;
        color: $gary-daker;
        font-weight: bold;
        margin-bottom: 16px;
        &.dashed {
            border-bottom: 2px dashed #e6e6e6;
            padding-bottom: 20px;
        }
    }

    .roomModals-footer {
        bottom: 0;
        width: 100%;
        height: 56px;
        background: #ebebeb;
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .footer-label {
            font-size: $font-size-sm;
            color: $gary-daker;
            font-weight: bold;
            margin-right: 8px;
        }
        .footer-price {
            font-size: $font-size-lg;
            color: $blue;
            font-weight: bold;
        }
    }
    .extra-items {
        margin-top: 19px;
    }
    .extra-items-title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }
    .extra-items-content {
        padding-left: 40px;
    }
    .extra-items-date {
        color: #999;
        font-size: 12px;
        margin-bottom: 10px
    }
    .extra-items-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
    }
    .extra-items-name {
        width: 224px;
        margin-right: 24px;
    }
    .extra-items-num, .extra-items-total {
        margin-right: 24px;
    }
</style>
<script>
    import bus from '../../../eventBus';
    import util from 'util';
    import { ORDER_TYPE, ORDER_STATUS_ICON, ORDER_STATE_TEXT } from '../../../../ordersManage/constant';
    import { mapActions } from 'vuex';
    import type from '../../store/types';
    import http from '../../../http';
    import Insurance from './Insurance.vue';
    import types from '../../store/types';
    import modal from '../../../modal';
    import { getOrderId } from '../../utils/order';
    require('blueimp-gallery/js/jquery.blueimp-gallery.min');
    import 'blueimp-gallery/css/blueimp-gallery.css';
    import CashDetail from './CashDetail.vue';

    export default{
        data() {
            return {
                readOnly: true,
                ORDER_STATUS_ICON,
                cashDetailShow: false,
                ORDER_TYPE,
                reseturl: {
                    '-1': 'resettleCombinedOrder',
                    '3': 'resettleRoomOrder',
                    '1': 'resettleEnterOrder',
                    '2': 'resettleGoodsOrder',
                    '0': 'resettleCaterOrder'
                }
            };
        },
        components: {
            Insurance,
            CashDetail
        },
        props: {
            type: Number,
            order: Object,
            id: Number
        },
        computed: {
            title() {
                switch (this.order.type) {
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
            },
            printUrl() {
                if (!this.id) {
                    return '';
                }

                let params = { orderId: this.id, orderType: this.type };
                params = http.getDataWithToken(params);
                params = http.paramsToString(params);
                return http.getUrl('/printer/getOrderDetailJsp?') + params;
            },
            orderState() {
                return this.order.orderState === undefined ? this.order.state : this.order.orderState;
            },
            orderStateText() {
                if (this.order.type === undefined || this.orderState === undefined || !ORDER_STATE_TEXT[this.order.type][this.orderState]) {
                    return '';
                }
                return ORDER_STATE_TEXT[this.order.type][this.orderState].text;
            },
            orderStateColor() {
                if (this.order.type === undefined || this.orderState === undefined || !ORDER_STATE_TEXT[this.order.type][this.orderState]) {
                    return '';
                }
                return ORDER_STATE_TEXT[this.order.type][this.orderState].color;
            },
            orderDates() {
                switch (this.order.type) {
                    case ORDER_TYPE.ACCOMMODATION:
                        return [
                            {
                                name: '预订时间',
                                date: this.order.reservedDate
                            },
                            {
                                name: '入住时间',
                                date: this.order.checkInDate
                            },
                            {
                                name: '退房时间',
                                date: this.order.checkOutDate
                            },
                            {
                                name: '取消时间',
                                date: this.order.cancelDate
                            }
                        ];
                    case ORDER_TYPE.CATERING:
                        return [
                            {
                                name: '预订时间',
                                date: this.order.creationTime
                            },
                            {
                                name: '开台时间',
                                date: this.order.operatorDate
                            },
                            {
                                name: '撤台时间',
                                date: this.order.colseBoardTime
                            }
                        ];
                    case ORDER_TYPE.COMBINATION:
                    case ORDER_TYPE.RETAIL:
                    case ORDER_TYPE.ENTERTAINMENT:
                        return [
                            {
                                name: '创建时间',
                                date: this.order.creationTime
                            }
                        ];
                }
            },
            getRoomsState() {
                const roomsState = {
                    checkOutAdAble: false,
                    checkOutAble: false,
                    checkInAble: false,
                    transform: false
                };

                function checkState(room) {
                    if (room.checkType === 1 && room.state !== 2) {
                        roomsState.transform = true;
                    }
                    if (room.state === 0) {
                        roomsState.checkInAble = true;
                    } else if (room.state === 1) {
                        const today = new Date();
                        const endDate = new Date(room.checkOutDate || room.endDate);
                        if (endDate > today && !util.isSameDay(endDate, today) && room.checkType !== 1) {
                            roomsState.checkOutAdAble = true;
                        } else {
                            roomsState.checkOutAble = true;
                        }
                    }
                }

                if (this.order.rooms) {
                    this.order.rooms.forEach(item => {
                        checkState(item);
                    });
                }

                const room = this.order.roomInfo;
                room && checkState(room);

                return roomsState;
            }
        },
        methods: {
            ...mapActions([type.LOAD_ROOM_BUSINESS_INFO, types.GET_ORDER_DETAIL]),
            hideModal() {
                bus.$emit('onClose');
                // this[type.SET_ORDER_DETAIL]({ orderDetail: {}});
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
                return Number(price.toFixed(2));
            },
            filterPayMents(arr, type1, type2, type3) {
                const newPayMents = [];
                if (arr) {
                    arr.forEach(item => {
                        if (item.type === type1 || item.type === type2 || item.type === type3) {
                            newPayMents.push(item);
                        }
                    });
                }
                return newPayMents;
            },
            showCombinationOrder() {
                bus.$emit('onShowDetail',
                    {
                        orderId: this.order.combinationOrderId,
                        type: ORDER_TYPE.COMBINATION
                    });
            },
            show() {
                bus.$emit('onShowDetail');
            },
            dateFormat(date) {
                return util.timeFormat(date);
            },
            openInsurance() {
                $('#insuranceDialog').modal('show');
            },
            openCashDetail() {
                this.cashDetailShow = true;
            },
            closeCashDetail() {
                this.cashDetailShow = false;
            },
            editOrder(type) {
                this.hideModal();
                bus.$emit('changeBack', this.show);
                bus.$emit('setBack', this.show);
                // 这里有个顺序问题，所以这样写了
                this.order.timeRoomAuto = false;
                this.order.timeRoomTransform = false;
                // 返回的时候重制
                if (type === 'auto') {
                    this.order.timeRoomAuto = true;
                }
                if (type === 'transform') {
                    this.order.timeRoomTransform = true;
                }
                $('#orderDetail').one('hidden.bs.modal', () => { bus.$emit('editOrder', 'editOrder', this.order); });
                
            },
            cancelOrder() {
                this.hideModal();
                bus.$emit('changeBack', this.show);
                bus.$emit('showCancelOrder');
            },
            showCashier(type) {
                this.hideModal();
                bus.$emit('changeBack', this.show);
                bus.$emit('showCashier', { type: type });
            },
            reGetMoney() {
                this.hideModal();
                bus.$emit('changeBack', this.show);
                bus.$emit('showCashier', { type: 'resetOrder' });
            },
            checkInOrCheckOut(type) {
                  const callback = function() {
                    this[types.LOAD_ROOM_BUSINESS_INFO]({ businessType: type })
                        .then(res => {
                            if (type === 0) {
                                // 办理入住
                                const haveToday = res.data.roomOrderInfoList.some((room) => {
                                    return util.isSameDay(new Date(room.checkInDate), new Date()) || new Date(room.checkInDate) <= new Date();
                                });
                                if (haveToday) {
                                    // this.hideModal();
                                    // $('#orderDetail').modal('hidden');
                                    // $('#checkIn').modal({ backdrop: 'static' });
                                    bus.$emit('changeBack', this.show);
                                    bus.$emit('editOrder', 'checkIn', this.order);
                                } else {
                                    modal.warn('未到办理入住的时间，无法入住！');
                                    return false;
                                }
                            } else {
                                // 退房
                                $('#checkOut').modal({ backdrop: 'static' });
                            }
                            bus.$emit('changeBack', this.show);
                            this.hideModal();
                    });
                }.bind(this);
                const outRome = this.checkoutTimeOut(this.order.rooms || [this.order]);
                if (outRome.length) {
                    const firstRoom = outRome[0]
                    let name = '';
                    let roomeType = '';
                    if (this.order.rooms) {
                        name = firstRoom.fullName;
                        roomeType = firstRoom.checkTypeStr;
                    }
                    if (this.order.roomInfo) {
                        name = firstRoom.roomInfo.roomName;
                        roomeType = firstRoom.checkTypeStr;
                    }
                    modal.confirm({ title: '提示', message: roomeType + '[' + name + ']已超时，确定保存订单吗？' }, callback);
                } else {
                    callback();
                }
            },
            checkoutTimeOut(room) {
                const outRoom = room.filter(function(room) {
                    return (new Date(room.endDate) < new Date() || (room.roomInfo && (new Date(room.roomInfo.checkOutDate) < new Date())));
                });
                return outRoom;
            },
            resetOrder() {
                http.get('/order/' + this.reseturl[this.type + ''], { orderId: this.id, orderType: this.type })
                    .then(res => {
                        this[types.GET_ORDER_DETAIL]({ orderId: this.id, orderType: this.type });
                        bus.$emit('refreshView');
                    });
            },
            autoSelectRooms() {
                const callback = function() {
                    http.post('/room/autoSelectRooms', { orderId: getOrderId(this.order), orderType: this.type })
                        .then(res => {
                            if (res.msg) {
                                modal.warn(res.msg);
                            }
                            this[types.GET_ORDER_DETAIL]({ orderId: getOrderId(this.order), orderType: this.type });
                            bus.$emit('refreshView');
                        });
                }.bind(this);
                if (this.order.rooms && this.order.rooms.filter((room) => (room.checkType === 1)).length) {
                    modal.confirm({ title: '提示', message: '预订钟点房不会自动排房' }, callback);
                } else {
                    callback();
                }
            },
            cancelSelectRooms() {
                http.post('/room/cancelSelectRooms', { orderId: getOrderId(this.order), orderType: this.type })
                    .then(res => {
                        this[types.GET_ORDER_DETAIL]({ orderId: getOrderId(this.order), orderType: this.type });
                        bus.$emit('refreshView');
                    });
            }
        }
    };
</script>
