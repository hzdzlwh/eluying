<template>
    <div>
        <div class="modal fade" id="registerInfoModal" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="registerInfoModal-header padding-style">
                        <span class="header-text">预订</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="registerInfoModal-body">
                    </div>
                    <div class="registerInfoModal-footer">
                        <div>
                            <span class="footer-label font-style">订单金额</span>
                            <span class="footer-price">¥9999</span>
                        </div>
                        <div class="dd-btn dd-btn-primary" @click="hideModal">完成预订</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="sass" rel="stylesheet/scss" type="text/css">
    @import "~dd-common-css/src/variables";
    #registerInfoModal {
        box-sizing: border-box;
        font-size: $font-size-base;
        color: $gary-daker;
        .modal-dialog {
            width: 794px;
        }
        .modal-content {
            width: 794px;
            height: 600px;
            border-top: 4px solid #178ce6;
            border-radius: 2px;
            box-shadow: 0 0 5px 0;
            padding: 0 0 56px 0;
            margin-top: 42.5px;
        }
        .font-style {
            font-size: $font-size-sm;
            color: $gary-daker;
            font-weight: bold;
        }
        .padding-style {
            padding: 0 24px;
        }
    }
    .registerInfoModal-header {
        width: 100%;
        height: 54px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid $gary-light;
        .close-icon {
            display: inline-block;
            width: 14px;
            height: 14px;
            background: url("../../../../../image/room_modal_close.png");
            background-size: contain;
            cursor: pointer;
        }
        .header-text {
            font-size: $font-size-lg;
            color: $gary-daker;
            font-weight: bold;
        }
    }
    .registerInfoModal-body {
        width: 100%;
        max-height: 485px;
        overflow: scroll;
    }
    .registerInfoModal-footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 56px;
        background: #ebebeb;
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .footer-label {
            margin-right: 8px;
        }
        .footer-price {
            font-size: $font-size-lg;
            color: $blue;
            font-weight: bold;
        }
    }
</style>
<script>
    export default{
        data() {
            return {}
        },

        created(){},

        methods:{
            hideModal(e){
                e.stopPropagation();
                $("#registerInfoModal").modal("hide");
            }
        }
    }
</script>