<template>
    <div>
        <div class="dd-datepicker-container">
            <DdDatepicker v-model="date" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import http from '../../../../common/http';
    import { DdDatepicker, DdDropdown, DdDropdownItem } from 'dd-vue-component';
    
    export default {
        data() {
            return {
                date: ''
            };
        },
        computed: {
            ...mapState(['date'])
        },
        components: {
            DdDatepicker,
            DdDropdown,
            DdDropdownItem
        },
        beforeRouteEnter(to, from, next) {
            next(() => {
                $('.date-select-container').hide();
            });
        },
        beforeRouteLeave(to, from, next) {
            $('.date-select-container').show();
            next();
        }
    };
</script>

<style lang="scss" scoped>
    
</style>
