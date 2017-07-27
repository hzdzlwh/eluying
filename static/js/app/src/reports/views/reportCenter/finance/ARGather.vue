<template>
    <div>
        <p style="font-weight: bold;font-size:24px;color:#178ce6;text-align:center;margin: 20px 0 26px">
            AR结算汇总表
        </p>
        <div class="top">
            <div class="date">日期 : <i>{{date.startDate}} ~ {{date.endDate}}</i></div>
            <div :class="collectClass" @click="collectUrl(collectNum)" style="float:right;">
                {{collectName}}
            </div>
        </div>

        <dd-table :columns="col" :data-source="vips" :bordered="true" style="margin:20px 0 10px;"></dd-table>
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
                collectNum: 0,
                collectName: '加入收藏',
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
            collectUrl(num) {
                if (num === 0) {
                    http.get('/stat/addToCollect',{statValue: 405}).then(res => {
                        this.collectNum = 1;
                        this.collectName = '已收藏';
                    });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection',{statValue: 405}).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 405) {
                                removeIndex = index;
                            }
                        });
                        this.$router.options.routes[2].children[0].children.splice(removeIndex , 1);
                        if (this.$router.options.routes[2].children[0].children.length > 1) {
                            this.$router.push('/reportCenter/collect/' + this.$router.options.routes[2].children[0].children[1].meta.id);
                        } else {
                            this.$router.push('/reportCenter/collect/');
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
                                if (collectList[i] === 405) {
                                    this.collectNum = 1;
                                    this.collectName = '已收藏';
                                }
                            }
                        }
                    })
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
