<template>
    <!-- <div v-for 'item in data'> -->
        <vipCardSet :data=item></vipCardSet>
    <!-- </div> -->
</template>
<script>
import vipCardSet from '../../components/vipCardSet';
import http from '../../../common/http';
export default {
    data() {
        return {
            data: []
        };
    },
    components: {
        vipCardSet
    },
    methods: {
        fetchDate() {
            http.get('/vipCard/getVipCardSettings')
                .then(res => {
                    this.data = res.data.list;
                });
        }
    },
    created() {
        this.fetchDate();
    }
};
</script>
