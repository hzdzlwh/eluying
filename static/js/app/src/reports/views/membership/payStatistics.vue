<template>
	<div class="pay-statistics">
		<div class="header-wrap">
            <div>
                <h4>支付统计({{this.date.startDate}}~{{this.date.endDate}})</h4>
            </div>
			<div class="search">
	            <input type="text" class="dd-input" placeholder="搜索姓名/手机号/证件号/会员卡号" @keyup.enter="search" ref="searchInput">
	            <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
                <a :href="exportUrl" download><button class="dd-btn dd-btn-primary">导出Excel</button></a>
	        </div>
        </div>
        <div>
            <dd-table :on-change="handleTableChange" :columns="col" :data-source="payStatisticLists"></dd-table>
        </div>
        <div class="foot">
            <span><small>共计</small> {{count}}条记录<small>总支付金额￥</small>{{totalPayAmount}}<small>预收账款支付总额￥</small>{{advanceTotalPayAmount}}<small>赠送金额支付总额￥</small>{{giftTotalPayAmount}}</span>
            <dd-pagination @currentchange="getStatistics" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
        </div>
	</div>
</template>

<script type="text/jsx">
    import { mapState } from 'vuex';
    import http from '../../../common/http';
    import { DdTable, DdPagination } from 'dd-vue-component';

    export default {
        data() {
            return {
                count: 0,
                pages: 0,
                pageNo: 1,
                advanceTotalPayAmount: 0,
                giftTotalPayAmount: 0,
                totalPayAmount: 0,
                searchPattern: '',
                col: [
                    {
                        title: '序号',
                        dataIndex: 'order',
                        width: 56
                    },
                    {
                        title: '会员卡',
                        dataIndex: 'vipCardName',
                        width: 100
                    },
                    {
                        title: '卡号',
                        dataIndex: 'vipCardNum',
                        width: 164
                    },
                    {
                        title: '姓名',
                        dataIndex: 'vipUserName',
                        width: 58
                    },
                    {
                        title: '手机号',
                        dataIndex: 'vipUserPhone',
                        width: 107
                    },
                    {
                        title: '订单号',
                        width: 164,
                        render: (h, row) => <span class="js-order-num">{row.orderNum}</span>
                    },
                    {
                        title: '渠道',
                        dataIndex: 'channelType',
                        width: 58
                    },
                    {
                        title: '支付金额',
                        dataIndex: 'payAmount',
                        width: 108
                    },
                    {
                        title: '预收账款支付',
                        dataIndex: 'advancePayAmount',
                        width: 108
                    },
                    {
                        title: '赠送金额支付',
                        dataIndex: 'giftPayAmount',
                        width: 108
                    },
                    {
                        title: '时间',
                        dataIndex: 'creationTime',
                        width: 135
                    },
                    {
                        title: '操作人员',
                        dataIndex: 'operator',
                        width: 87
                    }
                ],
                payStatisticLists: []
            };
        },
        computed: {
            ...mapState(['date']),
            exportUrl() {
                const paramsObj = {
                    exportType: 0,
                    reportType: 16,
                    params: JSON.stringify({
                        startDate: this.date.startDate,
                        endDate: this.date.endDate
                    })
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            }
        },
        created() {
            this.getStatistics();
        },
        methods: {
            search() {
                this.searchPattern = this.$refs.searchInput.value;
                this.getStatistics();
            },
            handleTableChange() {
            },
            getStatistics(page) {
                this.pageNo = page || this.pageNo;
                const _this = this;
                http.get('/stat/getVipCardPaylogs', {
                    endDate: this.date.endDate,
                    keyword: this.searchPattern,
                    page: this.pageNo,
                    startDate: this.date.startDate
                }).then(res => {
                    if (res.code === 1) {
                        this.payStatisticLists = res.data.items.map((item, index) => {
                            return { ...item, order: _this.pageNo === 1 ? (_this.pageNo - 1) * 30 + (index + 1) : (_this.pageNo - 1) * 30 + index };
                        });
                        this.count = res.data.totalCount;
                        this.advanceTotalPayAmount = res.data.advanceTotalPayAmount;
                        this.giftTotalPayAmount = res.data.giftTotalPayAmount;
                        this.totalPayAmount = res.data.totalPayAmount;
                        this.pages = Math.ceil(res.data.totalCount / 30);
                    }
                });
            }
        },
        watch: {
            date() {
                this.getStatistics();
            }
        },
        components: {
            DdTable,
            DdPagination
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
	.pay-statistics{
        padding-top: 47px;
        .header-wrap{
            display: flex;
            justify-content: space-between;
            margin-bottom: 11px;
            h4{
                font-size: 14px;
                line-height: 25px;
                color: #666666;
            }
        }
        .search{
            position: relative;
            width: 366px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .dd-input{
                width: 256px;
            }
            .search-icon{
                position: absolute;
                right: 116px;
                top: 8px;
                cursor: pointer;
            }
        }
        .foot {
            margin-top: 10px;
            background: #fafafa;
            box-shadow: 0 0 5px 0 rgba(0,0,0,0.15);
            height:45px;
            padding: 0 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            small:not(:first-child){
                margin-left: 18px;
            }
        }
    }
    
</style>

