<template>
    <div>
        <EntertainmentBody :order='order'></EntertainmentBody>
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
