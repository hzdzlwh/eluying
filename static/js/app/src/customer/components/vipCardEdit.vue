<template>
	<div class="modal fade" role="dialog" data-backdrop="static" id="vipCardEdit">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <div>
                        <h4>编辑会员卡</h4>
                    </div>
                    <button type="button" class="close" @click="hideModal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <div class="edit-item">
                        <p style="font-size:12px;font-weight: bold;margin-bottom:9px;">会员卡信息</p>
                        <div class="edit-info">
                            <div style="width: 33%;"><span style="font-size:14px;">姓名</span> <input style="width:110px;" class="dd-input" :value="card.vipName" disabled="true"></div>
                            <div style="width: 33%;"><span style="display:inline-block;font-size:14px;width:56px;text-align:right;">手机号</span> <input style="width:110px;" class="dd-input" :value="card.phone" disabled="true"></div>
                            <div style="width: 33%;display:flex;align-items: center;">
                                <span style="font-size:14px;margin-right:4px;">类型 </span>
                                <div>
                                    <DdSelect style="width: 110px;" :disabled="true" v-model="card.type">
                                        <dd-option v-for="type in types" :key="type.id" :value="type.id" :label="type.name"></dd-option>
                                    </DdSelect>
                                </div>
                            </div>
                        </div>
                        <div class="edit-info">
                            <div style="width: 33%;"><span style="font-size:14px;">卡号</span> <input style="width:169px;" class="dd-input" v-model="card.vipCardNum" maxlength="18"></div>
                            <div style="width: 33%;"><span style="font-size:14px;">办理日期</span> <input style="width:110px;" class="dd-input" :value="card.creationTime" disabled="true"></div>
                        </div>
                    </div>
                    <div class="edit-item" style="border-bottom:none;">
                        <p style="font-size:12px;font-weight: bold;margin-bottom:9px;">备注信息</p>
                        <textarea style="width:682px;height:80px;" maxlength="500" placeholder="-请填写描述-" v-model="card.remark"></textarea>
                    </div>
                </div>
                <div class="modal-foot">
                    <div style="padding: 15px; 20px;text-align: right;">
                        <button class="dd-btn dd-btn-primary" @click="saveEidt">保存</button>
                        <button class="dd-btn dd-btn-ghost" @click="hideModal">取消</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { DdSelect, DdOption } from 'dd-vue-component';
    import http from '../../common/http';
    export default {
        data() {
            return {
                card: Object,
                types: [
                    { id: 1, name: '副卡' }
                ]
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
                this.card = { ...newVal };
                this.types.push({ id: 0, name: this.card.categoryName });
            }
        },
        methods: {
            show() {
                $('#vipCardEdit').modal('show');
            },
            hide() {
                $('#vipCardEdit').modal('hide');
            },
            hideModal() {
                this.$emit('closeModal');
            },
            saveEidt() {
                http.get('/vipCard/editVipCard', { vipCardId: this.card.id, remark: this.card.remark, vipCardNum: this.card.vipCardNum }).then(res => {
                    if (res.code === 1) {
                        this.hideModal();
                        this.$emit('refreshView');
                    }
                });
            }
        },
        components: {
            DdSelect,
            DdOption
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
                    font-weight: bold;
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
                .edit-item{
                    padding: 15px 20px 10px;
                    border-bottom: 1px solid #e6e6e6;
                    .edit-info{
                        display: flex;
                        padding: 9px 22px;
                    }
                }
                
            }
        }
        
    }
</style>
