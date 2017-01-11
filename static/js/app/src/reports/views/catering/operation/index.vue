<template>
    <div>
        <TopMenu />
    </div>
</template>
<style>
</style>
<script>
    import TopMenu from '../../../components/TopMenu.vue'
    export default{
        data() {
            return {
                msg: 'hello vue'
            }
        },
        components: {
            TopMenu
        }
    }
</script>
