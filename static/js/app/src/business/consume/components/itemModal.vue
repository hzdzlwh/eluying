<template>
    <div>
        <div class="modal fade" id="itemModal" role="dialog" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="item-modal-header">
                        <h4 v-if="!item.goodsId">新增项目</h4>
                        <h4 v-if="item.goodsId">编辑项目</h4>
                    </div>
                    <div class="item-modal-body">
                        <div>
                            <span class="item-name">名称：</span><input type="text" class="dd-input" style="width: 210px" v-model="item.name" maxlength="20" @input="validate">
                            <span style="position:absolute;left:80px;font-size: 12px;color: #f24949;" v-if="nameIsWrite && item.name.length === 0">必填</span>
                            <span style="position:absolute;left:80px;font-size: 12px;color: #f24949;" v-if="nameErrorAlert">格式不对</span>
                        </div>
                        <div style="display: flex;">
                            <span class="item-name" style="line-height: 24px;">分类：</span>
                            <dd-select v-model="goodsTypeId">
                                <dd-option v-for="type in item.itemName" :key="type.goodsTypeId" :value="type.goodsTypeId" :label="type.name"></dd-option>
                            </dd-select>
                        </div>
                        <div>
                            <span class="item-name">单位：</span><input type="text" class="dd-input" style="width: 105px" v-model="item.unit" @input="validate" maxlength="5">
                            <span style="position:absolute;top:23px;left:80px;font-size: 12px;color: #f24949;" v-if="unitErrorAlert">格式不对</span>
                        </div>
                        <div>
                            <span class="default-price">默认价格：</span><input type="text" class="dd-input" style="width: 105px;" v-model="item.price" @input="validatePrice">
                            <span style="position:absolute;top:23px;left:80px;font-size: 12px;color: #f24949;" v-if="priceIsWrite && item.price.length === 0">必填</span>
                            <span style="position:absolute;left:80px;top:23px;font-size: 12px;color: #f24949;" v-if="priceErrorAlert">格式不对</span>
                            <span style="position:absolute;left:80px;top:23px;font-size: 12px;color: #f24949;" v-if="item.price > 20000000">不能大于20000000</span>
                        </div>
                    </div>
                    <div class="item-modal-footer">
                        <button class="dd-btn dd-btn-primary" style="margin:0 20px 0 78px;" @click="addItem">确定</button>
                        <button class="dd-btn dd-btn-ghost" data-dismiss="modal">取消</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { DdSelect, DdOption, DdDatepicker } from 'dd-vue-component';
    import http from '../../../common/http';

    export default {
        props: {
            itemProps: Object
        },
        data() {
            return {
                item: {},
                goodsTypeId: 0,
                nameReg: /[\w\u4e00-\u9fa5]/,
                priceReg: /^[1-9]\d*(\.\d{1,2})?$/,
                decimalPriceReg: /^0\.?[0-9]{0,2}$/,
                nameIsWrite: false,
                priceIsWrite: false,
                nameErrorAlert: false,
                unitErrorAlert: false,
                priceErrorAlert: false
            }
        },
        computed: {
        },
        watch: {
            itemProps(val) {
                this.item = { ...val };
                this.goodsTypeId = this.item.goodsId ? this.item.goodsTypeId : this.item.itemName[0].goodsTypeId;
            }
        },
        methods: {
            addItem() {
                if ( this.item.price === '' || this.item.price > 20000000 || !this.priceReg.test(this.item.price) ||  this.item.name === '' ||this.nameErrorAlert || this.unitErrorAlert) {
                    if (this.item.name === '') {
                        this.nameIsWrite = true;
                    }
                    if (this.item.price === '') {
                        this.priceIsWrite = true;
                    }
                    return false;
                }
                let url = this.item.newAdd ? '/goods/addOtherGoods' : '/goods/editOtherGoods';
                http.get(url, { goodsTypeId: this.goodsTypeId, name: this.item.name, price: Number(this.item.price), unit: this.item.unit, goodsId: this.item.goodsId }).then(res => {
                    if (res.code === 1) {
                        $('#itemModal').modal('hide');
                        this.$emit('onSuccess');
                    }
                });
            },
            validate() {
                if (this.item.name === '') {
                    this.nameErrorAlert = false;
                }
                if (this.item.unit === '') {
                    this.unitErrorAlert = false;
                }
                this.item.name.split('').forEach((element) => {
                    if (!this.nameReg.test(element)) {
                        this.nameErrorAlert = true;
                    } else {
                        this.nameErrorAlert = false;
                    }
                });
                this.item.unit.split('').forEach((element) => {
                    if (!this.nameReg.test(element)) {
                        this.unitErrorAlert = true;
                    } else {
                        this.unitErrorAlert = false;
                    }
                });
            },
            validatePrice() {
                if (this.item.price >=0 && this.item.price <1) {
                    this.priceErrorAlert =  !this.decimalPriceReg.test(this.item.price);
                }
                if (this.item.price >=1) {
                    this.priceErrorAlert = !this.priceReg.test(this.item.price);
                }
            }
        },
        components: {
            DdSelect,
            DdOption,
            DdDatepicker
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .modal-dialog{
        width: 330px;
       .modal-content{
            padding: 22px 20px;
            border-top: 4px solid #178ce6;
            .item-modal-header{
                height: 40px;
                line-height: 40px;
                font-size: 16px;
                color: #178ce6;
            }
            .item-modal-body{
                .item-name{
                    margin-right: 8px;
                    display: inline-block;
                    width: 70px;
                    text-align: right;
                }
                .default-price{
                    margin-right: 8px;
                }
                .dd-select{
                    width: 210px;
                }
                & > div {
                    position: relative;
                    margin-bottom: 15px;
                }
            }
            .item-modal-footer{
                button{
                    min-width: 50px;
                }
            }
        } 
    }
</style>
