<template>
    <div>
        <TopMenu />
        <router-view></router-view>
    </div>
</template>
<style>
</style>
<script>
    import TopMenu from '../components/TopMenu.vue'
    export default{
        components: {
            TopMenu
        }
    }
</script>
