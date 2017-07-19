<template>
    <div>
        <DateSelect/>
        <h2 class="title">{{$route.meta.name}}</h2>
        <div class="top">
            <div class="date">日期 : <i>{{date.startDate}} ~ {{date.endDate}}</i></div>
        </div>
        <dd-table :columns="col" :data-source="vips" :bordered="true" id="table"></dd-table>
        <div class="foot footfix">
            <dd-pagination @currentchange="handlePageChange" :visible-pager-count="6" :show-one-page="false" :age-count="pages" :current-page="pageNo" />
        </div> 
    </div>
</template>
<style lang="scss" scoped>
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
  }
  #table {
    margin-top: 20px;
    max-height: 400px;
    padding-bottom: 12px;
  }
</style>
<script>
    import { DdTable, DdPagination } from 'dd-vue-component';
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
                vips: [],
                vip: {},
                pages: 0,
                pageNo: 1,
                col: [
                    {
                        title: '收款方式',
                        dataIndex: 'payChannel',
                        width: 120
                    },
                    {
                        title: '笔数',
                        dataIndex: 'count',
                        width: 80
                    },
                    {
                        title: '金额',
                        dataIndex: 'amount',
                        width: 80
                    }
                ],
                flag: true
            };
        },
        created() {
            this.getData();
        },
        computed: {
            ...mapState(['date'])
        },
        watch: {
            date() {
                this.pageNo = 1;
                if (this.flag) {
                    this.fetchDate();
                }
            },
            pageNo() {
                if (this.flag) {
                    this.fetchDate();
                }
            }
        },
        components: {
            DateSelect,
            DdTable,
            DdPagination
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
                http.get('/stat/getARSummary', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                })
                .then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.list;
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
                    endDate: this.date.endDate
                };
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                http.get('/stat/getARSummary', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.list || [];
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
