<template>
    <div>
        <div class="restaurant-book-container">
            <div class="restaurant-destine-select">
                <span>营业日期</span>
                <dd-datepicker :disabledDate="disabledDate" v-model="date" class="destine-datepicker"></dd-datepicker>
                <div class="restaurant-destine-dish" >
                    <dd-select v-model="dishType" >
                        <dd-option :key="item.id" v-for="item in dishTypeAll" :value="item.dishType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
            </div>
            <dd-table :columns="col" :data-source="vips" :bordered="true" class="destine-table"></dd-table>
        </div>
    </div>
</template>
<style>
    .restaurant-book-container {
        padding-top: 80px;
        padding-left: 200px;
    }
    .restaurant-destine-select::after {
        content: '';
        clear: both;
        display: block;
    }
</style>
<style lang="scss" scoped>
    .restaurant-book-container {
        width: 600px;
    }
    .restaurant-destine-select {
        span {
            float: left;
            margin-right:20px;
            line-height: 24px;
        }
        .destine-datepicker {
            float: left;
            width: 140px;
        }
        .restaurant-destine-dish {
            float: right;
            width: 140px;
        }
    }
    .destine-table {
        margin: 20px 0 10px;
    }
</style>
<script>
    import http from 'http';
    import util from 'util';
    import { getDishType } from '../mixin/dishType.js';
    import { mapState } from 'vuex';
    import { DdDatepicker, DdTable, DdSelect, DdOption } from 'dd-vue-component';
    export default {
        mixins: [getDishType],
        data() {
            return {
                date: '',
                vips: [],
                col: [
                    {
                        title: '菜品分类',
                        dataIndex: 'type',
                        width: 80
                    },
                    {
                        title: '菜品名称',
                        dataIndex: 'name',
                        width: 80
                    },
                    {
                        title: '预订数量',
                        dataIndex: 'bookNum',
                        width: 60,
                        sorter: true
                    }
                ]
            };
        },
        computed: {
            ...mapState(['restId'])
        },
        created() {
            this.date = util.dateFormat(new Date());
            this.startGetDish();
        },
        methods: {
            disabledDate(date) {
                return util.DateDiff(new Date(), date) < 0;
            },
            getData() {
                const obj = {
                    queryType: 3,
                    restId: this.restId,
                    date: this.date,
                    dishCategoryId: this.dishType.split('~')[1]
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
                                newDish.reserveNum = dish.soldOut === 1 ? '已售完' : dish.sellClearNum;
                                this.vips.push(newDish);
                            });
                        });
                    }
                });
            },
            startGetDate() {
                if (!this.restId) {
                    window.setTimeout(this.startGetDate, 1000);
                } else {
                    this.getData();
                }
            },
            startGetDish() {
                if (!this.restId) {
                    window.setTimeout(this.startGetDish, 1000);
                } else {
                    this.getDishType();
                }
            }
        },
        watch: {
            date() {
                this.startGetDish();
            },
            restId() {
                this.getData();
                this.getDishType();
            },
            dishType() {
                this.getData();
            }
        },
        components: {
            DdDatepicker,
            DdTable,
            DdSelect,
            DdOption
        }
    };
</script>
