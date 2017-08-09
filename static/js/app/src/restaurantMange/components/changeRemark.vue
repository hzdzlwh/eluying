/*
* @Author: lxj
* @Date:   2017-08-08 18:22:37
* @Last Modified by:   lxj
* @Last Modified time: 2017-08-09 11:00:20
* @email: 783384903@qq.com
*/


<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="changeRemark">
        <div class="modal-dialog ">
            <div class="modal-content roomModals-body">
                <div class="modal-header">
                    <span>菜品备注</span>
                    <button type="button" class="close" @click="hideModal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <textarea name="remark" placeholder="请输入备注信息" maxlength="200" v-model="Str" class="dd-input"/>
                </div>
                <div class="modal-foot">
                    <button class="dd-btn dd-btn-ghost" @click="hideModal">取消</button>
                    <button class="dd-btn dd-btn-primary" @click='changeBook'>确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        data: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            Str: ''
        };
    },
    methods: {
        hideModal() {
            this.data = '';
            this.$emit('hideModal');
        },
        changeBook() {
            this.hideModal();
            this.$emit('changeRemark', this.Str);
        }
    },
    watch: {
        visible(newVale) {
            if (newVale) {
                $('#changeRemark').modal('show');
            } else {
                $('#changeRemark').modal('hide');
            }
        },
        data(val) {
            this.data = val;
        }
    },
    components: {
    }
};
</script>

<style lang="scss" scoped>
    .modal-content{
        padding: 0;
        width: 300px;
        .modal-body{
            border-bottom: 1px solid #e5e5e5;
            > div{
                margin-bottom: 16px;
            }
        }
        .modal-foot{
            padding:15px 15px 5px;
            text-align: right;
        }
    }
</style>
