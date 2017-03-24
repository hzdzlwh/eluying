<template>
    <div class="modal fade" id="add" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">添加企业客户／编辑企业客户</h4>
                </div>
                <div class="modal-body modal-line">
                    <p>
                        <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png">企业名称：</span>
                        <input v-model='encompanyName' type="text" maxlength="20" class="dd-input">
                    </p>
                    <p>
                        <span class="addCus">
                                   协议编号：</span>
                        <input v-model='encontractNum' type="text" class="dd-input" maxlength="20" placeholder="-请输入数字或字母-">
                    </p>
                    <p>
                        <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png">联系人：</span>
                        <input v-model='encontactName' class="dd-input" type="text" maxlength="20">
                    </p>
                    <p>
                        <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png">联系号码：</span>
                        <input v-model='encontactPhone' class="dd-input" type="text" maxlength="12">
                    </p>
                    <p>
                        <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png"/>企业类型：
                            </span>
                        <DdSelect v-model="encompanyType" class="addCustype">
                            <DdOption v-for="option in formCustomerType" :value="option.value" :label="option.name">
                            </DdOption>
                        </DdSelect>
                    </p>
                </div>
                <div class="modal-body">
                    <p class="preferential">
                        <span class="addCus">
                                    优惠折扣：
                            </span>
                        <span class="selectBox">
                        <div v-for='(item, index) in discount'>
                            <span class="preName">{{item.nodeName}}</span>
                        <input class="dd-input" type="text" v-model='item.discount'>折<span class="delete-icon" @click='remove(index)'></span>
                </div>

                </span>
                  <div style="display:flex;    padding-left: 100px;">
                    <span class="preName addpre" @click="openSelectNode('discount', discount)">选择项目</span>
                    <span class="preRequest">请输入0.1-9.9之间的数字</span>
                </div>
                </p>

                <p>
                    <span class="addCus">
                                   地址：</span>
                    <input v-model='encompanyAddress' type="text" class="dd-input addAdress" maxlength="16">
                </p>
                <p>
                    <span class="addCus">
                                   备注：</span>
                    <textarea v-model='enremark' cols="7" class="addOthor dd-input" placeholder="-请填写描述-"></textarea>
                </p>
                <p>
                    <span class="addCus">
                                   </span>
                    <span class="dd-btn-primary dd-btn" style="margin-right:10px;min-width: 30px;" @click='customerDate'>确定</span>
                    <span class="dd-btn-ghost dd-btn" style="min-width: 30px;" data-dismiss="modal">取消</span>
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

.selectBox > div {
    margin-bottom: 5px;
}

.selectBox input {
    width: 56px!important;
}

.selectBox {
    max-height: 300px;
    display: inline-block;
    overflow-y: scroll;
    padding-right: 20px;
}
</style>
<script>
import {
    DdSelect,
    DdOption
} from 'dd-vue-component';
import categorySelect from './categorySelect.vue'
import http from '../../common/AJAXService';
import modal from '../../common/modal'
export default {
    props: {
        id: {
            type: Number
        },
        companyAddress: {
            type: String,
            default: ''
        },
        companyName: {
            type: String,
            default: ''
        },
        companyType: {
            type: Number,
            default: 0
        },
        contactName: {
            type: String,
            default: ''
        },
        contactPhone: {
            type: String,
            default: ''
        },
        contractNum: {
            type: String,
            default: ''
        },
        discounts: {
            type: Array,
            default: function() {
                return []
            }
        },
        remark: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            encompanyAddress: this.companyAddress,
            encompanyName: this.companyName,
            encompanyType: this.companyType,
            encontactName: this.contactName,
            encontactPhone: this.contactPhone,
            encontractNum: this.contractNum,
            enremark: this.remark,
            consume: [],
            discount: this.discounts,
            selectType: undefined,
            formCustomerType: [{
                name: "可挂帐",
                value: 0
            }, {
                name: "不可挂帐",
                value: 1
            }],
        }
    },
    // watch: {
    //     visible(val) {
    //         if (val) {
    //             $('#vipForm').modal('show');
    //         } else {
    //             $('#vipForm').modal('hide');
    //         }
    //     }
    // },
    computed: {
        nodes() {
            return this.selectType === 'consume' ? this.consume : this.discount;
        }
    },
    created() {
        this.getCompanyDate();
    },
    methods: {
        openSelectNode(type, data) {
            $('#categorySelectModal').modal('show');
            this.selectType = type;
        },
        remove(index) {
            this.discount.splice(index, 1)
        },
        getCompanyDate() {
            if (this.id) {
                http.get('/contractCompany/getDetail', {
                    cid: this.id
                }).then(res => {
                    this.encompanyAddress = res.data.companyAddress
                    this.encompanyName = res.data.companyName
                    this.encompanyType = res.data.companyType
                    this.encontactName = res.data.contactName
                    this.encontactPhone = res.data.contactPhone
                    this.encontractNum = res.data.contractNum
                    this.discounts = res.data.discounts
                    this.enremark = res.data.remark
                })
            }
        },
        customerDate: function() {
            if (!this.encompanyName) {
                modal.somethingAlert('请输入公司名');
                return
            }
            if (!this.encontactName) {
                modal.somethingAlert('请输入联系人');
                return
            }
            if (!this.encontactPhone) {
                modal.somethingAlert('请输入联系号码');
                return
            }
            for (let i = 0; i < this.discount.length; i ++) {
                this.discount[i].discount = parseInt(this.discount[i].discount)
                if (!/^0\.[1-9]$|^[1-9]\.[0-9]$|^[1-9]$/.test(this.discount[i].discount)) {
                    modal.alert('请输入0.1-9.9之间正确的折扣数字');
                    return false;
                }
            }
            const data = {
                companyAddress: this.encompanyAddress,
                companyName: this.encompanyName,
                companyType: this.encompanyType,
                contactName: this.encontactName,
                contactPhone: this.encontactPhone,
                contractNum: this.encontractNum,
                discounts: JSON.stringify(this.discount),
                remark: this.enremark
            }
            if (this.id) {
                data.id = this.id
            }
            http.get('/contractCompany/addEditContractCompany', data).then(res => {
                if (res.code === 1) {
                    modal.somethingAlert('添加成功')
                    $('#add').modal('hide');
                    this.encompanyAddress = ''
                    this.encompanyName = ''
                    this.encompanyType = 0
                    this.encontactName = ''
                    this.encontactPhone = ''
                    this.encontractNum = ''
                    this.discounts = []
                    this.enremark = ''

                } else {en
                    modal.somethingAlert(res.msg)
                }
            })
        },
        handleCategorySelect(list) {
            if (this.selectType === 'consume') {
                this.consume = list;
            } else {
                const newList = [];
                list.map(item => {
                    const result = this.discount.find(i => i.id === item.id);
                    if (result) {
                        if (item.selected) {
                            newList.push({...result
                            });
                        }
                    } else {
                        newList.push({...item
                        });
                    }
                });
                this.discount = newList;
            }
        },
        deleteNode(item) {
            const index = this.discount.indexOf(item);
            this.discount.splice(index, 1);
        }
    },
    components: {
        DdSelect,
        DdOption,
        categorySelect
    }
}
</script>
