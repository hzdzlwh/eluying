<template>
    <div>
        <div>
            <ul class="restaurant-head-nav">
                <li>
                    <router-link to="/vip/list">会员列表</router-link>
                </li>
                <li>
                    <router-link to="/vip/setting">会员设置</router-link>
                </li>
            </ul>
        </div>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>
<style>
</style>
<script>
    export default{
        data() {
            return {
               
            }
        },
        methods: {
        
        }
    }
</script>
