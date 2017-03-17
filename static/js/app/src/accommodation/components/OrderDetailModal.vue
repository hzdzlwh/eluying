<template>
    <div>
        <div class="modal fade roomModals" id="orderDetail" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <div class="header-container" v-if="order.orderState">
                            <span class="header-text">订单详情</span>
                            <span class="order-state-angle" :style="{ borderColor: ORDER_STATUS_ICON[order.orderState]['borderColor']}"></span>
                            <span class="order-state" :style="{ background: ORDER_STATUS_ICON[order.orderState]['backgroundColor']}"
                                  v-text="ORDER_STATUS_ICON[order.orderState]['text']">
                            </span>
                        </div>
                        <div class="header-container">
                            <span class="header-tools" v-if="order.insuranceInfoList && order.insuranceInfoList.length > 0" @click="openInsurance">查看保险({{order.insuranceInfoList.length}})</span>
                            <span class="header-tools" v-if="order.orderState !== -1" @click="openPrint(order)">打印</span>
                            <span class="header-tools" v-if="order.orderState === 2 || order.orderState === 3" @click="editOrder">编辑订单</span>
                            <span class="header-tools" v-if="order.orderState === 2" @click="cancelOrder">取消订单</span>
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
                                    <label class="label-text">客户来源</label>
                                    <span>{{ order.origin }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="content-item" v-if="order.rooms && order.rooms.length > 0">
                            <p class="content-item-title"><span>房间信息</span></p>
                            <div class="items">
                                <div class="item" v-for="item in order.rooms">
                                    <div class="room-info">
                                        <div class="room-name">
                                            <span class="room-icon"></span>
                                            <span>{{item.serialNum}}({{item.name}})</span>
                                            <span class="room-state-icon" :style="{background: getRoomOrFoodState(3, item.state).backgroundColor}">
                                                {{getRoomOrFoodState(3, item.state).text}}
                                            </span>
                                        </div>
                                        <div class="room-date">
                                            <label class="label-text">入住</label>
                                            <span class="startDate">{{item.startDate.slice(5)}}</span>
                                            <span>~</span>
                                            <span class="endDate">{{item.endDate.slice(5)}}</span>
                                            <label class="label-text">共{{item.duration}}晚</label>
                                        </div>
                                        <div class="room-fee" style="margin-right: 81px">
                                            <label class="label-text">房费</label>
                                            <span>¥{{item.fee}}</span>
                                            <div class="orderDetailModal-roomPriceList">
                                                <dl class="price-item" v-for="priceItem in item.datePriceList">
                                                    <dt>{{priceItem.date.slice(5)}}</dt>
                                                    <dd>¥{{priceItem.dateFee}}</dd>
                                                </dl>
                                            </div>
                                        </div>
                                        <span class="discount-info" v-if="item.vipShowDiscount" style="top: 14px">
                                            <span>原价<span class="origin-price">¥{{ item.originPrice }}</span></span>
                                            <span class="discount-num">
                                                {{ item.vipShowDiscount }}
                                            </span>
                                        </span>
                                    </div>
                                    <div class="room-user" v-for="user in item.idCardList">
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
                        <div class="content-item" v-if="order.foodItems && order.foodItems.length > 0">
                            <p class="content-item-title"><span>餐饮信息</span></p>
                            <div class="items">
                                <div class="item" v-for="item in order.foodItems">
                                    <div class="food-item">
                                        <span class="food-icon"></span>
                                        <div class="item-content">
                                            <div class="item-name">
                                                <span class="item-name">{{item.restName}}</span>
                                                <span class="food-state-icon"
                                                      :style="{background: getRoomOrFoodState(0, item.foodState).backgroundColor}">
                                                    {{getRoomOrFoodState(0, item.foodState).text}}
                                                </span>
                                            </div>
                                            <div class="item-date">
                                                <label class="label-text">时间</label>
                                                <span>{{item.date.slice(5)}}</span>
                                            </div>
                                            <div class="item-count">
                                                <label class="label-text">人数</label>
                                                <span>{{item.peopleNum}}</span>
                                            </div>
                                            <div class="item-price" style="margin-right: 81px">
                                                <label class="label-text">小计</label>
                                                <span>¥{{item.foodPrice}}</span>
                                            </div>
                                            <span class="discount-info" v-if="item.vipShowDiscount" style="top: 14px">
                                                <span>原价<span class="origin-price">¥{{ item.originTotalPrice  }}</span></span>
                                                <span class="discount-num">
                                                    {{ item.vipShowDiscount }}
                                                </span>
                                            </span>
                                        </div>
                                        <div class="info-icon" @mouseenter="getFoodDetail(item)" @mouseleave="setInfoContentVisible(item)">
                                            <div class="info-content" v-if="item.visible" style="left: 0;">
                                                <p class="info-title">{{item.detail.restName}}</p>
                                                <p class="deskNum">
                                                    <span>桌号:{{ item.detail.boardDetailResps ? item.detail.boardDetailResps.join(',') : '' }}</span>
                                                    <span>人数:{{item.detail.peopleNum}}</span>
                                                </p>
                                                <p class="foodTime">就餐时间:{{ item.detail.orderTime ? item.detail.orderTime.slice(0, 16) : ''}}</p>
                                                <div class="food-container">
                                                    <div v-for="food in item.detail.itemsMap">
                                                        <p class="food-sub-item" v-for="dish in food.dishItemResp">
                                                            <span :class="{'item-indent': dish.dishId !== null && dish.dishId !== 0}" class="dish-name">
                                                                {{dish.categoryName}}
                                                            </span>
                                                            <span class="dish-numAndPrice">
                                                                <span>x{{dish.bookNum}}</span>
                                                                <span>¥{{dish.price}}</span>
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="money-container">
                                                    <p class="money-item">
                                                        <span class="money-type">订单金额</span>
                                                        <span class="money-num">¥{{findTypePrice(item.detail.payments, 13)}}</span>
                                                    </p>
                                                    <div class="item-indent" v-if="findTypePrice(item.detail.payments, 5) > 0">
                                                        <p class="money-item">
                                                            <span class="money-type">商品总价</span>
                                                            <span class="money-num">¥{{findTypePrice(item.detail.payments, 10)}}</span>
                                                        </p>
                                                        <p class="money-item">
                                                            <span class="money-type">优惠</span>
                                                            <span class="money-num">-¥{{Math.abs(findTypePrice(item.detail.payments, 5))}}</span>
                                                        </p>
                                                        <p class="money-item" v-if="findTypePrice(item.detail.payments, 11) > 0">
                                                            <span class="money-type">取消订单</span>
                                                            <span class="money-num">-¥{{Math.abs(findTypePrice(item.detail.payments, 11))}}</span>
                                                        </p>
                                                    </div>
                                                    <p class="money-item" v-if="findTypePrice(item.detail.payments, 4) > 0">
                                                        <span class="money-type">违约金</span>
                                                        <span class="money-num">¥{{findTypePrice(item.detail.payments, 4)}}</span>
                                                    </p>
                                                    <p class="money-item">
                                                        <span class="money-type">已付金额</span>
                                                        <span class="money-num">¥{{findTypePrice(item.detail.payments, 14)}}</span>
                                                    </p>
                                                    <p class="money-item">
                                                        <span class="money-type">需补金额</span>
                                                        <span class="money-num">¥{{findTypePrice(item.detail.payments, 15)}}</span>
                                                    </p>
                                                </div>
                                                <div class="operator-container">
                                                    <p>订单状态:{{item.detail.orderState === -1 ? '待付款' : FOOD_STATE[item.detail.orderState]}}</p>
                                                    <p>预订时间:{{item.detail.creationTime}}</p>
                                                    <p>操作员:{{item.detail.reserveName}}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content-item" v-if="order.playItems && order.playItems.length > 0">
                            <p class="content-item-title"><span>娱乐信息</span></p>
                            <div class="items">
                                <div class="item" v-for="item in order.playItems">
                                    <div class="play-item">
                                        <span class="enter-icon"></span>
                                        <div class="item-content">
                                            <span class="item-name">
                                                {{item.name}}{{item.chargeUnit ? `(${item.timeAmount * item.chargeUnitTime}${item.chargeUnit})` : ''}}
                                            </span>
                                            <div class="item-date">
                                                <label class="label-text">时间</label>
                                                <span>{{item.date.slice(5)}}</span>
                                            </div>
                                            <div class="item-count">
                                                <label class="label-text">数量</label>
                                                <span>{{`${item.amount}(可使用${item.enableAmount}/${item.amount})`}}</span>
                                            </div>
                                            <div style="margin-right: 81px">
                                                <label class="label-text">小计</label>
                                                <span>¥{{item.totalPrice}}</span>
                                            </div>
                                            <span class="discount-info" v-if="item.vipShowDiscount" style="top: 14px">
                                            <span>原价<span class="origin-price">¥{{(item.originPrice * item.amount * item.timeAmount).toFixed(2) }}</span></span>
                                            <span class="discount-num">
                                                {{ item.vipShowDiscount }}
                                            </span>
                                        </span>
                                        </div>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content-item" v-if="order.pcGoodsItems && order.pcGoodsItems.length > 0">
                            <p class="content-item-title"><span>商超信息</span></p>
                            <div class="items">
                                <div class="item" v-for="item in filterShopList">
                                    <div class="orderDetailModal-shop-item">
                                        <span class="shop-icon"></span>
                                        <div class="item-content">
                                            <span class="shop-time small-font">{{item.time.slice(5, 16)}}</span>
                                            <div style="margin-right: 81px">
                                                <label class="label-text">小计</label>
                                                <span>¥{{getTotalPrice(item['items'], true)}}</span>
                                            </div>
                                            <span class="discount-info" v-if="item.items[0].vipShowDiscount" style="top: 14px">
                                                <span>原价<span class="origin-price">¥{{ getTotalPrice(item['items'], false) }}</span></span>
                                                <span class="discount-num">
                                                    {{ item.items[0].vipShowDiscount }}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="item-content" v-for="option in item['items']">
                                        <span style="padding-left: 32px; width: 120px;">{{option.name}}</span>
                                        <span>x{{option.amount}}</span>
                                        <span style="margin-right: 304px;width: 120px; text-align: right">¥{{(option.price * option.amount).toFixed(2)}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content-item" v-if="order.remark && order.remark !== ''">
                            <p class="content-item-title"><span>备注信息</span></p>
                            <div>{{order.remark}}</div>
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
                    <div class="roomModals-footer" v-if="order.orderState !== -1">
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
        <div class="modal fade roomModals" role="dialog" id="insuranceDialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        保险详情
                        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    </div>
                    <div style="padding: 20px 24px; max-height: 485px">
                        <dd-table :bordered="true" :columns="columns" :dataSource="order.insuranceInfoList || []"></dd-table>
                    </div>
                    <div class="roomModals-footer">
                        <span>共{{order.insuranceInfoList && order.insuranceInfoList.length}}条保单记录，保费¥{{order.insuranceTotalPremium}}</span>
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
            max-height: 230px;
            overflow-y: scroll;
            background: #fafafa;
            border-radius: 2px;
            box-shadow: 0 0 5px 0;
            width: 274px;
            position: absolute;
            bottom: 0;
            margin: 0;
            padding: 8px;
            transform: translateX(-100%);
            &::-webkit-scrollbar {
                width: 0;
            }
            .item-indent {
                padding-left: 16px;
            }
            .dish-name {
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
            .info-content {
                display: none;
            }
        }
    }
</style>
<script>
    import AJAXService from 'AJAXService';
    import util from 'util';
    import { ID_CARD_TYPE, FOOD_STATE, ORDER_STATUS_ICON } from '../const';
    import modal from 'modal';
    import types from '../store/types';
    import { mapActions, mapState } from 'vuex';
    import { DdTable } from 'dd-vue-component';
    export default{
        props: {
            orderId: {
                type: Number
            },
            orderDetailShow: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return{
                ID_CARD_TYPE,
                FOOD_STATE,
                ORDER_STATUS_ICON,
                columns: [
                    {
                        title: '被保人姓名',
                        dataIndex: 'insurantsName',
                        width: 80
                    },
                    {
                        title: '手机号',
                        dataIndex: 'insurantsMobile',
                        width: 105
                    },
                    {
                        title: '性别',
                        render: (h, row) => (<span>{['','男','女'][row.insurantsSex]}</span>),
                        width: 38
                    },
                    {
                        title: '年龄',
                        dataIndex: 'insurantsAge',
                        width: 38
                    },
                    {
                        title: '投保日期',
                        dataIndex: 'startDate',
                        width: 90
                    },
                    {
                        title: '终保日期',
                        dataIndex: 'endDate',
                        width: 90
                    },
                    {
                        title: '保单号',
                        dataIndex: 'proposalNo'
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'date',
                        width: 155
                    }
                ]
            }
        },
        computed: {
            ...mapState({order: 'orderDetail'}),
            filterShopList() {
                let shopList = {};
                if (this.order.pcGoodsItems) {
                    this.order.pcGoodsItems.forEach(item => {
                        if (shopList[item.goodsOrderId]) {
                            shopList[item.goodsOrderId]['items'].push(item);
                        } else {
                            shopList[item.goodsOrderId] = {};
                            shopList[item.goodsOrderId]['time'] = item.date;
                            shopList[item.goodsOrderId]['items'] = [];
                            shopList[item.goodsOrderId]['items'].push(item);
                        }
                    });
                }
                return shopList;
            },
            getRoomsState() {
                let roomsState = {checkOutAdAble: false, checkOutAble: false, checkInAble: false};
                if (this.order.rooms) {
                    this.order.rooms.forEach(item => {
                        if (item.state === 0) {
                            roomsState.checkInAble = true;
                        } else if (item.state === 1) {
                            let today = new Date();
                            let endDate = new Date(item.endDate);
                            if(endDate > today && !util.isSameDay(endDate, today)){
                                roomsState.checkOutAdAble = true;
                            }else{
                                roomsState.checkOutAble = true;
                            }
                        }
                    });
                }
                return roomsState;
            }
        },
        methods: {
            ...mapActions([
                types.LOAD_ORDER_DETAIL,
                types.LOAD_ROOM_BUSINESS_INFO
            ]),
            hideModal() {
                this.$emit('hideOrderDetail');
                $("#orderDetail").modal("hide");
            },
            /**根据状态获取对应的图标
             * 0-餐, 3-住
             * @param type
             * @param state
             * @returns {*}
             */
            getRoomOrFoodState(type, state){
                switch(state){
                    case 0:
                        return {text: '预', backgroundColor: '#ffba75'};
                    case 1:
                        return {text: type === 0 ? '餐' : '住', backgroundColor: '#82beff'};
                    case 2:
                        return {text: type === 0 ? '完' : '退', backgroundColor: '#bfbfbf'};
                    case 3:
                        return {text: '消', backgroundColor: '#bfbfbf'};
                    default:
                        return {};
                }
            },
            openPrint(orderDetail) {
                let params = { orderId: orderDetail.orderId };
                params = AJAXService.getDataWithToken(params);
                params = AJAXService.paramsToString(params);
                window.open(AJAXService.getUrl2('/printer/getOrderDetailJsp?') + params);
            },
            cancelOrder() {
                this.hideModal();
                this.$emit('showCancelOrder', orderDetail.orderId)
            },
            getFoodDetail(food) {
                if (food.detail) {
                    food.visible = true;
                    return;
                }
                food.detail = {};
                AJAXService.ajaxWithToken('GET', 'getCaterOrderDetailUrl', {caterOrderId: food.foodOrderId}, function(res){
                    if (res.code === 1) {
                        food.detail = res.data;
                        food.detail.boardDetailResps = res.data.boardDetailResps.reduce((a,b) => { return a.concat(b.boardName) }, []);
                        this.$set(food, 'visible', true);
                    }
                }.bind(this));
            },
            setInfoContentVisible(food) {
                food.visible = false;
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
            getTotalPrice(arr, dis) {
                let price = 0;
                if (arr) {
                    arr.forEach(item => {
                        price += (dis ? item.price : item.originPrice) * item.amount;
                    });
                }
                return price.toFixed(2);
            },
            dateFormat(date) {
                return util.timeFormat(date);
            },
            checkInOrCheckOut(type) {
                this[types.LOAD_ROOM_BUSINESS_INFO]({ businessType: type })
                    .then(res => {
                        if (type === 0) {
                            const haveToday = res.data.roomOrderInfoList.some((room) => {
                                return util.isSameDay(new Date(room.checkInDate), new Date()) || new Date(room.checkInDate) <= new Date();
                            });
                            if (haveToday) {
                                $('#checkIn').modal({backdrop: 'static'});
                            } else {
                                modal.somethingAlert('未到办理入住的时间，无法入住！');
                                return false;
                            }
                        } else {
                            $('#checkOut').modal({backdrop: 'static'});
                        }

                        this.hideModal();
                    })
                    .catch(res => modal.somethingAlert(res.msg));
            },
            showCashier() {
                this.hideModal();
                this.$emit('showCashier', { type: 'orderDetail' })
            },
            editOrder() {
                this.hideModal();
                this.$emit('editOrder', 'editOrder', this.order);
            },
            openInsurance() {
                $('#insuranceDialog').modal('show');
            }
        },
        components:{
            DdTable
        },
        watch: {
            orderDetailShow(newVal, oldVal) {
                if(newVal && !oldVal){
                    this[types.LOAD_ORDER_DETAIL]({ orderId: this.orderId })
                        .then(res => {
                            $('#orderDetail').modal({backdrop: 'static'});
                        })
                        .catch(e => modal.somethingAlert(e.msg));
                }
            }
        }
    }
</script>
