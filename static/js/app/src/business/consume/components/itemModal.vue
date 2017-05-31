<template>
    <div>
        <div class="modal fade" id="itemModal" role="dialog" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="item-modal-header">
                        <h4 v-if="!item.name">新增项目</h4>
                        <h4 v-if="item.name">编辑项目</h4>
                    </div>
                    <div class="item-modal-body">
                        <div>
                            <span>名称：</span><input type="text" v-model="item.title">
                        </div>
                        <div>
                            <span>分类：</span>
                            <div>
                                
                            </div>
                        </div>
                    </div>
                    <div class="item-modal-footer">
                        <button class="dd-btn dd-btn-primary">确定</button>
                        <button class="dd-btn dd-btn-ghost" data-dismiss="modal">取消</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { DdSelect, DdOption } from 'dd-vue-component';
    import http from '../../../common/http';

    export default {
        props: {
            item: Object
        },
        data() {
            return {
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .modal-content{
        border-top: 4px solid #178ce6;
    }
</style>
