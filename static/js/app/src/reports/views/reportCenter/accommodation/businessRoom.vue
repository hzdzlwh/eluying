<template>
    <div>
        <div>
            <div><span style="margin-right: 4px">报表日期</span><dd-datepicker :disabledDate="disabledDate" v-model="date"></dd-datepicker></div>
            <div :class="collectClass" @click="collectUrl(collectNum)" style="float:right;margin-left:20px;">
                {{collectName}}
            </div>
            <div style="float:right;margin-left:20px;">
                <dd-dropdown text="导出明细" trigger="click">
                    <!-- <dd-dropdown-item><span><a :href="exportUrl(1)" download>导出PDF</a></span></dd-dropdown-item> -->
                    <dd-dropdown-item><span><a :href="exportUrl(0)" download>导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
        </div>
        <p class="report-title report-business-title">
            <span>客房营业统计表</span>
            <span class="ic">i
                <div class="i">
                    报表说明： <br>
                    1、房费不包含其他消费；<br>
                    2、有效客房数不包含维修房、停用房；<br>
                    3、出租率=间夜量/(总客房数-维修房数-停用房数)；<br>
                    4、平均房价=房费/间夜数；<br>
                    5、合计数据中是否包含自用房、免费房，将根据系统设置进行统计；<br>
                    6、钟点房间夜量按系统设置计算（默认0.5); <br>
                    7、RevPAR=平均房价*出租率，即房均收益。
                </div>
            </span>
        </p>
        <div class="report-business-select">
                <span>
                    统计维度：
                </span>
                <span class="report-business-select-box">
                    <div @click="getCheckData" :class="{active: this.statType === '入住类型'}">入住类型</div>
                    <div @click="getRoomData" :class="{active: this.statType === '房间类型'}">房间类型</div>
                    <div @click="getOriginData" style="border-right:0;" :class="{active: this.statType === '客户来源'}">客户来源</div>
                </span>
            </div>
        <div class="report-select-top">
            <div class="date" style="float:left;line-height:24px;">日期：{{date}}</div>
        </div>
        <div style="display: flex;margin:10px auto;">
            <table style="width: 98px" class="l">
                <thead>
                <tr>
                    <th>分类</th>
                </tr>
                </thead>
                <tbody class="td-body-color">
                <tr>
                    <td>{{statType}}</td>
                </tr>
                <tr v-for="r in dayStat" :class="{b: r.name === '合计'}">
                    <td class="ellipsis">
                        {{r.name}}
                    </td>
                </tr>
                </tbody>
            </table>
            <div style="flex: 1;">
                <table style="width: 100%" class="c">
                    <colgroup>
                        <col width="20%">
                        <col width="20%">
                        <col width="20%">
                        <col width="20%">
                        <col width="20%">
                    </colgroup>
                    <thead>
                    <tr>
                        <th colspan="5">本日</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="td-body-color">
                        <td>间夜量</td>
                        <td>房费</td>
                        <td>平均房价</td>
                        <td>出租率</td>
                        <td>RevPAR</td>
                    </tr>
                    <tr v-for="r in dayStat" :class="{b: r.name === '合计'}">
                        <td>{{r.night}}</td>
                        <td>{{r.fee}}</td>
                        <td>{{r.avg}}</td>
                        <td>{{r.rate}}</td>
                        <td>{{r.revPAR}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div style="flex: 1">
                <table style="width: 100%" class="r">
                    <colgroup>
                        <col width="20%">
                        <col width="20%">
                        <col width="20%">
                        <col width="20%">
                        <col width="20%">
                    </colgroup>
                    <thead>
                    <tr>
                        <th colspan="5">本月</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="td-body-color">
                        <td>间夜量</td>
                        <td>房费</td>
                        <td>平均房价</td>
                        <td>出租率</td>
                        <td>RevPAR</td>
                    </tr>
                    <tr v-for="r in monStat" :class="{b: r.name === '合计'}">
                        <td>{{r.night}}</td>
                        <td>{{r.fee}}</td>
                        <td>{{r.avg}}</td>
                        <td>{{r.rate}}</td>
                        <td>{{r.revPAR}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .report-business-title {
        display:flex;
        justify-content:center;
    }
    .report-business-select {
        height: 26px;
        margin:-20px auto -5px;
        display:flex;
        justify-content:center;
        align-items:center;
        color: #999999;
        font-size: 12px;
        .report-business-select-box {
            background:#ffffff;
            border:1px solid #d9d9d9;
            border-radius:4px;
            line-height:26px;
            width:166px;
            display:flex;
            justify-content:space-between;
            overflow:hidden;
            div {
                flex:1;
                text-align:center;
                border-right:1px solid #d9d9d9;
                cursor:pointer;
            }
            div:hover {
                color: #178ce6;
            }
            div.active {
                color:#ffffff;
                background:#178ce6;
            }
        }
    }
    .td-body-color {
        background:#eee;
    }
    th {
        background:#60758d;
        color: #fff;
    }
    th, td {
        height:32px;
        border:1px solid #e6e6e6;
    }
    .l {
        td, th {
            padding-left: 14px;
            max-width: 98px;
        }
    }
    .c, .r {
        td, th {
            text-align: center;
        }
    }
    .ic {
        line-height: 14px;
        border:1px solid #178ce6;
        border-radius:2px;
        width:14px;
        height:14px;
        display: inline-block;
        font-size: 12px;
        position: relative;
    }
    .i {
        display: none;
        position: absolute;
        top: 18px;
        left: 0;
        font-size:12px;
        color:#666666;
        line-height:18px;
        background:#fafafa;
        box-shadow:0 0 5px 0 rgba(0,0,0,0.15);
        width:384px;
        text-align: left;
        padding: 8px;
        font-weight: normal;
    }
    .ic:hover .i {
        display: block;
    }
    .b {
        font-weight: bold;
    }
</style>
<script>
    import { DdDatepicker, DdDropdown, DdDropdownItem } from 'dd-vue-component';
    import http from 'http';
    import util from 'util';
    import { collect } from '../mixin/collect';
    export default {
        mixins: [collect],
        data() {
            return {
                date: '',
                statType: '入住类型',
                dayStat: [],
                monStat: []
            };
        },
        created() {
            const prevDate = this.prevDate(new Date());
            this.date = util.dateFormat(prevDate);
            this.collectStat();
        },
        watch: {
            date() {
                this.getCheckData();
            }
        },
        components: {
            DdDatepicker,
            DdDropdown,
            DdDropdownItem
        },
        beforeRouteEnter(to, from, next) {
            http.get('/stat/getCollection')
                .then(res => {
                    if (res.code === 1) {
                        next(vm => {
                            const collectList = res.data.list;
                            for (let i = 0; i < collectList.length; i ++) {
                                if (collectList[i] === 19) {
                                    vm.collectNum = 1;
                                    vm.collectName = '已收藏';
                                }
                            }
                        });
                    }
                });
        },
        methods: {
            prevDate(date) {
                const d = date.getDate();
                return new Date(date.setDate(d - 1));
            },
            collectUrl(num) {
                if (num === 0) {
                    http.get('/stat/addToCollect', { statValue: 19 }).then(res => {
                        this.collectNum = 1;
                        this.collectName = '已收藏';
                    });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection', { statValue: 19 }).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 19) {
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
                const originParam = {
                    date: this.date
                };
                const paramsObj = {
                    exportType: type,
                    reportType: 19,
                    params: JSON.stringify(originParam)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            disabledDate(date) {
                return util.DateDiff(date, new Date()) < 1;
            },
            getCheckData() {
                http.get('/stat/getRoomDailyStat', { date: this.date }).then(res => {
                    if (res.code === 1) {
                        this.statType = '入住类型';
                        this.dayStat = res.data.checkTypeDayStat;
                        this.monStat = res.data.checkTypeMonStat;
                    }
                });
            },
            getRoomData() {
                http.get('/stat/getRoomDailyStat', { date: this.date }).then(res => {
                    if (res.code === 1) {
                        this.statType = '房间类型';
                        this.dayStat = res.data.roomTypeDayStat;
                        this.monStat = res.data.roomTypeMonStat;
                    }
                });
            },
            getOriginData() {
                http.get('/stat/getRoomDailyStat', { date: this.date }).then(res => {
                    if (res.code === 1) {
                        this.statType = '客户来源';
                        this.dayStat = res.data.originDayStat;
                        this.monStat = res.data.originMonStat;
                    }
                });
            }
        }
    };
</script>
