<template>
    <div class="calendar-glyph-detail ing down " :class='{hoverRight : overflow}'>
        <div class="glyph-arrow-up"></div>
        <div class="glyph-arrow-down"></div>
        <div class="glyph-detail-name">
            <div>{{date.customerName}} ({{date.customerPhone}})</div>
            <div class="eluyun_book2-small_outer spriteImg" v-if='date.roomState === 0'>
                <div class="eluyun_book2-small"></div>
            </div>
            <div class="eluyun_ing2-room_outer spriteImg" v-else>
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

.hoverRight {
    left: -200px!important;
}

.hoverRight .glyph-arrow-up {
    left: 260px;
}
</style>
<script>
export default {
    props: {
        date: {
            default: {},
            type: Object
        },
        hoverShow: {
            default: undefined,
            type: MouseEvent
        }
    },
    data() {
        return {};
    },
    computed: {
        overflow() {
            if (this.hoverShow && this.date) {
                return window.document.body.clientWidth - this.hoverShow.x < 350;
            }
        }
    },
    watch: {

    },
    methods: {

    }
};
</script>
