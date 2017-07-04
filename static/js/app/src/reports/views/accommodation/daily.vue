<template>
    <div>
        <div style="display: flex">
            <table>
                <thead>
                <tr>
                    <th>分类</th>
                    <th colspan="4">本日</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>入住类型</td>
                    <td>间夜量</td>
                    <td>房费</td>
                    <td>平均房价</td>
                    <td>出租率（扣除维修房、停用房）</td>
                </tr>
                <tr v-for="r in checkTypeDayStat">
                    <td>{{r.name}}</td>
                    <td>{{r.night}}</td>
                    <td>{{r.fee}}</td>
                    <td>{{r.avg}}</td>
                    <td>{{r.rate}}</td>
                </tr>
                <tr></tr>
                <tr v-for="r in roomTypeDayStat">
                    <td>{{r.name}}</td>
                    <td>{{r.night}}</td>
                    <td>{{r.fee}}</td>
                    <td>{{r.avg}}</td>
                    <td>{{r.rate}}</td>
                </tr>
                </tbody>
            </table>
            <table>
                <thead>
                <tr>
                    <th colspan="4">本日</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>间夜量</td>
                    <td>房费</td>
                    <td>平均房价</td>
                    <td>出租率（扣除维修房、停用房）</td>
                </tr>
                <tr v-for="r in checkTypeMonStat">
                    <td>{{r.night}}</td>
                    <td>{{r.fee}}</td>
                    <td>{{r.avg}}</td>
                    <td>{{r.rate}}</td>
                </tr>
                <tr></tr>
                <tr v-for="r in roomTypeMonStat">
                    <td>{{r.night}}</td>
                    <td>{{r.fee}}</td>
                    <td>{{r.avg}}</td>
                    <td>{{r.rate}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import { DdDatepicker, DdDropdown, DdDropdownItem } from 'dd-vue-component';
    export default {
        data() {
            return {
                checkTypeDayStat: [],
                checkTypeMonStat: [],
                roomTypeDayStat: [],
                roomTypeMonStat: []
            };
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
