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
                settings: undefined,
                autoUpgrade: undefined,
                levelName: undefined,
                thresholdFee: undefined,
                consume: [],
                discount: [],
                columns: [],
                id: undefined
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
                                        render: (h, row) => (
                                            <span class="list-action">
                                                <span onClick={() => this.openEdit(row)}>编辑</span>/
                                                <span onClick={() => this.deleteLevel(row.vipLevelSettingId)}>删除</span>
                                            </span>
                                        ),
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
                                                return <span>{row.consumeItems.map(i => i.nodeName).join('、')}</span>
                                            },
                                            width: 390
                                        }
                                    );

                                }
                            }

                        }
                    });
            },
            deleteLevel(id) {
                const message = this.autoUpgrade == 1
                    ? '删除该会员等级后，该等级的会员降低一等级，确认删除么？'
                    : '删除该会员等级后，该等级的所有会员将变更为默认等级，确认删除么？';
                modal.confirmDialog({
                    message
                }, () => {
                    http.post('/vipUser/removeVipLevel', { vipLevelId: id })
                        .then(res => {
                            if (res.code === 1) {
                                this.getLevelList();
                            } else {
                                modal.alert(res.msg);
                            }
                        })
                });
            },
            openCreate() {
                this.levelName = undefined;
                this.id = undefined;
                this.thresholdFee = undefined;
                this.consume = [];
                this.discount = [];
                $('#settingModal').modal('show');
            },
            openEdit(item) {
                this.levelName = item.levelName;
                this.id = item.vipLevelSettingId;
                this.thresholdFee = item.thresholdFee;
                this.consume = item.consumeItems;
                this.discount = item.discountInfoList;
                $('#settingModal').modal('show');
            },
            createLevel() {
                if (!this.levelName) {
                    modal.alert('请填写会员等级名称');
                    return false;
                }

                if (this.autoUpgrade == 1 && !this.thresholdFee) {
                    modal.alert('请输入升级条件');
                    return false;
                }

                if (this.autoUpgrade == 1 && !/^\d{1,10}$/.test(this.thresholdFee)) {
                    modal.alert('升级条件只能为整数');
                    return false;
                }

                if (this.autoUpgrade == 1 && this.consume.length === 0) {
                    modal.alert('请选择消费累计项目');
                    return false;
                }

                for (let i = 0; i < this.discount.length; i ++) {
                    if (!/^0\.[1-9]$|^[1-9]\.[0-9]$|^[1-9]$/.test(this.discount[i].discount)) {
                        modal.alert('请输入0.1-9.9之间正确的折扣数字');
                        return false;
                    }
                }

                const url = this.autoUpgrade == 1
                    ? '/vipUser/createEditVipLevel'
                    : '/vipUser/createEditVipLevelNotAuto';
                http.post(url, {
                    levelName: this.levelName,
                    thresholdFee: this.thresholdFee,
                    consumeListReq: JSON.stringify(this.consume),
                    discountListReq: JSON.stringify(this.discount),
                    vipLevelSettingId: this.id
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