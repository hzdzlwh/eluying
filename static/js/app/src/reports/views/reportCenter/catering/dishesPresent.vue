<template>
    <div>
        <div class="report-reportCenter-date">
            <DateSelect/>
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
        <p style="font-weight: bold;font-size:24px;color:#178ce6;text-align:center;margin: 20px 0 26px">
            {{$route.meta.name}}
        </p>
        <div class="top">
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
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="operatorId" >
                        <dd-option :key="item.employeeId" v-for="item in employeeList" :value="item.employeeId" :label="item.realName"></dd-option>
                    </dd-select>
                </div>
            </div>
        </div>
        <dd-table :columns="col" :data-source="vips" :bordered="true" style="margin:20px 0 10px;"></dd-table>
        <div class="foot footfix">
            <p style="font-size:16px;"><small style='width:16px;'>总赠送数量 : </small> {{receiptNum}}</p>
            <p style="font-size:16px;"><small style='width:16px;'>总赠送金额 : </small> {{receiptFree}}</p>
            <dd-pagination @currentchange="handlePageChange" :visible-pager-count="6" :show-one-page="false" :age-count="pages" :current-page="pageNo" />
        </div>
    </div>
</template>
<style lang='scss' scoped>
  .title {
    width: 100%;
    line-height: 56px;
    font-size: 1.5em;
    color: #746D66;
    text-align: center;
    font-family: border;
  }
  .top {
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
    .export {
      float: left;
      margin-left:20px;
    }
  }
  .report-collect {
      float: left;
      margin-left:20px;
      height: 24px;
      width: 100px;
      border-radius:2px;
      text-align: center;
      line-height:24px;
      cursor:pointer;
  }
  .report-collect-add {
      background:#178ce6;
  }
  .report-collect-dis {
      background:#f39c30;
  }
</style>
<script>
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption, DdGroupOption } from 'dd-vue-component';
    import http from 'http';
    import { mapState } from 'vuex';
    import DateSelect from '../../../components/DateSelect.vue';
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
                employeeList: [
                    {
                        realName: '全部操作人',
                        employeeId: 'ALL'
                    },
                    {
                        realName: '游客线上付款',
                        employeeId: -2
                    },
                    {
                        realName: '全部员工',
                        employeeId: -1
                    }
                ],
                operatorId: 'ALL',
                vips: [],
                pages: 0,
                receiptNum: 0,
                receiptFree: 0,
                pageNo: 1,
                collectNum: 0,
                collectName: '加入收藏',
                col: [
                    {
                        title: '订单号',
                        dataIndex: 'orderNum',
                        width: 180
                    },
                    {
                        title: '餐厅名称',
                        dataIndex: 'restName',
                        width: 80
                    },
                    {
                        title: '桌位',
                        dataIndex: 'boardName',
                        width: 80
                    },
                    {
                        title: '菜品分类',
                        dataIndex: 'dishType',
                        width: 100
                    },
                    {
                        title: '菜名',
                        dataIndex: 'dishName',
                        width: 80
                    },
                    {
                        title: '单价',
                        dataIndex: 'price',
                        width: 100
                    },
    
                    {
                        title: '数量',
                        dataIndex: 'bookNum',
                        width: 80
                    },
                    {
                        title: '总价',
                        dataIndex: 'totalPrice',
                        width: 120
                    },
                    {
                        title: '操作时间',
                        dataIndex: 'operationDate',
                        width: 120
                    },
                    {
                        title: '操作人',
                        dataIndex: 'operatorName',
                        width: 120
                    }
                ],
                flag: true
            };
        },
        created() {
            this.getData();
            this.getRestType();
            this.getEmployeeList();
            this.getDishType();
            this.getCollectStatus();
        },
        components: {
            DdTable,
            DdPagination,
            DdDropdown,
            DdDropdownItem,
            DdSelect,
            DdOption,
            DdGroupOption,
            DateSelect
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
            operatorId() {
                this.page = 1;
                this.getData();
            },
            pageNo() {
                this.getData();
            }
        },
        computed: {
            ...mapState(['date']),
            collectClass: function () {
                return {
                    'report-collect': true,
                    'report-collect-add': this.collectNum === 0,
                    'report-collect-dis': this.collectNum === 1
                }
            }
        },
        methods: {
            collectUrl(num) {
                if (num === 0) {
                    this.collectNum = 1;
                    this.collectName = '已收藏';
                    http.get('/stat/addToCollect',{statValue: 501});
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection',{statValue: 501});
                    this.collectNum = 0;
                    this.collectName = '加入收藏';
                }
            },
            getCollectStatus() {
                http.get('/stat/getCollection')
                    .then(res => {
                        if(res.code === 1) {
                            const collectList = res.data.list;
                            for(let i=0;i<collectList.length;i++){
                                if (collectList[i] === 501) {
                                    this.collectNum = 1;
                                    this.collectName = '已收藏';
                                }
                            }
                        }
                    })
            },
            getRestType() {
                http.get('/restaurant/listSimple')
                .then(res => {
                    if (res.code === 1) {
                        const restList = res.data.list;
                        this.restTypeOther = restList;
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
                                dish.dishType = `-1~{dish.name}`;
                                this.dishTypeAll.push(dish);
                                dict[dish.name] = 1;
                            }
                        });
                    }
                });
            },
            getEmployeeList() {
                http.get('/user/getEmployeeList', {})
                    .then(res => {
                        if (res.code === 1) {
                            this.employeeList = [...this.employeeList, ...res.data.list];
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
                    obj.dishType = this.name;
                };
                if (this.operatorId !== 'ALL') {
                    obj.operatorId = this.operatorId;
                };
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                };
                const paramsObj = {
                    exportType: type,
                    reportType: 501,
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
                    pageNo: this.pageNo,
                    restId: this.restType.split('~')[1],
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    showPackageDish: 0
                };
                if (this.name !== '全部菜品分类') {
                    obj.dishType = this.name;
                };
                if (this.operatorId !== 'ALL') {
                    obj.operatorId = this.operatorId;
                };
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                };
                http.post('/stat/getDishSendDetail', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.list || [];
                        this.receiptNum = res.data.count;
                        this.receiptFree = res.data.totalPrice;
                        this.pages = Math.ceil(res.data.count / 30);
                    }
                    this.flag = true;
                });
            },
            handlePageChange(internalCurrentPage) {
                this.pageNo = internalCurrentPage;
                this.getData();
            }
        }
    };
</script>
