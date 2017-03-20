<template>
<div>
    <ul class="leftMenu"><!---->
    <li class="leftMenu-item">
    <a href="/view/customer/vip" :class="{ active: step ===1 }" @click='changestep(1)'>会员客户</a> 
    <a href="/view/customer/company" :class="{ active: step ===2 }" @click='changestep(2)'>企业客户</a> 
    <a href="/view/customer/non-vip" :class="{ active: step ===3 }" @click='changestep(3)'>非会员客户</a> 
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
                step: 1
            }
        },
        methods: {
            changestep: function (step) {
                this.step = this.$route.meta.step
            }
        },
        watch: {
            '$route': 'changestep'
        },
        created () {
            this.changestep()
        }
    }
</script>
