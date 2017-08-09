<template>
    <div>
        <div class="restaurant-book-container">
            <div class="restaurant-destine-select">
                <span>营业日期</span>
                <dd-datepicker :disabledDate="disabledDate" v-model="date"></dd-datepicker>
                <div class="restaurant-destine-dish" >
                    <dd-select v-model="Type" >
                        <dd-option :key="item.id" v-for="item in roomTypeAll" :value="item.roomType" :label="item.name"></dd-option>
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
    import { DdDatepicker, DdDropdown, DdDropdownItem, DdTable } from 'dd-vue-component';
    export default {
        data() {
            return {
                date: '',
                vips: [],
                col: [
                    {
                        name: '菜品分类',
                        dataIndex: '',
                        width: 60
                    },
                    {
                        name: '菜品名称',
                        dataIndex: '',
                        width: 80
                    },
                    {
                        name: '预订数量',
                        dataIndex: '',
                        width: 80
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
                http.post('/dish/getDishTypes', { restId: this.restId }).then(res => {
                    if  (res.code === 1) {
                        this.vips = res.data.
                    }
                })
            }
        },
        computed: {
            ...mapState['restId']
        },
        created() {
            const prevDate = this.prevDate(new Date());
            this.date = util.dateFormat(prevDate);
        },
        components: {
            DdDatepicker,
            DdDropdown,
            DdDropdownItem,
            DdTable
        }
    };
</script>
