<template>
    <div>
        <div class="modal fade" id="payWithCode" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content"></div>
            </div>
        </div>
    </div>
</template>
<style type="text/css" rel="stylesheet/scss" lang="sass">
    @import "~dd-common-css/src/variables";
    #payWithCode {
        box-sizing: border-box;
        font-size: $font-size-base;
        color: $gary-daker;
        .modal-dialog {
            width: 400px;
        }
        .modal-content {
            width: 400px;
            border-top: 4px solid #178ce6;
            border-radius: 2px;
            box-shadow: 0 0 5px 0;
            padding: 0 0 56px 0;
            margin-top: 42.5px;
        }
    }
</style>
<script>
    export default{
        data(){
            return{
            }
        },
        components:{

        }
    }
</script>
