<template>
    <div id="vipForm" class="modal fade" role="dialog">
        <div class="modal-dialog vipForm-modal-dialog">
            <div class="modal-content vipForm-modal-content">
                <div class="vipForm-modal-header">
                    <span></span>
                    <span class="vipForm-closeBtn" ng-click="close()">&times;</span>
                </div>
                <div class="vipForm-modal-body">
                    <p class="body-mainTitle" v-if="!vip.vipUserId">新增会员</p>
                    <p class="body-mainTitle" v-if="vip.vipUserId">编辑会员</p>
                    <p class="body-subTitle">基本信息</p>
                    <div class="vipForm-info-container">
                        <div class="vipInfo-item-container">
                            <div class="vipInfo-item">
                                <span class="vipInfo-item-label">
                                    <img v-if="!vip.detail" src="//static.dingdandao.com/start.png">姓名
                                </span>
                                <input v-model="vip.name" type="text" maxlength="16" class="dd-input short-input">
                            </div>
                            <span v-if="(vip.modify || !vip.vipUserId) && hasSubmit && (vip.name.length === 0 || !vip.name)" class="error-tips">必填字段</span>
                            <span v-if="(vip.modify || !vip.vipUserId) && hasSubmit && vip.name.length === 1" class="error-tips">格式错误</span>
                        </div>
                        <div class="vipInfo-item-container">
                            <div class="vipInfo-item">
                                <span class="vipInfo-item-label">
                                    <img v-if="!vip.vipUserId" src="//static.dingdandao.com/start.png">手机号
                                </span>
                                <input v-model="vip.phone" type="text" maxlength="11" class="dd-input short-input">
                            </div>
                            <span v-if="!vip.vipUserId && hasSubmit && (vip.phone.length === 0 || !vip.phone)" class="error-tips">必填字段</span>
                            <span v-if="(vip.modify || !vip.vipUserId) && hasSubmit && vip.phone.length > 0 && vip.phone.length !== 11" class="error-tips">格式错误</span>
                        </div>
                        <div class="vipInfo-item">
                            <span class="vipInfo-item-label">
                                <img v-if="!vip.vipUserId || (vip.modify && !vip.isAutoUpgrade)" src="//static.dingdandao.com/start.png">会员等级
                            </span>
                            <div v-if="!vip.vipUserId || (vip.modify && !vip.isAutoUpgrade)" class="short-input">
                                <dd-select placeholder="-会员等级－" v-model="vip.vipLevelId">
                                    <dd-option v-for="level in levels" :value="level.vipLevelId" :label="level.vipLevelName"></dd-option>
                                </dd-select>
                            </div>
                        </div>
                        <div class="vipInfo-item">
                            <span class="vipInfo-item-label">会员卡号</span>
                            <input class="dd-input long-input" v-if="!vip.detail" v-model="vip.vipCardNum" type="text" maxlength="18" >
                        </div>
                        <div class="vipInfo-item">
                            <span class="vipInfo-item-label">证件号</span>
                            <div v-if="!vip.detail">
                                <div class="vip-idCard-container">
                                    <dd-select v-model="vip.idCardType">
                                        <dd-option v-for="type in idCardType" :value="type.key" :label="type.name"></dd-option>
                                    </dd-select>
                                </div>
                                <input class="dd-input inCardNum-input" v-model="vip.idCardNum" type="text" minlength="2" maxlength="18">
                            </div>
                        </div>
                        <div class="vipInfo-item">
                            <span class="vipInfo-item-label">性别</span>
                            <div class="vipInfo-item-content">
                                <div class="vip-gender-container">
                                    <dd-select v-model="vip.gender">
                                        <dd-option value="0" label="男"></dd-option>
                                        <dd-option value="1" label="女"></dd-option>
                                    </dd-select>
                                </div>
                                <div>
                                    <span class="vipInfo-item-label vipInfo-birthday-label">生日</span>
                                    <div class="vip-birthday-container" v-if="!vip.detail">
                                        <dd-datepicker></dd-datepicker>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="vipInfo-item">
                            <span class="vipInfo-item-label">地区</span>
                            <div class="vipInfo-item-content">
                                <div class="vip-country-container">
                                    <dd-select v-model="vip.provinceType" placeholder="省">
                                        <dd-option
                                            v-for="option in provinceItems"
                                            :value="option.id"
                                            :label="option.name"
                                            :key="option.id"
                                        >
                                        </dd-option>
                                    </dd-select>
                                </div>
                                <div class="vip-country-container">
                                    <dd-select v-model="vip.cityType" placeholder="市">
                                        <dd-option  v-for="option in cityItems"  :value="option.id" :label="option.name" :key="option.id+option.name+'city'">
                                        </dd-option>
                                    </dd-select>
                                </div>
                                <div class="vip-country-container">
                                    <dd-select v-model="vip.countyType" placeholder="区">
                                        <dd-option  v-for="option in countyItems"  :value="option.id" :label="option.name" :key="option.id+option.name">
                                        </dd-option>
                                    </dd-select>
                                </div>
                            </div>
                        </div>
                        <div class="vipInfo-item-container">
                            <div class="vipInfo-item">
                                <span class="vipInfo-item-label">邮箱</span>
                                <input class="dd-input long-input" v-model="vip.email" type="text" minlength="2" maxlength="30" >
                            </div>
                            <span v-if="vip.email && !mailFilter.test(vip.email) && hasSubmit && (vip.modify || !vip.vipUserId)" class="error-tips">邮箱格式错误</span>
                        </div>
                        <div class="vipInfo-item vipInfo-remark-container">
                            <span class="vipInfo-item-label">备注</span>
                            <textarea v-model="vip.remark" type="text" placeholder="-请填写描述-" maxlength="140" ></textarea>
                        </div>
                    </div>
                </div>
                <div class="vipForm-modal-foot">
                    <button v-if="!vip.detail" class="dd-btn dd-btn-sm dd-btn-primary" @click="addEditVip">确定</button>
                    <button v-if="!vip.detail" class="dd-btn dd-btn-sm dd-btn-ghost" ng-click="close()">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="sass" rel="stylesheet/scss">
.vipForm-modal-dialog {
    width: 340px;
}
.vipForm-modal-content {
    background: #fafafa;
    border-radius: 2px;
    border-top: 4px solid #178ce6;
    box-shadow:0px 2px 4px 0px rgba(0,0,0,0.15);
    padding: 0;
    overflow-x: visible;
    position: relative;
}
.vipForm-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.vipForm-closeBtn {
    display: inline-block;
    width: 20px;
    font-size: 20px;
    color: #999999;
    cursor: pointer;
}
.vipForm-closeBtn:hover {
    color: #666666;
}
.vipForm-modal-body {
    .body-mainTitle{
        font-size:16px;
        color:#178ce6;
        margin: 0 0 8px 20px;
    }
    .body-subTitle {
        font-size:14px;
        color:#178ce6;
        margin-left: 20px;
    }
}
.vipForm-info-container {
    padding: 16px 10px 18px 0;
    .vipInfo-item-container {
        position: relative;
    }
    .error-tips {
        position: absolute;
        left: 78px;
        top: 24px;
        font-size: 12px;
        color: #f24949;
    }
    .vipInfo-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 16px;
        .short-input {
            display: inline-block;
            width: 110px;
        }
        .long-input {
            display: inline-block;
            width: 240px;
        }
        .inCardNum-input {
            margin-left: -4px;
            border-left: none;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            width: 166px;
        }
        .vipInfo-item-content {
            display: inline-flex;
            width: 240px;
            justify-content: space-between;
            align-items: center;
        }
        .vip-idCard-container {
            display: inline-block;
            width: 74px;
            .dd-input {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
        }
        .vip-gender-container {
            width: 74px;
        }
        .vip-birthday-container {
            width: 114px;
            display: inline-block;
        }
        .vip-country-container {
            width: 78px;
        }
        textarea {
            width: 240px;
            height: 184px;
            border:1px solid #cccccc;
            border-radius:2px;
        }
    }
    .vipInfo-item-label {
        display: inline-flex;
        width: 70px;
        height: 20px;
        margin-right: 8px;
        align-items: center;
        justify-content: flex-end;
        color: #666666;
        img {
            margin-right: 4px;
        }
    }
    .vipInfo-birthday-label {
        width: auto;
        margin-right: 0;
    }
    .vipInfo-remark-container {
        align-items: flex-start;
    }
    input, textarea {
        padding: 2px 8px;
        resize: none;
    }
}
.vipForm-modal-foot {
    padding: 0 0 20px 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    button {
        margin-right: 20px;
        &:hover {
            background: #178ce6;
            color: #ffffff;
        }
    }
}
</style>
<script>
    import { DdSelect, DdOption, DdDatepicker } from 'dd-vue-component';
    import http from '../../common/AJAXService';
    import { dsyForComponent } from '../../common/dsy';
    import modal from '../../common/modal';

    export default{
        props: {
            visible: Boolean
        },
        data() {
            return {
                vip: {},
                levels: [{
                    vipLevelId: '',
                    vipLevelName: '—'
                }],
                idCardType: [
                    { key: '0', name: '身份证' },
                    { key: '1', name: '军官证' },
                    { key: '2', name: '通行证' },
                    { key: '3', name: '护照' },
                    { key: '4', name: '其他' }
                ],
                provinceType: undefined,
                cityType: undefined,
                countyType: undefined,
                provinceItems: dsyForComponent['0'],
                cityItems: [],
                countyItems: []
            };
        },
        watch: {
            visible(val) {
                if (val) {
                    $('#vipForm').modal('show');
                } else {
                    $('#vipForm').modal('hide');
                }
            },
            provinceType(newVal) {
                this.cityItems = dsyForComponent[`0_${newVal}`];
                this.cityType = 0;
                this.countyItems = dsyForComponent[`0_${this.provinceType}_${this.cityType}`];
                this.countyType = 0;
            },
            cityType(newVal) {
                this.countyItems = dsyForComponent[`0_${this.provinceType}_${newVal}`];
                this.countyType = 0;
            }
        },
        created() {
            this.getVipLevels();
        },
        methods: {
            getVipLevels() {
                http.get('/vipUser/getVipLevels')
                    .then(res => {
                        this.levels = this.levels.concat(res.data.list);
                    });
            },
            addEditVip() {
                const vip = this.vip;
                const data = {
                    ...vip,
                    province: vip.provinceType && this.provinceItems[vip.provinceType].name,
                    city: vip.cityType && this.cityItems[vip.cityType].name,
                    county: vip.countyType && this.countyItems[vip.countyType].name
                };

                if (vip.vipUserId) {
                    delete data.phone;
                    delete data.consumeAndDiscount;
                    delete data.vipConsumeList;
                }

                http.post('/vipUser/addEditVip', data)
                    .then(res => {
                        if (res.code === 1) {
                            $('#vipForm').modal('hide');
                            this.vip = { name: '', phone: '', idCardType: 0 };
                        } else {
                            modal.alert(res.msg);
                        }
                    });
            }
        },
        components: {
            DdSelect,
            DdOption,
            DdDatepicker
        }
    };
</script>
