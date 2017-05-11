<template>
    <div class="cardList-container">
        <div style="display: flex;flex-direction: row-reverse;margin-bottom: 21px;">
            <button class="dd-btn dd-btn-primary" @click="createCard">办理会员卡</button>
            <a style="margin-right: 16px"><button class="dd-btn dd-btn-primary">导出明细</button></a>
            <div class="search">
                <input type="text" class="dd-input" placeholder="搜索姓名/手机号/证件号/会员卡号" ref="searchInput">
                <img class="search-icon" src="//static.dingdandao.com/vipSearch.png">
            </div>
        </div>
        <dd-table :on-change="handleTableChange" :columns="col" :data-source="cardList"></dd-table>
        <div class="foot">
            <span><small>共计</small> {{7}}位会员</span>
            <dd-pagination @currentchange="getCardList" :visible-pager-count="6" :show-one-page="false" :page-count="30" :current-page="pageNo" />
        </div>
        <main-card-form :visible="modalList['main']" @closeModal="hideModal"></main-card-form>
        <additional-card-form :visible="modalList['additional']" :card="card" @closeModal="hideModal"></additional-card-form>
        <repair-card-form :visible="modalList['repair']" :card="card" @closeModal="hideModal"></repair-card-form>
        <recharge-card-form :visible="modalList['recharge']" :card="card" @closeModal="hideModal"></recharge-card-form>
        <given-card-form :visible="modalList['given']" :card="card" @closeModal="hideModal"></given-card-form>
        <simple-card-form :visible="modalList['operate']"
                          :card="card"
                          :type="type"
                          @closeModal="hideModal">
        </simple-card-form>
    </div>
</template>
<style lang="scss" type="text/css" rel="stylesheet/scss">
    .cardList-container {
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
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            border:1px solid #cccccc;
            border-radius:2px;
            width: 100px;
            cursor: pointer;
            height: 24px;
            &:nth-child(n+4) {
                 margin-top: 10px;
            }
        }
        .card-type-selected {
            border: 1px solid #178ce6;
            color: #178ce6;
        }
        .recharge-type {
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            border:1px solid #cccccc;
            border-radius:2px;
            width: 150px;
            cursor: pointer;
            height: 24px;
            &:nth-child(n+3) {
                 margin-top: 10px;
             }
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
<script>
    import { DdTable, DdPagination } from 'dd-vue-component';
    import mainCardForm from '../../components/mainCardForm.vue';
    import additionalCardForm from '../../components/additionalCardForm.vue';
    import repairCardForm from '../../components/repairCardForm.vue';
    import rechargeCardForm from '../../components/rechargeCardForm.vue';
    import givenCardForm from '../../components/givenCardForm.vue';
    import simpleCardForm from '../../components/simpleCardForm.vue';
    const cardStatusText = ['正常', '失效', '挂失'];

    export default{
        data() {
            return {
                pageNo: 1,
                card: undefined,
                type: undefined,
                modalList: {
                    additional: false,
                    main: false,
                    repair: false,
                    recharge: false,
                    given: false,
                    operate: false
                },
                col: [
                    {
                        title: '卡号',
                        dataIndex: 'cardNum',
                        width: 200
                    },
                    {
                        title: '类型',
                        dataIndex: 'cardType'
                    },
                    {
                        title: '姓名',
                        dataIndex: 'name'
                    },
                    {
                        title: '手机号',
                        dataIndex: 'phone'
                    },
                    {
                        title: '余额',
                        dataIndex: 'accountMoney'
                    },
                    {
                        title: '办理日期',
                        dataIndex: 'date',
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
                                {row.status === 0 && <span class='list-action-button' onClick={() => this.openModal(row, 'recharge')}>充值/</span>}
                                {row.status === 0 && <span class='list-action-button' onClick={() => {this.openModal(row, 'operate');this.type='lose'}}>挂失/</span>}
                                {row.status === 0 && <span class='list-action-button' onClick={() => this.openModal(row, 'given')}>转赠/</span>}
                                {row.status === 0 && <span class='list-action-button' onClick={() => this.openModal(row, 'additional')}>办理副卡</span>}
                                {row.status === 2 && <span class='list-action-button' onClick={() => this.openModal(row, 'repair')}>补办/</span>}
                                {row.status === 2 && <span class='list-action-button' onClick={() => {this.openModal(row, 'operate');this.type='recover'}}>恢复/</span>}
                                {row.status === 2 && <span class='list-action-button' onClick={() => {this.openModal(row, 'operate');this.type='useless'}}>失效</span>}
                            </span>,
                        width: 200
                    }
                ],
                cardList: [
                    {
                        cardNum: '330009999999999990',
                        cardType: '金卡',
                        name: '毛利兰',
                        phone: 23099999999,
                        accountMoney: 9000,
                        date: '1994-03-22',
                        status: 0,
                        children: [
                            {
                                cardNum: '330009999999999991',
                                cardType: '金卡',
                                name: '毛利兰',
                                phone: 23099999999,
                                accountMoney: 9000,
                                date: '1994-03-22',
                                status: 1
                            },
                            {
                                cardNum: '330009999999999992',
                                cardType: '金卡',
                                name: '毛利兰',
                                phone: 23099999999,
                                accountMoney: 9000,
                                date: '1994-03-22',
                                status: 2
                            }
                        ]
                    },
                    {
                        cardNum: '330009999999999993',
                        cardType: '银卡',
                        name: '工藤新一',
                        phone: 23099999993,
                        accountMoney: 8000,
                        date: '1994-03-22',
                        status: 0
                    }
                ]
            };
        },
        methods: {
            getCardList(page) {
                console.log(page || this.pageNo);
            },
            handleTableChange(data) {
                console.log(data);
            },
            createCard() {
                this.modalList['main'] = true;
            },
            hideModal() {
                for (const key in this.modalList) {
                    this.modalList[key] = false;
                }
            },
            openModal(card, type) {
                this.card = card;
                this.modalList[type] = true;
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
            simpleCardForm
        }
    };
</script>
