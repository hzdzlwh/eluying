<template>
	<div class="modal fade" role="dialog" data-backdrop="static" id="vipCardDetail">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4>{{card.id}}</h4>
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
        visible: Boolean,
        propsCard: Object,
        card: Object
    },
    created() {
        console.log(this.propsCard);
    },
    watch: {
        visible(val) {
            if (val) {
                this.show();
            } else {
                this.hide();
            }
        },
        propsCard(newVal) {
            this.card = newVal;
        }
    },
    methods: {
        show() {
            $('#vipCardDetail').modal('show');
        },
        hide() {
            $('#vipCardDetail').modal('hide');
        },
        hideModal() {
            this.$emit('closeModal');
        }
    }
	};
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss">
	.modal-dialog{
        width: 721px;
    }
</style>