<template>
    <div>
        <div class="restaurant-book-container">
            <div class="restaurant-destine-select">
                <span>营业日期</span>
                <dd-datepicker :disabledDate="disabledDate" v-model="date"></dd-datepicker>
                <div class="restaurant-destine-dish" >
                    <dd-select v-model="dishType" >
                        <dd-option :key="item.id" v-for="item in dishTypeAll" :value="item.dishType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
            </div>
            <dd-table :columns="col" :data-source="vips" :bordered="true" style="margin:20px 0 10px;"></dd-table>
        </div>
    </div>
</template>
<style>
    .restaurant-book-container {
        padding-top: 80px;
        padding-left: 200px;
    }
</style>
<style lang="scss" scoped>
    .restaurant-book-container {
        width: 600px;
    }
    .restaurant-destine-select {

    }
</style>
<script>
    import http from 'http';
    import util from 'util';
    import { mapState } from 'vuex';
    import { DdDatepicker, DdTable, DdSelect, DdOption } from 'dd-vue-component';
    export default {
        data() {
            return {
                date: '',
                vips: [],
                dishTypeAll: [{
                    id: -1,
                    name: '全部菜品',
                    dishType: '-1~'
                }],
                dishType: '-1~',
                col: [
                    {
                        name: '菜品分类',
                        dataIndex: '',
                        width: 80
                    },
                    {
                        name: '菜品名称',
                        dataIndex: '',
                        width: 80
                    },
                    {
                        name: '预订数量',
                        dataIndex: '',
                        width: 60
                    }
                ]
            };
        },
        methods: {
            disabledDate(date) {
                return util.DateDiff(date, new Date()) < 1;
            },
            prevDate(date) {
                const d = date.getDate();
                return new Date(date.setDate(d - 1));
            },
            getDishType() {
                http.post('/dish/getDishTypes', { restId: this.restId })
                    .then(res => {
                        if (res.code === 1) {
                            const dishList = res.data.list;
                            dishList.forEach(dish => {
                                dish.id = dish.dishTypeId;
                                dish.name = dish.dishType;
                                dish.dishType = `-1~${dish.dishTypeId}`;
                                this.dishTypeAll.push(dish);
                            });
                        }
                    });
            }
        },
        computed: {
            ...mapState['restId']
        },
        created() {
            const prevDate = this.prevDate(new Date());
            this.date = util.dateFormat(prevDate);
            this.getDishType();
        },
        components: {
            DdDatepicker,
            DdTable,
            DdSelect,
            DdOption
        }
    };
</script>
