<template>
    <div>
        <div style="box-shadow:0 0 5px 0 rgba(0,0,0,0.15);border-radius:2px;width:506px;border-top:4px solid #178ce6">
            <div style="height: 49px;background: #f0f0f0;display: flex;justify-content: space-between;align-items: center;padding: 0 20px"><span style="font-size: 16px">房型设置</span>
                <span style="cursor: pointer;color: #178ce6" @click="create"><img style="margin-right: 4px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAIVBMVEUAAAAXjegYjOYXjugYjecZj+YZjukXjegajOkXjeYXjObcqVb2AAAACnRSTlMASuNVYF1FklCadOWS3AAAADZJREFUCNdjEFoFBooMigxgIMSwAMLgQmFwJEAZLAZoDNHI0kAwI9m82AxDDbJ2TJPhlsKdAQDzmRTUpGPOVQAAAABJRU5ErkJggg" alt="">新增房型</span></div>
            <div style="padding: 16px 20px">
                <div v-for="room in rooms" :key="room.settingId" style="box-shadow:0 0 5px 0 rgba(0,0,0,0.15);border-radius:2px;">
                    <div style="background:#f0f0f0;height:37px;padding: 0 20px;display: flex;align-items: center;font-size: 16px;justify-content: space-between">
                        <span style="display: flex;align-items: center">
                            <span>房型：</span>
                            <dd-select>
                                <dd-option :key="c.cId" :label="c.cName" :value="c.cId" v-for="c in getAvailableCategories(room)"></dd-option>
                            </dd-select>
                        </span>
                        <span style="cursor: pointer;color: #178ce6;font-size: 14px" v-if="room.settingId"><span>编辑</span>/<span @click="deleteRoom(room.settingId)">删除</span></span>
                    </div>
                    <div style="padding: 16px 20px">
                        <div class="line">
                            <span class="slabel">起步时长<span class="msg" v-if="msg.startDuration">{{msg.startDuration}}</span></span><input type="text" class="dd-input" v-model="room.startDuration">
                            <span class="slabel" style="margin-left: 32px">起步价格<span class="msg" v-if="msg.startPrice">{{msg.startPrice}}</span></span>￥<input type="text" class="dd-input" v-model="room.startPrice">
                        </div>
                        <div class="line">
                            <span class="slabel">单位时长<span class="msg" v-if="msg.unitDuration">{{msg.unitDuration}}</span></span><input type="text" class="dd-input" v-model="room.unitDuration">
                            <span class="slabel" style="margin-left: 32px">单位价格<span class="msg" v-if="msg.unitPrice">{{msg.unitPrice}}</span></span>￥<input type="text" class="dd-input" v-model="room.unitPrice">
                        </div>
                        <div class="line">
                            <span class="slabel">最大时长<span class="msg" v-if="msg.maxDuration">{{msg.maxDuration}}</span></span><input type="text" class="dd-input" v-model="room.maxDuration">
                        </div>
                        <div class="line" style="display: flex">
                            <span class="slabel">开放时段</span>
                            <div>
                                <div>
                                    <div v-for="(h, index) in room.openHours" class="line">
                                        <input type="text" class="dd-input" v-model="h.start"> - <input type="text" class="dd-input" v-model="h.end"><span></span>
                                        <img @click="deleteOpenHours(room, index)" style="cursor: pointer;margin-left: 16px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAS1BMVEUAAACbm5uampqampqampqbm5uhoaGampqbm5uampqbm5ucnJyZmZmampqampqZmZmampqampqbm5uZmZmbm5uampqhoaGampqZmZltaZz8AAAAGHRSTlMAa6uhi3Ubl4SlYyXx0JiAW0tJQT41E+/1WhRoAAAAWklEQVQY08XI2RGAIBAE0V4PVg5vUPKPVJQqUvB99QyfGHK+Y+1VVZfgjHFhKbkiU7FT7G8JXDR1WMchbBty4CzQCWPPMNCPSPfr4U9S4vT1UGsaq4CfczN7HnrMBOywZ/dgAAAAAElFTkSuQmCC" alt="">
                                    </div>
                                </div>
                                <span @click="addOpenHours(room)" style="cursor: pointer;color: #178ce6">新增时间段</span>
                            </div>
                        </div>
                        <div style="padding-left: 64px">
                            <button @click="save(room)" class="dd-btn dd-btn-primary dd-btn-sm" style="margin-right: 20px">保存</button>
                            <button class="dd-btn dd-btn-sm dd-btn-ghost" @click="cancel">取消</button>
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
</style>
<script>
    import http from 'http';
    import { DdSelect, DdOption } from 'dd-vue-component';

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
                        this.rooms = res.list;
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
            cancel() {
                this.rooms.shift();
            },
            addOpenHours(room) {
                room.openHours.push({
                    start: '',
                    end: ''
                });
            },
            deleteOpenHours(room, index) {
                room.openHours.splice(index, 1);
            },
            save(room) {
                this.msg = {};
                if (!/^(((\d|1\d|2[0-3])(\.\d)?)|(24(\.0)?))$/.test(room.startDuration)) {
                    this.msg.startDuration = '↑请输入0.1-24之间的数字';
                    return false;
                }
                if (room.startPrice === '' || Number.isNaN(Number(room.startPrice)) || (room.startPrice < 0.01 && room.startPrice > 20000000) || (room.startPrice.split('.')[1] && room.startPrice.split('.')[1].length > 2)) {
                    this.msg.startPrice = '↑请输入0.01-20,000,000之间的数字';
                    return false;
                }
                if (!/^(((\d|1\d|2[0-3])(\.\d)?)|(24(\.0)?))$/.test(room.unitDuration)) {
                    this.msg.unitDuration = '↑请输入0.1-24之间的数字';
                    return false;
                }
                if (room.unitPrice === '' || Number.isNaN(Number(room.unitPrice)) || (room.unitPrice < 0.01 && room.unitPrice > 20000000) || (room.unitPrice.split('.')[1] && room.unitPrice.split('.')[1].length > 2)) {
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
                http.post('/room/saveHourRoomSetting', room)
                    .then(res => {
                        this.getHourRoomSetting();
                    });
            },
            deleteRoom(settingId) {
                http.post('/room/delHourRoomSetting', { settingId })
                    .then(res => {
                        this.getHourRoomSetting();
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
            }
        },
        components: {
            DdSelect,
            DdOption
        }
    };
</script>
