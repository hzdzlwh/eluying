<template>
    <div class="listbox">
    <div class="box-head"><DdSelect :value='selettype'></DdSelect></div>
    </div>
</template>
<style scoped>
.listbox{
    padding: 20px 0 0 40px;
}
</style>
<script>
    import {DdDatepicker, DdPagination, DdSelect} from 'dd-vue-component'
    export default{
        data() {
            return {
               type: 1
            }
        },
        methods: {
        
        },
        components: {
            DdDatepicker,
            DdPagination,
            DdSelect
        },
    }
</script>
