<template>
    <div>
        <div class="date-container">
            <div class="dd-datepicker-container">
                <span>报表日期</span>
                <DdDatepicker v-model="today" :disabled-date="disabledDate" />
                <span> 单位:人民币元</span>
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
                        <tr>
                            
                        </tr>
                    </tbody>
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
                        <tr>
                            
                        </tr>
                    </tbody>
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
                today: undefined
            };
        },
        created() {
            this.today = util.dateFormat(new Date());
            // this.getDailyReportData();
        },
        methods: {
            getDailyReportData() {
                http.get('/stat/getDailyStat', { date: this.today }).then(res => {
                    console.log(res);
                });
            },
            disabledDate(date) {
                return date && date.valueOf() > Date.now();
            },
            exportUrl(type) {
                return '';
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
            }
        }
    }
</style>
