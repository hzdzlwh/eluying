<template>
	<div class="modal fade" role="dialog" data-backdrop="static" id="vipCardDetail">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <div>
                        <h4>{{card.categoryName}} {{card.vipCardNum}}<span class="edit" @click="openModal('edit')">编辑</span></h4>
                    </div>
                    <button type="button" class="close" @click="hideModal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <div class="info-item">
                        <p style="font-size:12px;font-weight: bold;margin-bottom:9px;">会员卡信息</p>
                        <div class="customer-info">
                            <div style="width: 25%;"><span style="font-size:12px;color:#999999;">姓名</span> <span>{{card.vipName}}</span></div>
                            <div style="width: 25%;"><span style="font-size:12px;color:#999999;">手机号</span> <span>{{card.phone}}</span></div>
                            <div style="width: 25%;" v-if="card.type !== 1"><span style="display:inline-block;width:48px;text-align:right;font-size:12px;color:#999999;">余额</span> <span>{{card.balanceFee}}</span></div>
                            <div style="width: 25%;"><span style="font-size:12px;color:#999999;">类型</span> <span>{{card.type === 0? card.categoryName : '副卡'}}</span></div>
                        </div>
                        <div class="customer-info">
                            <div style="width: 25%;display:flex;align-items:center;"><span style="font-size:12px;color:#999999;">卡号</span> <span style="display: inline-block;width:130px;overflow:hidden;text-overflow: ellipsis;margin-left:3px;" :title="card.vipCardNum">{{card.vipCardNum}}</span></div>
                            <div style="width: 25%;"><span style="font-size:12px;color:#999999;">办理日期</span> <span>{{card.creationTime}}</span></div>
                            <div style="width: 25%;"><span style="font-size:12px;color:#999999;">状态</span> <span>{{CARDSTATUS[card.status]}}</span></div>
                            <div style="width: 25%;display: block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"><span style="font-size:12px;color:#999999;">销售员</span> <span :title='card.salerString'>{{card.salerString || '无'}}</span></div>
                        </div>
                    </div>
                    <div class="info-item">
                        <p style="font-size:12px;font-weight: bold;margin-bottom:9px;">备注信息</p>
                        <p v-if="card.remark">{{card.remark}}</p>
                        <p v-else>无</p>
                    </div>
                </div>
                <div class="modal-foot">
                    <div style="padding: 15px; 20px;text-align: right;">
                        <button class="dd-btn dd-btn-primary" v-if="card.rechargeAble" @click="openModal('recharge')">充值</button>
                        <button class="dd-btn dd-btn-primary" v-if="card.status === 0" @click="openModal('operate', 'lose')">挂失</button>
                        <button class="dd-btn dd-btn-primary" v-if="card.givingAble" @click="openModal('given')">转赠</button>
                        <button class="dd-btn dd-btn-primary" v-if="card.viceAble" @click="openModal('additional')">办理副卡</button>
                        <button class="dd-btn dd-btn-primary" v-if="card.reapplyAble" @click="openModal('repair')">补办</button>
                        <button class="dd-btn dd-btn-primary" v-if="card.status === 1" @click="openModal('operate', 'recover')">恢复</button>
                        <button class="dd-btn dd-btn-primary" v-if="card.status === 1" @click="openModal('operate', 'useless')">失效</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
    data() {
        return {
            card: Object,
            CARDSTATUS: ['正常', '挂失', '失效']
        };
    },
    props: {
        visible: Boolean,
        propsCard: Object
    },
    watch: {
        visible(val) {
            if (val) {
                this.show();
            } else {
                this.hide();
            }
        },
        propsCard(newVal) {
            this.card = newVal;
        }
    },
    methods: {
        show() {
            $('#vipCardDetail').modal('show');
        },
        hide() {
            $('#vipCardDetail').modal('hide');
        },
        hideModal() {
            this.$emit('closeModal');
        },
        openModal(type, loseOrrecoverOruseless) {
            this.$emit('openModal', type, loseOrrecoverOruseless);
        }
    }
	};
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss">
	.modal-dialog{
        width: 721px;
        .modal-content{
            border-top: 4px solid #178ce6;
            .modal-header{
                display: flex;
                justify-content: space-between;
                h4{
                    font-size: 16px;
                }
                .edit{
                    font-size: 14px;
                    margin-left: 10px;
                    cursor: pointer;
                    color: #178ce6;
                }
            }
            .modal-body{
                padding: 0;
                .info-item{
                    padding: 15px 20px 10px;
                    border-bottom: 1px solid #e6e6e6;
                    .customer-info{
                        display: flex;
                        padding-left: 22px;
                        height: 34px;
                        line-height: 34px;
                    }
                }
                
            }
        }
        
    }
</style>
