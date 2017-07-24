<template>
    <div style="width: 1000px;margin:0 auto;">
        <div class="report-reportCenter-date">
            <DateSelect/>
            <a :href="collect" class="report-btn">点击收藏</a>
            <a :href="exportUrl(0)" class="report-btn">导出Excel</a>
        </div>
        <h2 class="report-reportCenter-title">{{$route.meta.name}}</h2>
        <div class="report-reportCenter-top">
            <div class="date">日期 : <i>{{date.startDate}} ~ {{date.endDate}}</i></div>
            <div class="select-box">
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="restType" >
                        <dd-option :key="item.id" v-for="item in restTypeAll" :value="item.restType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="name" >
                        <dd-option :key="item.id" v-for="item in dishTypeAll" :value="item.name" :label="item.name"></dd-option>
                    </dd-select>
                </div>
            </div>
        </div>
        <table border="1" class="report-dishesStat-table">
            <thead>
                <tr>
                    <th>餐厅名称</th>
                    <th>菜品种类</th>
                    <th>菜品名称</th>
                    <th>总数</th>
                    <th>售卖数量</th>
                    <th>赠送数量</th>
                </tr>
            </thead>
            <tbody v-for="(rest, restIndex) in vips">
                <tr v-for="(dishType, dishTypeIndex) in rest.dishTypeList">
                    <td :rowspan="rest.dishTypeList.length" :class=" dishTypeIndex > 0 && dishTypeIndex <= rest.dishTypeList.length ?'table-desplay-rest':''">{{rest.restName}}</td>
                    <td>{{dishType.dishType}}</td>
                    <td>
                        <div v-for="(dish, dishIndex) in dishType.dishList">{{dish.dishName}}</div>
                    </td>
                    <td>
                        <div v-for="(dish, dishIndex) in dishType.dishList">{{dish.totalAmount}}</div>
                    </td>
                    <td>
                        <div v-for="(dish, dishIndex) in dishType.dishList">{{dish.sellNum}}</div>
                    </td>
                    <td>
                        <div v-for="(dish, dishIndex) in dishType.dishList">{{dish.sendNum}}</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div> 
</template>
<style lang="scss">
    .report-dishesStat{
        border:1px solid #ccc;
        thead{
            background: #99CCFF;
        }
        tr{
            height: 24px;
        }
        td{
            div{
                height: 20px;
                box-sizing:border-box;
                border-bottom:1px solid #ccc;
            }  
        }
        
    }
    .report-reportCenter-title {
        width: 100%;
        line-height: 56px;
        font-size: 1.5em;
        color: #746D66;
        text-align: center;
        font-family: border;
    }
    .report-reportCenter-top {
        width: 100%;
        height: 32px;
        padding: 5px 0;
        .date {
            float: left;
            line-height: 25.44px;
        }
        .select-box {
            float: left;
            .fr {
                float: left;
                margin-left: 20px;
            }
        }
    }
    .report-dishesStat-table{
        width: 1000px;
        margin: 0 auto;
        margin-top: 20px;
        th{
            height: 30px;
            background: #99CCFF;
            text-align:center;
        }
        .table-desplay-rest{
            display:none;
        }
        td{
            text-align:center;
        }
        div{
            height: 30px;
            line-height: 28px;
            text-align:center;
            border-bottom: 1px solid #ccc;
        }
    }
</style>
<script>
    import http from 'http';
    import { mapState } from 'vuex';
    import DateSelect from '../../../components/DateSelect.vue';
    import { DdDropdown, DdDropdownItem, DdSelect, DdOption, DdTable } from 'dd-vue-component';
    export default {
        props: {
            startDate: String,
            endDate: String
        },
        data() {
            return {
                restTypeAll: [{
                    id: -1,
                    name: '全部餐厅',
                    restType: '-1~'
                }],
                restType: '-1~',
                dishTypeAll: [{
                    id: -1,
                    name: '全部菜品分类'
                }],
                name: '全部菜品分类',
                pages: 0,
                pageNo: 1,
                vips: []
            };
        },
        created() {
            this.getRestType();
            this.getDishType();
            this.getData();
        },
        components: {
            DdDropdown,
            DdDropdownItem,
            DateSelect,
            DdSelect,
            DdOption,
            DdTable
        },
        computed: {
            ...mapState(['date'])
        },
        watch: {
            restType() {
                this.pageNo = 1;
                this.getData();
            },
            name() {
                this.pageNo = 1;
                this.getData();
            },
            startDate() {
                this.pageNo = 1;
                this.getData();
            },
            endDate() {
                this.pageNo = 1;
                this.getData();
            },
            pageNo() {
                this.getData();
            }
        },
        methods: {
            getRestType() {
                http.get('/restaurant/listSimple')
                .then(res => {
                    if (res.code === 1) {
                        const restList = res.data.list;
                        restList.forEach(rest => {
                            rest.id = rest.restId;
                            rest.name = rest.restName;
                            rest.restType = `-1~${rest.restId}`;
                            this.restTypeAll.push(rest);
                        });
                    }
                });
            },
            getDishType() {
                http.get('/dish/getDishTypes')
                .then(res => {
                    if (res.code === 1) {
                        const dishType = res.data.list;
                        const dict = {};
                        dishType.forEach(dish => {
                            dish.name = dish.dishType;
                            if (!dict[dish.name]) {
                                this.dishTypeAll.push(dish);
                                dict[dish.name] = 1;
                            }
                        });
                    }
                });
            },
            exportUrl(type) {
                const obj = {
                    pageNo: this.pageNo,
                    restId: this.restType.split('~')[1],
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    showPackageDish: 0
                };
                if (this.name !== '全部菜品分类') {
                    obj.name = this.name;
                };
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                };
                const paramsObj = {
                    exportType: type,
                    reportType: 502,
                    params: JSON.stringify(obj)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            collect() {
            },
            getData() {
                const obj = {
                    pageNo: this.pageNo,
                    restId: this.restType.split('~')[1],
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    showPackageDish: 0
                };
                if (this.name !== '全部菜品分类') {
                    obj.name = this.name;
                };
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                };
                http.post('/stat/getDishGather', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.list;
                        this.pages = Math.ceil(res.data.count / 30);
                    };
                });
            },
            handlePageChange(internalCurrentPage) {
                this.pageNo = internalCurrentPage;
                this.getData();
            }
        }
    };
</script>
