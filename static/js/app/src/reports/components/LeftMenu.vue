<template>
    <ul class='leftMenu'>
        <li v-if="!route.meta.invisible" v-for="route in $router.options.routes" class="leftMenu-item">
            <router-link :to="route.path">{{route.meta.name}}</router-link>
            <ul v-if="route.children && $route.path.indexOf(route.path) > -1" id="leftMenu-children">
                <li v-for="child in route.children">
                    <router-link :to="child.path">{{child.meta.name}}</router-link>
                </li>
            </ul>
        </li>
    </ul>
</template>
<style>
</style>
<script>
    export default{
        created() {
            console.log(this.$router, this.$route);
        },
        data(){
            return{
                msg:'hello vue'
            }
        },
        components:{
        }
    }
</script>
