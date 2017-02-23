/**
 * Created by lingchenxuan on 2017/2/17.
 */
import Vue from 'vue';
import http from '../common/AJAXService';
import init from '../common/init';
import auth from '../common/auth';
import modal from '../common/modal';
import { DdTable } from 'dd-vue-component';

init({
    id: auth.VIP_ID,
    noAuthUrl: auth.NO_AUTH_FOR_VIP_URL,
    leftMenu: false
});

$(function() {

    const main = new Vue({
        el: '.vip-container',
        created: function() {
            this.getLevelList();
        },
        data() {
            return {
                settings: [],
                autoUpgrade: undefined,
                levelName: undefined,
                thresholdFee: undefined,
                consume: [],
                discount: [],
                columns: [],
            }
        },
        components: {
            DdTable
        },
        methods: {
            getLevelList() {
                http.get('/vipUser/getVipSettings', {})
                    .then(res => {
                        if (res.code === 1) {
                            this.settings = res.data.vipSettingItemList;
                            if (this.settings.length > 0) {
                                this.autoUpgrade = res.data.autoUpgrade;
                                this.columns = [
                                    {
                                        title: '会员等级',
                                        dataIndex: 'levelName',
                                        width: 152
                                    },
                                    {
                                        title: '优惠折扣',
                                        render: (h, row) => {
                                            return row.discountInfoList.map(i =>{
                                                return (
                                                    <p style={{
                                                        display: 'flex',
                                                        'justify-content': 'space-between',
                                                        width: '190px'}}
                                                    >
                                                        <span>{i.nodeName}</span>
                                                        <span>{i.discount}折</span>
                                                    </p>
                                                );
                                            })
                                        },
                                        width: 252
                                    },
                                    {
                                        title: '操作',
                                        render: (h, row) => (<span className="list-action"><span>编辑</span>/<span>删除</span></span>),
                                        width: 93
                                    },
                                ];
                                if (this.autoUpgrade == 1) {
                                    this.columns.splice(2, 0,
                                        {
                                            title: '升级条件',
                                            render: (h, row) => {
                                                return <span>消费满¥{row.thresholdFee}</span>
                                            },
                                            width: 186
                                        },
                                        {
                                            title: '消费累计项目',
                                            render: (h, row) => {
                                                return <span>{row.consumeItems.join('、')}</span>
                                            },
                                            width: 390
                                        }
                                    );

                                }
                            }

                        }
                    });
            },
            createLevel() {
                const url = this.autoUpgrade == 1 ?'/vipUser/createEditVipLevel' : '/vipUser/createEditVipLevelNotAuto';
                http.post(url, {
                    levelName: this.levelName,
                    thresholdFee: this.thresholdFee,
                    consumeListReq: JSON.stringify(this.consume),
                    discountListReq: JSON.stringify(this.discount)
                })
                    .then(res => {
                        if (res.code === 1) {
                            this.getLevelList();
                            $('#settingModal').modal('hide');
                        } else {
                            modal.alert(res.msg);
                        }
                    });

            },
            deleteNode(item) {
                const index = this.discount.indexOf(item);
                this.discount.splice(index, 1)
            },
            selectSystem() {
                if (typeof this.autoUpgrade === 'undefined') {
                    return false;
                }

                $('#system').modal('hide');
                $('#settingModal').modal('show');
            },
            openSelectNode(type, data) {
                $('#selectModal').modal('show');
                select.type = type;
                data.map(item => {
                    if (item.nodeType === 0) {
                        select.room = true;
                    }

                    if (item.nodeType === 3) {
                        select.shop = true;
                    }

                    if (item.nodeType === 1) {
                        select.restNodeList.map(i => {
                            if (i.id === item.id) {
                                i.selected = true;
                            }
                        });
                    }

                    if (item.nodeType === 2) {
                        select.enterNodeList.map(i => {
                            if (i.id === item.id) {
                                i.selected = true;
                            }
                        });
                    }
                });
            }
        }
    });

    const select = new Vue({
        el: '#selectModal',
        created: function() {
            http.get('/vipUser/getNodeInfo', {})
                .then(res => {
                    if (res.code === 1) {
                        this.enterNodeList = res.data.enterNodeList;
                        this.restNodeList = res.data.restNodeList;
                        this.enterNodeList.map(i => {
                            this.$set(i, 'selected', false);
                            this.$set(i, 'discount', undefined);
                        });
                        this.restNodeList.map(i => {
                            this.$set(i, 'selected', false);
                            this.$set(i, 'discount', undefined);
                        });
                    }
                })
        },
        data() {
            return {
                enterNodeList: [],
                restNodeList: [],
                room: undefined,
                shop: undefined,
                type: ''
            }
        },
        computed: {
            food: {
                get() {
                    return this.restNodeList.every(i => i.selected);
                },
                set(v) {
                    this.restNodeList.map(i => i.selected = v);
                }
            },
            et: {
                get() {
                    return this.enterNodeList.every(i => i.selected);
                },
                set(v) {
                    this.enterNodeList.map(i => i.selected = v);
                }
            },
            all: {
                get() {
                    const arr = [this.room, this.shop, this.et, this.food];
                    return arr.every(i => i);
                },
                set(v) {
                    this.room = v;
                    this.shop = v;
                    this.et = v;
                    this.food = v;
                }
            }
        },
        methods: {
            confirmSelect() {
                const list = [];
                if (this.room) {
                    list.push({
                        id: 0,
                        nodeType: 0,
                        nodeName: '住宿'
                    })
                }

                this.enterNodeList.map(i => {
                    if (i.selected) {
                        list.push({ ...i });
                    }
                });
                this.restNodeList.map(i => {
                    if (i.selected) {
                        list.push({ ...i });
                    }
                });

                if (this.shop) {
                    list.push({
                        id: 0,
                        nodeType: 3,
                        nodeName: '商超'
                    })
                }

                main[this.type] = list;
                this.close();
            },
            close() {
                $('#selectModal').modal('hide');
                this.enterNodeList.map(i => this.$set(i, 'selected', false));
                this.restNodeList.map(i => this.$set(i, 'selected', false));
                this.room = undefined;
                this.shop = undefined;
                this.type = '';
            }
        }
    })
});