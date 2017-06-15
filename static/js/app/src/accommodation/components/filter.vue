<template>
    <div style="position: relative;border-right: 1px solid #ccc;">
        <div class="calendar-room-filter-box" @click="roomTypeVisible = !roomTypeVisible">
            <div class="calendar-icon calendar-icon-roomtype"></div>
            <span style="cursor: pointer">状态</span>
            <img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" :class='{calendarChange: roomTypeVisible}' class='calendar-room-filter-toggle'>
        </div>
        <div v-show="roomTypeVisible" class="calendar-room-filter-select" >
            <ul>
                <li v-for="c in roomTypeList">
                <label >
                    <span class="calendar-icon-color" :style='{background:colorList[c.id]}'></span><span >{{c.name}}</span> <span>({{roomTypeCount && roomTypeCount[c.tag]}})</span>
                    <input name="room" class="dd-checkbox" type="checkbox" :value='c.select' @change="setSelect(c)" />
                    </label>
                </li>
            </ul>
        </div>
        <!-- roomType -->
        <div class="calendar-room-filter-box" @click="tagVisible = !tagVisible">
            <div class="calendar-icon calendar-icon-tag"></div>
            <span style="cursor: pointer">标签</span>
            <img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" :class='{calendarChange: tagVisible}' class='calendar-room-filter-toggle'>
        </div>
        <div v-show="tagVisible" class="calendar-room-filter-select">
            <ul>
                <li v-for="c in tagList">
                <label >
                   <span class="calendar-tag-color" :style='{background:c.color}'>{{c.name}}</span><span>({{roomTypeCount && roomTypeCount[c.tag]}})</span>
                    <input name="room" class="dd-checkbox" type="checkbox" :value='c.select' @change="setSelect(c)" />
                    </label>
                </li>
            </ul>
        </div>
        <!-- tag -->
        <div class="calendar-room-filter-box" @click="roomVisible = !roomVisible">
            <div class="calendar-icon calendar-icon-room"></div>
            <span style="cursor: pointer">房型</span>
            <img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" :class='{calendarChange: roomVisible}' class='calendar-room-filter-toggle'>
        </div>
        <div v-show="roomVisible" class="calendar-room-filter-select">
            <ul>
                <li v-for="c in categoriesList">
                <label >
                    <span>{{c.name}}</span>
                    <input name="room" class="dd-checkbox" type="checkbox" :value='c.select' @change="setSelect(c)" />
                    </label>
                </li>
            </ul>
        </div>
        <!-- room -->
        <div class="calendar-room-filter-box" @click="areaVisible = !areaVisible">
            <div class="calendar-icon calendar-icon-area"></div>
            <span style="cursor: pointer">区域</span>
            <img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" :class='{calendarChange: areaVisible}' class='calendar-room-filter-toggle'>
        </div>
        <div v-show="areaVisible" class="calendar-room-filter-select">
            <ul>
                <li v-for="c in areaTemp">
                <label >
                    <span>{{c.name}}</span>
                    <input name="room" class="dd-checkbox" type="checkbox" :value='c.select' @change="setSelect(c)" />
                    </label>
                </li>
            </ul>
        </div>
        <!-- area -->
        <div class="calendar-room-filter-box" @click="customVisible = !customVisible">
            <div class="calendar-icon calendar-icon-custom"></div>
            <span style="cursor: pointer">客源</span>
            <img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" :class='{calendarChange: customVisible}' class='calendar-room-filter-toggle'>
        </div>
        <div v-show="customVisible" class="calendar-room-filter-select">
            <ul>
                <li v-for="c in customTemp">
                <label >
                    <span>{{c.name}}</span>
                    <input name="room" class="dd-checkbox" type="checkbox" :value='c.select' @change="setSelect(c)" />
                    </label>
                </li>
            </ul>
        </div>
        <!-- custom -->
    </div>
</template>
<style scoped>
.calendar-room-filter-select label{
    display: block;
};
.calendar-tag-color {
    color: #fff;
    padding: 3px;
    background: #f29130;
    border-radius: 2px;
}

.calendar-room-filter-select ul {
    width: 183px;
    padding: 0 17px 5px 30px;
}

.calendar-room-filter-select li {
    margin-bottom: 20px;
}

.calendar-room-filter-select li input {
    float: right;
}

.calendar-room-filter-select {
    padding-top: 15px;
    top: 38px;
    cursor: default;
    left: 0;
    z-index: 1;
    background: #fafafa;
    /*box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.15);*/
    border-radius: 2px;
    transition:all 1s; 
}

.calendar-room-filter-box {
    background: #ffffff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.10);
    height: 38px;
    padding: 12px 16px;
    margin-bottom:4px;
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

.calendar-icon-tag {
    background-image: url('/static/image/icon/ico2.png')
}

.calendar-icon-room {
    background-image: url('/static/image/icon/ico3.png')
}

.calendar-icon-area {
    background-image: url('/static/image/icon/ico4.png')
}

.calendar-icon-custom {
    background-image: url('/static/image/icon/ico5.png')
}

.calendar-room-filter-toggle {
    float: right;
    margin-top: 7px;
    transition:all 1s; 
}
.calendarChange{
    transform:rotate(180deg); 
}
.calendar-icon-color {
    width: 14px;
    display: inline-block;
    height: 14px;
    margin-right: 5px;
    vertical-align: text-top;
}
.calendar-tag-color {
    display: inline-block;
    margin-right: 5px;
    padding: 2px;
    color:#fff;
}
</style>
<script>
import {
    colorList
} from '../colorList';
export default {
    props: {
        categories: Array,
        customList: Array,
        areaList: Array,
        roomTypeCount: Object
    },
    data() {
        return {
            categoriesList: [],
            colorList,
            roomTypeVisible: false,
            tagVisible: false,
            roomVisible: false,
            customVisible: false,
            areaVisible: false,
            categoriesTemp: [],
            customTemp: [],
            areaTemp: [],
            roomTypeList: [{
                name: '空房',
                id: '0',
                tag: 'empty'
            }, {
                name: '在住',
                id: '11',
                tag: 'checkIn'
            }, {
                name: '预离',
                id: '12',
                tag: 'dueOut'
            }, {
                name: '保留',
                id: '1',
                tag: 'persist'
            }, {
                name: '维修',
                id: '2',
                tag: 'repair'
            }, {
                name: '停用',
                id: '3',
                tag: 'blockUp'
            }],
            tagList: [{
                name: '预抵',
                color: '#e59547',
                value: '1',
                tag: 'arrival'
            }, {
                name: '脏房',
                color: '#8b7258',
                value: '2',
                tag: 'dirty'
            }]
        };
    },
    computed: {
        parms() {
            const categoriesParms = [];
            const roomTypeList = [];
            const tagList = [];
            const areaList = [];
            const customList = [];
            this.categoriesList.forEach(function(el, index) {
                if (el.select) {
                    categoriesParms.push(Number(el.id));
                }
            });
            this.roomTypeList.forEach(function(el, index) {
                if (el.select) {
                    roomTypeList.push(Number(el.id));
                }
            });
            this.tagList.forEach(function(el, index) {
                if (el.select) {
                    tagList.push(Number(el.value));
                }
            });
            this.areaTemp.forEach(function(el, index) {
                if (el.select) {
                    areaList.push(Number(el.id));
                }
            });
            this.customList.forEach(function(el, index) {
                if (el.select) {
                    customList.push(Number(el.id));
                }
            });
            return {
                roomTypes: JSON.stringify(categoriesParms),
                states: JSON.stringify(roomTypeList),
                tags: JSON.stringify(tagList),
                origins: JSON.stringify(customList),
                zones: JSON.stringify(areaList)
            };
        }
    },
    watch: {
        categories(val) {
            this.categoriesList = val;
        },
        customList(val) {
            this.customTemp = val;
        },
        areaList(val) {
            this.areaTemp = val;
        },
        parms(n, o) {
            if (JSON.stringify(n) !== JSON.stringify(o)) {
                this.$emit('change', n);
            }
        }
    },
    methods: {
        setSelect(item) {
            this.$set(item, 'select', !item.select);
        },
        getParms() {
            const categoriesParms = [];
            const roomTypeList = [];
            const tagList = [];
            const areaList = [];
            const customList = [];
            this.categoriesList.forEach(function(el, index) {
                if (el.select) {
                    categoriesParms.push(Number(el.id));
                }
            });
            this.roomTypeList.forEach(function(el, index) {
                if (el.select) {
                    roomTypeList.push(Number(el.id));
                }
            });
            this.tagList.forEach(function(el, index) {
                if (el.select) {
                    tagList.push(Number(el.id));
                }
            });
            this.areaTemp.forEach(function(el, index) {
                if (el.select) {
                    areaList.push(Number(el.id));
                }
            });
            this.customList.forEach(function(el, index) {
                if (el.select) {
                    customList.push(Number(el.id));
                }
            });
            return {
                roomTypes: JSON.stringify(categoriesParms),
                states: JSON.stringify(roomTypeList),
                tags: JSON.stringify(tagList),
                origins: JSON.stringify(customList),
                zones: JSON.stringify(areaList)
            };
        },
        toggleSelect() {
            if (this.visible) {
                this.visible = false;
            } else {
                this.categoriesTemp = this.categories.map(c => ({ ...c
                }));
                this.visible = true;
            }
        },
        hide() {
            this.visible = false;
        }
    }
};
</script>
