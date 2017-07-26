<template>
    <div>
        <p style="font-weight: bold;font-size:24px;color:#178ce6;text-align:center;margin: 20px 0 26px">
            收款明细表
        </p>
        <div class="top">
            <div class="date">日期 : <i>{{date.startDate}} ~ {{date.endDate}}</i></div>
            <div class="select-box">
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="orderType" >
                        <dd-option :key="item.id" v-for="item in orderTypeAll" :value="item.orderType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="channelId" >
                        <dd-option :key="item.id" v-for="item in channels" :value="item.id" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="operatorId" >
                        <dd-option :key="item.employeeId" v-for="item in employeeList" :value="item.employeeId" :label="item.realName"></dd-option>
                    </dd-select>
                </div>
            </div>
            <div class="export">
                <dd-dropdown text="导出明细" trigger="click" style="width:100px;">
                  <!-- <dd-dropdown-item><span><a :href="exportUrl(1)">导出PDF</a></span></dd-dropdown-item> -->
                  <dd-dropdown-item><span><a :href="exportUrl(0)">导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
            <div :class="collectClass" @click="collectUrl(collectNum)">
                {{collectName}}
            </div>
        </div>
        <dd-table :columns="col" :data-source="vips" :bordered="true" style="margin: 20px 0 10px;"></dd-table>
        <div class="foot footfix">
            <div style="float:left;">
                <p style="font-size:16px;"><small style='width:16px;'>总收款笔数 : </small> {{receiptNum}}</p>
                <p style="font-size:16px;"><small style='width:16px;'>总收款金额 : </small> {{receiptFree}}</p>
            </div>
            <dd-pagination @currentchange="handlePageChange" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" style="float:right;margin-top:20px;"/>
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
  #table {
    margin-top: 20px;
    max-height: 400px;
    padding-bottom: 12px;
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
      font-family:MicrosoftYaHei;
      font-size:14px;
      color:#ffffff;
      text-align:center;
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
                orderTypeAll: [{
                    id: -2,
                    name: '全部订单类型',
                    orderType: -2
                }, {
                    id: -1,
                    name: '组合订单',
                    orderType: -1
                }, {
                    id: 0,
                    name: '餐饮',
                    orderType: 0
                }, {
                    id: 1,
                    name: '娱乐',
                    orderType: 1
                }, {
                    id: 2,
                    name: '商超',
                    orderType: 2
                }, {
                    id: 3,
                    name: '住宿',
                    orderType: 35
                }],
                collectNum: 0,
                collectName: '加入收藏',
                orderType: -2,
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
                channels: [
                    {
                        id: 'ALL',
                        name: '全部收款方式'
                    }
                ],
                channelId: 'ALL',
                vips: [],
                pages: 0,
                receiptNum: 0,
                receiptFree: 0,
                pageNo: 1,
                col: [
                    {
                        title: '订单号',
                        dataIndex: 'orderNum',
                        width: 180
                    },
                    {
                        title: '订单类型',
                        dataIndex: 'orderType',
                        width: 80
                    },
                    {
                        title: '订单内容',
                        dataIndex: 'orderContent',
                        width: 120
                    },
                    {
                        title: '联系人',
                        dataIndex: 'customerName',
                        width: 80
                    },
                    {
                        title: '手机号',
                        dataIndex: 'customerPhone',
                        width: 100
                    },
                    {
                        title: '下单时间',
                        dataIndex: 'creationTime',
                        width: 80
                    },
                    {
                        title: '收款金额',
                        dataIndex: 'amount',
                        width: 100
                    },
    
                    {
                        title: '收款时间',
                        dataIndex: 'payTime',
                        width: 80
                    },
                    {
                        title: '收款方式',
                        dataIndex: 'payChannel',
                        width: 120
                    },
                    {
                        title: '操作人',
                        dataIndex: 'operator',
                        width: 120
                    }
                ],
                flag: true
            };
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
        created() {
            this.getData();
            this.getEmployeeList();
            this.getChannels();
            this.getCollectStatus();
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
        watch: {
            date() {
                this.pageNo = 1;
                if (this.flag) {
                    this.getData();
                }
            },
            orderType() {
                this.pageNo = 1;
                if (this.flag) {
                    this.getData();
                }
            },
            channelId() {
                this.page = 1;
                this.getData();
            },
            operatorId() {
                this.page = 1;
                this.getData();
            }
        },
        methods: {
            collectUrl(num) {
                if (num === 0) {
                    this.collectNum = 1;
                    this.collectName = '已收藏';
                    http.get('/stat/addToCollect',{statValue: 401});
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection',{statValue: 401});
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
                                if (collectList[i] === 401) {
                                    this.collectNum = 1;
                                    this.collectName = '已收藏';
                                }
                            }
                        }
                    })
            },
            exportUrl(type) {
                const obj = {
                    page: this.pageNo,
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                };
                if (this.orderType !== -2) {
                    obj.orderType = this.orderType;
                }
                if (this.channelId !== 'ALL') {
                    obj.channelId = this.channelId;
                };
                if (this.operatorId !== 'ALL') {
                    obj.operatorId = this.operatorId;
                };
                // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                const paramsObj = {
                    exportType: type,
                    reportType: 401,
                    params: JSON.stringify(obj)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            getEmployeeList() {
                http.get('/user/getEmployeeList', {})
                    .then(res => {
                        if (res.code === 1) {
                            this.employeeList = [...this.employeeList, ...res.data.list];
                        }
                    });
            },
            getChannels() {
                http.get('/user/getChannels', { type: 1, isAll: true })
                    .then(res => {
                        if (res.code === 1) {
                            this.channels = [...this.channels, ...res.data.list];
                        }
                    });
            },
            getData() {
                const obj = {
                    page: this.pageNo,
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                };
                if (this.orderType !== -2) {
                    obj.orderType = this.orderType;
                }
                if (this.channelId !== 'ALL') {
                    obj.channelId = this.channelId;
                };
                if (this.operatorId !== 'ALL') {
                    obj.operatorId = this.operatorId;
                };
                // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                http.get('/stat/getPaymentList', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.items || [];
                        this.receiptNum = res.data.totalCount;
                        this.receiptFree = res.data.totalAmount;
                        this.pages = Math.ceil(res.data.totalCount / 30);
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
