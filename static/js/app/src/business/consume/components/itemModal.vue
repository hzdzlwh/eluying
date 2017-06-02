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
                            <span class="item-name">名称：</span><input type="text" class="dd-input" style="width: 210px" v-model="item.name">
                            <span style="position:absolute;left:80px;font-size: 12px;color: #f24949;" v-if=" item.name && (!nameReg.test(item.name) || item.name.length > 20)">格式不对</span>
                        </div>
                        <div style="display: flex;">
                            <span class="item-name" style="line-height: 24px;">分类：</span>
                            <dd-select v-model="goodsTypeId">
                                <dd-option v-for="type in item.itemName" :key="type.goodsTypeId" :value="type.goodsTypeId" :label="type.name"></dd-option>
                            </dd-select>
                        </div>
                        <div>
                            <span class="item-name">单位：</span><input type="text" class="dd-input" style="width: 105px" v-model="item.unit">
                            <span style="position:absolute;top:23px;left:80px;font-size: 12px;color: #f24949;" v-if=" item.unit && (!nameReg.test(item.unit) || item.unit.length > 5)">格式不对</span>
                        </div>
                        <div>
                            <span class="default-price">默认价格：</span><input type="text" class="dd-input" style="width: 105px;" v-model="item.price">
                            <span style="position:absolute;left:80px;top:23px;font-size: 12px;color: #f24949;" v-if=" item.price && !priceReg.test(item.price)">格式不对</span>
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
                if ( this.item.price === '' || !this.priceReg.test(this.item.price) || (!this.nameReg.test(this.item.unit) || this.item.unit.length > 5) || (!this.nameReg.test(this.item.name) || this.item.name.length > 20)) {
                    return false;
                }
                let url = this.item.newAdd ? '/goods/addOtherGoods' : '/goods/editOtherGoods';
                http.get(url, { goodsTypeId: this.goodsTypeId, name: this.item.name, price: Number(this.item.price), unit: this.item.unit, goodsId: this.item.goodsId }).then(res => {
                    if (res.code === 1) {
                        $('#itemModal').modal('hide');
                        this.$emit('onSuccess');
                    }
                });
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
