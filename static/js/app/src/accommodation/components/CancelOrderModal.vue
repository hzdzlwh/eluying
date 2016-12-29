<template>
    <div>
        <div class="modal fade roomModals" id="cancelOrder" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">取消订单</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title"><span>订单总结</span></p>
                            <span>订单金额:<span>¥120000</span></span>
                            <span style="margin-left: 24px">已付金额:<span>¥120000</span></span>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>违约信息</span></p>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">需退金额:<span class="order-price-num green">¥1200</span></span>
                        </div>
                        <div class="dd-btn dd-btn-primary">完成</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
    export default{
        data(){
            return{}
        },
        methods:{
            hideModal() {
                $('#cancelOrder').modal('hide');
            }
        },
        components:{}
    }
</script>
