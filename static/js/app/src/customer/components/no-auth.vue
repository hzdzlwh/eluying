<template>
    <div >
	<noAuth :authName='decodeURI($route.query.name)'></noAuth>
    </div>
</template>
<script>
import noAuth from '../../common/components/noAuth.vue';
export default{
    data() {
        return {
        };
    },
    components: {
        noAuth
    }
};
</script>
