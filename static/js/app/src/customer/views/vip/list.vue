<template>
    <div>
        <div class="search">
            <input type="text" class="dd-input" placeholder="搜索姓名/手机号/证件号/会员卡号" @keyup.enter="search" ref="searchInput">
            <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
        </div>
        <div style="display: flex;flex-direction: row-reverse;margin-bottom: 8px;margin-top: 24px">
            <a :href="outPutExcel()"><button class="dd-btn dd-btn-primary" >导出明细</button></a>
            <button class="dd-btn dd-btn-primary" style="margin-right: 8px" @click="openVipForm">新增会员</button>
        </div>
        <dd-table :on-change="handleTableChange" :columns="col" :data-source="vips"></dd-table>
        <div class="foot">
            <span><small>共计</small> {{count}}位会员</span>
            <dd-pagination @currentchange="getVips" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
        </div>
        <vip-form :vip="vip" @onSuccess="getVips" />
        <detail :tab="detailTab" :id="detailId" type="vip" :title="detailTitle">
            <div></div>
        </detail>
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
<script type="text/babel">
    import { DdTable, DdPagination } from 'dd-vue-component';
    import http from '../../../common/AJAXService';
    import vipForm from '../../components/vipForm.vue';
    import util from '../../../common/util';
    import detail from '../../components/detail.vue';
    const idCardType = [
        '身', '军', '通', '护', '其'
    ];

    export default{
        data() {
            return {
                vips: [],
                vip: {},
                pages: 0,
                count: 0,
                pageNo: 1,
                vipFormVisible: false,
                searchPattern: undefined,
                col: [
                    {
                        title: '姓名',
                        dataIndex: 'name'
                    },
                    {
                        title: '会员等级',
                        dataIndex: 'levelName',
                        sorter: true
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
                        dataIndex: 'entireTotalConsume',
                        sorter: true
                    },
                    {
                        title: '累计金额',
                        dataIndex: 'totalConsume',
                        sorter: true
                    },
                    {
                        title: '证件号',
                        render: (h, row) => <span>{row.idCardNum}{row.idCardType !== null && <span class="idcard-icon">{idCardType[row.idCardType]}</span>}</span>,
                        width: 200
                    },
                    {
                        title: '加入日期',
                        render: (h, row) => <span>{row.createTime.split(' ')[0]}</span>,
                        sorter: true
                    },
                    {
                        title: '操作',
                        render: (h, row) => <span class="list-action-button" onClick={() => this.openDetailDialog(row, 2)}>查单</span>,
                        width: 60
                    }
                ],
                detailTab: undefined,
                detailId: undefined,
                detailTitle: undefined
            };
        },
        created() {
            this.getVips();
        },
        methods: {
            getVips(page) {
                this.pageNo = page || this.pageNo;
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
                    });
            },
            openVipForm() {
                $('#vipForm').modal('show');
            },
            outPutExcel() {
                const campId = localStorage.getItem('campId');
                const uid = localStorage.getItem('uid');
                const host = http.getUrl2('/vipUser/vipUserListToExcel');
                const url = host + '?' + 'campId=' + campId + '&uid=' + uid + '&terminal=1&version=10&timestamp=' + (new Date()).valueOf() + '&sign=' + util.getSign();
                return url;
            },
            search() {
                this.searchPattern = this.$refs.searchInput.value;
                this.pageNo = 1;
                this.getVips();
            },
            handleTableChange(data) {
                this.pageNo = 1;
                this.sortColumn = data.sortField;
                this.sortType = data.sortType;
                this.getVips();
            },
            getIdCardIcon(num) {
                return this.idCardList[num].label.substring(0, 1);
            },
            openDetailDialog(vip, tab) {
                this.detailTab = tab;
                this.detailId = vip.vipUserId;
                this.detailTitle = vip.name;
                $('#detailModal').modal('show');
            }
        },
        components: {
            DdTable,
            DdPagination,
            vipForm,
            detail
        }
    };
</script>
