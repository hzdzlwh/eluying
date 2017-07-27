<template>
    <div>
        <div class="date-container">
            <div class="dd-datepicker-container">
                <span>报表日期</span>
                <DdDatepicker v-model="today" :disabled-date="disabledDate" />
                <span style="margin-left: 10px;"> 单位:人民币元</span>
            </div>
            <div style="height:inherit;">
                <dd-dropdown text="导出明细" trigger="click" style="float:left;">
                    <!-- <dd-dropdown-item><span><a :href="exportUrl(1)">导出PDF</a></span></dd-dropdown-item> -->
                    <dd-dropdown-item><span><a :href="exportUrl(0)">导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
                <div :class="collectClass" @click="collectUrl(collectNum)" style="float:left;">
                    {{collectName}}
                </div>
            </div>
        </div>
        <div class="content">
            <div class="title">
                <h2>营业日报表</h2>
            </div>
            <div class="table-container">
                <table class="debit-table" border="1">
                    <thead>
                        <tr>
                            <th colspan="3">借方</th>
                        </tr>
                        <tr>
                            <th>项目</th>
                            <th>本日</th>
                            <th>本月累计</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in debit" :class="{'mark-tr': item.nodeLevel === 1, 'word-bold': item.nodeLevel === 2}">
                            <td>{{item.name}}</td>
                            <td>{{item.dailyAmount}}</td>
                            <td>{{item.monthlyAmount}}</td>
                        </tr>
                        <tr v-for="n in debitSupplymentTr">
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{{debitSummary.name}}</td>
                            <td>{{debitSummary.dailyAmount}}</td>
                            <td>{{debitSummary.monthlyAmount}}</td>
                        </tr>
                    </tfoot>
                </table>
                <table class="credit-table" border="1">
                    <thead>
                        <tr>
                            <th colspan="3">贷方</th>
                        </tr>
                        <tr>
                            <th>项目</th>
                            <th>本日</th>
                            <th>本月累计</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in credit" :class="{'mark-tr': item.nodeLevel === 1, 'word-bold': item.nodeLevel === 2}">
                            <td>{{item.name}}</td>
                            <td>{{item.dailyAmount}}</td>
                            <td>{{item.monthlyAmount}}</td>
                        </tr>
                        <tr v-for="n in creditSupplymentTr">
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{{creditSummary.name}}</td>
                            <td>{{creditSummary.dailyAmount}}</td>
                            <td>{{creditSummary.monthlyAmount}}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
    import http from '../../../../common/http';
    import util from '../../../../common/util';
    import { DdDatepicker, DdDropdown, DdDropdownItem } from 'dd-vue-component';
    
    export default {
        data() {
            return {
                collectNum: 0,
                collectName: '加入收藏',
                today: undefined,
                credit: [],
                creditSummary: {},
                debit: [],
                debitSummary: {}
            };
        },
        created() {
            this.today = util.dateFormat(new Date());
            this.getDailyReportData();
            this.getCollectStatus();
        },
        computed: {
            debitSupplymentTr() {
                return this.credit.length > this.debit.length ? this.credit.length - this.debit.length : 0;
            },
            creditSupplymentTr() {
                return this.debit.length > this.credit.length ? this.debit.length - this.credit.length : 0;
            },
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
                    http.get('/stat/addToCollect',{statValue: 18}).then(res => {
                        this.collectNum = 1;
                        this.collectName = '已收藏';
                    });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection',{statValue: 18}).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 18) {
                                removeIndex = index;
                            }
                        });
                        this.$router.options.routes[2].children[0].children.splice(removeIndex , 1);
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
            getCollectStatus() {
                http.get('/stat/getCollection')
                    .then(res => {
                        if(res.code === 1) {
                            const collectList = res.data.list;
                            for(let i=0;i<collectList.length;i++){
                                if (collectList[i] === 18) {
                                    this.collectNum = 1;
                                    this.collectName = '已收藏';
                                }
                            }
                        }
                    })
            },
            getDailyReportData() {
                http.get('/stat/getDailyStat', { date: this.today }).then(res => {
                    if (res.code === 1) {
                        this.credit = res.data.credit;
                        this.debit = res.data.debit;
                        this.creditSummary = res.data.credit.pop();
                        this.debitSummary = res.data.debit.pop();
                    }
                });
            },
            disabledDate(date) {
                return date && date.valueOf() > Date.now();
            },
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
            }
        },
        watch: {
            today() {
                this.getDailyReportData();
            }
        },
        components: {
            DdDatepicker,
            DdDropdown,
            DdDropdownItem
        },
        beforeRouteEnter(to, from, next) {
            next(() => {
                $('.date-select-container').hide();
            });
        },
        beforeRouteLeave(to, from, next) {
            $('.date-select-container').show();
            next();
        }
    };
</script>
<style lang="scss" scoped>
    .date-container{
        display: flex;
        justify-content: space-between;
        margin-top: 22px;
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
    .content{
        padding-top: 20px;
        .title{
            h2{
                font-size: 24px;
                color: #178ce6;
                text-align: center;
            }
        }
        .table-container{
            display: flex;
            margin-top: 26px;
            .debit-table{
                width: 50%;
                font-size: 12px;
                border: 1px solid #e6e6e6;
                tr{
                    height: 32px;
                }
                thead{
                    tr:first-child{
                        background: #61758c;
                        color: #fff;
                        th{
                            text-align: center;
                        }
                    }
                    tr:last-child{
                        background: #eeeeee;
                        color: #666666;
                        th:first-child{
                            padding-left: 20px;
                        }
                        th:not(:first-child){
                            text-align: right;
                            padding-right: 20px;
                        }
                    }
                }
                tbody{
                    tr{
                        td:first-child{
                            padding-left: 34px;
                        }
                        td:not(:first-child){
                            text-align: right;
                            padding-right: 20px;
                        }
                    }
                    .mark-tr{
                        font-weight: bold;
                        color: #666666;
                        background: #b2dbff;
                        td:first-child{
                            padding-left: 20px;
                        }
                    }
                    .word-bold{
                        font-weight: bold;
                        color: #666666;
                        padding-left: 34px;
                    }
                }
                tfoot{
                    tr{
                       background: #61758c;
                        color: #fff;
                        td:first-child{
                            padding-left: 20px;
                        }
                        td:not(:first-child){
                            text-align: right;
                            padding-right: 20px;
                        }
                    }
                }
            }
            .credit-table{
                width: 50%;
                font-size: 12px;
                border: 1px solid #e6e6e6;
                tr{
                    height: 32px;
                }
                thead{
                    tr:first-child{
                        background: #61758c;
                        color: #fff;
                        th{
                            text-align: center;
                        }
                    }
                    tr:last-child{
                        background: #eeeeee;
                        color: #666666;
                        th:first-child{
                            padding-left: 20px;
                        }
                        th:not(:first-child){
                            text-align: right;
                            padding-right: 20px;
                        }
                    }
                }
                tbody{
                    tr{
                        td:first-child{
                            padding-left: 46px;
                        }
                        td:not(:first-child){
                            text-align: right;
                            padding-right: 20px;
                        }
                    }
                    .mark-tr{
                        font-weight: bold;
                        color: #666666;
                        background: #b2dbff;
                        td:first-child{
                            padding-left: 20px;
                        }
                    }
                    .word-bold{
                        font-weight: bold;
                        color: #666666;
                        td:first-child{
                            padding-left: 34px;
                        }
                    }
                }
                tfoot{
                    tr{
                       background: #61758c;
                        color: #fff;
                        td:first-child{
                            padding-left: 20px;
                        }
                        td:not(:first-child){
                            text-align: right;
                            padding-right: 20px;
                        }
                    }
                }
            }
        }
    }
</style>
