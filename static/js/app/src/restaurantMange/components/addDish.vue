/**
 * @Author: lwh
 * @Date:   2017-08-09 14:19:31
 * @Last Modified by:   lwh
 * @Last Modified time: 2017-08-09 15:38:58
 */

<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="addDish">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span>新增自定义菜品</span>
                    <button type="button" class="close" @click="hideModal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <div>
                        <span>菜品名称：</span>
                        <input type="text" class="dd-input" v-model="dishName">
                    </div>
                    <div class="dish-price">
                        <span>菜品价格：</span>
                        <input type="number" class="dd-input" v-model.number="dishPrice">
                    </div>
                    <div class="customer-info">自定义菜品不参与折扣</div>
                </div>
                <div class="modal-foot">
                    <button class="dd-btn dd-btn-ghost" @click="hideModal">取消</button>
                    <button class="dd-btn dd-btn-primary" @click="addDish">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dishName: '',
            dishPrice: undefined
        };
    },
    methods: {
        hideModal() {
            this.$emit('hideModal');
        },
        addDish() {
        }
    },
    watch: {
        visible(newValue) {
            if (newValue) {
                $('#addDish').modal('show');
            } else {
                $('#addDish').modal('hide');
            }
        }
    }
};
</script>

<style lang="scss" scoped>
     .modal-content{
        padding: 0;
        .modal-body{
            border-bottom: 1px solid #e5e5e5;
            input{
                width: 200px;
            }
            .dish-price{
                margin-top: 16px;
            }
            .customer-info{
                color: #8492a6;
                margin-left: 80px;
            }
        }
        .modal-foot{
            padding: 16px;
            text-align: right;
        }
     }
     
</style>
