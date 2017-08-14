<template>
    <div class="save-cancel">
        <button class="dd-btn dd-btn-primary" @click="save">保存</button>&nbsp<button class="dd-btn dd-btn-ghost" @click="cancel">取消</button>
    </div>
</template>

<script>
    export default {
        methods: {
            save() {
                this.$emit('save');
            },
            cancel() {
                this.$emit('cancel');
            }
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
    
</style>