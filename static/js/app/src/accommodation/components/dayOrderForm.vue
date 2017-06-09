<template>
    <div class="modal fade" id="dayOrderForm" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click='close'><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">{{outOrIn? '转' : '查看'}}{{formType[formNumber].name}}</h4>
                </div>
                <div class="modal-body modal-line">
                    <p>
                        <span class="addCus">
                                    房间</span>
                        <span>{{room && room.roomName}}</span>
                    </p>
                    <p>
                        <span class="addCus">起始日期</span>
                        <DatePicker :popper-class='"DatePickerAbsorct"' v-model="value3" type="datetimerange" placeholder="选择时间范围" format='yyyy-MM-dd HH:mm:ss'>
                        </DatePicker>
                        <!--  <div class="dd-start-date">
                <DdDatepicker placeholder="开始时间" v-model="formdata.startDate" />
            </div>
            <span class="dd-date-symbol">~</span>
            <div class="dd-end-date">
                <DdDatepicker placeholder="结束时间" v-model="formdata.endDate" />
            </div> -->
                    </p>
                    <p>
                        <span class="addCus">
                                    原因</span>
                        <input v-model='formdata.reason' class="dd-input" type="text" maxlength="50">
                    </p>
                    <p>
                        <span class="addCus">
                                    备注</span>
                        <textarea style="width:350px" v-model='formdata.remark' class='dd-input' placeholder="
 请输入备注信息" maxlength="500"></textarea>
                    </p>
                </div>
                <div class="roomModals-footer">
                    <div>
                        <div class="dd-btn dd-btn-primary order-btn" style='background:#009900' @click='end' v-if='outOrIn === 0'>
                            结束{{formType[formNumber].name}}
                        </div>
                    </div>
                    <div class="order-btns">
                        <div class="dd-btn  order-btn" style="color:#178ce6" @click='close'>
                            取消
                        </div>
                        <div class="dd-btn dd-btn-primary order-btn" @click='changeData'>
                            确定
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.addpre {
    color: #178ce6;
    cursor: pointer;
}

.addOthor {
    height: 65px;
}

.addAdress,
.addOthor {
    width: 330px!important;
    resize: none;
}

.addCustype {
    width: 80px;
    display: inline-block;
}

#dayOrderForm .modal-body p input {
    width: 350px;
    height: 24px;
    margin-right: 4px;
}

#dayOrderForm .modal-body p {
    margin: 0 auto 16px;
    display: flex;
}

#dayOrderForm .modal-line {
    border: 1px solid #e6e6e6
}

#dayOrderForm .addCus {
    width: 80px;
    display: inline-block;
    text-align: right;
    color: #666;
    margin-right: 20px;
}

#dayOrderForm .modal-title {
    font-size: 16px;
    color: #178ce6;
    text-align: left;
    margin-bottom: 8px;
}

#dayOrderForm .modal-content {
    background: #fafafa;
    border-radius: 2px;
    border-top: 4px solid #178ce6;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
    padding: 0;
}

#dayOrderForm .modal-dialog {
    width: 480px;
}

#dayOrderForm {
    z-index: 2051;
}

.delete-icon {
    margin-left: 16px;
    width: 16px;
    height: 16px;
    background: url('../../../../../image/modal/room_modal_delete.png');
    background-size: contain;
    cursor: pointer;
    display: inline-block;
}

.preName {
    width: 100px;
    overflow-x: hidden;
    display: inline-block;
}

.preRequest {
    display: inline-block;
}

.preferential {
    display: flex;
}

.preferential .addCus {
    display: inline-block;
}

.discountItem {
    margin-bottom: 5px;
    display: inline-flex;
    align-items: center;
}

.discountBox {
    max-height: 284px;
    overflow-y: auto;
}

.selectBox input {
    width: 56px!important;
}

.selectBox {
    display: inline-block;
    padding-right: 20px;
    width: 300px;
}
</style>
<script>
import {
    DdDatepicker
} from 'dd-vue-component';
import http from '../../common/http';
import modal from '../../common/modal';
import bus from '../../common/eventBus';
import {
    DatePicker
} from 'element-ui';
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        formNumber: {
            type: Number,
            default: 0
        },
        // 0为保留，1为维修，2为停用
        outOrIn: {
            type: Number,
            default: 0
        },
        // 0为查看，1为转
        date: String,
        room: Object
    },
    data() {
        return {
            formdata: {},
            consume: [],
            // discount: this.data.discounts,
            selectType: undefined,
            formType: [{
                name: '保留'
            }, {
                name: '维修'
            }, {
                name: '停用'
            }],
            value3: undefined,
            flag: true
        };
    },
    methods: {
        dateFormat: function(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            let h = date.getHours();
            h = h < 10 ? '0' + h : h;
            let M = date.getMinutes();
            M = M < 10 ? '0' + M : M;
            let s = date.getSeconds();
            s = s < 10 ? '0' + s : s;
            return y + '-' + m + '-' + d + ' ' + h + ':' + M + ':' + s;
        },
        close() {
            this.selectType = undefined;
            $('#dayOrderForm').modal('hide');
            this.$emit('close');
            this.flag = true;
            this.formdata = {};
        },
        fetchData() {
            this.flag = false;
            if (this.room) {
                http.get('/room/getStopInfo', {
                    date: this.date,
                    roomId: this.room.roomId,
                    type: this.formNumber + 1
                }).then(res => {
                    this.flag = true;
                    this.formdata = res.data;
                    // 防止重复提交
                });
            } else {
                this.flag = true;
            }
        },
        end() {
            const parms = {
                logId: this.formdata.logId,
                roomId: this.room.roomId,
                type: this.formNumber + 1
            };
            http.get('/room/endStopInfo', parms).then(res => {
                this.close();
                bus.$emit('refreshView');
            });
        },
        changeData() {
            const parms = this.formdata;
            if (!parms.logId) {
                delete parms.logId;
            }
            parms.startDate = this.dateFormat(this.value3[0]);
            parms.endDate = this.dateFormat(this.value3[1]);
            parms.reason = this.formdata.reason;
            parms.remark = this.formdata.remark;
            parms.roomId = this.room.roomId;
            parms.type = Number(this.formNumber) + 1;
            http.get('/room/setStopInfo', parms).then(res => {
                this.close();
                bus.$emit('refreshView');
            });
        }
    },
    watch: {
        visible(val) {
            if (val) {
                $('#dayOrderForm').modal({
                    backdrop: 'static'
                });
                $('#dayOrderForm').modal('show');
            } else {
                $('#dayOrderForm').modal('hide');
            }
        },
        formNumber(n) {
            if (this.outOrIn === 0 && this.flag) {
                this.fetchData();
            }
        },
        outOrIn(n) {
            if (n === 0 && this.flag) {
                this.fetchData();
            }
        },
        date(n) {
            if (this.outOrIn === 0 && this.flag) {
                this.fetchData();
            }
        },
        room(val) {
            if (this.outOrIn === 0 && this.flag) {
                this.fetchData();
            }
        },
        formdata(val) {
            if (val.startDate && val.endDate) {
                this.value3 = [new Date(val.startDate), new Date(val.endDate)];
            } else {
                this.value3 = undefined;
            }
        }
    },
    components: {
        DdDatepicker,
        DatePicker
    }
};
</script>
