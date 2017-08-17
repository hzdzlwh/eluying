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
                <dd-table :columns="col" :data-source="vips" :bordered="true" class="estimate-table"></dd-table>
            </div>
        </div>
        <resetBookDish v-if="resetBookDish" :info="row" v-on:resetBookDishNum="saverResetBookDish" v-on:cancerBookDishNum="closeResetBookDish"/>
    </div>
</template>
<style lang="scss">
    .bookDishFontRed {
        color: red;
    }
    .bookDishFontBlue {
        color: #178ce2;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
</style>
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
                overflow: auto;
                .estimate-table {
                    &::-webkit-scrollBar {
                        width: 0;
                    }
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
                vips: [],
                row: {},
                col: [
                    {
                        title: '菜品分类',
                        dataIndex: 'type',
                        width: 100
                    },
                    {
                        title: '菜品名称',
                        dataIndex: 'name',
                        width: 100
                    },
                    {
                        title: '预订数量',
                        dataIndex: 'bookNum',
                        width: 80
                    },
                    {
                        title: '库存数量',
                        width: 80,
                        render: (h, row) => {
                            return <div class={row.reserveNum === '已售完' ? 'bookDishFontRed' : ''}>{row.reserveNum}</div>;
                        }
                    },
                    {
                        title: '操作',
                        width: 80,
                        render: (h, row) => {
                            return <div class={'bookDishFontBlue'} onClick={() => this.opporateBookDish(row)}>设置</div>;
                        }
                    }
                ],
                resetBookDish: false
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
                    queryType: 1,
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
                        this.vips = [];
                        list.forEach(dishes => {
                            const dishList = dishes.dishes;
                            dishList.forEach(dish => {
                                const newDish = {};
                                newDish.type = dishes.dishCategoryName;
                                newDish.name = dish.dishName;
                                newDish.bookNum = dish.reserveNum;
                                newDish.dishId = dish.dishId;
                                newDish.reserveNum = dish.soldOut === 1 ? '已售完' : dish.sellClearNum;
                                this.vips.push(newDish);
                            });
                        });
                    }
                });
            },
            search() {
                this.dishType = '-1~';
                this.getData();
            },
            opporateBookDish(row) {
                this.resetBookDish = true;
                this.row = row;
            },
            closeResetBookDish() {
                this.resetBookDish = false;
            },
            saverResetBookDish(dishId, reserveNum) {
                this.vips.forEach(item => {
                    if (item.dishId === dishId) {
                        item.reserveNum = reserveNum;
                    }
                });
                this.resetBookDish = false;
                this.$emit('updataEstimate', this.filterUpdata(this.vips, { dishId: dishId }));
            },
            filterUpdata(collection, source) {
                // collection代表被测试的对象数组，source为被测试的属性值对（or对象）。
                // 使用Object.keys()方法获取这个对象的所有属性，并返回为一个数组。
                const sourceKeys = Object.keys(source);

                // 使用filter()方法过滤出符合条件的数组对象。
                return collection.filter(function(obj) {
                    // 遍历source的所有属性
                    for (let i = 0; i < sourceKeys.length; i ++) {
                        // 如果obj中属性不匹配，则返回false，即为不符合条件
                        if (obj[sourceKeys[i]] !== source[sourceKeys[i]]) {
                            return false;
                        }
                    }
                    return true;
                });
            }
        },
        watch: {
            dishType() {
                this.getData();
            }
        },
        components: {
            resetBookDish,
            DdSelect,
            DdOption,
            DdTable
        }
    };
</script>
