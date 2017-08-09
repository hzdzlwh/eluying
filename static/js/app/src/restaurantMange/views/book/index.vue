/*
* @Author: lxj
* @Date:   2017-07-28 16:16:28
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-07-28 16:16:28
* @email: 783384903@qq.com
*/

<template>
    <div>
        <leftMenu></leftMenu>
        <router-view></router-view>
    </div>
</template>
<style>
    
</style>
<script>
    import leftMenu from '../../components/leftMenu.vue';
    export default {
        props: {
        },
        data() {
            return {
            };
        },
        conputed: {
        },
        methods: {
        },
        watch: {
        },
        components: {
            leftMenu
        },
        created() {
        }
    };
</script>