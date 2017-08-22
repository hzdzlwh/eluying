<template>
    <div>
        <div class="restaurant-book-container">
            <div class="restaurant-destine-select">
                <div class="restaurant-estimate-dish" >
                    <dd-select v-model="dishType" >
                        <dd-option :key="item.id" v-for="item in dishTypeAll" :value="item.dishType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div v-if="restPermission" class="estimate-delete-dishes bookDishFontBlue" @click="emptyEstimateDish">
                    清空
                </div>
                <div v-if="restPermission" class="estimate-add-dish bookDishFontBlue" @click="addEstimateDish">
                    <span class="estimate-add-icon"></span>
                    新增沽清菜品
                </div>
            </div>
            <dd-table :columns="col" :data-source="vips" :bordered="true" :sortField='sort.sortField' :sortType='sort.sortType' :onChange='changeSort' class="estimate-table"></dd-table>
        </div>
        <div class="restaurant-point-shade" v-if="bookShadow">
            <div class="book-empty-tips" v-if="emptyBookDishes">
                <div class="book-tips-header">
                    提示
                </div>
                <div class="book-tips-center">
                    确定清空沽清列表吗?
                </div>
                <div class="book-tips-footer">
                    <div class="book-btn-ensure" @click="emptyDishes">
                        确定
                    </div>
                    <div class="book-btn-cancer" @click="bookCancer">
                        取消
                    </div>
                </div>
            </div>
            <bookDeleteDish v-if="deleteBookDish" :info="row" :subscript="index" @bookDeleteDishCancer="() => {this.deleteBookDish = false; this.bookShadow = false;}" @deleteBookDish="ensureDeleteBookDish"/>
            <bookAddDish v-if="addBookDish" @updataEstimate="updataVips" @closeAddDish="() => {this.addBookDish = false; this.bookShadow = false;}"></bookAddDish>
        </div>
        <ResetBookDish v-if="resetBookDish" :info="row" @resetBookDishNum="saverResetBookDish" @cancerBookDishNum="() => {this.resetBookDish = false;}"/>
    </div>
</template>
<style lang="scss" scoped>
    .restaurant-book-container {
        width: 750px;
    }
    .restaurant-estimate-dish {
        width:150px;
        float:left;
    }
    .estimate-delete-dishes,.estimate-add-dish {
        padding: 0 5px;
        float: right;
        cursor: pointer;
        line-height: 24px;
    }
    .estimate-table {
        margin-top: 20px;
    }
    .book-empty-tips, .book-delect-tips {
        background:#fafafa;
        box-shadow:0 2px 4px 0 rgba(0,0,0,0.15);
        border-radius:2px;
        width:185px;
        height:166px;
        border-top: 2px solid #178ce6;
        .book-tips-header {
            width: 100%;
            line-height: 34px;
            font-size: 16px;
            text-align:center;
            margin-top: 10px;
        }
        .book-tips-center {
            width: 100%;
            text-align:center;
            line-height: 70px;
            font-size: 14px;
        }
        .book-tips-footer {
            width: 100%;
            display: flex;
            justify-content:space-between;
            align-items: center;
            padding: 0 32px;
            .book-btn-ensure, .book-btn-cancer {
                width: 48px;
                line-height: 24px;
                text-align:center;
                cursor:pointer;
                border-radius: 2px;
            }
            .book-btn-ensure {
                background: #178ce6;
                color: #fff;
            }
            .book-btn-cancer {
                border: 1px solid #ccc;
            }
        }
    }
</style>
<script>
    import { mapState } from 'vuex';
    import { getDishType } from '../mixin/dishType.js';
    import { DdSelect, DdOption, DdTable } from 'dd-vue-component';
    import bookAddDish from '../../components/bookAddDish.vue';
    import ResetBookDish from '../../components/resetBookDish.vue';
    import bookDeleteDish from '../../components/bookDeleteDish.vue';
    import http from 'http';
    export default {
        mixins: [getDishType],
        data() {
            return {
                vips: [],
                newVip: {},
                sort: {},
                bookShadow: false,
                emptyBookDishes: false,
                deleteBookDish: false,
                addBookDish: false,
                resetBookDish: false,
                restPermission: false,
                row: {},
                index: 0,
                col: [],
                col1: [
                    {
                        title: '菜品分类',
                        dataIndex: 'type'
                    },
                    {
                        title: '菜品名称',
                        dataIndex: 'name'
                    },
                    {
                        title: '库存数量',
                        render: (h, row) => {
                            return <div class={row.soldOut === 1 ? 'bookDishFontRed' : ''}>{row.soldOut === 1 ? '已售完' : row.sellClearNum}</div>;
                        },
                        sorter: true
                    },
                    {
                        title: '操作',
                        render: (h, row) =>
                            <span>
                                <span class="bookDishFontBlue" onClick={() => this.editBookDish(row)}>编辑</span>
                                <span class="bookDishFontBlue" style="margin-left:10px;" onClick={() => this.delectBookDish(row, h)}>删除</span>
                            </span>
                    }
                ],
                col2: [
                    {
                        title: '菜品分类',
                        dataIndex: 'type'
                    },
                    {
                        title: '菜品名称',
                        dataIndex: 'name'
                    },
                    {
                        title: '预订数量',
                        dataIndex: 'reserveNum'
                    },
                    {
                        title: '库存数量',
                        render: (h, row) => {
                            return <div class={row.soldOut === 1 ? 'bookDishFontRed' : ''}>{row.soldOut === 1 ? '已售完' : row.sellClearNum}</div>;
                        },
                        sorter: true
                    },
                    {
                        title: '操作',
                        render: (h, row) =>
                            <span>
                                <span class="bookDishFontBlue" onClick={() => this.editBookDish(row)}>编辑</span>
                                <span class="bookDishFontBlue" style="margin-left:10px;" onClick={() => this.delectBookDish(row, h)}>删除</span>
                            </span>
                    }
                ],
                col3: [
                    {
                        title: '菜品分类',
                        dataIndex: 'type'
                    },
                    {
                        title: '菜品名称',
                        dataIndex: 'name'
                    },
                    {
                        title: '库存数量',
                        render: (h, row) => {
                            return <div class={row.soldOut === 1 ? 'bookDishFontRed' : ''}>{row.soldOut === 1 ? '已售完' : row.sellClearNum}</div>;
                        },
                        sorter: true
                    }
                ],
                col4: [
                    {
                        title: '菜品分类',
                        dataIndex: 'type'
                    },
                    {
                        title: '菜品名称',
                        dataIndex: 'name'
                    },
                    {
                        title: '预订数量',
                        dataIndex: 'reserveNum'
                    },
                    {
                        title: '库存数量',
                        render: (h, row) => {
                            return <div class={row.soldOut === 1 ? 'bookDishFontRed' : ''}>{row.soldOut === 1 ? '已售完' : row.sellClearNum}</div>;
                        },
                        sorter: true
                    }
                ]
            };
        },
        computed: {
            ...mapState(['restId'])
        },
        methods: {
            getData() {
                const obj = {
                    restId: this.restId,
                    queryType: 2,
                    dishCategoryId: this.dishType.split('~')[1]
                };
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                http.get('/dish/getSellClearMenu', obj).then(res => {
                    if (res.code === 1) {
                        if (res.data.restPermission) {
                            this.restPermission = true;
                            if (res.data.reservePreOrder === 1) {
                                this.col = this.col2;
                            } else if (res.data.reservePreOrder === 0) {
                                this.col = this.col1;
                            }
                        } else if (!res.data.restPermission) {
                            this.restPermission = false;
                            if (res.data.reservePreOrder === 1) {
                                this.col = this.col4;
                            } else if (res.data.reservePreOrder === 0) {
                                this.col = this.col3;
                            }
                        }
                        const list = res.data.list;
                        this.vips = [];
                        list.forEach(dishes => {
                            const dishList = dishes.dishes;
                            dishList.forEach(dish => {
                                dish.type = dishes.dishCategoryName;
                                dish.name = dish.dishName;
                                this.vips.push(dish);
                            });
                        });
                    }
                });
            },
            changeSort: function(value) {
                this.sort = value;
            },
            sortData(arr, type) {
                for (let unfix = arr.length - 1; unfix > 0; unfix --) {
                    for (let i = 0; i < unfix; i ++) {
                        const value1 = arr[i].sellClearNum;
                        const value2 = arr[i + 1].sellClearNum;
                        const temp = arr[i];
                        if (type === 0) {
                            if (value1 > value2) {
                                arr.splice(i, 1);
                                arr.splice(i + 1, 0, temp);
                            }
                        } else if (type === 1) {
                            if (value1 < value2) {
                                arr.splice(i, 1);
                                arr.splice(i + 1, 0, temp);
                            }
                        }
                    }
                }
                return arr;
            },
            addEstimateDish() {
                this.bookShadow = true;
                this.addBookDish = true;
            },
            emptyEstimateDish() {
                this.bookShadow = true;
                this.emptyBookDishes = true;
            },
            emptyDishes() {
                const dishIdAll = [];
                this.vips.forEach(item => {
                    console.log(item.dishId);
                    dishIdAll.push(item.dishId);
                });
                const obj = {
                    dishId: JSON.stringify(dishIdAll),
                    oprType: 0
                };
                http.get('/dish/updateSellClearNum', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = [];
                        this.emptyBookDishes = false;
                        this.bookShadow = false;
                    }
                });
            },
            bookCancer() {
                this.deleteBookDish = false;
                this.emptyBookDishes = false;
                this.bookShadow = false;
            },
            updataVips(arr) {
                let index = 0;
                for (let i = 0; i < this.vips.length; i ++) {
                    if (this.vips[i].dishId === arr[0].dishId) {
                        this.vips[i].sellClearNum = arr[0].sellClearNum;
                        this.vips[i].soldOut = arr[0].soldOut;
                        break;
                    } else {
                        index ++;
                    }
                }
                if (index === this.vips.length) {
                    this.vips.push(arr[0]);
                }
            },
            editBookDish(row) {
                this.resetBookDish = true;
                this.row = row;
            },
            closeResetBookDish() {
                this.resetBookDish = false;
            },
            saverResetBookDish(dishId, sellClearNum, soldOut) {
                this.vips.forEach(item => {
                    if (item.dishId === dishId) {
                        item.sellClearNum = sellClearNum;
                        item.soldOut = soldOut;
                    }
                });
                this.resetBookDish = false;
            },
            delectBookDish(row, h) {
                this.row = row;
                this.index = h;
                this.bookShadow = true;
                this.deleteBookDish = true;
            },
            ensureDeleteBookDish(index) {
                this.vips.splice(index, 1);
                this.deleteBookDish = false;
                this.bookShadow = false;
            },
            startGetDish() {
                if (!this.restId) {
                    window.setTimeout(this.startGetDish, 1000);
                } else {
                    this.getDishType();
                }
            },
            startGetData() {
                if (!this.restId) {
                    window.setTimeout(this.startGetData, 1000);
                } else {
                    this.getData();
                }
            }
        },
        created() {
            this.startGetData();
            this.startGetDish();
        },
        watch: {
            restId() {
                this.startGetData();
                this.getDishType();
            },
            dishType() {
                this.startGetData();
            },
            sort: function() {
                this.sortData(this.vips, this.sort.sortType);
            }
        },
        components: {
            DdSelect,
            DdOption,
            DdTable,
            bookAddDish,
            ResetBookDish,
            bookDeleteDish
        }
    };
</script>
