<template>
    <div>
        <div class="modal fade roomModals" data-backdrop="static" id="orderDetail" role="dialog">
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
                        <solt></solt>
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
                    <div class="roomModals-footer">
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
    </div>
</template>
<style>
</style>
<script>
    import { ORDER_TYPE } from '../constant';
    export default{
        data() {
            return {};
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
        props: {
            readOnly: Boolean,
            order: {
                type: Object,
                default: {}
            },
            type: String,
            visible: Boolean
        },
        watch: {
            visible(val) {
                if (val) {
                    $('#orderDetail').modal('show');
                } else {
                    $('#orderDetail').modal('hide');
                }
            }
        },
        methods: {}
    };
</script>
