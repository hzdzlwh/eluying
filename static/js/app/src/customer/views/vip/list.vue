<template>
    <div class="cardList-container">
        <div style="display: flex;flex-direction: row-reverse;margin-bottom: 21px;">
            <a :href="outPutExcel()"><button class="dd-btn dd-btn-primary" >导出明细</button></a>
            <button class="dd-btn dd-btn-primary" style="margin-right: 16px" v-if='contral.VIP_EDIT_ID' @click="openVipForm">新增会员</button>
            <div class="search">
                <input type="text" class="dd-input" placeholder="搜索姓名/手机号/证件号/会员卡号" @keyup.enter="search" ref="searchInput">
                <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
            </div>
        </div>
        <dd-table :on-change="handleTableChange" :columns="col" :data-source="vips"></dd-table>
        <div class="foot">
            <span><small>共计</small> {{count}}位会员</span>
            <dd-pagination @currentchange="getVips" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
        </div>
        <vip-form :vip-props="vip" @onSuccess="getVips" />
        <recharge-card-form :visible="rechargeVisible"
                            :card="card"
                            :channels="payChannels"
                            @closeModal="hideModel"
                            @changeParams="modifyParams">
        </recharge-card-form>
        <main-card-form :visible="mainCardVisible"
                        :oldPhone="vip.phone"
                        :oldName="vip.name"
                        :channels="payChannels"
                        @closeModal="hideModel"
                        @changeParams="modifyParams">
        </main-card-form>
        <pay-with-code :visible="payCodeVisible"
                       :params="payWithCodeParams"
                       :url="payWithCodeInterfaceUrl"
                       @closeModal="hideModel"
                       @refreshView="">
        </pay-with-code>
        <detail
            :tab="detailTab"
            :id="detailId"
            type="vip"
            :title="detailTitle"
            :visible="detailVisible"
            :onClose="handleDetailClose"
            :onDelete="deleteVip"
            :onEdit="openEdit"
            :phone="vip.phone"
        >
            <div class="vip-detail-container">
                <div class="bottom-line">
                    <div class="vip-detail-header">客户信息</div>
                    <div class="vip-detail-row">
                        <div style="width: 25%">
                            <span class="vip-detail-filed">姓名</span>
                            <span>{{vip.name}}</span>
                        </div>
                        <div style="width: 25%">
                            <span class="vip-detail-filed">性别</span>
                            <span>{{['男', '女'][vip.gender]}}</span>
                        </div>
                        <div style="width: 25%">
                            <span class="vip-detail-filed">生日</span>
                            <span>{{vip.birthday}}</span>
                        </div>
                        <div style="width: 25%">
                            <span class="vip-detail-filed">手机号</span>
                            <span>{{vip.phone}}</span>
                        </div>
                    </div>
                    <div class="vip-detail-row">
                        <div style="width: 50%">
                            <span class="vip-detail-filed">邮箱</span>
                            <span style="flex: 1;word-break: break-all;">{{vip.email}}</span>
                        </div>
                        <div style="width: 50%">
                            <span class="vip-detail-filed">证件号</span>
                            <span>{{vip.idCardNum}}</span>
                        </div>
                    </div>
                    <div class="vip-detail-row">
                        <div style="width: 25%">
                            <span class="vip-detail-filed">创建渠道</span>
                            <span>{{vip.vipChannel}}</span>
                        </div>
                        <div style="width: 25%">
                            <span class="vip-detail-filed">创建人</span>
                            <span>{{vip.operatorName}}</span>
                        </div>
                        <div style="width: 50%">
                            <span class="vip-detail-filed">地区</span>
                            <span>{{(vip.province || '')}} - {{(vip.city || '')}} - {{(vip.county || '')}}</span>
                        </div>
                    </div>
                </div>
                <div class="bottom-line">
                    <div class="vip-detail-header">会员信息</div>
                    <div class="vip-detail-row">
                        <div style="width: 33%">
                            <span class="vip-detail-filed" style="width: 84px">累计消费金额</span>
                            <span>¥{{vip.totalConsume}}</span>
                        </div>
                        <div style="width: 33%">
                            <span class="vip-detail-filed" style="width: 84px">总消费金额</span>
                            <span>¥{{vip.entireTotalConsume}}</span>
                        </div>
                        <div style="width: 33%">
                            <span class="vip-detail-filed">会员等级</span>
                            <span>{{vip.levelName}}</span>
                        </div>
                    </div>
                </div>
                <div class="bottom-line">
                    <div class="vip-detail-header">会员卡</div>
                    <table class="vip-card-table">
                        <thead>
                        <tr>
                            <th style="width: 20%">名称</th>
                            <th style="width: 20%">卡号</th>
                            <th style="width: 20%">余额</th>
                            <th style="width: 20%">办理日期</th>
                            <th style="width: 20%">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in vip.vipCards">
                            <td>{{item.name}}</td>
                            <td>{{item.vipCardNum}}</td>
                            <td>{{item.balanceFee}}</td>
                            <td>{{item.creationTime}}</td>
                            <td><a @click="charge(item)">充值</a></td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="check-vip-card"><a @click="checkCard"><span>+</span> 办理会员卡</a></div>
                </div>
                <div class="bottom-line-last">
                    <div class="vip-detail-header">备注信息</div>
                    <div>{{vip.remark || '无'}}</div>
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
        position: relative;
        margin-right: 16px;
    }
    .search-icon {
        position: absolute;
        right: 8px;
        top: 6px;
    }
    .vip-detail-container {
        .bottom-line{
            padding: 15px 0 0 20px;
            border-bottom: 1px solid #e6e6e6;
            a:hover{
                cursor: pointer;
                text-decoration:none
            }
        }
        .bottom-line-last{
            padding: 15px 0 16px 20px;
        }
        .vip-detail-header {
            margin-bottom: 16px;
            font-weight: bold;
            font-size: 12px;
        }
        .vip-card-table{
            width: 100%;
            tr{
                height: 27px;
            }
        }
        .check-vip-card{
            font-size: 14px;
            margin: 16px 0;
            span{
                border: 1px solid;
                width: 16px;
                line-height: 16px;
                display: inline-block;
                text-align: center;
                border-radius: 3px;
            }
        }
        .vip-detail-row {
            margin-bottom: 19px;
            display: flex;
        }
        .vip-detail-filed {
            text-align: right;
            width: 56px;
            margin-right: 9px;
            display: inline-block;
            color: #999;
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
    import rechargeCardForm from '../../components/rechargeCardForm.vue';
    import mainCardForm from '../../components/mainCardForm.vue';
    import payWithCode from '../../components/payWithCode.vue';
    const idCardType = [
        '身', '军', '通', '护', '其'
    ];
    import auth from '../../../common/auth';
    export default{
        data() {
            return {
                contral: {},
                vips: [],
                payChannels: [],
                vip: {},
                pages: 0,
                count: 0,
                pageNo: 1,
                searchPattern: undefined,
                detailVisible: false,
                payWithCodeParams: undefined,
                payWithCodeInterfaceUrl: undefined,
                col: [
                    {
                        title: '姓名',
                        dataIndex: 'name'
                    },
                    {
                        title: '手机号',
                        dataIndex: 'phone'
                    },
                    {
                        title: '消费总金额',
                        dataIndex: 'entireTotalConsume',
                        sorter: true
                    },
                    {
                        title: '会员等级',
                        dataIndex: 'levelName',
                        sorter: true
                    },
                    {
                        title: '会员卡',
                        render: (h, row) => <div>{row.vipCards && row.vipCards.map(function(item) {
                            return <div style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;" title={item.name} key={item.vipUserId}>{item.name}</div>;
                        })}</div>
                    },
                    {
                        title: '余额',
                        render: (h, row) => <div>{row.vipCards && row.vipCards.map(function(item) {
                            return <div style="height:19px;" key={item.vipUserId}>{item.balanceFee}</div>;
                        })}</div>
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
                detailTitle: undefined,
                rechargeVisible: false,
                card: null,
                mainCardVisible: false,
                payCodeVisible: false
            };
        },
        created() {
            this.getVips();
            this.getPayChannels();
            this.contral.VIP_EDIT_ID = auth.checkModule(auth.VIP_ID, auth.VIP_EDIT_ID);
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
                this.vip = { name: '', phone: '', idCardType: 0, vipLevelId: '', gender: undefined, birthday: undefined, newAdd: true };
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
            getPayChannels() {
                http.get('/user/getChannels', { type: 1 })
                    .then(res => {
                        if (res.code === 1) {
                            this.payChannels = res.data.list;
                        }
                    });
            },
            modifyParams(params) {
                this.payWithCodeParams = params.params;
                this.payWithCodeInterfaceUrl = params.url;
                this.payCodeVisible = true;
            },
            handleDetailClose() {
                this.detailVisible = false;
            },
            openEdit() {
                this.handleDetailClose();
                $('#vipForm').modal('show');
            },
            deleteVip() {
                modal.confirm({ message: '删除会员之后不可找回，您确定要删除吗？' }, () => {
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
            },
            charge(card) {
                this.card = { vipCardNum: card.vipCardNum, categoryName: card.type === 0 ? '主卡' : '副卡', categoryId: card.categoryId, id: card.vipCardId };
                this.handleDetailClose();
                this.rechargeVisible = true;
            },
            checkCard() {
                this.handleDetailClose();
                this.mainCardVisible = true;
            },
            hideModel() {
                this.rechargeVisible = false;
                this.mainCardVisible = false;
                this.payCodeVisible = false;
                this.vip.phone = '';
            }
        },
        components: {
            DdTable,
            DdPagination,
            vipForm,
            detail,
            rechargeCardForm,
            mainCardForm,
            payWithCode
        }
    };
</script>
