/**
 * @Author: lwh
 * @Date:   2017-08-07 19:20:30
 * @Last Modified by:   lwh
 * @Last Modified time: 2017-08-08 09:56:35
 */

 <template>
     <div class="modal fade" role="dialog" data-backdrop="static" id="relevanceOrder">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span>关联订单</span>
                    <button type="button" class="close" @click="hideModal"><span>&times;</span></button>
                </div>
                <div class="modal-body">     
                </div>
                <div class="modal-foot">
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
        }
    },
    methods: {
        hideModal() {
            this.$emit('hideModal');
        }
    },
    watch: {
        visible(newValue) {
            if (newValue) {
                $('#relevanceOrder').modal('show');
            } else {
                $('#relevanceOrder').modal('hide');
            }
        }
    }
};
 </script>

 <style lang="scss" scoped>
     .modal-dialog{
        width: 942px;
     }
 </style>