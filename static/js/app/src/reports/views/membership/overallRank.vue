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
        <dd-table :on-change="handleTableChange" :columns="col" :data-source="memberCards"></dd-table>
	</div>
</template>

<script>
    import { DdTable, DdPagination } from 'dd-vue-component';

    export default {
        data() {
            return {
                col: [
                    {
                        title: '序号',
                        dataIndex: ''
                    },
                    {
                        title: '会员卡',
                        dataIndex: ''
                    },
                    {
                        title: '卡号',
                        dataIndex: ''
                    },
                    {
                        title: '姓名',
                        dataIndex: ''
                    },
                    {
                        title: '手机号',
                        dataIndex: ''
                    },
                    {
                        title: '总充值金额',
                        dataIndex: '',
                        sorter: true
                    },
                    {
                        title: '总赠送金额',
                        dataIndex: '',
                        sorter: true
                    },
                    {
                        title: '总消费金额',
                        dataIndex: '',
                        sorter: true
                    },
                    {
                        title: '余额',
                        dataIndex: '',
                        sorter: true
                    }
                ],
                memberCards: []
            };
        },
        methods: {
            search() {
            },
            handleTableChange() {
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
    }
    
</style>

