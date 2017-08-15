<template>
    <div>
        <div class="content-item">
            <p class="content-item-title"><span>餐饮信息</span>
            <span class="increase-container" @click="addRest"  v-if='checkState =="book"'>
                    <span class="increase-icon"></span>添加餐饮
            </span></p>
            <div class="items">
                <div class="item" v-for="(item, index) in foodItems" v-if='foodItems.length'>
                    <div class="food-item">
                        <span class="food-icon"></span>
                        <div class="item-content">
                            <div class="item-name">
                                <span class="item-name" v-if='checkState !== "book"'>{{item.restName}}</span>
                                <dd-select v-model='item.resetId' placeholder="请选择餐厅" @input='modifyFood([item])' v-if='checkState === "book"'>
                                    <dd-option v-for="reset in resets" :value="reset.restId" :key="reset.restId" :label="reset.restName">
                                    </dd-option>
                                </dd-select>
                                <span class="food-state-icon" v-if="!order.caterOrderId"
                                      :style="{background: getRoomOrFoodState(0, item.foodState).backgroundColor}">
                                    {{getRoomOrFoodState(0, item.foodState).text}}
                                </span>
                            </div>
                            <div class="item-desks" v-if='checkState !== "book"'>
                                <label class="label-text">桌号</label>
                                <span>{{ getDesks(item) || '未选择' }}</span>
                            </div>
                            <div class="item-count">
                                <label class="label-text">就餐人数</label>
                                <inputVaild :min=1 :max=2000 v-model='item.peopleNum' :isInt=true ></inputVaild>
                            </div>
                            <div class="item-date">
                                <label class="label-text">用餐时间</label>
                                <DatePicker v-model='item.date' type="datetime" placeholder="选择日期时间" format='yyyy-MM-dd HH:mm'></DatePicker>
                            </div>

                            <div class="item-price">
                                <label class="label-text">小计</label>
                                <span>¥{{item.foodPrice}}</span>
                            </div>
                            <span class="discount-info"  style="top: 25px">
                                <span v-if="item.showDiscount">原价<span class="origin-price">¥{{ item.originTotalPrice }}</span></span>
                                <span class="discount-num" v-if="item.showDiscount">
                                    {{ item.showDiscount }}
                                </span>
                                <span class="more-discount" :id="'js-more-restdiscount-' + index">
                                <span class="more-discount-handle" @click="handleMoreDiscountClick(index, $event)">
                                    <span>更多折扣</span>
                        <span class="more-discount-icon"></span>
                        </span>
                        <span class="more-discount-select">
                                    <dd-select v-model="item.moreDiscount" @input="moreDiscountChange(item)">
                                        <dd-option :value="0" label="不使用">
                                        </dd-option>
                                        <dd-group-option v-for="item in discountPlans" :label="item.label" :key="item" v-if="item.discounts && item.discounts.length > 0">
                                            <dd-option v-for="discount in item.discounts" :key="discount" :value="discount.id" :label="discount.name + ' ' + discount.discount + '折'">
                                                <span :title="discount.serialNum">{{discount.name + ' ' + discount.discount + '折'}}</span>
                        </dd-option>
                        </dd-group-option>
                        </dd-select>
                        </span>
                        </span>
                            </span>
                        <span class="delete-icon" @click='deleteFoodItem(index)' v-if='!item.orderState || (item.orderState !== 3 && item.orderState !== 8)'></span>                            
                        </div>
                    </div>
                    <div class="food-item" style="padding-left: 40px;">
                                                    <div class="item-date">
                                <label class="label-text">整单优惠¥</label>
                                <inputVaild  v-model='item.discount' @input='modifyFood([item])'></inputVaild>
                            </div>
                    </div>
                    <div class="food-item" style="padding-left: 40px;">
                                                    <div class="item-date">
                                <label class="label-text">点菜</label>
                                
                            </div>
                    </div>
                </div>
            </div>
        </div>
       <!--  <div class="content-item" v-if="order.caterOrderId ">
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
        </div> -->
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
    .food-item{
        margin-bottom:10px;
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
    // import { mapState, mapGetters } from 'vuex';
    import bus from '../../../eventBus';
    import inputVaild from '../../../components/inputVaild.vue';
    import { DatePicker } from 'element-ui';
    import http from '../../../http.js';
    import {
        DdSelect,
        DdOption,
        DdGroupOption
    } from 'dd-vue-component';
    export default{
        props: {
            vipDiscountDetail: Object,
            userOriginType: Object,
            vipId: Number,
            vipCardId: Number,
            vipCardInfo: {
                type: Object,
                default: {}
            },
            checkState: String,
            order: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                foodItems: [],
                discountPlans: [],
                resets: [],
                orderType: this.order.foodItems ? 1 : 0 // 1组合订单，0子订单
            };
        },
        created() {
            this.getQuickDiscounts();
            this.getRestList();
            this.foodItems = this.getFoodItem();
            bus.$on('submitOrder', this.changeFood);
        },
        beforeDestroy() {
            bus.$off('submitOrder', this.changeFood);
        },
        watch: {
            order: {
                handler(c, o) {
                    this.foodItems = this.getFoodItem();
                    this.orderType = this.order.foodItems ? 1 : 0;
                },
                deep: true
            },
            userOriginType(origin, oldOrigin) {
                // 如果之前的渠道是undefined，代表初始化
                if (!oldOrigin) {
                    return false;
                }
                if (this.foodItems.length > 0 && origin) {
                        // 切成其他的渠道，要把会员和企业的折扣设为不使用
                    if (origin.id !== -4 || origin.id !== -5) {
                        this.foodItems.map(r => {
                            if (r.channelDiscount < 0) {
                                r.channelDiscount = 0;
                            }
                        });
                    }
                    // 更改渠道
                    this.modifyFood(this.foodItems);
                }
            },
            vipCardInfo(vipCardInfo, oldVipCardInfo) {
                if (!this.userOriginType ||
                        JSON.stringify(vipCardInfo) === JSON.stringify(oldVipCardInfo) ||
                        this.userOriginType.id > 0) {
                    return;
                }
                const discounts = vipCardInfo.discount && vipCardInfo.discount < 10 ? [{
                    id: this.userOriginType.id,
                    name: vipCardInfo.name,
                    serialNum: vipCardInfo.serialNum,
                    discount: vipCardInfo.discount
                }] : [];
                this.$set(this.discountPlans, 1, {
                    label: vipCardInfo.tag,
                    discounts: discounts
                });
                this.handleVipCardChange(this.userOriginType.id, oldVipCardInfo.name !== undefined);
            },
            vipCardId(id, oldId) {
                    // 会员折扣id为-4
                if (!this.userOriginType) {
                    return;
                }
                const discounts = this.vipCardInfo.discount && this.vipCardInfo.discount < 10 ? [{
                    id: this.userOriginType.id,
                    name: this.vipCardInfo.name,
                    serialNum: this.vipCardInfo.serialNum,
                    discount: this.vipCardInfo.discount
                }] : [];
                this.$set(this.discountPlans, 1, {
                    label: this.vipCardInfo.tag,
                    discounts: discounts
                });
                const changeId = id === 0 ? 0 : this.userOriginType.id;
                this.handleVipCardChange(changeId, oldId !== undefined && oldId !== 0);
            },
            vipDiscountDetail(newVal, oldVal) {
                if (!newVal.vipDetail || !oldVal.vipDetail) {
                    return false;
                }

                if (newVal.vipDetail.vipId !== oldVal.vipDetail.vipId) {
                    this.modifyFood(this.foodItems);
                }
            }
        },
        components: {
            inputVaild,
            DatePicker,
            DdSelect,
            DdOption,
            DdGroupOption
        },
        methods: {
            getFoodItem() {
                const order = Object.assign({}, this.order);
                let foodItems = [];
                if (order.caterOrderId) {
                    const obj = {};
                    obj.restName = order.restName;
                    obj.boardDetailResps = order.boardDetailResps.map(board => {
                        return board.boardName;
                    });
                    obj.peopleNum = order.peopleNum;
                    obj.date = order.expectStartTime;
                    obj.foodPrice = order.totalPrice;
                    obj.originTotalPrice = order.originTotalPrice;
                    obj.showDiscount = order.showDiscount;
                    foodItems[0] = obj;
                } else {
                    foodItems = order.foodItems ? order.foodItems : [];
                }
               return foodItems;
            },
            getRestList() {
                http.get('/restaurant/listSimple').then(res => {
                    this.resets = res.data.list;
                });
            },
            addRest() {
                this.foodItems.push({
                    //     obj.restName = order.restName;
                    // obj.boardDetailResps = order.boardDetailResps.map(board => {
                    //     return board.boardName;
                    // });
                    // obj.peopleNum = order.peopleNum;
                    // obj.date = order.expectStartTime;
                    // obj.foodPrice = order.totalPrice;
                    // obj.originTotalPrice = order.originTotalPrice;
                    // obj.showDiscount = order.showDiscount;
                    // foodItems[0] = obj;
                    restId: 0,
                    peopleNum: 1,
                    date: new Date(),
                    foodPrice: 0,
                    originTotalPrice: 0,
                    showDiscount: '',
                    itemsMap: [],
                    moreDiscount: undefined
                });
            },
            modifyFood(food) {
                if (food.length === 0) {
                    return false;
                }

                // 会员-1，企业-2,会员卡-4
                let discountChannel;
                let discountRelatedId; // eslint-disable-line
                if (this.userOriginType && this.userOriginType.id === -5) {
                    discountRelatedId = this.userOriginType.companyId;
                    discountChannel = 2;
                } else if (this.userOriginType && (this.userOriginType.id === -4 || this.userOriginType.id === -3)) {
                    // 会员渠道分为会员等级和会员卡
                    if (!this.vipId || this.vipCardId === undefined) {
                        return false;
                    }

                    if (this.vipCardId > 0) {
                        discountRelatedId = this.vipCardId;
                        discountChannel = 4;
                    }

                    if (this.vipCardId === 0) {
                        discountRelatedId = null;
                        discountChannel = null;
                    }

                    if (this.vipCardId < 0) {
                        discountRelatedId = this.vipId;
                        discountChannel = 1;
                    }
                }

                // food.map(room => {
                //     if (room.moreDiscount > 0) {
                //         room.quickDiscountId = room.moreDiscount;
                //     } else {
                //         room.quickDiscountId = '';
                //     }
                // });

                const params = {
                    discountChannel: discountChannel,
                    discountRelatedId: discountRelatedId,
                    rests: JSON.stringify(food.map(fo => {
                        const parm = {
                            discountPrice: fo.discount,
                            quickDiscountId: fo.moreDiscount,
                            restId: fo.restId
                        };
                        if (fo.dishes) {
                            parm.dishes = JSON.stringify(fo.itemsMap.map(item => {
                                return {
                                    bookNum: item.bookNum,
                                    dishId: item.dishId,
                                    price: item.price
                                };
                            }));
                        }
                        return parm;
                    }))
                };
                http.get('/dish/calculateDiscountPrice', params)
                    .then(res => {
                        res.data.list.forEach((item, index) => {
                            food[index].originTotalPrice = item.oriTotalPrice;
                            food[index].showDiscount = item.showDiscount;
                            food[index].foodPrice = item.totalPrice;
                        });
                    });
            },
            getQuickDiscounts() {
                http.get('/quickDiscount/getList', {
                    nodeId: 0,
                    nodeType: 0
                })
                    .then(res => {
                        this.discountPlans = [];
                        this.discountPlans.push({
                            label: '快捷折扣',
                            discounts: res.data.list.map(item => {
                                return {
                                    id: item.id,
                                    name: item.description,
                                    discount: item.discount
                                };
                            })
                        });
                    });
            },
            handleVipCardChange(id, forceChange) {
                // 切换了会员卡后房间更多折扣的处理逻辑，没有折扣选择不使用
                if (this.checkState !== 'editOrder') {
                    this.foodItems.map(r => {
                        r.moreDiscount = id;
                    });
                }
                if (Number(this.vipCardInfo.discount) === 10 && (this.checkState !== 'editOrder')) {
                    this.foodItems.map(r => {
                        r.moreDiscount = 0;
                    });
                }
                if (this.foodItems.length > 0) {
                    // 更改渠道
                    this.modifyFood(this.foodItems);
                }
            },
            handleMoreDiscountClick(index, ev) {
                ev.stopPropagation();
                document.querySelector(`#js-more-restdiscount-${index} .dd-select-input`).click();
            },
            moreDiscountChange(room) {
                this.modifyFood([room]);
            },
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
            deleteFoodItem(index) {
                this.foodItems.splice(index, 1);
            },
            getTotalPrice() {
                if (this.foodItems && this.foodItems.length > 0) {
                    const totalPrice = this.foodItems.reduce((a, b) => { return a + Number(b.foodPrice); }, 0);
                    this.$emit('priceChange', totalPrice);
                    return totalPrice;
                }
            },
            changeFood() {
                this.$emit('change', this.foodItems);
            }
        }
    };
</script>
