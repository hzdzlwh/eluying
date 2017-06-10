<template>
    <div class="calendar-glyph-detail ing down">
        <div class="glyph-arrow-up"></div>
        <div class="glyph-arrow-down"></div>
        <div class="glyph-detail-name">
            <div>{{date.customerName}} ({{date.customerPhone}})</div>
            <div class="eluyun_ing2-room_outer spriteImg">
                <div class="eluyun_ing2-room"></div>
            </div>
        </div>
        <div class="glyph-detail-time">
            <div class="start">{{date.checkInDate.slice(5,11)}}<span class="glyph-label">&nbsp;入住</span></div>
            <div class="end">{{date.checkOutDate.slice(5,11)}}<span class="glyph-label">&nbsp;离店</span></div>
            <div class="glyph-label">共<span>{{date.nights}}</span>晚</div>
            <div class="glyph-label">{{date.origin}}</div>
        </div>
        <div class="glyph-detail-price">
            <div><span class="glyph-label">订单总价：</span><span class="num">¥ {{date.totalPrice}}</span></div>
            <!---->
            <div><span class="glyph-label">客户需补：</span><span class="num">¥ {{date.lastPrice}}</span></div>
        </div>
        <!---->
    </div>
</template>
<style scoped>
.calendar-glyph-detail {
    position: relative;
}
</style>
<script>
export default {
    props: {
        date: {
            default: {},
            type: Object
        }
    },
    data() {
        return {};
    },
    computed: {},
    watch: {

    },
    methods: {

    }
};
</script>
