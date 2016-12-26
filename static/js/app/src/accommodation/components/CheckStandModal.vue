<template>
    <div>
        <div class="modal fade roomModals" id="checkStand" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">收银台</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title"><span>订单收款</span></p>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>押金退款</span></p>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">需补金额:<span class="order-price-num red">¥0</span></span>
                            <span class="footer-label">需退押金:<span class="order-price-num green">¥1200</span></span>
                        </div>
                        <div class="dd-btn dd-btn-primary">完成</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    body{
        background-color:#ff0000;
    }
</style>
<script>
    export default{
        data(){
            return{}
        },
        methods: {
            hideModal(){
                $('#checkoutStand').modal('hide');
            }
        },
        components:{
        }
    }
</script>
