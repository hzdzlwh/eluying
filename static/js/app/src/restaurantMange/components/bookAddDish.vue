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
                    <input type="text" v-model="inputValue" placeholder="搜索菜品名称/拼音首字母">
                    <div class="book-search-icon"></div>
                </div>
            </div>
            <div class="book-table-box">
                <dd-table :columns="col" :data-source="vips" :bordered="true" class="estimate-table"></dd-table>
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
                        background: url('/static/image/bg_banner.png') center center no-repeat;
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
                vips: [],
                col: [
                    {
                        title: '菜品分类',
                        dataIndex: '',
                        width: 100
                    },
                    {
                        title: '菜品名称',
                        dataIndex: '',
                        width: 100
                    },
                    {
                        title: '预订数量',
                        dataIndex: '',
                        width: 80
                    },
                    {
                        title: '库存数量',
                        dataIndex: '',
                        width: 80
                    },
                    {
                        title: '操作',
                        render: (h, row) =>
                            <div>设置</div>
                    }
                ]
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
                        list.forEach(item => {
                            const dish = [];
                            dish.type = item.dishCategoryName;
                            dish.name = item.dishes.dishName;
                            dish.bookNum = item.dishes.reserveNum;
                            this.vips.push(dish);
                        });
                    }
                });
            }
        },
        components: {
            DdSelect,
            DdOption,
            DdTable
        }
    };
</script>