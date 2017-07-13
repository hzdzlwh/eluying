<template>
    <div>
        <div class="modal fade" id="changeRoomDialog" role="dialog" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="item-modal-header">
                        <h4>换房</h4>
                    </div>
                    <div class="item-modal-body">
                        <slot></slot>
                    </div>
                    <div class="item-modal-footer">
                       <button class="dd-btn dd-btn-primary" @click="confirmDrag">确定</button><button class="dd-btn dd-btn-ghost" @click="restDrag">取消</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            confirmDrag: Function,
            restDrag: Function
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
    #changeRoomDialog{
        .modal-dialog{
            width: 300px;
            h4{
                color: #178ce6;
                font-size: 16px;
                margin-bottom:10px;
                border-bottom: 1px solid #e5e5e5;
            }
            .item-modal-body{
                margin-bottom: 20px;
            }
            .item-modal-footer{
                display: flex;
                justify-content: space-between;
            }
        }
    }
</style>

