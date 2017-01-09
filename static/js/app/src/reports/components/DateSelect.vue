<template>
    <div>
        <DdSelect>
            <DdOption>最近7天</DdOption>
            <DdOption>未来7天</DdOption>
            <DdOption>今天</DdOption>
            <DdOption>昨天</DdOption>
            <DdOption>本周</DdOption>
            <DdOption>本月</DdOption>
            <DdOption>自定义</DdOption>
        </DdSelect>
        <DdDatepicker />
        <DdDatepicker />
    </div>
</template>
<style>

</style>
<script>
    import { DdDatepicker, DdSelect, DdOption } from 'dd-vue-component';
    export default{
        data(){
            return{
                msg:'hello vue'
            }
        },
        components:{
            DdDatepicker,
            DdSelect,
            DdOption
        }
    }
</script>
