<template>
	<div class="deal-detail">
		<div class="header-wrap">
			<div>
                <h4>交易明细({{this.date.startDate}}~{{this.date.endDate}})</h4>         
            </div>
            <div class="search">
	            <input type="text" class="dd-input" placeholder="搜索姓名/手机号/证件号/会员卡号" @keyup.enter="search" ref="searchInput">
	            <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
                <a :href="exportUrl" download><button class="dd-btn dd-btn-primary">导出Excel</button></a>
	        </div>
        </div>
        <div>
            <dd-table :on-change="handleTableChange" :columns="col" :data-source="dealDetailList"></dd-table>
        </div>
        <div class="foot">
            <span><small>共计</small> {{count}}条记录</span>
            <dd-pagination @currentchange="getDealDetails" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
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
                pageNo: 1,
                pages: 0,
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
                        title: '渠道',
                        dataIndex: 'channelType'
                    },
                    {
                        title: '类型',
                        dataIndex: 'type'
                    },
                    {
                        title: '金额',
                        dataIndex: 'amount'
                    },
                    {
                        title: '时间',
                        dataIndex: 'creationTime',
                        width: 135
                    },
                    {
                        title: '操作人员',
                        dataIndex: 'operator'
                    }
                ],
                dealDetailList: []
            };
        },
        computed: {
            ...mapState(['date']),
            exportUrl() {
                const paramsObj = {
                    exportType: 0,
                    reportType: 15,
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
            this.getDealDetails();
        },
        methods: {
            search() {
                this.searchPattern = this.$refs.searchInput.value;
                this.getDealDetails();
            },
            getDealDetails(page) {
                this.pageNo = page || this.pageNo;
                const _this = this;
                http.get('/stat/getVipCardWalletDetails', {
                    endDate: this.date.endDate,
                    keyword: this.searchPattern,
                    page: this.pageNo,
                    startDate: this.date.startDate
                }).then(res => {
                    if (res.code === 1) {
                        this.dealDetailList = res.data.items.map((item, index) => {
                            return { ...item, order: (_this.pageNo - 1) * 30 + (index + 1) };
                        });
                        this.pages = Math.ceil(res.data.totalCount / 30);
                        this.count = res.data.totalCount;
                    }
                });
            },
            handleTableChange() {
            }
        },
        watch: {
            date() {
                this.getDealDetails();
            }
        },
        components: {
            DdTable,
            DdPagination
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
	.deal-detail{
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
        }
    }
</style>

