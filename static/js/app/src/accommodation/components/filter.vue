<template>
    <div style="position: relative">
        <div class="calendar-room-filter-box" @click="roomTypeVisible = !roomTypeVisible">
            <div class="calendar-icon calendar-icon-roomtype"></div>
            <span style="cursor: pointer">状态</span>
            <img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" class='calendar-room-filter-toggle'>
        </div>
        <div v-if="roomTypeVisible" class="calendar-room-filter-select">
            <ul>
                <li v-for="c in roomTypeList">
                    <span class="calendar-icon-color" :style='{background:colorList[c.id]}'></span> {{c.name}}
                    <input name="room" class="dd-checkbox" type="checkbox" :value='c.select' @change="setSelect(c)" />
                </li>
            </ul>
        </div>
        <!-- roomType -->
        <div class="calendar-room-filter-box" @click="tagVisible = !tagVisible">
            <div class="calendar-icon calendar-icon-tag"></div>
            <span style="cursor: pointer">标签</span>
            <img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" class='calendar-room-filter-toggle'>
        </div>
        <div v-if="tagVisible" class="calendar-room-filter-select">
            <ul>
                <li v-for="c in tagList">
                    <span class="calendar-tag-color" :style='{background:c.color}'>{{c.name}}</span>
                    <input name="room" type="checkbox" :value='c.select' @change="setSelect(c)" />
                </li>
            </ul>
        </div>
        <!-- tag -->
        <div class="calendar-room-filter-box" @click="roomVisible = !roomVisible">
            <div class="calendar-icon calendar-icon-room"></div>
            <span style="cursor: pointer">房型</span>
            <img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" class='calendar-room-filter-toggle'>
        </div>
        <div v-if="roomVisible" class="calendar-room-filter-select">
            <ul>
                <li v-for="c in categoriesList">
                    <span>{{c.name}}</span>
                    <input name="room" type="checkbox" :value='c.select' @change="setSelect(c)" />
                </li>
            </ul>
        </div>
        <!-- room -->
        <div class="calendar-room-filter-box" @click="areaVisible = !areaVisible">
            <div class="calendar-icon calendar-icon-area"></div>
            <span style="cursor: pointer">区域</span>
            <img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" class='calendar-room-filter-toggle'>
        </div>
        <div v-if="areaVisible" class="calendar-room-filter-select">
            <ul>
                <li v-for="c in areaTemp">
                    <span>{{c.name}}</span>
                    <input name="room" type="checkbox" :value='c.select' @change="setSelect(c)" />
                </li>
            </ul>
        </div>
        <!-- area -->
        <div class="calendar-room-filter-box" @click="customVisible = !customVisible">
            <div class="calendar-icon calendar-icon-custom"></div>
            <span style="cursor: pointer">客源</span>
            <img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" class='calendar-room-filter-toggle'>
        </div>
        <div v-if="customVisible" class="calendar-room-filter-select">
            <ul>
                <li v-for="c in customTemp">
                    <span>{{c.name}}</span>
                    <input name="room" type="checkbox" :value='c.select' @change="setSelect(c)" />
                </li>
            </ul>
        </div>
        <!-- custom -->
    </div>
</template>
<style scoped>
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
        categories: Array,
        customList: Array,
        areaList: Array
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
                    customList.push(Number(el.id));
                }
            });
            this.customList.forEach(function(el, index) {
                if (el.select) {
                    areaList.push(Number(el.id));
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
        // categoriesList(n, o) {
        //     if (o !== []) {
        //         this.$emit('change', this.getParms());
        //     }
        // },
        // tagList(n, o) {
        //     if (o !== []) {
        //         this.$emit('change', this.getParms());
        //     }
        // },
        // roomTypeList(n, o) {
        //     if (o !== []) {
        //         this.$emit('change', this.getParms());
        //     }
        // },
        // roomTypeList: {
        //     handler(n, o) {
        //         if (o !== []) {
        //             this.$emit('change', this.getParms());
        //         }
        //     },
        //     deep: true
        // },
        // tagList: {
        //     handler(n, o) {
        //         if (o !== []) {
        //             this.$emit('change', this.getParms());
        //         }
        //     },
        //     deep: true
        // },
        // areaTemp: {
        //     handler(n, o) {
        //         if (o !== []) {
        //             this.$emit('change', this.getParms());
        //         }
        //     },
        //     deep: true
        // },
        // customTemp: {
        //     handler(n, o) {
        //         if (o !== []) {
        //             this.$emit('change', this.getParms());
        //         }
        //     },
        //     deep: true
        // },
        // categoriesList: {
        //     handler(n, o) {
        //         if (o !== []) {
        //             this.$emit('change', this.getParms());
        //         }
        //     },
        //     deep: true
        // }
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
                    customList.push(Number(el.id));
                }
            });
            this.customList.forEach(function(el, index) {
                if (el.select) {
                    areaList.push(Number(el.id));
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
