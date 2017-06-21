<template>
    <div class="calendar-glyph-detail ing down " :class='{hoverRight : overflow}'>
        <div class="glyph-arrow-up"></div>
        <!-- <div class="glyph-arrow-down"></div> -->
        <div v-for='(item, index) in date.eventList' class="glyph-detail"  @click.stop='tadayClick(item)'>
            <div class="glyph-detail-content" :class="{'glyph-detail-box': index !== date.eventList.length - 1}">
                <div class="glyph-detail-name" v-if='item.checkType'>
                    <div>{{item.customerName}} ({{item.customerPhone}})</div>
                    <span class="checkType">{{checkType[item.checkType]}}</span>
                </div>
                <div class="glyph-detail-time">
                    <div class="start">{{item.startDate.slice(2,16)}}<span class="glyph-label">&nbsp;{{(item.type === 1 || item.type === 2 || item.type === 3) ? '开始': '到达' }}</span></div>
                    <div class="end">{{item.endDate.slice(2,16)}}<span class="glyph-label">&nbsp;{{(item.type === 1 || item.type === 2 || item.type === 3) ? '结束': '离开' }}</span></div>
                    <div class="glyph-label" v-if='!(item.type === 1 || item.type === 2 || item.type === 3)'>共<span>{{item.nights}}</span>晚</div>
                    <div class="glyph-label glyph-status" :style='{"background-color" : colorList[item.type]}' :date-type='item.type'>{{nameList[item.type]}}</div>
                </div>
                <div class="remark" v-if='!(item.type === 1 || item.type === 2 || item.type === 3)'>
                    <span class="glyph-label">备注：</span>{{item.remark}}
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.calendar-glyph-detail {
    padding: 10px 0;
}

.glyph-detail:hover {
    background-color: #e1effa;
}
.glyph-detail-content{
    margin: 0 8px;
}
.glyph-detail-box {
    border-bottom: 1px solid #e6e6e6
}

.glyph-status {
    padding: 3px 10px;
    color: #fff;
    border-radius: 2px;
    font-size: 12px;
    line-height: 12px;
    margin-top: 3px;
    height: 17px;
    width: 48px;
}

.checkType {
    font-size: 14px;
    color: #999999;
}

.calendar-glyph-detail {
    position: relative;
    width: 380px;
}

.hoverRight {
    left: -200px!important;
}

.hoverRight .glyph-arrow-up {
    left: 260px;
}
</style>
<script>
import bus from '../../common/eventBus';
import {
    colorList,
    nameList,
    checkType
} from '../colorList';
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
        return {
            colorList,
            nameList,
            checkType,
            mockDate: [{
                customerName: 'customerName',
                customerPhone: 'customerPhone',
                endDate: '4-20 15:46',
                eventId: 12,
                nights: '1',
                remark: '12312',
                roomOrderId: '123',
                startDate: '4-24 15:21',
                type: 11,
                checkType: 1
            }, {
                customerName: 'customerName',
                customerPhone: 'customerPhone',
                endDate: '4-20 15:46',
                eventId: 13,
                nights: '1',
                remark: '12312',
                roomOrderId: '123',
                startDate: '4-24 15:21',
                type: 12,
                checkType: 1
            }, {
                customerName: 'customerName',
                customerPhone: 'customerPhone',
                endDate: '4-20 15:46',
                eventId: 14,
                nights: '1',
                remark: '12312',
                roomOrderId: '123',
                startDate: '4-24 15:21',
                type: 13,
                checkType: 1
            }, {
                endDate: '4-20 15:46',
                eventId: 15,
                remark: '12312',
                startDate: '4-24 15:21',
                type: 1
            }, {
                endDate: '4-20 15:46',
                eventId: 16,
                remark: '12312',
                startDate: '4-24 15:21',
                type: 2
            }, {
                endDate: '4-20 15:46',
                eventId: 17,
                remark: '12312',
                startDate: '4-24 15:21',
                type: 3
            }]
        };
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
        tadayClick(it) {
            const date = {
                checkOutDate: it.endDate,
                checkInDate: it.startDate,
                roomState: it.type,
                isArrival: false,
                roomName: this.date.roomName,
                roomId: this.date.roomId
            };
            if (it.type === 1 || it.type === 2 || it.type === 3) {
                date.logId = it.eventId;
            } else {
                if (it.roomOrderId) {
                    date.roomOrderId = it.roomOrderId;
                }
                date.orderId = it.eventId;
            }
            bus.$emit('tadayClick', date);
        }
    }
};
</script>
