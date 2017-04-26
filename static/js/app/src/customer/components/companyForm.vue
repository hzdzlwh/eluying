<template>
    <div class="modal fade" id="add" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click='close'><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">{{data.id? '编辑企业客户' : '添加企业客户'}}</h4>
                </div>
                <div class="modal-body modal-line">
                    <p>
                        <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png">企业名称：</span>
                        <input v-model='formdata.companyName' type="text" maxlength="20" class="dd-input">
                    </p>
                    <p>
                        <span class="addCus">
                                   企业编号：</span>
                        <input v-model='formdata.contractNum' type="text" class="dd-input" maxlength="20" placeholder="-请输入数字或字母-">
                    </p>
                    <p>
                        <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png">联系人：</span>
                        <input v-model='formdata.contactName' class="dd-input" type="text" maxlength="20">
                    </p>
                    <p>
                        <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png">联系号码：</span>
                        <input v-model='formdata.contactPhone' class="dd-input" type="text" maxlength="11">
                    </p>
                    <p>
                        <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png"/>企业类型：
                            </span>
                        <DdSelect v-model="formdata.companyType" class="addCustype">
                            <DdOption v-for="option in formCustomerType" :value="option.value" :key='option' :label="option.name">
                            </DdOption>
                        </DdSelect>
                    </p>
                </div>
                <div class="modal-body">
                    <p class="preferential">
                        <span class="addCus">
                                    优惠折扣：
                            </span>
                            <span>
                        <span class="selectBox" v-if='formdata.discounts'>
                        <div class="discountBox">
                        <div v-for='(item,index) in formdata.discounts' class="discountItem" :key="item.id">
                            <span class="preName">{{item.nodeName}}</span>
                        <input class="dd-input" type="text" v-model='item.discount'>折<span class="delete-icon" @click='formdata.discounts.splice(index, 1)'></span>
                </div></div>
                <div style="display:flex;">
                    <span class="preName addpre" @click="openSelectNode('discount')">选择项目</span>
                    <span class="preRequest" v-if='formdata.discounts.length'>请输入0.1-9.9之间的数字</span>
                </div>
                </span>
                
                </span>
                </p>
                <p>
                    <span class="addCus">
                                   地址：</span>
                    <input v-model='formdata.companyAddress' type="text" class="dd-input addAdress" maxlength="16">
                </p>
                <p>
                    <span class="addCus">
                                   备注：</span>
                    <textarea v-model='formdata.remark' cols="7" class="addOthor dd-input" placeholder="-请填写描述-"></textarea>
                </p>
                <p>
                    <span class="addCus">
                                   </span>
                    <span class="dd-btn-primary dd-btn" style="margin-right:10px;min-width: 30px;" @click='customerDate'>确定</span>
                    <span class="dd-btn-ghost dd-btn" style="min-width: 30px;" @click='close'>取消</span>
                </p>
            </div>
        </div>
    </div>
    <categorySelect :onConfirm="handleCategorySelect" :type="selectType" :list="nodes" />
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

#add .modal-body p input {
    width: 210px;
    height: 24px;
    margin-right: 4px;
}

#add .modal-body p {
    margin: 0 auto 16px;
    display: flex;
}

#add .modal-line {
    border: 1px solid #e6e6e6
}

#add .addCus {
    width: 100px;
    display: inline-block;
    text-align: right;
    color: #666;
}

#add .modal-title {
    font-size: 16px;
    color: #178ce6;
    text-align: left;
    margin-bottom: 8px;
}

#add .modal-content {
    background: #fafafa;
    border-radius: 2px;
    border-top: 4px solid #178ce6;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
    padding: 0;
}

#add .modal-dialog {
    width: 480px;
}

#add {
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
.discountBox{
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
    DdSelect,
    DdOption
} from 'dd-vue-component';
import categorySelect from './categorySelect.vue';
import http from '../../common/http';
import modal from '../../common/modal';
export default {
    props: {
        data: {
            type: Object,
            default: {}
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formdata: {
                id: 0,
                companyAddress: '',
                companyName: '',
                companyType: 0,
                contactName: '',
                contactPhone: '',
                contractNum: '',
                discounts: [],
                remark: ''
            },
            consume: [],
            // discount: this.data.discounts,
            selectType: undefined,
            formCustomerType: [{
                name: '可挂帐',
                value: 1
            }, {
                name: '不可挂帐',
                value: 0
            }]
        };
    },
    computed: {
        nodes() {
            return this.selectType === 'consume' ? this.consume : this.formdata.discounts;
        }
    },
    created() {
        this.getCompanyDate();
    },
    methods: {
        close() {
            this.selectType = undefined;
            $('#add').modal('hide');
            this.$emit('close');
        },
        openSelectNode(type) {
            $('#categorySelectModal').modal('show');
            this.selectType = type;
        },
        remove(index) {
            this.discount.splice(index, 1);
        },
        getCompanyDate() {
            if (this.id) {
                http.get('/contractCompany/getDetail', {
                    cid: this.id
                }).then(res => {
                    this.companyAddress = res.data.companyAddress;
                    this.encompanyName = res.data.companyName;
                    this.encompanyType = res.data.companyType;
                    this.encontactName = res.data.contactName;
                    this.encontactPhone = res.data.contactPhone;
                    this.encontractNum = res.data.contractNum;
                    this.discount = res.data.discounts;
                    this.enremark = res.data.remark;
                });
            } else {
                this.discount = [];
            }
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
                if (res.code === 1) {
                    modal.warn('添加成功');
                    this.$emit('add');
                    if (this.formdata.id) {
                        modal.warn('修改成功');
                    }
                    this.close();
                } else {
                    modal.warn(res.msg);
                }
            });
        },
        handleCategorySelect(list) {
            if (this.selectType === 'consume') {
                this.consume = list;
            } else {
                if (this.formdata.discounts) {
                    const newList = [];
                    list.map(item => {
                        const result = this.formdata.discounts.find(i => i.id === item.id && i.nodeType === item.nodeType);
                        if (result) {
                            if (item.selected) {
                                newList.push({ ...result
                                });
                            }
                        } else {
                            newList.push({ ...item
                            });
                        }
                    });

                    this.formdata.discounts = newList;
                } else {
                    this.formdata.discounts = list;
                }
            }
        },
        deleteNode(item) {
            const index = this.formdata.discounts.indexOf(item);
            this.formdata.discounts.splice(index, 1);
        }
    },
    watch: {
        visible(val) {
            if (val) {
                $('#add').modal({
                    backdrop: 'static'
                });
                $('#add').modal('show');
            } else {
                $('#add').modal('hide');
            }
        },
        data(val) {
            this.formdata = { ...val
            };
        }
    },
    components: {
        DdSelect,
        DdOption,
        categorySelect
    }
};
</script>
