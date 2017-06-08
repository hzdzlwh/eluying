<template>
    <div style="position: relative">
        <div class="calendar-room-filter-box" @click="toggleSelect">
            <div class="calendar-icon calendar-icon-roomtype"></div>
            <span style="cursor: pointer">状态</span>
            <img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" class='calendar-room-filter-toggle'>
        </div>
        <div v-if="visible" class="calendar-room-filter-select">
            <ul>
                <li v-for="c in roomTypeList" @click="select(c)">
                    <span class="calendar-icon-color" :style='{background:colorList[c.id]}'></span> {{c.name}}
                    <input name="room" type="checkbox" value="roomTypeSelect[c.id]" />
                </li>
            </ul>
        </div>
<!-- room -->
          <div class="calendar-room-filter-box" @click="toggleSelect">
            <div class="calendar-icon calendar-icon-tag"></div>
            <span style="cursor: pointer">标签</span>
            <img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" class='calendar-room-filter-toggle'>
        </div>
        <div v-if="visible" class="calendar-room-filter-select">
            <ul>
                <li v-for="c in roomTypeList" @click="select(c)">
                    <span class="calendar-icon-color" :style='{background:colorList[c.id]}'></span> {{c.name}}
                    <input name="room" type="checkbox" value="roomTypeSelect[c.id]" />
                </li>
            </ul>
        </div>
<!-- tag -->

    </div>
</template>
<style scoped>
.calendar-room-filter-select ul {
    width: 183px;
    padding: 0 17px 0 30px ;
}

.calendar-room-filter-select li {
    margin: 0 0 10px;
}
.calendar-room-filter-select li input {
    float: right;
}
.calendar-room-filter-select {
    padding-top:15px;
    top: 38px;
    cursor: default;
    left: 0;
    z-index: 1;
    background: #fafafa;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.15);
    border-radius: 2px;
}

.calendar-room-filter-box {
    background: #ffffff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.10);
    height: 38px;
    padding: 12px 16px;
}

.calendar-icon {
    width: 14px;
    height: 14px;
    background-repeat: no-repeat;
    display: inline-block;
    vertical-align: text-top;
    margin-right: 8px;
}

.calendar-icon-roomtype {
    background-image: url('/static/image/icon/ico1.png')
}
.calendar-icon-tag{
    background-image: url('/static/image/icon/ico2.png')
}
.calendar-icon-room{
    background-image: url('/static/image/icon/ico3.png')
}
.calendar-room-filter-toggle {
    float: right;
    margin-top: 7px;
}

.calendar-icon-color {
    width: 14px;
    display: inline-block;
    height: 14px;
    margin-right: 5px;
}
</style>
<script>
import {
    colorList
} from '../colorList';
export default {
    props: {
        categories: Array
    },
    data() {
        return {
            roomTypeSelect: {

            },
            colorList,
            visible: false,
            categoriesTemp: [],
            roomTypeList: [{
                name: '空房',
                id: '0'
            }, {
                name: '在住',
                id: '11'
            }, {
                name: '预离',
                id: '12'
            }, {
                name: '保留',
                id: '1'
            }, {
                name: '维修',
                id: '2'
            }, {
                name: '停用',
                id: '3'
            }],
            tagList: [{
                name: '预抵',
                color: '#e59547',
                value: '1'
            }, {
                name: '脏房',
                color: '#8b7258',
                value: '2'
            }]
        };
    },
    methods: {
        toggleSelect() {
            if (this.visible) {
                this.visible = false;
            } else {
                this.categoriesTemp = this.categories.map(c => ({ ...c
                }));
                this.visible = true;
            }
        },
        select() {

        },
        hide() {
            this.visible = false;
        }
    }
};
</script>
