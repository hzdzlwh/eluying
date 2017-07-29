<template>
    <div>
        <p class="report-title">
            AR结算汇总表
        </p>
        <div class="top">
            <div class="date">日期 : <i>{{date.startDate}} ~ {{date.endDate}}</i></div>
            <div :class="collectClass" @click="collectUrl(collectNum)" style="float:right;">
                {{collectName}}
            </div>
        </div>

        <dd-table :columns="col" :data-source="vips" :bordered="true" style="margin:20px 0 10px;"></dd-table>
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
    import { collect } from '../mixin/collect';
    export default {
        mixins: [ collect ],
        props: {
            startDate: String,
            endDate: String
        },
        data() {
            return {
                vips: [],
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
                ]
            };
        },
        beforeRouteEnter (to, from, next) {
            http.get('/stat/getCollection')
                .then(res => {
                    if(res.code === 1) {
                        next(vm => {
                            const collectList = res.data.list;
                            for(let i=0;i<collectList.length;i++){
                                if (collectList[i] === 405) {
                                    vm.collectNum = 1;
                                    vm.collectName = '已收藏';
                                }
                            }
                        })
                    }
                })
        },
        created() {
            this.getData();
            this.collectStat();
        },
        computed: {
            ...mapState(['date'])
        },
        watch: {
            date() {
                this.pageNo = 1;
                this.getData();
            }
        },
        components: {
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
                const obj = {
                    pageNo: this.pageNo,
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
                    }
                });
            }
        }
    };
</script>
