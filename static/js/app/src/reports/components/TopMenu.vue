<template>
    <ul class="restaurant-head-nav">
        <li v-for="route in routes">
            <router-link :to="route.path">{{route.meta.name}}</router-link>
        </li>
    </ul>
</template>
<style lang="sass" rel="stylesheet/scss">
    a {
        text-decoration: none;
        &:link {
            text-decoration: none;
        }
        &:visited {
            text-decoration: none;
        }
        &:hover {
            text-decoration: none;
        }
        &:active {
            text-decoration: none;
        }
    }
</style>
<script>
    export default{
        data() {
            return {
                routes: []
            }
        },
        created() {
            this.routes = this.$route.matched[1].meta.children;
        },
        watch: {
            ['$route.path']() {
                this.routes = this.$route.matched[1].meta.children;
            }
        },
        methods: {
        
        }
    }
</script>
