<template>
    <div>
        <p>订单金额拆分到每日订单，统计每日订单消费金额的渠道来源</p>
        <div class="card">
            <h5 class="card-title"><b>渠道来源分析</b></h5>
            <div style="display: flex">
                <div id="pie" style="width: 40%"></div>
                <div id="line" style="width: 60%"></div>
            </div>
        </div>
    </div>
</template>
<style>

</style>
<script>
    export default{
        data() {
            return{
                msg:'hello vue'
            }
        }
    }
</script>
