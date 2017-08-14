<template>
    <div class="book-add-dish">
        <div class="book-dish-header">
            新增沽清
            <div class="close-book-dish" @click="close">x</div>
        </div>
        <div class="book-dish-container">
            <div class="book-select-box">
                <div class="book-dish-select">
                    <div class="restaurant-estimate-dish" >
                        <dd-select v-model="dishType" >
                            <dd-option :key="item.id" v-for="item in dishTypeAll" :value="item.dishType" :label="item.name"></dd-option>
                        </dd-select>
                    </div>
                </div>
                <div class="book-dish-search">
                    <input type="text" v-model="inputValue" placeholder="搜索菜品名称/拼音首字母" @keyup.enter="search">
                    <div class="book-search-icon" @click="search"></div>
                </div>
            </div>
            <div class="book-table-box">
                <table class="dd-table orders-manage-table">
                    <thead>
                    <tr>
                        <th style="padding-left: 42px; width: 214px">菜品分类</th>
                        <th style="width: 120px">菜品名称</th>
                        <th>预订数量</th>
                        <th>库存数量</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="noOrders-tr" v-show="vips.length === 0">
                        <td colspan="10">
                            <div class="noOrders-container">
                                <img src="//static.dingdandao.com/ordersManage_noOrders.png" alt="">
                                <p v-text="searchContent !== '' ? '没有搜索到符合条件的菜品...' : '没有菜品信息'"></p>
                            </div>
                        </td>
                    </tr>
                    <tr :key="item.orderId"
                        v-for="(item, index) in vips"
                        v-if="vips.length > 0"
                        :class="['orders-tr', index % 2 === 1 ? 'orders-tr-even' : 'orders-tr-odd']"
                    >
                        <td style="padding-left: 42px; position: relative;">
                            <div class="dd-arrowRight-orderNum dd-orderArrow" v-if="false && !!item.subOrderList && item.subOrderList.length > 1 && !item.showSub"></div>
                            <div class="dd-arrowDown-orderNum dd-orderArrow" v-if="false && !!item.subOrderList && item.subOrderList.length > 1 && item.showSub"></div>
                            {{ item.orderNum }}
                        </td>
                        <td style="font-size: 0">
                            <span class="order-state order-state-red" v-if="getOrderType(item).indexOf(3) !== -1">住</span>
                            <span class="order-state order-state-yellow" v-if="getOrderType(item).indexOf(0) !== -1">餐</span>
                            <span class="order-state order-state-blue" v-if="getOrderType(item).indexOf(1) !== -1">娱</span>
                            <span class="order-state order-state-green" v-if="getOrderType(item).indexOf(2) !== -1">商</span>
                        </td>
                        <td v-text="item.orderTotalPrice"></td>
                        <td v-text="item.payAmount"></td>
                        <td v-text="item.payChannels" :title="item.payChannels"></td>
                        <td v-text="item.customerName === '单日客' ? '--' : item.customerName"></td>
                        <td v-text="item.customerPhone || '--'"></td>
                        <td v-text="item.origin"></td>
                        <td v-text="item.date"></td>
                        <td v-text="getOrderStatusText(item)"></td>
                        <td v-text="!!item.operators && item.operators.length > 0
                                    ? item.operators.join('、') : '--'"
                            :title="!!item.operators && item.operators.length > 0
                                    ? `${item.operators.join('、')}共${item.operators.length}人`
                                    : '没有收银员'">
                        </td>
                        <td v-text="item.operator"></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .book-add-dish {
        background:#fafafa;
        box-shadow:0 2px 4px 0 rgba(0,0,0,0.15);
        border-radius:2px;
        width:535px;
        border-top: 2px solid #178ce6;
        padding-bottom: 24px;
        .book-dish-header {
            line-height: 72px;
            font-size: 18px;
            color: #666666;
            padding: 0 24px;
            border-bottom: 1px solid #e6e6e6;
            .close-book-dish {
                width: 14px;
                height: 14px;
                vertical-align: middle;
                float: right;
                cursor: pointer;
            }
        }
        .book-dish-container {
            padding: 0 24px;
            .book-select-box {
                height: 72px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .book-dish-select {
                    height: 24px;
                    width: 140px;
                }
                .book-dish-search {
                    height: 24px;
                    width: 270px;
                    border: 1px solid #cccccc;
                    border-radius: 2px;
                    position: relative;
                    input {
                        border: 0;
                        height: 100%;
                        width: 100%;
                        padding-right: 24px;
                        padding-left: 8px;
                    }
                    .book-search-icon {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 24px;
                        height: 24px;
                        cursor: pointer;
                        background: url('//static.dingdandao.com/vipSearch.png') center center no-repeat;
                    }
                    &:hover {
                        border: 1px solid #178ce6;
                    }
                }
            }
            .book-table-box {
                height: 502px;
                overflow: scroll;
                ::-webkit-scrollBar {
                    width: 0;
                }
            }
        }
    }
</style>
<script>
    import { DdSelect, DdOption, DdTable } from 'dd-vue-component';
    import resetBookDish from './resetBookDish.vue';
    import http from 'http';
    import { getDishType } from '../views/mixin/dishType.js';
    export default {
        mixins: [getDishType],
        data() {
            return {
                inputValue: '',
                vips: []
            };
        },
        created() {
            this.getDishType();
            this.getData();
        },
        methods: {
            close() {
                this.$emit('closeAddDish');
            },
            getData() {
                const obj = {
                    queryType: 2,
                    restId: this.restId,
                    dishCategoryId: this.dishType.split('~')[1],
                    keyWord: this.inputValue
                };
                // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                http.get('/dish/getSellClearMenu', obj).then(res => {
                    if (res.code === 1) {
                        const list = res.data.list;
                        list.forEach(item => {
                            const dish = [];
                            dish.type = item.dishCategoryName;
                            dish.name = item.dishes.dishName;
                            dish.bookNum = item.dishes.reserveNum;
                            this.vips.push(dish);
                        });
                    }
                });
            },
            search() {
                this.dishType = '-1~';
                this.getData();
            },
            opperateBookDish() {
            }
        },
        watch: {
            dishType() {
                this.getData();
            }
        },
        components: {
            DdSelect,
            DdOption,
            DdTable
        }
    };
</script>
