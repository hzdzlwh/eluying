<template>
    <ul class="restaurant-head-nav">
        <li v-for="route in routes">
            <router-link :to="route.path">{{route.meta.name}}</router-link>
        </li>
    </ul>
</template>
<style>
</style>
<script>
    export default{
        data() {
            return {
                msg: 'hello vue',
                routes: []
            }
        },
        created() {
            this.routes = this.$route.matched[1].meta.children;
        },
        methods: {
        
        }
    }
</script>
