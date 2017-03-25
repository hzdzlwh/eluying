<template>
    <div class="modal fade " id="selectModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog selectdialog">
            <div class="modal-content">
                <div class="selectModals-header">
                    <div class="header-container">
                        <span class="header-text">选择娱乐项目</span>
                    </div>
                    <span class="close-icon" @click="hideModal()"></span>
                </div>
                <div class="selectModal-body">
                    <div class="selectLeft">
                        <div class="selectLeft-item" v-for='item in selectDate' :class='{selectActive: item.entertainmentId === entertainmentIdActive.entertainmentId}' @click='changelist(item)'>{{item.entertainmentName}}
                        </div>
                    </div>
                    <div class="selectright">
                        <div class="selectright-item" v-for='it in entertainmentListActive' @click='selectprogram(it)'>
                            <div>{{it.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="sass" rel="stylesheet/scss">
@import "~dd-common-css/src/variables";
#selectModal {
    z-index: 1051;
}

.selectdialog {
    width: 390px;
    height: 390px
}

.modal-content {
    width: 390px;
    border-top: 4px solid #178ce6;
    border-radius: 2px;
    box-shadow: 0 0 5px 0;
    padding: 0 0 56px 0;
    margin-top: 0 !important;
    background: #fafafa;
    box-sizing: content-box;
}

.selectModals-header {
    width: 100%;
    height: 53px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    .close-icon {
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url("../../../../../image/modal/room_modal_close.png");
        background-size: contain;
        cursor: pointer;
    }
    .header-text {
        font-size: $font-size-lg;
        color: $gary-daker;
        font-weight: bold;
    }
}

.selectModal-body {
    width: 100%;
    max-height: 320px;
    clear: both;
    overflow: auto;
    .selectLeft {
        width: 125px;
        display: inline-block;
        height: 320px;
        float: left;
        overflow-y: auto;
        .selectLeft-item {
            padding: 10px 20px;
            color: #999;
            text-align: center;
            border-bottom: 1px solid #e6e6e6;
            cursor: pointer;
        }
        .selectActive {
            background: #fff;
        }
    }
    .selectright {
        float: left;
        width: 265px;
        display: inline-block;
        overflow-y: auto;
        max-height: 320px;
        .selectright-item {
            background: #fff;
            padding: 0 20px;
            &:hover {
                background: #e1effa;
            }
            > div {
                border-bottom: 1px solid #e6e6e6;
                padding: 10px 0;
                display: block;
                cursor: pointer;
            }
        }
    }
}
</style>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        selectDate: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data() {
        return {
            entertainmentIdActive: this.selectDate[0],
            entertainmentListActive: this.selectDate[0].categoryList
        }
    },
    computed: {},
    methods: {
        changelist(list) {
            this.entertainmentListActive = list.categoryList
            this.entertainmentIdActive = list
        },
        hideModal() {
            this.$emit('close', false)
            $('#selectModal').modal('hide');
        },
        selectprogram(item) {
            // let data = this.entertainmentIdActive
            // data.categoryList = item
            this.$emit('selectProjectDate', item)
            this.hideModal()
        }
    },
    watch: {
        show(val) {
            if (val) {
                $('#selectModal').modal({
                    backdrop: 'static'
                })
            } else {
                $('#selectModal').modal('hide');
            }
        }
    }
}
</script>
