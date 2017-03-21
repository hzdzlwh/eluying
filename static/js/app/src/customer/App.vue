<template>
<div>
    <ul class="leftMenu">
        <li class="leftMenu-item">
            <router-link to="/vip">会员客户</router-link>
        </li>
        <li class="leftMenu-item">
            <router-link to="/company">企业客户</router-link>
        </li>
        <li class="leftMenu-item">
            <router-link to="/non-vip">非会员客户</router-link>
        </li>
    </ul>
    <router-view></router-view>
</div>
</template>
<style>
</style>
<script>
    export default{
        data () {
            return {
            }
        }
    }
</script>
