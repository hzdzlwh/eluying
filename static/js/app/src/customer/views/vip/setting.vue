<template>
    <div class="vip-setting-container">
        <div style="margin-top: 23px" class="clearfix" v-if="settings && settings.length > 0">
            <i v-if="autoUpgrade === 1">会员等级由低到高自动升级（最多可创建5个等级）</i>
            <i v-if="autoUpgrade === 0">最多可创建5个等级</i>
            <span class="help-button" data-toggle="modal" data-target="#helpModal">帮助</span>
            <button v-if="settings && settings.length < 5" class="dd-btn dd-btn-primary" style="float: right" @click="openCreate">新增</button>
            <div style="margin-top:12px;box-shadow: 0 0 5px 0 rgba(0,0,0,0.15);">
                <dd-Table :columns="columns" :data-source="settings"></dd-Table>
            </div>
        </div>

        <div style="text-align: center; margin-top: 87px" v-if="settings && settings.length === 0">
            <img src="//static.dingdandao.com/ordersManage_noOrders.png" alt="">
            <p style="margin: 10px 0 20px"><i>您目前还没有会员体系</i><span class="help-button" data-toggle="modal" data-target="#helpModal">&nbsp;&nbsp;帮助</span></p>
            <button class="dd-btn dd-btn-primary" data-toggle="modal" data-target="#system">创建会员体系</button>
        </div>
        <div class="modal fade" role="dialog" id="helpModal">
            <div class="modal-dialog" style="width: 632px">
                <div class="modal-content">
                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    <h2 style="border-bottom: 1px solid #d4d4d4; margin-bottom: 15px;height: 40px;line-height: 40px">帮助</h2>
                    <div style="font-size: 14px">
                        <p style="margin-bottom: 5px"><b>1、 会员系统如何使用？</b></p>
                        <p>
                            会员系统提供自动升级与不自动升级两种会员等级方案，首先请根据营业情况和发展规划设计好会员级别、升级条件（选择自动升级则需要填写升级条件）与会员权益。然后可以手动添加会员，也可以让客户通过会员注册网站注册成为会员。客户成为会员之后，通过订单来了系统创建订单时，会员客户将拥有相应的会员折扣，并在订单结束时会累计该会员的消费金额。如果选择自动升级，则当会员累计消费金额达到预定的升级条件时将会自动升级为下一等级的会员。
                        </p>
                        <br>
                        <p style="margin-bottom: 5px">
                            <b>2、会员的累计消费金额包含会员在系统中所有项目的消费吗？</b>
                        </p>
                        <p>
                            自动升级的情况下，管理者可以在会员等级设置中选择需要累计的项目，并且可以选择需要给予会员优惠的项目；
                            非自动升级的情况下，则默认累计所有的项目消费，但仍然可以选择需要给予会员优惠的项目。
                        </p>
                        <br>
                        <p style="margin-bottom: 5px">
                            <b>3、 会员等级设置的更改（新增、删除、修改）对已有的会员数据会带来什么影响？</b>
                        </p>
                        <p>
                            会员等级设置更改之后，已有的会员数据会根据最新的设置进行自动更新。如果选择自动升级，可能会导致会员等级的上升、下降或者不变。具体说明如下：<br>
                            （1）删除会员等级，可能会导致一部分会员的等级下降为下一等级；<br>
                            （2）新增、修改会员等级设置，可能会导致部分会员等级上升，但是不会自动降低会员的等级；<br>
                            （3）已有会员的累计消费金额不受影响，并在最新的会员规则下继续累计、升级。<br>
                        </p>
                        <br>
                        <p style="margin-bottom: 5px">
                            <b>4、 会员等级设置的更改（新增、删除、修改）或会员数据的更新（如：会员升级）对已有的订单会带来什么影响？</b>
                        </p>
                        <p>
                            会员等级设置更改或会员数据更新之后，已有的订单（包括已预订、进行中、已结束的订单）不受影响，将保留原有的会员信息与会员折扣。只有新创建的订单，才会按照新的等级设置和新的会员等级进行消费金额累计与会员折扣。
                        </p>
                        <br>
                        <p style="margin-bottom: 5px">
                            <b>5、 会员订单如何进行优惠？又如何累计消费金额？</b>
                        </p>
                        <p>
                            订单创建时，系统根据输入的客户信息自动识别会员，符合规定的会员将在订单中享受折扣，会员与折扣信息会保存在订单中，直至订单结束。订单结束后，自动将实际消费金额累计到会员数据中。<br>
                            具体说明如下：<br>
                            （1）会员订单一旦创建，将不可更改客户信息。非会员订单创建后，即使更改客户信息，也不能识别为会员，不享受会员折扣，只能重新创建订单；<br>
                            （2）销售下单的订单，不参与会员消费金额累计与会员折扣；<br>
                            （3）微官网的订单，参与会员消费金额累计，但暂时没有会员折扣；<br>
                        </p>
                        <br>
                        <p style="margin-bottom: 5px">
                            <b>6、 会员的等级可以更改吗？</b>
                        </p>
                        <p>
                            如果选择自动升级，则新增会员时可以设置为某个等级，但添加之后不可更改；<br>
                            如果选择非自动升级，则可以随时更改会员等级。
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" role="dialog" id="settingModal" data-backdrop="static">
            <div class="modal-dialog"  style="width: 486px">
                <div class="modal-content">
                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    <h2 v-if="!id" style="margin-bottom: 15px;height: 40px;line-height: 40px">添加会员等级</h2>
                    <h2 v-if="id" style="margin-bottom: 15px;height: 40px;line-height: 40px">编辑会员等级</h2>
                    <div class="form-row">
                        <label for="levelName">会员等级名称：</label>
                        <input id="levelName" maxlength="8" v-model="levelName" style="width: 208px" class="dd-input" type="text">
                    </div>
                    <div v-if="autoUpgrade == 1" class="form-row">
                        <label for="thresholdFee">升级条件：</label>
                        <span>累计金额满</span>
                        <input id="thresholdFee" v-model="thresholdFee" maxlength="10" class="dd-input" style="width: 110px;margin: 0 8px" type="text">
                        <span>元</span>
                    </div>
                    <div style="display: flex" v-if="autoUpgrade == 1" class="form-row">
                        <label >消费累计项目：</label>
                        <div style="flex: 1">
                            <span>{{consume.map(i => i.nodeName).join('、')}}</span>
                            <span @click="openSelectNode('consume', consume)" class="select-button">选择项目</span>
                        </div>
                    </div>
                    <i class="form-row" style="font-size: 12px" v-if="autoUpgrade == 1">成为会员后，在【消费业态】中累计消费达到【升级条件】后自动升级为该级别会员</i>
                    <div class="line"></div>
                    <div class="form-row" style="display: flex">
                        <label>优惠折扣：</label>
                        <div style="width: 285px">
                            <div style="max-height: 78px;overflow: auto">
                                <div style="margin-bottom: 3px" v-for="item in discount" :key="item.id">
                                    <span style="display: inline-block;width: 132px">{{item.nodeName}}</span>
                                    <input style="width: 56px;" type="text" class="dd-input" v-model="item.discount">
                                    <i style="margin: 0 16px 0 8px">折</i>
                                    <img style="cursor: pointer" src="/static/image/modal/room_modal_delete.png" alt="" @click="deleteNode(item)">
                                </div>
                            </div>
                            <div>
                                <span @click="openSelectNode('discount', discount)" class="select-button">选择项目</span>
                                <small style="margin-left: 76px" v-if="discount.length > 0"><i>请输入0.1-9.9之间的数字</i></small>
                            </div>
                        </div>
                    </div>
                    <div style="margin-left: 105px">
                        <button class="dd-btn dd-btn-primary dd-btn-sm" @click="createLevel">确定</button>
                        <button class="dd-btn dd-btn-ghost dd-btn-sm" data-dismiss="modal">取消</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" role="dialog" id="system" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content" style="width: 496px">
                    <h2 style="margin-bottom: 24px">选择会员体系</h2>
                    <div style="margin-left: 23px">
                        <div style="margin-bottom: 22px">
                            <input type="radio" class="dd-radio" name="system" v-model="autoUpgrade" value="1">
                            <span>自动升级体系</span>
                            <p style="margin-left: 21px">
                                <i><small>会员根据自身的消费累计金额，在达到一定的升级条件之后自动进行等级升级</small></i>
                            </p>
                        </div>
                        <div style="margin-bottom: 22px">
                            <input type="radio" class="dd-radio" name="system" v-model="autoUpgrade" value="0">
                            <span>非自动升级体系</span>
                            <p style="margin-left: 21px"><i><small>会员的等级需要进行手动编辑调整</small></i></p>
                        </div>
                        <div>
                            <button @click="selectSystem" class="dd-btn dd-btn-sm dd-btn-primary">下一步</button>
                            <button class="dd-btn dd-btn-sm dd-btn-ghost" data-dismiss="modal">取消</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <categorySelect :onConfirm="handleCategorySelect" :type="selectType" :list="nodes" />
    </div>
</template>
<style lang="scss">
    .list-action {
        color: #178ce6;
        cursor: pointer;
    }
    .vip-setting-container {
        td {
            vertical-align: top !important;
        }
    }
</style>
<style lang="scss" scoped>
    @import '~dd-common-css/src/variables';

    .vip-setting-container {
        margin: 0 auto;
    i {
        color: #999;
        font-style: normal;
    }

    .help-button {
        color: $blue;
        cursor: pointer;
    }
    #helpModal {
    .modal-content {
        padding: 10px;
    }
    }

    #settingModal {
    label {
        width: 98px;
        text-align: right;
    }
    .form-row {
        margin-bottom: 15px;
    }
    .line {
        width: 484px;
        height: 1px;
        background: #e6e6e6;
        margin: 15px -20px;
    }
    }
    }
    .modal-content {
        background: #fafafa;
        box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.15);
        border-radius: 2px;
        border-top: 4px solid #178ce6;
        padding: 20px;
    }

    #settingModal {
    .select-button {
        cursor: pointer;
        color: $blue;
    }
    }
    td {
        vertical-align: top !important;
    }

</style>
<script>
    import modal from '../../../common/modal';
    import http from '../../../common/AJAXService';
    import { DdTable } from 'dd-vue-component';
    import categorySelect from '../../components/categorySelect.vue';
    import auth from '../../../common/auth';
    export default{
        data() {
            return {
                contral: { VIP_EDIT_ID: auth.checkModule(auth.VIP_ID, auth.VIP_EDIT_ID) },
                settings: undefined,
                autoUpgrade: undefined,
                levelName: undefined,
                thresholdFee: undefined,
                consume: [],
                discount: [],
                columns: [],
                id: undefined,
                selectType: undefined
            };
        },
        created() {
            this.getLevelList();
        },
        computed: {
            nodes() {
                return this.selectType === 'consume' ? this.consume : this.discount;
            }
        },
        components: {
            DdTable,
            categorySelect
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
                                            return row.discountInfoList.map(i => {
                                                return (
                                                    <p
                                                        style={{
                                                            display: 'flex',
                                                            'justify-content': 'space-between',
                                                            width: '190px'
                                                        }}
                                                    >
                                                        <span>{i.nodeName}</span>
                                                        <span>{i.discount}折</span>
                                                    </p>
                                                );
                                            });
                                        },
                                        width: 252
                                    },
                                    {
                                        title: '操作',
                                        render: (h, row) => (
                                            this.contral.VIP_EDIT_ID ? <span>
                                                <span class="list-action" onClick={() => this.openEdit(row)}>编辑</span>／
                                                <span class="list-action" onClick={() => this.deleteLevel(row.vipLevelSettingId)}>删除</span>
                                            </span>
                                            : ''
                                        ),
                                        width: 100
                                    }
                                ];
                                if (this.autoUpgrade === 1) {
                                    this.columns.splice(2, 0,
                                        {
                                            title: '升级条件',
                                            render: (h, row) => {
                                                return <span>消费满¥{row.thresholdFee}</span>;
                                            }
                                        },
                                        {
                                            title: '消费累计项目',
                                            render: (h, row) => {
                                                return <span>{row.consumeItems.map(i => i.nodeName).join('、')}</span>;
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
                const message = Number(this.autoUpgrade) === 1
                    ? (this.settings.length === 1
                        ? '删除该会员等级后，该等级的所有会员将变更为默认等级，确认删除么？'
                        : '删除该会员等级后，该等级的会员降低一等级，确认删除么？')
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
                        });
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
                this.consume = item.consumeItems.map(i => ({ ...i }));
                this.discount = item.discountInfoList.map(i => ({ ...i }));
                $('#settingModal').modal('show');
            },
            createLevel() {
                if (!this.levelName) {
                    modal.alert('请填写会员等级名称');
                    return false;
                }

                if (Number(this.autoUpgrade) === 1 && this.thresholdFee === undefined) {
                    modal.alert('请输入升级条件');
                    return false;
                }

                if (Number(this.autoUpgrade) === 1 && !/^\d{1,10}$/.test(this.thresholdFee)) {
                    modal.alert('升级条件只能为整数');
                    return false;
                }

                if (Number(this.autoUpgrade) === 1 && this.consume.length === 0) {
                    modal.alert('请选择消费累计项目');
                    return false;
                }

                for (let i = 0; i < this.discount.length; i ++) {
                    if (!/^0\.[1-9]$|^[1-9]\.[0-9]$|^[1-9]$/.test(this.discount[i].discount)) {
                        modal.alert('请输入0.1-9.9之间正确的折扣数字');
                        return false;
                    }
                }

                const url = Number(this.autoUpgrade) === 1
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
                this.discount.splice(index, 1);
            },
            selectSystem() {
                if (typeof this.autoUpgrade === 'undefined') {
                    return false;
                }

                $('#system').modal('hide');
                this.openCreate();
            },
            handleCategorySelect(list) {
                if (this.selectType === 'consume') {
                    this.consume = list;
                } else {
                    const newList = [];
                    list.map(item => {
                        const result = this.discount.find(i => i.id === item.id && i.nodeType === item.nodeType);
                        if (result) {
                            if (item.selected) {
                                newList.push({ ...result });
                            }
                        } else {
                            newList.push({ ...item });
                        }
                    });
                    this.discount = newList;
                }
            },
            openSelectNode(type, data) {
                $('#categorySelectModal').modal('show');
                this.selectType = type;
                /* select.type = type;
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
                });*/
            }
        }
    };
</script>
