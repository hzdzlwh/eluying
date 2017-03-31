<template>
    <div>
        <EntertainmentBody :order='order'></EntertainmentBody>
        <div class="content-item" ><p class="content-item-title"><span>备注信息</span></p> <div>{{order.remark || '无'}}</div></div>
    </div>
</template>
<style scoped>
</style>
<script>
import EntertainmentBody from './EntertainmentBody.vue'
export default {
    props: {
        order: {
            type: Object,
            default: undefined
        }
    },
    components: {
        EntertainmentBody
    }
}
</script>
