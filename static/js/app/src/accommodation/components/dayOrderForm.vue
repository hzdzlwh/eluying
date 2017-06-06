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
                                    <img src="//static.dingdandao.com/start.png">房间</span>
                        <span>{{formdata.roomName}}</span>
                    </p>
                    <p>
                        <span class="addCus">起始日期</span>
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
                                    <img src="//static.dingdandao.com/start.png">原因</span>
                        <input v-model='formdata.why' class="dd-input" type="text" maxlength="20">
                    </p>
                    <p>
                        <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png">备注</span>
                        <textarea v-model='formdata.remark'></textarea>
                    </p>
                </div>
            </div>
            </span>
            </span>
            </p>
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
    width: 120px;
    display: inline-block;
}

#dayOrderForm .modal-body p input {
    width: 210px;
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
    width: 100px;
    display: inline-block;
    text-align: right;
    color: #666;
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
export default {
    props: {
        data: {
            type: Object,
            default: () => { return {}; }
        },
        visible: {
            type: Boolean,
            default: false
        },
        formNumber: {
            type: Number,
            default: 0
        },
        // 0为维修，1为保留，2为停用
        outOrIn: {
            type: Number,
            default: 0
        }
        // 0为查看，1为转
    },
    data() {
        return {
            formdata: {
                id: 0,
                roomName: '',
                startDate: '',
                endDate: 0,
                why: '',
                remark: ''
            },
            consume: [],
            // discount: this.data.discounts,
            selectType: undefined,
            formType: [{
                name: '维修'
            }, {
                name: '保留'
            }, {
                name: '停用'
            }]
        };
    },
    methods: {
        close() {
            this.selectType = undefined;
            $('#add').modal('hide');
            this.$emit('close');
        },
        customerDate: function() {
            if (!this.formdata.companyName) {
                modal.warn('请输入企业名称');
                return;
            }
            if (this.formdata.contractNum) {
                const re = /^[0-9a-zA-Z]*$/g;
                if (!re.test(this.formdata.contractNum)) {
                    modal.warn('请输入正确的协议编号');
                    return;
                }
            }
            if (!this.formdata.contactName) {
                modal.warn('请输入联系人');
                return;
            }
            if (!this.formdata.contactPhone) {
                modal.warn('请输入联系号码');
                return;
            }
            const data = Object.assign({}, this.formdata);
            if (this.formdata.discounts) {
                for (let i = 0; i < this.formdata.discounts.length; i ++) {
                    this.formdata.discounts[i].discount = parseFloat(this.formdata.discounts[i].discount);
                    if (!/^0\.[1-9]$|^[1-9]\.[0-9]$|^[1-9]$/.test(this.formdata.discounts[i].discount)) {
                        modal.warn('请输入0.1-9.9之间正确的折扣数字');
                        return false;
                    }
                }

                data.discounts = JSON.stringify(data.discounts);
            }
            if (!this.formdata.id) {
                delete data.id;
            }
            http.get('/contractCompany/addEditContractCompany', data).then(res => {
                this.$emit('add');
                if (this.formdata.id) {
                    modal.success('修改成功');
                } else {
                    modal.success('添加成功');
                }
                this.close();
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
        data(val) {
            this.formdata = { ...val
            };
        }
    },
    components: {
        DdDatepicker
    }
};
</script>
