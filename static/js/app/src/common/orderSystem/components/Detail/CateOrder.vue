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
                                <span>{{ getDesks(item) }}</span>
                            </div>
                            <div class="item-count">
                                <label class="label-text">人数</label>
                                <span>{{item.peopleNum}}</span>
                            </div>
                            <div class="item-date">
                                <label class="label-text">时间</label>
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
        <div class="content-item" v-if="order.caterOrderId">
            <p class="content-item-title"><span>菜单详情</span></p>
            <div class="items">
                <div class="cateOrder-item" v-for="item in order.itemsMap">
                    <p class="cateOrder-operation-info">
                        <span>{{ item.operatorDate.slice(11, 16) }}</span>
                        <span>{{ item.operatorName }}</span>
                    </p>
                    <div class="cateOrder-dishes-container">
                        <div class="cateOrder-dish food-sub-item" v-for="dish in item.dishItemResp">
                            <p class="dish-name-container">
                                <span :class="{'item-indent': dish.dishId !== null && dish.dishId !== 0 }"
                                      class="dish-name">
                                    {{dish.categoryName}}
                                </span>
                                <span class="dish-discount-icon"
                                      v-if="dish.discountable === 1 && !(dish.dishId > 0)">折</span>
                            </p>
                            <span class="dish-numAndPrice">
                                <span>x{{dish.bookNum}}</span>
                                <span>¥{{(dish.price * dish.bookNum).toFixed(2)}}</span>
                            </span>
                        </div>
                    </div>
                    <div class="cateOrder-item-remark" v-if='item.remark'>
                        菜品备注：{{item.remark}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
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
        ORDER_STATE_TEXT
    } from '../../../../ordersManage/constant';
    export default{
        props: {
            order: Object
        },
        data() {
            return {};
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
                    foodItems[0] = obj;
                } else {
                    foodItems = this.order.foodItems;
                }

                return foodItems;
            }
        },
        methods: {
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
