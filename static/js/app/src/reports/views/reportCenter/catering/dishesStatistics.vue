<template>
    <div>
        <div class="report-reportCenter-date">
            <div :class="collectClass" @click="collectUrl(collectNum)" style="float:right;margin-top:-20px;margin-left:20px;">
                {{collectName}}
            </div>
            <div class="export" style="float:right;margin-left:20px;margin-top:-20px;">
                <dd-dropdown text="导出明细" trigger="click" style="width:100px;">
                  <!-- <dd-dropdown-item><span><a :href="exportUrl(1)">导出PDF</a></span></dd-dropdown-item> -->
                  <dd-dropdown-item><span><a :href="exportUrl(0)">导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
        </div>
        <p class="report-title">
            菜品统计汇总表
        </p>
        <div class="report-select-top">
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
                    <th style="width:170px;">总数</th>
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
<style lang="scss" scoped>
    .report-dishesStat-table{
        width: 1200px;
        margin:0 auto;
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
    import { DdDropdown, DdDropdownItem, DdSelect, DdOption, DdTable } from 'dd-vue-component';
    import { getRestType, getDishType } from '../mixin/selectType';
    import { collect } from '../mixin/collect';
    import pagination from '../mixin/pagination';
    export default {
        mixins: [getRestType, getDishType, collect, pagination],
        props: {
            startDate: String,
            endDate: String
        },
        data() {
            return {
                vips: []
            };
        },
        beforeRouteEnter(to, from, next) {
            http.get('/stat/getCollection')
                .then(res => {
                    if (res.code === 1) {
                        next(vm => {
                            const collectList = res.data.list;
                            for (let i = 0; i < collectList.length; i ++) {
                                if (collectList[i] === 502) {
                                    vm.collectNum = 1;
                                    vm.collectName = '已收藏';
                                }
                            }
                        });
                    }
                });
        },
        created() {
            this.getRestType();
            this.getDishType();
            this.getData();
            this.collectStat();
        },
        watch: {
            date() {
                this.pageNo = 1;
                this.getData();
            }
        },
        computed: {
            ...mapState(['date'])
        },
        components: {
            DdDropdown,
            DdDropdownItem,
            DdSelect,
            DdOption,
            DdTable
        },
        methods: {
            collectUrl(num) {
                if (num === 0) {
                    http.get('/stat/addToCollect', { statValue: 502 }).then(res => {
                        this.collectNum = 1;
                        this.collectName = '已收藏';
                    });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection', { statValue: 502 }).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 502) {
                                removeIndex = index;
                            }
                        });
                        this.$router.options.routes[2].children[0].children.splice(removeIndex, 1);
                        if (this.$router.options.routes[2].children[0].children.length > 1) {
                            if (this.$route.params.id) {
                                this.$router.push('/reportCenter/collect/' + this.$router.options.routes[2].children[0].children[1].meta.id);
                            }
                        } else {
                            if (this.$route.params.id) {
                                this.$router.push('/reportCenter/collect/');
                            }
                        }
                    });
                }
            },
            exportUrl(type) {
                const obj = {
                    restId: this.restType.split('~')[1],
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    showPackageDish: 0
                };
                if (this.name !== '全部菜品分类') {
                    obj.dishType = this.name;
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
            getData() {
                const obj = {
                    restId: this.restType.split('~')[1],
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    showPackageDish: 0
                };
                if (this.name !== '全部菜品分类') {
                    obj.dishType = this.name;
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
                    };
                });
            }
        }
    };
</script>
