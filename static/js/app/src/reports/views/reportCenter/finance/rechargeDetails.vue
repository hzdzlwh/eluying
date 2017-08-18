<template>
    <div>
        <p class="report-title">
            充值明细表
        </p>
        <div class="report-select-top">
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
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="channelId" >
                        <dd-option :key="item.id" v-for="item in channels" :value="item.id" :label="item.name"></dd-option>
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
        <dd-table :columns="col" :data-source="vips" :bordered="true" style="margin:20px 0 10px;"></dd-table>
        <div class="report-center-foot">
            <div style="float:left;">
                <span class="report-center-span">总充值笔数 : <b> {{receiptNum}}</b></span>
                <span class="report-center-span">总充值金额 : <b> {{receiptFree}}</b></span>
                <span class="report-center-span">总赠送金额 : <b> {{priceFree}}</b></span>
            </div>
            <dd-pagination @currentchange="handlePageChange" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" class="report-center-pagination"/>
        </div>
    </div>
</template>
<style lang='scss' scoped>
</style>
<script>
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption, DdGroupOption } from 'dd-vue-component';
    import http from 'http';
    import { mapState } from 'vuex';
    import { collect } from '../mixin/collect';
    import pagination from '../mixin/pagination';
    import { getChannelType, getMemberType, getCategoryType } from '../mixin/selectType';
    export default {
        mixins: [pagination, collect, getChannelType, getMemberType, getCategoryType],
        props: {
            startDate: String,
            endDate: String
        },
        data() {
            return {
                vips: [],
                receiptNum: 0,
                priceFree: 0,
                receiptFree: 0,
                col: [
                    {
                        title: '类型',
                        dataIndex: 'type',
                        width: 80
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
                        width: 100
                    },
                    {
                        title: '赠送金额',
                        dataIndex: 'freePrice',
                        width: 100
                    },
    
                    {
                        title: '充值时间',
                        dataIndex: 'creationTime',
                        width: 120
                    },
                    {
                        title: '付款方式',
                        dataIndex: 'channel',
                        width: 100
                    },
                    {
                        title: '操作人',
                        dataIndex: 'operator',
                        width: 100
                    }
                ]
            };
        },
        components: {
            DdTable,
            DdPagination,
            DdDropdown,
            DdDropdownItem,
            DdSelect,
            DdOption,
            DdGroupOption
        },
        watch: {
            date() {
                this.pageNo = 1;
                this.getData();
            }
        },
        beforeRouteEnter(to, from, next) {
            http.get('/stat/getCollection')
                .then(res => {
                    if (res.code === 1) {
                        next(vm => {
                            const collectList = res.data.list;
                            for (let i = 0; i < collectList.length; i ++) {
                                if (collectList[i] === 305) {
                                    vm.collectNum = 1;
                                    vm.collectName = '已收藏';
                                }
                            }
                        });
                    }
                });
        },
        created() {
            this.getChannels();
            this.getData();
            this.collectStat();
        },
        computed: {
            ...mapState(['date'])
        },
        methods: {
            collectUrl(num) {
                if (num === 0) {
                    http.get('/stat/addToCollect', { statValue: 305 }).then(res => {
                        this.collectNum = 1;
                        this.collectName = '已收藏';
                    });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection', { statValue: 305 }).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 305) {
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
                const obj = {
                    pageNum: this.pageNo,
                    categoryId: this.categoryType.split('~')[1],
                    startDate: this.date.startDate,
                    toDate: this.date.endDate
                };
                if (this.type !== -1) {
                    obj.type = this.type;
                };
                if (this.channelId !== 'ALL') {
                    obj.payChannel = this.channelId;
                };
                // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                const paramsObj = {
                    exportType: type,
                    reportType: 305,
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
                    pageNum: this.pageNo,
                    categoryId: this.categoryType.split('~')[1],
                    startDate: this.date.startDate,
                    toDate: this.date.endDate
                };
                if (this.type !== -1) {
                    obj.type = this.type;
                };
                if (this.channelId !== 'ALL') {
                    obj.payChannel = this.channelId;
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
                        this.pages = Math.ceil(res.data.total / 30);
                    }
                    this.flag = true;
                });
            }
        }
    };
</script>
