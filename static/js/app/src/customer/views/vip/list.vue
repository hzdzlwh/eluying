<template>
    <div>
        <div class="search">
            <input type="text" class="dd-input" placeholder="搜索姓名/手机号/证件号/会员卡号">
            <img class="search-icon" ng-click="search()" src="//static.dingdandao.com/vipSearch.png">
        </div>
        <div style="display: flex;flex-direction: row-reverse;margin-bottom: 8px;margin-top: 24px">
            <button class="dd-btn dd-btn-primary">导出明细</button>
            <button class="dd-btn dd-btn-primary" style="margin-right: 8px" @click="openVipForm">新增会员</button>
        </div>
        <dd-table :columns="col" :data-source="vips"></dd-table>
        <div class="foot">
            <span><small>共计</small> {{count}}位会员</span>
            <dd-pagination @currentchange="getVips" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
        </div>
        <vip-form :visible="vipFormVisible"/>
    </div>
</template>
<style scoped>
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
    .search {
        width: 256px;
        position: absolute;
        top: 0;
        right: 0;
    }
    .search-icon {
        position: absolute;
        right: 8px;
        top: 6px;
    }
</style>
<script>
    import { DdTable, DdPagination } from 'dd-vue-component';
    import http from '../../../common/AJAXService';
    import vipForm from '../../components/vipForm.vue';
    export default{
        data() {
            return {
                vips: [],
                pages: 0,
                count: 0,
                pageNo: 1,
                vipFormVisible: false,
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
                        render: (h, row) => <span>{row.idCardNum}</span>,
                        width: 200
                    },
                    {
                        title: '加入日期',
                        render: (h, row) => <span>{row.createTime.split(' ')[0]}</span>
                    },
                    {
                        title: '操作',
                        render: (h, row) => <span>查单</span>,
                        width: 60
                    }
                ]
            }
        },
        created() {
            this.getVips();
        },
        methods: {
            getVips(page) {
                this.pageNo = page ? page : this.page;
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
                            this.pages = Math.ceil(res.data.vipUserListSize / 30);
                        }
                    })
            },
            openVipForm() {
                this.vipFormVisible = true;
            }
        },
        components: {
            DdTable,
            DdPagination,
            vipForm
        }
    }
</script>
