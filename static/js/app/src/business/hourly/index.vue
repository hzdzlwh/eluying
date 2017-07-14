<!-- 这文件不是我写的=-=代码太💩一堆bug，改不下去了 -->
<template>
    <div>
        <div style="box-shadow:0 0 5px 0 rgba(0,0,0,0.15);border-radius:2px;width:506px;border-top:4px solid #178ce6">
            <div style="height: 49px;background: #f0f0f0;display: flex;justify-content: space-between;align-items: center;padding: 0 20px"><span style="font-size: 16px">房型设置</span>
                <span style="cursor: pointer;color: #178ce6" @click="create"><img style="margin-right: 4px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAIVBMVEUAAAAXjegYjOYXjugYjecZj+YZjukXjegajOkXjeYXjObcqVb2AAAACnRSTlMASuNVYF1FklCadOWS3AAAADZJREFUCNdjEFoFBooMigxgIMSwAMLgQmFwJEAZLAZoDNHI0kAwI9m82AxDDbJ2TJPhlsKdAQDzmRTUpGPOVQAAAABJRU5ErkJggg" alt="">新增房型</span></div>
            <div style="padding: 16px 20px">
                <div v-for="room in rooms" :key="room.settingId" style="box-shadow:0 0 5px 0 rgba(0,0,0,0.15);border-radius:2px;margin-bottom: 20px">
                    <div style="background:#f0f0f0;height:37px;padding: 0 20px;display: flex;align-items: center;font-size: 16px;justify-content: space-between">
                        <span style="display: flex;align-items: center">
                            <span>房型：</span>
                            <dd-select v-if="!room.settingId || room.edit" v-model="room.subTypeId">
                                <dd-option :key="c.cId" :label="c.cName" :value="c.cId" v-for="c in getAvailableCategories(room)"></dd-option>
                            </dd-select>
                            <span v-if="room.settingId && !room.edit">{{room.subTypeName}}</span>
                        </span>
                        <span style="cursor: pointer;color: #178ce6;font-size: 14px" v-if="room.settingId && !room.edit"><span @click="edit(room)">编辑</span>/<span @click="deleteRoom(room.settingId)">删除</span></span>
                    </div>
                    <div style="padding: 16px 20px" v-if="!room.settingId || room.edit">
                        <div class="line">
                            <span class="slabel">起步时长<span class="msg" v-if="msg.startDuration">{{msg.startDuration}}</span></span><input type="text" class="dd-input" v-model.lazy="room.startDuration" @input="handleInput(1, $event)">小时
                            <span class="slabel" style="margin-left: 32px">起步价格<span class="msg" v-if="msg.startPrice">{{msg.startPrice}}</span></span>￥<input @input="handleInput(2, $event)" type="text" class="dd-input" v-model.lazy="room.startPrice">
                        </div>
                        <div class="line">
                            <span class="slabel">单位时长<span class="msg" v-if="msg.unitDuration">{{msg.unitDuration}}</span></span><input type="text" class="dd-input" v-model.lazy="room.unitDuration" @input="handleInput(1, $event)">小时
                            <span class="slabel" style="margin-left: 32px">单位价格<span class="msg" v-if="msg.unitPrice">{{msg.unitPrice}}</span></span>￥<input @input="handleInput(2, $event)" type="text" class="dd-input" v-model.lazy="room.unitPrice">
                        </div>
                        <div class="line">
                            <span class="slabel">最大时长<span class="msg" v-if="msg.maxDuration">{{msg.maxDuration}}</span></span><input type="text" class="dd-input" v-model.lazy="room.maxDuration" @input="handleInput(1, $event)">小时
                        </div>
                        <div class="line" style="display: flex">
                            <span class="slabel">开放时段</span>
                            <div>
                                <div>
                                    <div v-for="(h, index) in room.openHours" class="line">
                                     <el-time-select
                                        placeholder="起始时间"
                                        v-model="h.startDate"
                                        format='HH:mm'
                                        :clearable=false
                                        >
                                      </el-time-select>
                                      <el-time-select
                                        placeholder="结束时间"
                                        v-model="h.endDate"
                                        format='HH:mm'
                                        :clearable=false
                                        >
                                      </el-time-select>
                                       <!--  <input type="text" class="dd-input" v-model="h.start"> - <input type="text" class="dd-input" v-model="h.end">
                                        <span></span> -->
                                        <img @click="deleteOpenHours(room, index)" style="cursor: pointer;margin-left: 16px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAS1BMVEUAAACbm5uampqampqampqbm5uhoaGampqbm5uampqbm5ucnJyZmZmampqampqZmZmampqampqbm5uZmZmbm5uampqhoaGampqZmZltaZz8AAAAGHRSTlMAa6uhi3Ubl4SlYyXx0JiAW0tJQT41E+/1WhRoAAAAWklEQVQY08XI2RGAIBAE0V4PVg5vUPKPVJQqUvB99QyfGHK+Y+1VVZfgjHFhKbkiU7FT7G8JXDR1WMchbBty4CzQCWPPMNCPSPfr4U9S4vT1UGsaq4CfczN7HnrMBOywZ/dgAAAAAElFTkSuQmCC" alt="">
                                    </div>
                                </div>
                                <span v-if="room.openHours && room.openHours.length < 5" @click="addOpenHours(room)" style="cursor: pointer;color: #178ce6">新增时间段</span>
                            </div>
                        </div>
                        <div style="padding-left: 64px">
                            <button @click="save(room)" class="dd-btn dd-btn-primary dd-btn-sm" style="margin-right: 20px">保存</button>
                            <button class="dd-btn dd-btn-sm dd-btn-ghost" @click="cancel(room)">取消</button>
                        </div>
                    </div>
                    <div style="padding: 16px 20px" v-if="room.settingId && !room.edit">
                        <div class="line">
                            <span class="slabel">起步时长</span><span class="word">{{room.startDuration}}小时</span>
                            <span class="slabel" style="margin-left: 32px">起步价格</span>￥<span class="word">{{room.startPrice}}</span>
                        </div>
                        <div class="line">
                            <span class="slabel">单位时长</span><span class="word">{{room.unitDuration}}小时</span>
                            <span class="slabel" style="margin-left: 32px">单位价格</span>￥<span class="word">{{room.unitPrice}}</span>
                        </div>
                        <div class="line">
                            <span class="slabel">最大时长</span><span class="word">{{room.maxDuration}}小时</span>
                        </div>
                        <div class="line" style="display: flex">
                            <span class="slabel">开放时段</span>
                            <div>
                                <div>
                                    <div v-for="(h, index) in room.openHours" class="line">
                                        <span>{{h.start}}</span> - <span>{{h.end}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    .msg {
        position: absolute;
        font-size: 12px;
        color: #f24949;
        bottom: -20px;
        left: 60px;
        display: block;
        width: 200px;
    }
    .line .el-input{
        width: 105px!important;
        height: 24px;
    }
    .line .el-input input {
        height: 24px;
    }
</style>
<script>
    import http from 'http';
    import modal from 'modal';
    import { DdSelect, DdOption } from 'dd-vue-component';
import {
    TimePicker
} from 'element-ui';
    export default {
        created() {
            this.getHourRoomSetting();
            this.getRoomCategories();
        },
        data() {
            return {
                rooms: [],
                categories: [],
                msg: {}
            };
        },
        methods: {
            getHourRoomSetting() {
                http.get('/room/getHourRoomSetting')
                    .then(res => {
                        this.rooms = res.data.list;
                        this.rooms.forEach(element => {
                            element.openHours.forEach(el => {
                                const dateEnd = el.end.split(':');
                                const dateStart = el.start.split(':');
                                this.$set(el, 'endDate',new Date(2017, 8, 8, dateEnd[0], dateEnd[1]));
                                this.$set(el, 'startDate',new Date(2017, 8, 8, dateStart[0], dateStart[1]));
                            });
                        });
                    });
            },
            create() {
                if (this.rooms[0] && !this.rooms[0].settingId) {
                    return false;
                }
                this.rooms.unshift({
                    maxDuration: '',
                    openHours: [],
                    startDuration: '',
                    startPrice: '',
                    subTypeId: undefined,
                    unitDuration: '',
                    unitPrice: ''
                });
            },
            cancel(room) {
                if (room.edit) {
                    this.getHourRoomSetting();
                } else {
                    this.rooms.shift();
                }
            },
            addOpenHours(room) {
                room.openHours.push({
                    startDate: '',
                    endDate: '',
                    start: '',
                    end: ''
                });
            },
            deleteOpenHours(room, index) {
                room.openHours.splice(index, 1);
            },
            save(room) {
                this.msg = {};
                room.openHours.forEach(el => {
                    el.start = el.startDate.getHours() + ':' + el.startDate.getMinutes();
                    el.end = el.endDate.getHours() + ':' + el.endDate.getMinutes();
                });
                if (!room.subTypeId) {
                    modal.warn('请选择房型');
                    return false;
                }
                if (!/^(((\d|1\d|2[0-3])(\.\d)?)|(24(\.0)?))$/.test(room.startDuration)) {
                    this.msg.startDuration = '↑请输入0.1-24之间的数字';
                    return false;
                }
                if (room.startPrice === '' || Number.isNaN(Number(room.startPrice)) || (room.startPrice < 0.01 && room.startPrice > 20000000) || (room.startPrice * 100 % 1 !== 0)) {
                    this.msg.startPrice = '↑请输入0.01-20,000,000之间的数字';
                    return false;
                }
                if (!/^(((\d|1\d|2[0-3])(\.\d)?)|(24(\.0)?))$/.test(room.unitDuration)) {
                    this.msg.unitDuration = '↑请输入0.1-24之间的数字';
                    return false;
                }
                if (room.unitPrice === '' || Number.isNaN(Number(room.unitPrice)) || (room.unitPrice < 0.01 && room.unitPrice > 20000000) || (room.unitPrice * 100 % 1 !== 0)) {
                    this.msg.unitPrice = '↑请输入0.01-20,000,000之间的数字';
                    return false;
                }
                if (!/^(((\d|1\d|2[0-3])(\.\d)?)|(24(\.0)?))$/.test(room.maxDuration)) {
                    this.msg.maxDuration = '↑请输入0.1-24之间的数字';
                    return false;
                }
                if (Number(room.maxDuration) < Number(room.startDuration)) {
                    this.msg.maxDuration = '↑最大时长不能小于起步时长';
                    return false;
                }
                if (!room.openHours || !room.openHours[0] || !room.openHours[0].start || !room.openHours[0].end) {
                    modal.warn('请填写开放时间段');
                    return false;
                }
                http.post('/room/saveHourRoomSetting', { ...room, openHours: JSON.stringify(room.openHours) })
                    .then(res => {
                        this.getHourRoomSetting();
                    });
            },
            deleteRoom(settingId) {
                modal.confirm({ message: '确定删除该钟点房房型吗？' }, () => {
                    http.post('/room/delHourRoomSetting', { settingId })
                        .then(res => {
                            this.getHourRoomSetting();
                        });
                });
            },
            getRoomCategories() {
                http.get('/room/getRoomCategories')
                    .then(res => {
                        this.categories = res.data.list;
                    });
            },
            getAvailableCategories(room) {
                return this.categories.filter(c =>
                    c.cId === room.subTypeId || !this.rooms.some(r => r.subTypeId === c.cId)
                );
            },
            edit(room) {
                this.$set(room, 'edit', true);
            },
            handleInput(length, ev) {
                const input = ev.target;
                if (input.value.split('.')[1] && input.value.split('.')[1].length > length) {
                    input.value = input.value.slice(0, -1);
                }
            }
        },
        components: {
            DdSelect,
            DdOption,
            'el-time-select' : TimePicker
        }
    };
</script>
