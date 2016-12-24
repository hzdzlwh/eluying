<template>
    <div>
        <div class="modal fade roomModals" id="checkOut" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">办理退房</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body"></div>
                    <div class="roomModals-footer"></div>
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
