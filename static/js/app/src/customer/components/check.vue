<template>
    <div id="checkForm" class="modal fade" role="dialog">
        <div class="modal-dialog checkForm-modal-dialog">
            <div class="modal-content checkForm-modal-content">
                <div class="checkForm-modal-header">
                    <span></span>
                    <span class="checkForm-closeBtn" @click="close()">&times;</span>
                </div>
                <div class="checkForm-modal-body">
                </div>
                <div class="checkForm-modal-foot">
                    <button class="dd-btn dd-btn-sm dd-btn-primary">确定</button>
                    <button class="dd-btn dd-btn-sm dd-btn-ghost">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" rel="stylesheet/scss">
</style>
<script>
import http from '../../common/AJAXService';
import modal from '../../common/modal';
import {
    DdSelect,
    DdOption
} from 'dd-vue-component';
export default {
    props: {
        visible: Boolean,
        type: 0,
    },
    data() {
        return {
            content: [{
                name: '企业充值',
                name1: '充值金额：',
                name2: '支付方式：'
            }]
        };
    },
    watch: {
        visible(val) {
            if (val) {
                $('#vipForm').modal('show');
            } else {
                $('#vipForm').modal('hide');
            }
        }
    },
    created() {},
    methods: {
        close() {
            $('#vipForm').modal('hide');
            this.$emit('close');
        }
    },
    components: {
        DdSelect,
        DdOption
    }
};
</script>
