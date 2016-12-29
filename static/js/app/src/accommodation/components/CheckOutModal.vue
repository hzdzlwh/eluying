<template>
    <div>
        <div class="modal fade roomModals" id="checkOut" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">办理退房</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title"><span>房间信息</span></p>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>订单总结</span></p>
                            <span>订单金额:<span>¥120000</span></span>
                            <span style="margin-left: 24px">已付金额:<span>¥120000</span></span>
                            <span style="margin-left: 24px">需补金额:<span>¥12000</span></span>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>违约信息</span></p>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>押金信息</span></p>
                            <span>已付押金:<span>¥1200</span></span>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">需补金额:<span class="order-price-num red">¥0</span></span>
                            <span class="footer-label">需退押金:<span class="order-price-num green">¥1200</span></span>
                        </div>
                        <div class="dd-btn dd-btn-primary">确认退房</div>
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
            hideModal(){
                $('#checkOut').modal('hide');
            }
        },
        components:{}
    }
</script>
