/**
 * Created by ddll on 17-6-20.
 */
import init from '../../common/init';
import auth from '../../common/auth';
import Vue from 'vue';
import { DdSelect, DdOption } from 'dd-vue-component';
import http from 'http';
import modal from 'modal';

init({
    id: auth.BUSINESS_ID,
    topMenu: true
});

const app = new Vue({
    template: `
        <div>
            <div style="width: 720px">
                <p style="color: #178ce6;display: flex;justify-content: space-between;margin-bottom: 23px"><span>房间列表</span>
                    <span style="cursor: pointer" @click="openZoneModal('new')">
                        <img style="margin-right: 4px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAIVBMVEUAAAAXjegYjOYXjugYjecZj+YZjukXjegajOkXjeYXjObcqVb2AAAACnRSTlMASuNVYF1FklCadOWS3AAAADZJREFUCNdjEFoFBooMigxgIMSwAMLgQmFwJEAZLAZoDNHI0kAwI9m82AxDDbJ2TJPhlsKdAQDzmRTUpGPOVQAAAABJRU5ErkJggg" alt="">新增区域
                    </span>
                </p>
                <div v-for="zone in zones" :key="zone.zoneId" style="box-shadow:0px 0px 5px 0px rgba(0,0,0,0.15);border-radius:2px;border-top: 4px solid #178ce6;margin-bottom:20px">
                    <div style="background: #f0f0f0;height: 53px;padding-left: 20px;line-height: 53px">
                        <span style="font-size: 16px;margin-right: 8px">{{zone.zoneName}}</span><span><span @click="openZoneModal('edit', zone)" style="color: #178ce6;cursor: pointer">修改</span> / <span style="color: #178ce6;cursor: pointer" @click="deleteZone(zone.zoneId)">删除</span></span></span>
                    </div>
                    <div style="padding: 0 20px">
                        <table style="width: 100%;">
                            <thead style="font-weight: bold">
                                <tr style="height: 42px">
                                    <th style="font-weight: bold;text-align: left">房号</th>
                                    <th style="font-weight: bold;text-align: center">房型</th>
                                    <th style="font-weight: bold;text-align: center">单位</th>
                                    <th style="font-weight: bold;text-align: center">可用人数</th>
                                    <th style="font-weight: bold;text-align: right">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="room in zone.zoneRooms" :key="room.roomId" style="height: 42px">
                                    <td>{{room.roomNum}}</td>
                                    <td style="text-align: center">{{room.typeName}}</td>
                                    <td style="text-align: center">{{room.unit}}</td>
                                    <td style="text-align: center">{{room.fitNum}}</td>
                                    <td style="text-align: right;color: #178ce6"><span style="cursor: pointer" @click="openChangeModal(room, zone.zoneId)">换区</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal fade" role="dialog" id="zoneModal" data-backdrop="static">
                <div class="modal-dialog" style="width: 352px">
                    <div class="modal-content v-modal">
                        <div>
                            <p style="font-size:16px;margin-bottom:20px">{{this.type === 'new' ? '新增区域' : '编辑区域'}}</p>
                            <p style="margin-bottom: 20px">
                                <label>
                                    <span>区域名称</span>
                                    <input style="width: 230px" type="text" class="dd-input" v-model="name">
                                </label>
                            </p>
                            <div>
                                <button class="dd-btn dd-btn-primary" @click="operateZone">确定</button>&nbsp;
                                <button class="dd-btn dd-btn-ghost" @click="hideZoneModal">取消</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" role="dialog" id="changeModal">
                <div class="modal-dialog" style="width: 352px">
                    <div class="modal-content v-modal">
                        <div>
                            <p style="font-size:16px;margin-bottom:20px">换区</p>
                            <p style="margin-bottom: 20px;display: flex;align-items: center;">
                                <span>区域选择</span>&nbsp;
                                <dd-select v-model="zoneId">
                                    <dd-option :key="zone.zoneId" v-for="zone in zones" :label="zone.zoneName" :value="zone.zoneId">{{zone.zoneName}}</dd-option>
                                </dd-select>
                            </p>
                            <div>
                                <button class="dd-btn dd-btn-primary" @click="changeZone">确定</button>
                                <button class="dd-btn dd-btn-ghost" @click="hideChangeModal">取消</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function() {
        return {
            zones: [],
            type: '',
            name: '',
            zoneId: '',
            roomId: ''
        };
    },
    created() {
        this.getRoomsAndZones();
    },
    methods: {
        getRoomsAndZones() {
            http.get('/room/getRoomsAndZones')
                .then(res => {
                    this.zones = res.data.list;
                });
        },
        deleteZone(zoneId) {
            modal.confirm({
                message: '删除区域后将无法恢复'
            }, () => {
                http.post('/room/operateZone', {
                    operationType: 3,
                    zoneId
                })
                    .then(res => {
                        this.getRoomsAndZones();
                    });
            });
        },
        openZoneModal(type, zone) {
            $('#zoneModal').modal('show');
            this.type = type;
            if (type === 'edit') {
                this.name = zone.zoneName;
                this.zoneId = zone.zoneId;
            }
        },
        operateZone() {
            http.post('/room/operateZone', {
                operationType: this.type === 'new' ? 1 : 2,
                zoneId: this.zoneId,
                name: this.name
            })
                .then(res => {
                    this.hideZoneModal();
                    this.getRoomsAndZones();
                });
        },
        hideZoneModal() {
            $('#zoneModal').modal('hide');
            this.zoneId = '';
            this.type = '';
            this.name = '';
        },
        openChangeModal(room, zoneId) {
            $('#changeModal').modal('show');
            this.roomId = room.roomId;
            this.zoneId = zoneId;
        },
        hideChangeModal() {
            $('#changeModal').modal('hide');
            this.zoneId = '';
            this.roomId = '';
        },
        changeZone() {
            http.post('/room/changeZone', {
                newZoneId: this.zoneId,
                roomId: this.roomId
            })
                .then(res => {
                    this.hideChangeModal();
                    this.getRoomsAndZones();
                });
        }
    },
    components: {
        DdSelect,
        DdOption
    }
});

document.addEventListener('DOMContentLoaded', () => {
    app.$mount('#app');
});
