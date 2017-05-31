<template>
    <div class="vip-setting-container">
        <div class="clearfix" v-if="settings && settings.length > 0">
            <i v-if="autoUpgrade === 1">会员等级由低到高自动升级（最多可创建30个等级）</i>
            <i v-if="autoUpgrade === 0">最多可创建30个等级</i>
            <span class="help-button" data-toggle="modal" data-target="#helpModal">帮助</span>
            <button v-if="settings && settings.length < 30 && contral.VIP_EDIT_ID" class="dd-btn dd-btn-primary" style="float:right" @click="openCreate">新增</button>
            <div style="margin-top:18px;">
                <vipLevel v-for='(dd ,index) in settings' :editor='dd.addType === 1' :data='dd' :key="dd.vipLevelSettingId" :type='Number(autoUpgrade)' @delet='deletLevel' @addCard='getLevelList' @select='select'></vipLevel>
            </div>
        </div>
        <div style="text-align: center; margin-top: 87px" v-if="settings && settings.length === 0">
            <img src="//static.dingdandao.com/ordersManage_noOrders.png" alt="">
            <p style="margin: 10px 0 20px"><i>您目前还没有会员体系</i><span class="help-button" data-toggle="modal" data-target="#helpModal">&nbsp;&nbsp;帮助</span></p>
            <button class="dd-btn dd-btn-primary" data-toggle="modal" data-target="#system" >创建会员体系</button>
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
                            自动升级的情况下，管理者可以在会员等级设置中选择需要累计的项目，并且可以选择需要给予会员优惠的项目； 非自动升级的情况下，则默认累计所有的项目消费，但仍然可以选择需要给予会员优惠的项目。
                        </p>
                        <br>
                        <p style="margin-bottom: 5px">
                            <b>3、 会员等级设置的更改（新增、删除、修改）对已有的会员数据会带来什么影响？</b>
                        </p>
                        <p>
                            会员等级设置更改之后，已有的会员数据会根据最新的设置进行自动更新。如果选择自动升级，可能会导致会员等级的上升、下降或者不变。具体说明如下：
                            <br> （1）删除会员等级，可能会导致一部分会员的等级下降为下一等级；
                            <br> （2）新增、修改会员等级设置，可能会导致部分会员等级上升，但是不会自动降低会员的等级；
                            <br> （3）已有会员的累计消费金额不受影响，并在最新的会员规则下继续累计、升级。
                            <br>
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
                            订单创建时，系统根据输入的客户信息自动识别会员，符合规定的会员将在订单中享受折扣，会员与折扣信息会保存在订单中，直至订单结束。订单结束后，自动将实际消费金额累计到会员数据中。
                            <br> 具体说明如下：
                            <br> （1）会员订单一旦创建，将不可更改客户信息。非会员订单创建后，即使更改客户信息，也不能识别为会员，不享受会员折扣，只能重新创建订单；
                            <br> （2）销售下单的订单，不参与会员消费金额累计与会员折扣；
                            <br> （3）微官网的订单，参与会员消费金额累计，但暂时没有会员折扣；
                            <br>
                        </p>
                        <br>
                        <p style="margin-bottom: 5px">
                            <b>6、 会员的等级可以更改吗？</b>
                        </p>
                        <p>
                            如果选择自动升级，则新增会员时可以设置为某个等级，但添加之后不可更改；
                            <br> 如果选择非自动升级，则可以随时更改会员等级。
                        </p>
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
        <categorySelect :onConfirm="handleCategorySelect" :type="'discount'" :list="nodes" />
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
    width: 730px;
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
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
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
import http from '../../../common/http';
import auth from '../../../common/auth';
import modal from '../../../common/modal';
import vipLevel from '../../components/vipLevel';
import categorySelect from '../../components/categorySelect.vue';
import bus from '../../event.js';
export default {
    data() {
        return {
            contral: {
                VIP_EDIT_ID: auth.checkModule(auth.VIP_ID, auth.VIP_EDIT_ID)
            },
            settings: undefined,
            autoUpgrade: undefined,
            levelName: undefined,
            thresholdFee: undefined,
            consume: [],
            discount: [],
            columns: [],
            id: undefined,
            nodes: []
        };
    },
    components: {
        vipLevel,
        categorySelect
    },
    created() {
        this.getLevelList();
    },
    methods: {
        select(nodes) {
            this.nodes = nodes;
            $('#categorySelectModal').modal('show');
        },
        handleCategorySelect(list) {
            bus.$emit('vipLevelCategory', list);
        },
        deletLevel(id) {
            if (id) {
                const callback = () => {
                    http.get('/vipUser/removeVipLevel', {
                        vipLevelId: id
                    })
                            .then(res => {
                                this.getLevelList();
                            });
                };
                const message = this.settings.length !== 1 ? '删除该会员等级后，该等级的会员根据累计消费金额重新评定等级，确认删除么？' : '该等级会最后一个等级，删除后所有会员将重置为默认等级，您将可以重新选择升级方式，确认删除么？';
                modal.confirm({
                    message: message,
                    title: '删除会员等级'
                }, callback);
            } else {
                this.getLevelList();
            }
        },
        getLevelList() {
            http.get('/vipUser/getVipSettings', {})
                    .then(res => {
                        if (res.code === 1) {
                            this.settings = res.data.vipSettingItemList;
                            if (this.settings.length > 0) {
                                this.autoUpgrade = res.data.autoUpgrade;
                            }
                        }
                    });
        },
        openCreate() {
            this.settings.unshift({
                consumeItems: [],
                discountInfoList: [],
                addType: 1
            });
        },
        selectSystem() {
            if (typeof this.autoUpgrade === 'undefined') {
                return false;
            }
            this.autoUpgrade = Number(this.autoUpgrade);
            $('#system').modal('hide');
            this.openCreate();
                // this.openCreate();
        }
    }
};
</script>
