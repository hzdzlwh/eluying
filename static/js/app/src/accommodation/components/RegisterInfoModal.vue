<template>
    <div>
        <div class="modal fade" id="registerInfoModal" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="registerInfoModal-header">
                        <span class="title-text">预订</span>
                        <span>&times;</span>
                    </div>
                    <div class="registerInfoModal-footer"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="sass" rel="stylesheet/scss" type="text/css">
    @import "~dd-common-css/src/variables";
    #registerInfoModal {
        .modal-dialog {
            width: 794px;
        }
        .modal-content {
            width: 794px;
            height: 600px;
            border-top: 4px solid #178ce6;
            border-radius: 2px;
            box-shadow: 0 0 5px 0;
            padding: 0;
        }
    }
    .registerInfoModal-header {
        width: 100%;
        height: 53px;
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title-text {
            font-size: $font-size-lg;
            color: $gary-daker;
            font-weight: bold;
        }
    }
    .registerInfoModal-footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 56px;
        background: #ebebeb;
    }
</style>
<script>
    export default{
        data() {
            return {}
        },

        created(){
        }
    }
</script>