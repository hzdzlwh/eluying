<template>
    <div>
        <div class="date-container">
            <div class="dd-datepicker-container">
                <span>报表日期</span>
                <DdDatepicker v-model="today" :disabled-date="disabledDate" />
                <span style="margin-left: 10px;"> 单位:人民币元</span>
            </div>
            <div>
                <dd-dropdown text="导出明细" trigger="click">
                    <dd-dropdown-item><span><a :href="exportUrl(1)">导出PDF</a></span></dd-dropdown-item>
                    <dd-dropdown-item><span><a :href="exportUrl(0)">导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
        </div>
        <div class="content">
            <div class="title">
                <h2>营业日报表</h2>
            </div>
            <div class="table-container">
                <table class="daily-table" border="1">
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
                        <tr class="mark-tr">
                            <td>收银</td>
                            <td>{{debit.payments.dailyTotal}}</td>
                            <td>{{debit.payments.monthlyTotal}}</td>
                        </tr>
                        <tr v-for="item in debit.payments.items">
                            <td>{{item.name}}</td>
                            <td>{{item.dailyAmount}}</td>
                            <td>{{item.monthlyAmount}}</td>
                        </tr>
                        <tr class="mark-tr">
                            <td>收银</td>
                            <td>{{debit.enterpriseCityledger.dailyTotal}}</td>
                            <td>{{debit.enterpriseCityledger.monthlyTotal}}</td>
                        </tr>
                        <tr v-for="item in debit.enterpriseCityledger.items">
                            <td>{{item.name}}</td>
                            <td>{{item.dailyAmount}}</td>
                            <td>{{item.monthlyAmount}}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>借方合计</td>
                            <td>{{debit.summary.dailyTotal}}</td>
                            <td>{{debit.summary.monthlyTotal}}</td>
                        </tr>
                    </tfoot>
                </table>
                <table class="daily-table" border="1">
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
                        <tr class="mark-tr">
                            <td>住宿</td>
                            <td>{{credit.accommodation.dailyTotal}}</td>
                            <td>{{credit.accommodation.monthlyTotal}}</td>
                        </tr>
                        <tr v-for="item in credit.accommodation.items">
                            <td>{{item.name}}</td>
                            <td>{{item.dailyAmount}}</td>
                            <td>{{item.monthlyAmount}}</td>
                        </tr>
                        <tr class="mark-tr">
                            <td>餐饮</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-for="item in credit.cater.items">
                            <td>{{item.name}}</td>
                            <td>{{item.dailyAmount}}</td>
                            <td>{{item.monthlyAmount}}</td>
                        </tr>
                        <tr class="mark-tr">
                            <td>娱乐</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-for="item in credit.entertainment.items">
                            <td>{{item.name}}</td>
                            <td>{{item.dailyAmount}}</td>
                            <td>{{item.monthlyAmount}}</td>
                        </tr>
                        <tr class="mark-tr">
                            <td>商超</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-for="item in credit.goods.items">
                            <td>{{item.name}}</td>
                            <td>{{item.dailyAmount}}</td>
                            <td>{{item.monthlyAmount}}</td>
                        </tr>
                        <tr class="mark-tr">
                            <td>会员卡</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr class="mark-tr">
                            <td>保险</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr class="mark-tr">
                            <td>预付款</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>贷方合计</td>
                            <td>{{credit.summary.dailyTotal}}</td>
                            <td>{{credit.summary.monthlyTotal}}</td>
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
                today: undefined,
                credit: {
                    accommodation: Object,
                    advancePayment: Object,
                    cater: Object,
                    entertainment: Object,
                    goods: Object,
                    insurance: Object,
                    vipCard: Object,
                    summary: Object
                },
                debit: {
                    enterpriseCityledger: Object,
                    payments: Object,
                    summary: Object
                }
            };
        },
        created() {
            this.today = util.dateFormat(new Date());
            this.getDailyReportData();
        },
        methods: {
            getDailyReportData() {
                http.get('/stat/getDailyStat', { date: this.today }).then(res => {
                    if (res.code === 1) {
                        this.credit.accommodation = res.data.credit.accommodation;
                        this.credit.advancePayment = res.data.credit.advancePayment;
                        this.credit.cater = res.data.credit.cater;
                        this.credit.entertainment = res.data.credit.entertainment;
                        this.credit.goods = res.data.credit.goods;
                        this.credit.insurance = res.data.credit.insurance;
                        this.credit.vipCard = res.data.credit.vipCard;
                        this.credit.summary = res.data.credit.summary;
                        this.debit.payments = res.data.debit.payments;
                        this.debit.enterpriseCityledger = res.data.debit.enterpriseCityledger;
                        this.debit.summary = res.data.debit.summary;
                    }
                });
            },
            disabledDate(date) {
                return date && date.valueOf() > Date.now();
            },
            exportUrl(type) {
                return '';
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
            .daily-table{
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
