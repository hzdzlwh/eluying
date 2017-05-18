<template>
	<div class="pay-statistics">
		<div class="header-wrap">
            <div>
                <h4>支付统计(2016-08-22~2016-08-28)</h4>
            </div>
			<div class="search">
	            <input type="text" class="dd-input" placeholder="搜索姓名/手机号/证件号/会员卡号" @keyup.enter="search" ref="searchInput">
	            <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
                <button class="dd-btn dd-btn-primary">导出Excel</button>
	        </div>
        </div>
        <div>
            <dd-table :on-change="handleTableChange" :columns="col" :data-source="payStatisticLists"></dd-table>
        </div>
        <div class="foot">
            <span><small>共计</small> {{count}}条记录</span>
            <dd-pagination @currentchange="getLists" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
        </div>
	</div>
</template>

<script type="text/jsx">
    import { DdTable, DdPagination } from 'dd-vue-component';

    export default {
        data() {
            return {
                count: 20,
                pages: 5,
                pageNo: 1,
                col: [
                    {
                        title: '序号',
                        dataIndex: 'a',
                        width: 56
                    },
                    {
                        title: '会员卡',
                        dataIndex: 'b',
                        width: 100
                    },
                    {
                        title: '卡号',
                        dataIndex: 'c',
                        width: 164
                    },
                    {
                        title: '姓名',
                        dataIndex: 'd',
                        width: 58
                    },
                    {
                        title: '手机号',
                        dataIndex: 'e',
                        width: 107
                    },
                    {
                        title: '订单号',
                        width: 164,
                        render: (h, row) => <span class="js-order-num">{row.f}</span>
                    },
                    {
                        title: '渠道',
                        dataIndex: 'g',
                        width: 58
                    },
                    {
                        title: '支付金额',
                        dataIndex: 'h',
                        width: 108
                    },
                    {
                        title: '预收账款支付',
                        dataIndex: 'i',
                        width: 108
                    },
                    {
                        title: '赠送金额支付',
                        dataIndex: 'j',
                        width: 108
                    },
                    {
                        title: '时间',
                        dataIndex: 'k',
                        width: 135
                    },
                    {
                        title: '操作人员',
                        dataIndex: 'l',
                        width: 87
                    }
                ],
                payStatisticLists: [
                    {
                        a: 1,
                        b: '超级白金卡',
                        c: 112345678912345678,
                        d: '斤斤计',
                        e: 12345678901,
                        f: 330009999999999999,
                        g: '门店',
                        h: 99999,
                        i: 2222,
                        j: 99999,
                        k: '2017-09-04 15:00',
                        l: '那是是'
                    }
                ]
            };
        },
        methods: {
            search() {
            },
            handleTableChange() {
            },
            getLists() {
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

