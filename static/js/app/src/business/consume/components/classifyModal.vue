<template>
    <div>
        <div class="modal fade" id="classifyModal" role="dialog" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="classify-modal-header">
                        <h4 v-if="!classifyProps.goodsTypeId">新增分类</h4>
                        <h4 v-if="classifyProps.goodsTypeId">修改分类</h4>
                    </div>
                    <div class="classify-modal-body">
                        <div>
                            <span>分类名称：</span><input type="text" class="dd-input" style="width: 210px;" v-model="classify.name">
                            <span v-if="classify.name && (!nameReg.test(classify.name) || classify.name.length > 10)">格式错误</span>
                        </div>
                    </div>
                    <div class="classify-modal-footer">
                        <button class="dd-btn dd-btn-primary" style="margin-right: 20px;" @click="addClassify">确定</button>
                        <button class="dd-btn dd-btn-ghost" data-dismiss="modal">取消</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import http from '../../../common/http';

    export default {
        props: {
            classifyProps: Object
        },
        data() {
            return {
                classify: {},
                nameReg: /[\w\u4e00-\u9fa5]/,
            }
        },
        methods: {
            addClassify() {
                if (!this.nameReg.test(this.classify.name) || this.classify.name.length > 10 || this.classify.name === '') {
                    return false;
                }
                
                let url = this.classify.goodsTypeId ? 'goods/editOtherGoodsType' : '/goods/addOtherGoodsType';
                http.get(url, this.classify).then(res => {
                    if (res.code === 1) {
                        $('#classifyModal').modal('hide');
                        this.$emit('onSuccess');
                    }
                });
            }
        },
        watch: {
            classifyProps(val) {
                this.classify = { ...val };
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .modal-content{
        .classify-modal-header{
            height: 30px;
            line-height: 30px;
            font-size: 16px;
            color: #178ce6;
        }
        .classify-modal-body{
            margin-bottom: 20px;
        }
        .classify-modal-footer{
            text-align: center;
            button{
                min-width: 50px;
            }
        }
        
    }
</style>
