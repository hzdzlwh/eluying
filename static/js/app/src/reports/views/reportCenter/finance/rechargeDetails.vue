<template>
    <div>
        <DateSelect/>
        <h2 class="title">{{$route.meta.name}}</h2>
        <div class="top">
            <div class="date">日期 : <i>{{date.startDate}} ~ {{date.endDate}}</i></div>
            <div class="select-box">
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="type" >
                        <dd-option :key="item.id" v-for="item in typeAll" :value="item.type" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="categoryType" >
                        <dd-option :key="item.id" v-for="item in categoryTypeAll" :value="item.categoryType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr room" >
                    <dd-select v-model="channelType" >
                        <dd-option :key="item.id" v-for="item in channelTypeAll" :value="item.channelType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
            </div>
            <div class="export">
                <dd-dropdown text="导出明细" trigger="click" style="width:100px;">
                  <!-- <dd-dropdown-item><span><a :href="exportUrl(1)">导出PDF</a></span></dd-dropdown-item> -->
                  <dd-dropdown-item><span><a :href="exportUrl(0)">导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
        </div>
        <dd-table :columns="col" :data-source="vips" :bordered="true" id="table"></dd-table>
        <div class="foot footfix">
            <p style="font-size:16px;"><small style='width:16px;'>总充值笔数 : </small> {{receiptNum}}</p>
            <p style="font-size:16px;"><small style='width:16px;'>总充值金额 : </small> {{receiptFree}}</p>
            <p style="font-size:16px;"><small style='width:16px;'>总赠送金额 : </small> {{priceFree}}</p>
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
  #table {
    margin-top: 20px;
    max-height: 400px;
    padding-bottom: 12px;
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
                typeAll: [{
                    id: -1,
                    name: '全部类型',
                    type: -1
                }, {
                    id: 0,
                    name: '会员',
                    type: 0
                }, {
                    id: 1,
                    name: '会员卡',
                    type: 1
                }],
                type: -1,
                channelTypeAll: [{
                    id: -1,
                    name: '全部付款方式',
                    channelType: '-1~'
                }],
                channelType: '-1~',
                categoryTypeAll: [{
                    id: -1,
                    name: '会员卡/等级',
                    categoryType: '-1~'
                }],
                categoryType: '-1~',
                vips: [],
                vip: {},
                pages: 0,
                receiptNum: 0,
                priceFree: 0,
                receiptFree: 0,
                pageNo: 1,
                col: [
                    {
                        title: '类型',
                        dataIndex: 'type',
                        width: 180
                    },
                    {
                        title: '会员卡/等级',
                        dataIndex: 'name',
                        width: 80
                    },
                    {
                        title: '联系人',
                        dataIndex: 'userName',
                        width: 80
                    },
                    {
                        title: '手机号',
                        dataIndex: 'phone',
                        width: 100
                    },
                    {
                        title: '充值金额',
                        dataIndex: 'price',
                        width: 80
                    },
                    {
                        title: '赠送金额',
                        dataIndex: 'freePrice',
                        width: 100
                    },
    
                    {
                        title: '充值时间',
                        dataIndex: 'creationTime',
                        width: 80
                    },
                    {
                        title: '付款方式',
                        dataIndex: 'channel',
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
        watch: {
            date() {
                this.pageNo = 1;
                if (this.flag) {
                    this.fetchDate();
                }
            },
            channelType() {
                this.pageNo = 1;
                if (this.flag) {
                    this.fetchDate();
                }
            },
            categoryType() {
                this.pageNo = 1;
                if (this.flag) {
                    this.fetchDate();
                }
            },
            pageNo() {
                if (this.flag) {
                    this.fetchDate();
                }
            },
            type() {
                this.pageNo = 1;
                if (this.flag) {
                    this.fetchDate();
                }
            }
        },
        created() {
            this.getData();
        },
        computed: {
            ...mapState(['date'])
        },
        methods: {
            exportUrl(type) {
                const originParam = {
                    date: this.today
                };
                const paramsObj = {
                    exportType: type,
                    reportType: 18,
                    params: JSON.stringify(originParam)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            getData() {
                http.get('/stat/getChargeLog', {
                    startDate: this.date.startDate,
                    toDate: this.date.endDate
                })
                .then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.entityList;
                        this.receiptNum = res.data.totalChargeCount;
                        this.priceFree = res.data.totalFreeFee;
                        this.receiptFree = res.data.totalChargeFee;
                        this.pages = Math.ceil(res.data.orderAmount / 30);
                    }
                    this.flag = true;
                });
            },
            fetchDate() {
                const obj = {
                    pageNo: this.pageNo,
                    // zoneId: this.zoneType.split('~')[1],
                    // roomType: this.roomType.split('~')[1],
                    startDate: this.date.startDate,
                    toDate: this.date.endDate
                };
                if (this.type !== -1) {
                    obj.type = this.type;
                };
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                http.get('/stat/getChargeLog', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.entityList || [];
                        this.receiptNum = res.data.totalChargeCount;
                        this.priceFree = res.data.totalFreeFee;
                        this.receiptFree = res.data.totalChargeFee;
                        this.pages = Math.ceil(res.data.orderAmount / 30);
                        // if (keyword) {
                        //     this.originId = -2;
                        //     this.endTime = undefined;
                        //     this.pageNo = 1;
                        //     this.searchPattern = undefined;
                        //     this.startTime = undefined;
                        //     this.state = -1;
                        //     this.timeType = 1;
                        //     $("#search").val('');
                        // }
                    }
                    this.flag = true;
                });
            },
            handlePageChange(internalCurrentPage) {
                this.pageNo = internalCurrentPage;
                this.fetchDate();
            }
        }
    };
</script>
