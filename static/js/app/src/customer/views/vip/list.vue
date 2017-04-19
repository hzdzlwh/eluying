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
        <vip-form :vip-props="vip" @onSuccess="getVips" />
        <detail
            :tab="detailTab"
            :id="detailId"
            type="vip"
            :title="detailTitle"
            :visible="detailVisible"
            :onClose="handleDetailClose"
            :onDelete="deleteVip"
            :onEdit="openEdit"
        >
            <div class="vip-detail-container">
                <div style="margin-right: 75px;width: 250px">
                    <div class="vip-detail-row">
                        <span class="vip-detail-filed">手机号</span>
                        <span>{{vip.phone}}</span>
                    </div>
                    <div class="vip-detail-row">
                        <span class="vip-detail-filed">会员等级</span>
                        <span>{{vip.levelName}}</span>
                        <div v-if="vip.levelName !== '—' && vip.consumeAndDiscount  && vip.consumeAndDiscount.length > 0" class="tip-img-container">
                            <img src="/static/image/modal/room_modal_info.png" >
                            <div class="vip-leavelUpgrade-tip">
                                <div>
                                    {{vip.levelName}}
                                </div>
                                <div v-for="item in vip.consumeAndDiscount" class="discount-item">
                                    <span>{{item.name}}</span>
                                    <span>{{item.discount}}折</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="vip-detail-row">
                        <span class="vip-detail-filed">会员卡号</span>
                        <span>{{vip.vipCardNum}}</span>
                    </div>
                    <div class="vip-detail-row">
                        <span class="vip-detail-filed">证件号</span>
                        <span>{{vip.idCardNum}}</span>
                    </div>
                    <div class="vip-detail-row">
                        <span class="vip-detail-filed">地区</span>
                        <span>{{(vip.province || '') + (vip.city || '') + (vip.county || '')}}</span>
                    </div>
                    <div class="vip-detail-row">
                        <span class="vip-detail-filed">生日</span>
                        <span>{{vip.birthday}}</span>
                    </div>
                    <div class="vip-detail-row">
                        <span class="vip-detail-filed">性别</span>
                        <span>{{['男', '女'][vip.gender]}}</span>
                    </div>
                    <div class="vip-detail-row">
                        <span class="vip-detail-filed">邮箱</span>
                        <span style="flex: 1;word-break: break-all;">{{vip.email}}</span>
                    </div>
                </div>
                <div style="width:350px">
                    <div class="vip-detail-row" style="display: block">
                        <div style="display: flex; margin-bottom: 12px">
                            <span class="vip-detail-filed">累计金额</span>
                            <span>¥{{vip.totalConsume}}</span>
                            <div class="tip-img-container" v-if="vip.isAutoUpgrade === 1 && vip.nextVipLevelName">
                                <img src="/static/image/modal/room_modal_info.png" >
                                <div class="vip-leavelUpgrade-tip">
                                    <div>升级下一级别还需在以下项目消费{{vip.upgradeFee}}元</div>
                                    <div>{{vip.vipConsumeList.join('、')}}</div>
                                </div>
                            </div>
                        </div>
                        <i>成为会员之后对相关业态的累计消费金额（不含违约金）</i>
                    </div>
                    <div class="vip-detail-row">
                        <span class="vip-detail-filed">消费金额</span>
                        <span>¥{{vip.entireTotalConsume}}</span>
                    </div>
                    <div class="vip-detail-row">
                        <span class="vip-detail-filed">创建时间</span>
                        <span>{{vip.creationTime}}</span>
                    </div>
                    <div class="vip-detail-row">
                        <span class="vip-detail-filed">创建人</span>
                        <span>{{vip.operatorName}}</span>
                    </div>
                    <div class="vip-detail-row">
                        <span class="vip-detail-filed">创建渠道</span>
                        <span>{{vip.vipChannel}}</span>
                    </div>
                    <div class="vip-detail-row">
                        <span class="vip-detail-filed">备注</span>
                        <span style="flex: 1">{{vip.remark}}</span>
                    </div>
                </div>
            </div>
        </detail>
    </div>
</template>
<style lang="scss" scoped>
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
    .vip-detail-container {
        display: flex;
        .vip-detail-row {
            margin-bottom: 24px;
            display: flex;
        }
        .vip-detail-filed {
            text-align: right;
            width: 56px;
            margin-right: 9px;
            display: inline-block;
        }
        .vip-leavelUpgrade-tip {
            position: absolute;
            display: none;
            width: 200px;
            background: #fafafa;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
            border-radius: 2px;
            z-index: 10;
            div:first-child {
                padding: 8px 16px;
                color: #666666;
                font-size: 16px;
                border-bottom: 1px solid #e6e6e6;
            }
            div:last-child {
                padding: 8px 16px;
                font-size: 14px;
                color: #999999;
            }
            .discount-item {
                padding: 8px 16px;
                font-size: 14px;
                color: #999999;
                display: flex;
                justify-content: space-between;
            }
        }
        .tip-img-container {
            position: relative;
            margin-left: 9px;
            &:hover {
                .vip-leavelUpgrade-tip {
                    display: block;
                }
            }
        }
    }
</style>
<script type="text/babel">
    import { DdTable, DdPagination } from 'dd-vue-component';
    import http from '../../../common/http';
    import vipForm from '../../components/vipForm.vue';
    import util from '../../../common/util';
    import detail from '../../components/detail.vue';
    import modal from '../../../common/modal';
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
                searchPattern: undefined,
                detailVisible: false,
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
                        render: (h, row) =>
                            <span>
                                <span class="list-action-button" onClick={() => this.openDetailDialog(row, 1)}>详情</span>／
                                <span class="list-action-button" onClick={() => this.openDetailDialog(row, 2)}>查单</span>
                            </span>,
                        width: 100
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
                this.vip = { name: '', phone: '', idCardType: 0, vipLevelId: '', gender: undefined, birthday: undefined };
                $('#vipForm').modal('show');
            },
            outPutExcel() {
                const campId = localStorage.getItem('campId');
                const uid = localStorage.getItem('uid');
                const host = http.getUrl('/vipUser/vipUserListToExcel');
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
                this.getVipDetail(vip.vipUserId);
                this.detailTab = tab;
                this.detailId = vip.vipUserId;
                this.detailTitle = vip.name;
                this.detailVisible = true;
            },
            getVipDetail(id) {
                http.get('/vipUser/getVipUserDetailInfoPC', { vipUserId: id })
                    .then(res => {
                        if (res.code === 1) {
                            this.vip = res.data.vipUserDetailInfoResp;
                            Object.assign(this.vip, res.data);
                            delete this.vip.vipUserDetailInfoResp;
                        } else {
                            modal.alert(res.msg);
                        }
                    });
            },
            handleDetailClose() {
                this.detailVisible = false;
            },
            openEdit() {
                this.handleDetailClose();
                $('#vipForm').modal('show');
            },
            deleteVip() {
                modal.confirmDialog({ message: '删除会员之后不可找回，您确定要删除吗？' }, () => {
                    http.post('/vipUser/removeVip', { vipUserId: this.vip.vipUserId })
                        .then(res => {
                            if (res.code === 1) {
                                this.handleDetailClose();
                                this.getVips();
                            } else {
                                modal.alert(res.msg);
                            }
                        });
                });
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
