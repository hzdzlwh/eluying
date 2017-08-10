<template>
    <div>
        <div class="content-item">
            <p class="content-item-title"><span>餐饮信息</span></p>
            <div class="items">
                <div class="item" v-for="item in foodItems">
                    <div class="food-item">
                        <span class="food-icon"></span>
                        <div class="item-content">
                            <div class="item-name">
                                <span class="item-name">{{item.restName}}</span>
                                <span class="state-icon" v-if="!order.caterOrderId"
                                      :class="getOrderState(item, 'color')"
                                >
                                    {{getOrderState(item, 'text')}}
                                </span>
                            </div>
                            <div class="item-desks">
                                <label class="label-text">桌号</label>
                                <span>{{ getDesks(item) || '未选择' }}</span>
                            </div>
                            <div class="item-count">
                                <label class="label-text">就餐人数</label>
                                <span>{{item.peopleNum}}</span>
                            </div>
                            <div class="item-date">
                                <label class="label-text">用餐时间</label>
                                <span>{{item.date.slice(0, 16)}}</span>
                            </div>
                            <div class="item-price">
                                <label class="label-text">小计</label>
                                <span>¥{{item.foodPrice}}</span>
                                <span class="single-order-btn"
                                      v-text="!order.caterOrderId ? '查看': ''"
                                      :class="!order.caterOrderId ? 'cursor' : ''"
                                      @click="showSingleOrder(item)">
                                </span>
                            </div>
                            <span class="discount-info" v-if="item.showDiscount" style="top: 20px">
                                <span>原价<span class="origin-price">¥{{ item.originTotalPrice }}</span></span>
                                <span class="discount-num">
                                    {{ item.showDiscount }}
                                </span>
                            </span>
                        </div>
                    </div>
                           
                </div>
            </div>
        </div>
         <div class="content-item" v-if='this.order.type === ORDER_TYPE.CATERING'>
            <p class="content-item-title"><span>餐饮信息</span></p>
            <div class="items">
             <div class="rest-restDetail-constain" style="width:300px">
            <table class="rest-restDetail-table">
                <thead>
                    <tr><td width="150px">菜品名称</td><td width="45px">数量</td><td width='80px'>金额</td></tr>
                </thead>
                <tbody>
                <template v-for='it in foodItems[0].itemsMap'>
                    <tr @click='changeItem(it); dishClick(it)' > <td><div><span class="rest-restDetail-dishname" :class='{"rest-item-del" : it.serviceState === 1}'> <span  :class='getTriangle(it)'></span><span >{{it.dishName}}</span></span><span class="rest-item-send" v-if='it.serviceState === 2'>送</span></div></td><td><div :class='{"rest-item-del" : it.serviceState === 1}'>x{{it.bookNum}}</div></td><td :class='{"rest-item-del" : it.serviceState === 1}'>{{it.price}}</td></tr>
                    <tr v-for='sub in it.subDishList' @click='dishClick(sub)' v-if='it.select' :class='{"rest-item-del" : sub.serviceState === 1}'>
                        <td class="rest-restDetail-trchild">{{sub.dishName}}</td><td><div>x{{sub.bookNum}}</div></td><td></td>
                    </tr>
                </template> 
                </tbody>
            </table>
        </div>
        <div style="width:400px">
            <div>菜品备注：不要辣修改</div>
            <div>点菜员：邱立</div>
            <div>下单时间：2017-07-13 14:21</div>
            <div></div>
        </div>
            </div>
            </div>
    </div>
</template>
<style lang="scss">
    .cateTag{
            font-size: 10px;
    color: #ffffff;
    display: inline-flex;
    border-radius: 2px;
    width: 17px;
    height: 16px;
    margin-left: 5px;
    align-items: center;
    justify-content: center;
    }
    .item-price {
        display: inline-flex;
        align-items: center;
    }

    .cateOrder-operation-info {
        padding-right: 40%;
        margin-bottom: 10px;
        color: #999999;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cateOrder-dishes-container {
        padding-top: 7px;
        padding-right: 40%;
        border-top: 1px solid #e6e6e6;
    }

    .cateOrder-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .cateOrder-item:not(:last-child) {
        padding-bottom: 15px;
        margin-bottom: 16px;
        border-bottom: 1px dotted #e6e6e6;
    }

    .cateOrder-dish {
        display: flex;
        justify-content: space-between;
        align-items: center;

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
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }

        .dish-name {
            display: block;
            max-width: 140px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .dish-numAndPrice {
            flex-grow: 1;
            display: inline-flex;
            justify-content: space-between;
        }
    }
    .cateOrder-dish:not(:last-child) {
        margin-bottom: 10px;
    }

    .cateOrder-item-remark {
        font-size: 12px;
        color: #999999;
        margin-top: 10px;
        padding-top: 15px;
        border-top: 1px dotted #e6e6e6;
    }
</style>
<script>
    import bus from '../../../eventBus.js';
    import {
        ORDER_TYPE,
        ORDER_STATE_TEXT,
        REST_STATUS
    } from '../../../../ordersManage/constant';
    export default{
        props: {
            order: Object
        },
        data() {
            return { REST_STATUS, ORDER_TYPE, dishChange: undefined };
        },
        computed: {
            foodItems() {
                let foodItems = [];
                if (this.order.caterOrderId) {
                    const obj = {};
                    obj.restName = this.order.restName;
                    obj.boardDetailResps = this.order.boardDetailResps.map(board => {
                        return board.boardName;
                    });
                    obj.peopleNum = this.order.peopleNum;
                    obj.date = this.order.expectStartTime;
                    obj.foodPrice = this.order.totalPrice;
                    obj.originTotalPrice = this.order.originTotalPrice;
                    obj.showDiscount = this.order.showDiscount;
                    obj.itemsMap = this.order.itemsMap;
                    foodItems[0] = obj;
                } else {
                    foodItems = this.order.foodItems;
                }

                return foodItems;
            }
        },
        methods: {
            getTriangle(item) {
                if (!item.subDishList || !item.subDishList.length) {
                    return '';
                }
                if (item.select) {
                    return 'triangle-down';
                } else {
                    return 'triangle-right';
                }
            },
            dishClick(dish) {
                if (dish.serviceState === 1) {
                    return;
                }
                this.dishChange = dish;
            },
            changeItem(item) {
                if (!item.subDishList || !item.subDishList.length) {
                    return;
                }
                if (item.select === undefined) {
                    this.$set(item, 'select', true);
                } else {
                    item.select = !item.select;
                }
            },
            getOrderState(food, prop) {
                if (food.foodState === undefined || !ORDER_STATE_TEXT[ORDER_TYPE.CATERING][food.foodState]) {
                    return '';
                }

                return ORDER_STATE_TEXT[ORDER_TYPE.CATERING][food.foodState][prop];
            },
            getDesks(item) {
                let desksStr = '';
                if (this.order.caterOrderId) {
                    desksStr = item.boardDetailResps ? item.boardDetailResps.join('、') : '';
                } else {
                    desksStr = item.boardList ? item.boardList.join('、') : '';
                }

                return desksStr;
            },
            showSingleOrder(order) {
                if (!this.order.caterOrderId) {
                    bus.$emit('onShowDetail',
                        {
                            orderId: order.foodOrderId,
                            type: 0
                        });
                } else {
                    return false;
                }
            }
        }
    };
</script>
