<template>
    <div>
        <div class="restaurant-book-container">
            <div class="restaurant-destine-select">
                <div class="restaurant-estimate-dish" >
                    <dd-select v-model="dishType" >
                        <dd-option :key="item.id" v-for="item in dishTypeAll" :value="item.dishType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div class="estimate-delete-dishes" @click="emptyEstimateDish">
                    清空
                </div>
                <div class="estimate-add-dish" @click="addEstimateDish">
                <span class="estimate-add-icon"></span>
                新增沽清菜品
            </div>
            </div>
            <dd-table :columns="col" :data-source="vips" :bordered="true" class="estimate-table"></dd-table>
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
            <div class="book-delect-tips" v-if="deleteBookDish">
                <div class="book-tips-header">
                    提示
                </div>
                <div class="book-tips-center">
                    确定删除该沽清菜品吗?
                </div>
                <div class="book-tips-footer">
                    <div class="book-btn-ensure" @click="deleteDish">
                        确定
                    </div>
                    <div class="book-btn-cancer" @click="bookCancer">
                        取消
                    </div>
                </div>
            </div>
            <div class="book-edit-dish" v-if="editBookDish">

            </div>
            <div class="book-add-dish" v-if="addBookDish">

            </div>
        </div>
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
        &:hover {
            color: blue;
        }
    }
    .estimate-table {
        margin-top: 20px;
    }
</style>
<script>
    import { mapState } from 'vuex';
    import { getDishType } from '../mixin/dishType.js';
    import { DdSelect, DdOption, DdTable } from 'dd-vue-component';
    import http from 'http';
    export default {
        mixins: [getDishType],
        data() {
            return {
                vips: [],
                bookShadow: false,
                emptyBookDishes: false,
                deleteBookDish: false,
                editBookDish: false,
                addBookDish: false,
                col: [
                    {
                        title: '菜品分类',
                        dataIndex: 'dishType'
                    },
                    {
                        title: '菜品名称',
                        dataIndex: 'name'
                    },
                    {
                        title: '库存数量',
                        dataIndex: 'reverseNum',
                        sorter: true
                    },
                    {
                        title: '操作'
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
                    queryType: 2
                };
                http.get('/dish/getSellClearMenu', obj).then(res => {
                    if (res.code === 1) {
                        const list = res.data.list;
                        list.forEach(item => {
                            const dish = [];
                            dish.dishType = item.dishCategoryName;
                            dish.name = item.dishes.dishName;
                            dish.reverseNum = item.dishes.soldOut === 1 ? '已售完' : item.deshes.sellClearNum;
                            dish.dishId = item.dishes.dishId;
                            dish.expanded = true;
                            this.vips.push(dish);
                        });
                    }
                });
            },
            sort(col, type) {
                function compare(property, type) {
                    return function(obj1, obj2) {
                        const value1 = obj1[property];
                        const value2 = obj2[property];
                        if (type === 0) {
                            return value1 - value2;
                        } else if (type === 1) {
                            return value2 - value1;
                        }
                    };
                }
                this.vips.sort(compare('reverseNum', type));
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
                this.emptyBookDishes = false;
                this.bookShadow = false;
            }
        },
        created() {
            if (this.restId !== 0) {
                this.getData();
                this.getDishType();
            }
        },
        watch: {
            restId() {
                this.getData();
                this.getDishType();
            },
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
