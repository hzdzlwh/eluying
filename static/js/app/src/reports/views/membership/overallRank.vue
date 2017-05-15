<template>
	<div class="overall-rank">
		<div class="header-wrap">
			<div>
                <h4>汇总排名(2016-08-22~2016-08-28)</h4>
            </div>
            <div class="search">
	            <input type="text" class="dd-input" placeholder="搜索姓名/手机号/证件号/会员卡号" @keyup.enter="search" ref="searchInput">
	            <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
                <button class="dd-btn dd-btn-primary">导出Excel</button>
	        </div>
        </div>
        <div>
            <dd-table :on-change="handleTableChange" :columns="col" :data-source="memberCards"></dd-table>
        </div>
        <div class="foot">
            <span><small>共计</small> {{count}}位会员</span>
            <dd-pagination @currentchange="getCards" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
        </div>
	</div>
</template>

<script>
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
                        dataIndex: 'a'
                    },
                    {
                        title: '会员卡',
                        dataIndex: 'b'
                    },
                    {
                        title: '卡号',
                        dataIndex: 'c',
                        width: 300
                    },
                    {
                        title: '姓名',
                        dataIndex: 'd'
                    },
                    {
                        title: '手机号',
                        dataIndex: 'e'
                    },
                    {
                        title: '总充值金额',
                        dataIndex: 'f',
                        sorter: true
                    },
                    {
                        title: '总赠送金额',
                        dataIndex: 'g',
                        sorter: true
                    },
                    {
                        title: '总消费金额',
                        dataIndex: 'h',
                        sorter: true
                    },
                    {
                        title: '余额',
                        dataIndex: 'i',
                        sorter: true
                    }
                ],
                memberCards: [
                    {
                        a: 1,
                        b: '超级白金卡',
                        c: 123456789012345678,
                        d: '啊啊啊',
                        e: 22222222222,
                        f: 99999,
                        g: 99999,
                        h: 10000,
                        i: 10000
                    }
                ]
            };
        },
        methods: {
            search() {
            },
            handleTableChange() {
            },
            getCards() {
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

