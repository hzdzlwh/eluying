<template>
    <div class="cardList-container">
        <div style="display: flex;flex-direction: row-reverse;margin-bottom: 21px;">
            <button class="dd-btn dd-btn-primary" @click="createCard">办理会员卡</button>
            <a style="margin-right: 16px" :href="outPutExcel()" download><button class="dd-btn dd-btn-primary">导出明细</button></a>
            <div class="search">
                <input type="text"
                       class="dd-input"
                       placeholder="搜索姓名/手机号/证件号/会员卡号"
                       @keyup.enter="search"
                       v-model="keyword" />
                <img class="search-icon" src="//static.dingdandao.com/vipSearch.png" @click="search">
            </div>
        </div>
        <dd-table :on-change="handleTableChange" :columns="col" :data-source="cardList"></dd-table>
        <div class="foot">
            <span><small>共计</small>{{count}}张卡</span>
            <dd-pagination
                    @currentchange="getCardList"
                    :visible-pager-count="6"
                    :show-one-page="false"
                    :page-count="pages"
                    :current-page="pageNo" />
        </div>
        <main-card-form :visible="modalList['main']"
                        @closeModal="hideModal"
                        @changeParams="modifyParams"
                        :channels="payChannels"
                        @refreshView="getCardList">
        </main-card-form>
        <vip-card-detail :propsCard="card"
                         :visible="modalList['detail']"
                         @closeModal="hideModal"
                         @openModal="openModal">                        
        </vip-card-detail>
        <vip-card-edit :visible="modalList['edit']"
                       @closeModal="hideModal"
                       :propsCard="card"
                       @refreshView="getCardList">
        </vip-card-edit>
        <additional-card-form :visible="modalList['additional']"
                              :card="card"
                              :channels="payChannels"
                              @changeParams="modifyParams"
                              @refreshView="getCardList"
                              @closeModal="hideModal">
        </additional-card-form>
        <repair-card-form :visible="modalList['repair']"
                          :card="card"
                          :channels="payChannels"
                          @changeParams="modifyParams"
                          @refreshView="getCardList"
                          @closeModal="hideModal">
        </repair-card-form>
        <recharge-card-form :visible="modalList['recharge']"
                            :card="card"
                            :channels="payChannels"
                            @refreshView="getCardList"
                            @changeParams="modifyParams"
                            @closeModal="hideModal">
        </recharge-card-form>
        <given-card-form :visible="modalList['given']"
                         :card="card"
                         :channels="payChannels"
                         @changeParams="modifyParams"
                         @refreshView="getCardList"
                         @closeModal="hideModal">
        </given-card-form>
        <simple-card-form :visible="modalList['operate']"
                          :card="card"
                          :type="type"
                          @refreshView="getCardList"
                          @closeModal="hideModal">
        </simple-card-form>
        <pay-with-code :visible="modalList['payCode']"
                       :params="payWithCodeParams"
                       :url="payWithCodeInterfaceUrl"
                       @closeModal="hideModal"
                       @refreshView="getCardList">
        </pay-with-code>
    </div>
</template>
<style lang="scss" type="text/css" rel="stylesheet/scss">
    .cardList-container {
        .card-operation-btn:not(:last-child)::after {
            content: '/';
        }
        .error-phone-tip {
            position: absolute;
            font-size: 12px;
            color: #f24949;
            top: 24px;
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
        .cardList-modal-dialog {
            width:422px;
        }
        .cardList-modal-content {
            padding: 0;
            background:#fafafa;
            box-shadow:0px 2px 4px 0px rgba(0,0,0,0.15);
            border-radius:2px;
            border-top: 4px solid #178ce6;
            width:422px;
        }
        .cardList-modal-header {
            margin-bottom: 20px;
            padding: 15px 20px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cardList-modal-title {
            font-size:16px;
            color:#178ce6;
        }
        .cardList-modal-close {
            display: inline-block;
            width: 14px;
            height: 14px;
            cursor: pointer;
            background: url("../../../../../../image/modal/room_modal_close.png");
            background-size: contain;
        }
        .cardList-body-item {
            display: flex;
            padding: 0 20px;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        .cardList-body-itemLeft {
            display: inline-flex;
            align-items: center;
            justify-content: flex-end;
            flex-grow: 1;
            align-self: flex-start;
            height: 24px;
        }
        .cardList-body-itemRight {
            display: flex;
            position: relative;
            align-items: center;
            width: 320px;
            margin-left: 8px;
            justify-content: space-between;
            flex-flow: row wrap;
        }
        .card-type {
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            box-sizing: border-box;
            border:1px solid #cccccc;
            border-radius:2px;
            width: 100px;
            cursor: pointer;
            line-height: 24px;
            height: 24px;
            &:not(:nth-child(3n)) {
                margin-right: 10px;
             }
            &:nth-child(n+4) {
                 margin-top: 10px;
            }
        }
        .card-type-selected {
            border: 1px solid #178ce6;
            color: #178ce6;
        }
        .recharge-type {
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            box-sizing: border-box;
            border:1px solid #cccccc;
            border-radius:2px;
            width: 150px;
            cursor: pointer;
            line-height: 24px;
            height: 24px;
            &:nth-child(n+3) {
                 margin-top: 10px;
             }
        }
        .recharge-type-selected {
            border: 1px solid #178ce6;
        }
        .normal-input {
            width: 110px;
        }
        .body-bottom-priceTitle {
            font-size: 12px;
        }
        .body-bottom-price {
            font-size: 16px;
            color: #178ce6;
        }
        .cardList-modal-foot {
            height: 56px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-right: 20px;
            border-top: 1px solid #e6e6e6;
            button:not(last-child) {
                margin-right: 16px;
            }
        }
    }
</style>
<script type="text/jsx">
    import { DdTable, DdPagination } from 'dd-vue-component';
    import vipCardDetail from '../../components/vipCardDetail.vue';
    import vipCardEdit from '../../components/vipCardEdit.vue';
    import mainCardForm from '../../components/mainCardForm.vue';
    import additionalCardForm from '../../components/additionalCardForm.vue';
    import repairCardForm from '../../components/repairCardForm.vue';
    import rechargeCardForm from '../../components/rechargeCardForm.vue';
    import givenCardForm from '../../components/givenCardForm.vue';
    import simpleCardForm from '../../components/simpleCardForm.vue';
    import payWithCode from '../../components/payWithCode.vue';
    import http from '../../../common/http';
    const cardStatusText = ['正常', '挂失', '失效'];

    export default{
        data() {
            return {
                pageNo: 1,
                pages: 0,
                count: 0,
                card: undefined,
                type: undefined,
                keyword: undefined,
                payChannels: [],
                payWithCodeParams: undefined,
                payWithCodeInterfaceUrl: undefined,
                modalList: {
                    additional: false,
                    main: false,
                    repair: false,
                    recharge: false,
                    given: false,
                    operate: false,
                    payCode: false,
                    detail: false,
                    edit: false
                },
                col: [
                    {
                        title: '卡号',
                        dataIndex: 'vipCardNum',
                        width: 240
                    },
                    {
                        title: '类型',
                        render: (h, row) => <div>
                                                <span>{row.type === 0 ? row.categoryName : '副卡'}</span>
                                                {row.lastCardNum && <div style="font-size: 12px">补({row.lastCardNum}）</div>}
                                            </div>
                    },
                    {
                        title: '姓名',
                        dataIndex: 'vipName'
                    },
                    {
                        title: '手机号',
                        dataIndex: 'phone'
                    },
                    {
                        title: '余额',
                        render: (h, row) => <span>{row.type === 0 ? row.balanceFee : ''}</span>,
                        className: 'text-right'
                    },
                    {
                        title: '办理日期',
                        render: (h, row) => <span>{row.creationTime.split(' ')[0]}</span>,
                        sorter: true
                    },
                    {
                        title: '状态',
                        render: (h, row) => <span>{cardStatusText[row.status]}</span>,
                        width: 50
                    },
                    {
                        title: '操作',
                        render: (h, row) =>
                            <span>
                                {<span class="list-action-button card-operation-btn" onClick={() => this.openDetail(row)}>详情</span>}
                            </span>,
                        width: 80
                    }
                ],
                cardList: []
            };
        },
        created() {
            this.getCardList();
            this.getPayChannels();
        },
        methods: {
            getCardList(page) {
                this.pageNo = page || this.pageNo;
                const params = {
                    pageNo: this.pageNo,
                    keyword: this.keyword,
                    sortType: this.sortType
                };
                http.get('/vipCard/getVipCardList', params)
                    .then(res => {
                        if (res.code === 1) {
                            this.cardList = res.data.vipCardList;
                            this.cardList.map(card => {
                                if (card.viceVipCardList && card.viceVipCardList.length > 0) {
                                    card.children = card.viceVipCardList;
                                }
                            });
                            this.count = res.data.vipCardsCount;
                            this.pages = Math.ceil(res.data.vipCardsListSize / 30);
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
            handleTableChange(data) {
                this.pageNo = 1;
                this.sortType = data.sortType;
                this.getCardList();
            },
            createCard() {
                this.modalList['main'] = true;
            },
            hideModal(type) {
                if (type) {
                    this.modalList[type] = false;
                } else {
                    for (const key in this.modalList) {
                        this.modalList[key] = false;
                    }
                }
            },
            modifyParams(params) {
                this.payWithCodeParams = params.params;
                this.payWithCodeInterfaceUrl = params.url;
                this.modalList['payCode'] = true;
            },
            openDetail(card) {
                http.get('/vipCard/getVipCardDetail', { vipCardId: card.id }).then(res => {
                    if (res.code === 1) {
                        this.card = res.data;
                        this.modalList['detail'] = true;
                    }
                });
            },
            openModal(type, loseOrrecoverOruseless) {
                // this.card = card;
                this.hideModal();
                this.modalList[type] = true;
                if (loseOrrecoverOruseless) {
                    this.type = loseOrrecoverOruseless;
                }
            },
            search() {
                this.pageNo = 1;
                this.getCardList();
            },
            outPutExcel() {
                const originParam = {};
                if (this.keyword) {
                    originParam.keyword = this.keyword;
                }
                const host = http.getUrl('/vipCard/vipCardsExport');
                const pa = http.getDataWithToken(originParam);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            }
        },
        components: {
            DdTable,
            DdPagination,
            mainCardForm,
            additionalCardForm,
            repairCardForm,
            rechargeCardForm,
            givenCardForm,
            simpleCardForm,
            payWithCode,
            vipCardDetail,
            vipCardEdit
        }
    };
</script>
