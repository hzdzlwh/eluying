<template>
    <div>
        <EntertainmentBody :order='order'></EntertainmentBody>
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
