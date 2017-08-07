/**
 * @Author: lwh
 * @Date:   2017-08-07 11:16:56
 * @Last Modified by:   lwh
 * @Last Modified time: 2017-08-07 11:57:24
 */

<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="reserveInfo">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span>填写预订信息</span>
                    <button type="button" class="close" @click="hideModal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <div><span>客户姓名:</span><input type="text" class="dd-input"></div>
                    <div><span>手机号:</span><input type="number" class="dd-input"></div>
                    <div><span>客户来源:</span></div>
                    <div><span>会员卡:</span></div>
                    <div><span>就餐人数:</span><input type="number" max="1000" class="dd-input"></div>
                    <div><span>用餐时间:</span></div>
                    <div><span>销售员:</span></div>
                    <div><span>订单备注:</span><textarea></textarea></div>
                </div>
                <div class="modal-foot">
                    
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
    methods: {
        hideModal() {
            this.$emit('hideModal');
        }
    },
    watch: {
        visible(newVale) {
            if (newVale) {
                $('#reserveInfo').modal('show');
            } else {
                $('#reserveInfo').modal('hide');
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>