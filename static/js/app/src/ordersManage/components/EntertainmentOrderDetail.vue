<template>
    <div>
        <EntertainmentOrder :order='order' :showMoadl=false></EntertainmentOrder>
        <EntertainmentBody :order='order'></EntertainmentBody>
        <div class="content-item"><p class="content-item-title"><span>备注信息</span></p> <div>{{order.remark || "无"}}</div></div>
    </div>
</template>
<style scoped>
</style>
<script>
import EntertainmentOrder from './EntertainmentOrder.vue'
import EntertainmentBody from './EntertainmentBody.vue'
export default {
    props: {
        order: {
            type: Object,
            default: undefined
        }
    },
    components: {
        EntertainmentOrder,
        EntertainmentBody
    }
}
</script>
