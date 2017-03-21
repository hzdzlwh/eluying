<template>
    <div>
        <div><input type="text"></div>
        <div>
            <button>新增会员</button>
            <button>导出明细</button>
        </div>
        <dd-table :columns="col" :data-source="vips"></dd-table>
        <div>
            <span>共计</span>
            <dd-pagination></dd-pagination>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import { DdTable, DdPagination } from 'dd-vue-component';
    import http from '../../../common/AJAXService';
    export default{
        data() {
            return {
                vips: [],
                count: 0,
                pageNo: 1,
                col: [
                    {
                        title: '姓名',
                        dataIndex: 'name'
                    },
                    {
                        title: '会员等级',
                        dataIndex: 'levelName'
                    },
                    {
                        title: '会员卡号',
                        dataIndex: 'vipCardNum'
                    },
                    {
                        title: '手机号',
                        dataIndex: 'phone'
                    },
                    {
                        title: '消费金额',
                        dataIndex: 'entireTotalConsume'
                    },
                    {
                        title: '累计金额',
                        dataIndex: 'totalConsume'
                    },
                    {
                        title: '证件号',
                        render: (h, row) => <span>{row.idCardNum}</span>
                    },
                    {
                        title: '加入日期',
                        render: (h, row) => <span>{row.createTime.split(' ')[0]}</span>
                    },
                    {
                        title: '操作',
                        render: (h, row) => <span>查单</span>
                    }
                ]
            }
        },
        created() {
            this.getVips();
        },
        methods: {
            getVips() {
                http.get('/vipUser/getVipUserListPC', {
                    pageNo: this.pageNo,
                    searchPattern: this.searchPattern,
                    sortColumn: this.sortColumn,
                    sortType: this.sortType
                })
                    .then(res => {
                        if (res.code === 1) {
                            this.vips = res.data.vipUserList;
                            this.count = res.data.vipUserListSize;
                        }
                    })
            }
        },
        components: {
            DdTable,
            DdPagination
        }
    }
</script>
