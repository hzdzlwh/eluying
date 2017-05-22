<template>
	<div class="overall-rank">
		<div class="header-wrap">
			<div>
                <h4>汇总排名(2016-08-22~2016-08-28)</h4>
            </div>
            <div class="search">
	            <input type="text" class="dd-input" placeholder="搜索姓名/手机号/证件号/会员卡号" @keyup.enter="search" ref="searchInput">
	            <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
                <a :href="exportUrl" download><button class="dd-btn dd-btn-primary">导出Excel</button></a>
	        </div>
        </div>
        <div>
            <dd-table :on-change="handleTableChange" :columns="col" :data-source="memberCards"></dd-table>
        </div>
        <div class="foot">
            <span><small>共计</small> {{count}}位会员</span>
            <dd-pagination @currentchange="getVipCards" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
        </div>
	</div>
</template>

<script>
    import { mapState } from 'vuex';
    import http from '../../../common/http';
    import { DdTable, DdPagination } from 'dd-vue-component';

    export default {
        data() {
            return {
                searchPattern: undefined,
                count: 0,
                pages: 0,
                pageNo: 1,
                col: [
                    {
                        title: '序号',
                        dataIndex: 'order',
                        width: 56
                    },
                    {
                        title: '会员卡',
                        dataIndex: 'vipCardName'
                    },
                    {
                        title: '卡号',
                        dataIndex: 'vipCardNum',
                        width: 164
                    },
                    {
                        title: '姓名',
                        dataIndex: 'vipUserName'
                    },
                    {
                        title: '手机号',
                        dataIndex: 'vipUserPhone',
                        width: 107
                    },
                    {
                        title: '总充值金额',
                        dataIndex: 'totalRechargeAmount',
                        sorter: true
                    },
                    {
                        title: '总赠送金额',
                        dataIndex: 'totalGiftAmount',
                        sorter: true
                    },
                    {
                        title: '总消费金额',
                        dataIndex: 'totalConsumeAmount',
                        sorter: true
                    },
                    {
                        title: '余额',
                        dataIndex: 'balanceAmount',
                        sorter: true
                    }
                ],
                memberCards: []
            };
        },
        computed: {
            ...mapState(['date']),
            exportUrl() {
                const paramsObj = {
                    exportType: 0,
                    reportType: 14,
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
            this.getVipCards();
        },
        methods: {
            getVipCards(page) {
                this.pageNo = page || this.pageNo;
                const _this = this;
                http.get('/stat/getVipCardSummary', {
                    endDate: this.date.endDate,
                    keyword: this.searchPattern,
                    page: this.pageNo,
                    sortColumn: this.sortColumn,
                    startDate: this.date.startDate,
                    sortDirection: this.sortType === 0 ? 'asc' : 'desc'
                }).then(res => {
                    if (res.code === 1) {
                        this.memberCards = res.data.items.map((item, index) => {
                            return { ...item, order: _this.pageNo === 1 ? (_this.pageNo - 1) * 30 + (index + 1) : (_this.pageNo - 1) * 30 + index };
                        });
                        this.count = res.data.totalCount;
                        this.pages = Math.ceil(res.data.totalCount / 30);
                    }
                });
            },
            search() {
                this.searchPattern = this.$refs.searchInput.value;
                this.pageNo = 1;
                this.getVipCards();
            },
            handleTableChange(data) {
                this.pageNo = 1;
                this.sortColumn = data.sortField;
                this.sortType = data.sortType;
                this.getVipCards();
            }
        },
        watch: {
            date() {
                this.getVipCards();
            }
        },
        components: {
            DdTable,
            DdPagination
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
	.overall-rank{
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
                right: 8px;
                top: 6px;
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
        }
    }
    
</style>

