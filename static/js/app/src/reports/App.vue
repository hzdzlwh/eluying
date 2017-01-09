<template>
    <div class="reports-container">
        <LeftMenu></LeftMenu>
        <DateSelect></DateSelect>
        <router-view></router-view>
    </div>
</template>
<style>
    .reports-container {
        padding-top: 68px;
        padding-left: 168px;
    }
</style>
<script>
    import LeftMenu from './components/LeftMenu.vue';
    import DateSelect from './components/DateSelect.vue';
    export default{
        data() {
            return{
                msg:'hello vue'
            }
        },
        components:{
            LeftMenu,
            DateSelect
        }
    }
</script>
