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
                                <span class="food-state-icon" v-if="!order.caterOrderId"
                                      :style="{background: getRoomOrFoodState(0, item.foodState).backgroundColor}">
                                    {{getRoomOrFoodState(0, item.foodState).text}}
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
                                      :class="!order.caterOrderId ? 'cursor' : ''">
                                </span>
                            </div>
                            <span class="discount-info" v-if="item.vipShowDiscount" style="top: 14px">
                                <span>原价<span class="origin-price">¥{{ item.originTotalPrice }}</span></span>
                                <span class="discount-num">
                                    {{ item.vipShowDiscount }}
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
                </div>
            </div>
        </div>
        <span v-show="false">{{getTotalPrice()}}</span>
    </div>
</template>
<style lang="scss" type="text/css" rel="stylesheet/scss">
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
    import { mapState } from 'vuex';
    import bus from '../../../common/eventBus';
    export default{
        props: {
            vipDiscountDetail: {
                type: Object,
                default: function() { return {}; }
            }
        },
        data() {
            return {};
        },
        created() {
            bus.$on('submitOrder', this.changeFood);
        },
        beforeDestroy() {
            bus.$off('submitOrder', this.changeFood);
        },
        computed: {
            ...mapState({ order: 'orderDetail' }),
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
                    obj.vipShowDiscount = this.order.vipShowDiscount;
                    foodItems[0] = obj;
                } else {
                    foodItems = this.order.foodItems;
                }

                return foodItems;
            }
        },
        methods: {
            getRoomOrFoodState(type, state) {
                switch (state) {
                    case 0:
                        return { text: '预', backgroundColor: '#ffba75' };
                    case 1:
                        return { text: type === 0 ? '餐' : '住', backgroundColor: '#82beff' };
                    case 2:
                        return { text: type === 0 ? '完' : '退', backgroundColor: '#bfbfbf' };
                    case 3:
                        return { text: '消', backgroundColor: '#bfbfbf' };
                    default:
                        return {};
                }
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
            getTotalPrice() {
                if (this.foodItems && this.foodItems.length > 0) {
                    const totalPrice = this.foodItems.reduce((a, b) => { return a + Number(b.foodPrice); }, 0);
                    this.$emit('priceChange', totalPrice);
                    return totalPrice;
                }
            },
            changeFood() {
                this.$emit('change');
            }
        }
    };
</script>
