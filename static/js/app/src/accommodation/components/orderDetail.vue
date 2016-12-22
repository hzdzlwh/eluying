<template>
    <div>
        <div class="modal fade roomModals" id="orderDetailModal" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <div class="header-container"><span class="header-text">订单详情</span><span class="order-state"></span></div>
                        <div class="header-container">
                            <span class="header-tools">打印</span>
                            <span class="header-tools">编辑订单</span>
                            <span class="close-icon" @click="hideModal"></span>
                        </div>
                    </div>
                    <div class="roomModals-body" style="height: 392px;">
                        <div class="content-item">
                            <p class="content-item-title"><span>客户信息</span></p>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>房间信息</span></p>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>餐饮信息</span></p>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>娱乐信息</span></p>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>商超信息</span></p>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>备注信息</span></p>
                        </div>
                    </div>
                    <div class="roomModals-footer" style="height: 149px;"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="sass" type="text/css" rel="stylesheet/scss">
    @import "~dd-common-css/src/variables";
    .header-container {
        display: flex;
        align-items: center;
    }
    .header-tools {
        color: $blue;
        font-size: $font-size-sm;
        cursor: pointer;
        margin-right: 16px;
    }
</style>
<script>
    export default{
        data(){
            return{}
        },
        methods: {
            hideModal(e){
                e.stopPropagation();
                $("#orderDetailModal").modal("hide");
            }
        },
        components:{}
    }
</script>
