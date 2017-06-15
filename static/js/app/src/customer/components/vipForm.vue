<template>
    <div id="vipForm" class="modal fade" role="dialog" data-backdrop="static">
        <div class="modal-dialog vipForm-modal-dialog">
            <div class="modal-content vipForm-modal-content">
                <div class="vipForm-modal-header">
                    <h4 class="body-mainTitle" v-if="!vip.vipUserId">新增会员</h4>
                    <h4 class="body-mainTitle" v-if="vip.vipUserId">编辑会员</h4>
                    <span class="vipForm-closeBtn" @click="close()">&times;</span>
                </div>
                <div class="vipForm-modal-body">
                    <div class="client-info">
                        <p class="body-subTitle">客户信息</p>
                        <div class="vipForm-info-container">
                            <div class="vipInfo-item-container">
                                <div class="vipInfo-item-wrap">
                                    <div class="vipInfo-item">
                                        <span class="vipInfo-item-label" style="width:56px">
                                            <img v-if="!vip.detail" src="//static.dingdandao.com/start.png">姓名
                                        </span>
                                        <input v-model="vip.name" type="text" maxlength="16" class="dd-input short-input">
                                        <span v-if="hasSubmit && !vip.name" class="error-tips">必填字段</span>
                                        <span v-if="hasSubmit && vip.name && vip.name.length === 1" class="error-tips">格式错误</span>
                                    </div>
                                    <div class="vipInfo-item">
                                        <span class="vipInfo-item-label">性别</span>
                                        <div class="vip-gender-container">
                                            <dd-select v-model="vip.gender">
                                                <dd-option :value="0" label="男"></dd-option>
                                                <dd-option :value="1" label="女"></dd-option>
                                            </dd-select>
                                        </div>
                                    </div>
                                    <div class="vipInfo-item">
                                        <span class="vipInfo-item-label vipInfo-birthday-label">生日</span>
                                        <div class="vip-birthday-container" v-if="!vip.detail">
                                            <dd-datepicker v-model="vip.birthday"></dd-datepicker>
                                        </div>
                                    </div>
                                    <div class="vipInfo-item">
                                        <span class="vipInfo-item-label">
                                            <img v-if="!vip.vipUserId" src="//static.dingdandao.com/start.png">手机号
                                        </span>
                                        <input v-if="!vip.vipUserId" v-model="vip.phone" type="text" maxlength="20" class="dd-input short-input">
                                        <input v-if="vip.vipUserId" :value="vip.phone" disabled type="text" maxlength="20" class="dd-input short-input">
                                        <span v-if="!vip.vipUserId && hasSubmit && !vip.phone" class="error-tips">必填字段</span>
                                        <!-- <span v-if="(vip.modify || !vip.vipUserId) && hasSubmit && vip.phone && vip.phone.length > 0 && vip.phone.length !== 11" class="error-tips">格式错误</span> -->
                                    </div>
                                </div>
                                <div class="vipInfo-item-wrap">
                                    <div class="vipInfo-item">
                                        <span class="vipInfo-item-label" style="width:56px">邮箱</span>
                                        <input type="text" class="dd-input long-input" v-model="vip.email" minlength="2" maxlength="30">
                                        <span v-if="vip.email && !mailFilter.test(vip.email) && hasSubmit" class="error-tips">邮箱格式错误</span>
                                    </div>
                                    <div class="vipInfo-item">
                                        <span class="vipInfo-item-label">证件号</span>
                                        <div v-if="!vip.detail">
                                            <div class="vip-idCard-container">
                                                <dd-select v-model="vip.idCardType">
                                                    <dd-option :key="type.key" v-for="type in idCardType" :value="type.key" :label="type.name"></dd-option>
                                                </dd-select>
                                            </div>
                                            <input class="dd-input inCardNum-input" v-model="vip.idCardNum" type="text" minlength="2" maxlength="18">
                                        </div>
                                    </div>
                                </div>
                                <div class="vipInfo-item-wrap">
                                    <div class="vipInfo-item" v-bind:class="{'none-margin': !(vipProps.isAutoUpgrade === 0) && !vipProps.newAdd}">
                                        <span class="vipInfo-item-label">创建渠道</span>
                                        <input class="dd-input long-input" v-model="vip.vipChannel" type="text" >
                                    </div>
                                    <div class="vipInfo-item" v-bind:class="{'none-margin': !(vipProps.isAutoUpgrade === 0) && !vipProps.newAdd}">
                                        <span class="vipInfo-item-label">地区</span>
                                        <div class="vipInfo-item-content">
                                            <div class="vip-country-container">
                                                <dd-select v-model="province" placeholder="省">
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
                                                <dd-select v-model="city" placeholder="市">
                                                    <dd-option  v-for="option in cityItems"  :value="option.id" :label="option.name" :key="option.id+option.name+'city'">
                                                    </dd-option>
                                                </dd-select>
                                            </div>
                                            <div class="vip-country-container">
                                                <dd-select v-model="county" placeholder="区">
                                                    <dd-option  v-for="option in countyItems"  :value="option.id" :label="option.name" :key="option.id+option.name">
                                                    </dd-option>
                                                </dd-select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="vipInfo-item-wrap" v-show="vipProps.newAdd || vipProps.isAutoUpgrade === 0">
                                    <div class="vipInfo-item vip-level" style="margin-bottom:0">
                                        <span class="vipInfo-item-label">会员等级</span>
                                        <dd-select placeholder="-会员等级－" v-model="vip.vipLevelId">
                                            <dd-option :key="level.vipLevelId" v-for="level in levels" :value="level.vipLevelId" :label="level.vipLevelName"></dd-option>
                                        </dd-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="vipInfo-item vipInfo-remark-container">
                        <p class="body-subTitle" style="margin-bottom:16px;">备注信息</p>
                        <textarea v-model="vip.remark" type="text" placeholder="-请填写描述-" maxlength="140" style="width:682px;height:80px;" ></textarea>
                    </div>
                </div>
                <div class="vipForm-modal-foot">
                    <button style="width:110px;" v-if="!vip.detail" class="dd-btn dd-btn-sm dd-btn-ghost" @click="close">取消</button>
                    <button style="width:110px;" v-if="!vip.detail" class="dd-btn dd-btn-sm dd-btn-primary" @click="addEditVip">保存</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" rel="stylesheet/scss">
.vipForm-modal-dialog {
    width: 721px;
    .vipForm-modal-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 20px 16px 20px;
        border-bottom: 1px solid #e6e6e6;
        h4{
            font-size: 16px;
        }
    }
    .dd-select-menu {
        max-height: 300px;
        overflow: auto;
    }
}
.modal-content{
    padding: 0;
}
.vipForm-modal-content {
    background: #fafafa;
    border-radius: 2px;
    border-top: 4px solid #178ce6;
    box-shadow:0px 2px 4px 0px rgba(0,0,0,0.15);
    overflow-x: visible;
    position: relative;
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
    .client-info{
        padding: 15px 20px 0;
        border-bottom: 1px solid #e6e6e6;
    }
    .vipInfo-item-wrap{
        display: flex;
        justify-content: space-between;
    }
    .body-mainTitle{
        font-size:16px;
        color:#178ce6;
        margin: 0 0 8px 20px;
    }
    .body-subTitle {
        font-size:14px;
        color:#666666;
    }
    .vipInfo-remark-container {
        padding: 15px 19px 20px 20px;
    }
}
.vipForm-info-container {
    padding: 16px 0px 18px 0;
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
        position: relative;
        .short-input {
            display: inline-block;
            width: 110px;
        }
        .long-input {
            display: inline-block;
            width: 247px;
        }
        .inCardNum-input {
            margin-left: -4px;
            border-left: none;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            width: 236px;
        }
        .vipInfo-item-content {
            display: inline-flex;
            width: 310px;
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
            width: 98px;
        }
        textarea {
            width: 240px;
            height: 184px;
            border:1px solid #cccccc;
            border-radius:2px;
        }
    }
    .none-margin{
        margin-bottom: 0;
    }
    .vip-level{
        .dd-select{
            width: 247px;
        }
    }
    .vipInfo-item-label {
        display: inline-flex;
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
    }
    
    input, textarea {
        padding: 2px 8px;
        resize: none;
    }
}
.vipForm-modal-foot {
    padding: 0 0 20px 80px;
    display: flex;
    justify-content: flex-end;
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
    import http from '../../common/http';
    import { dsyForComponent } from '../../common/dsy';

    export default{
        props: {
            visible: Boolean,
            vipProps: Object
        },
        data() {
            return {
                vip: {},
                levels: [{
                    vipLevelId: '',
                    vipLevelName: '—'
                }],
                idCardType: [
                    { key: 0, name: '身份证' },
                    { key: 1, name: '军官证' },
                    { key: 2, name: '通行证' },
                    { key: 3, name: '护照' },
                    { key: 4, name: '其他' }
                ],
                provinceItems: dsyForComponent['0'],
                cityItems: [],
                countyItems: [],
                hasSubmit: false,
                mailFilter: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
                province: undefined,
                city: undefined,
                county: undefined
            };
        },
        watch: {
            vipProps(val) {
                this.vip = { ...val };
                this.province = this.mapAddress(this.provinceItems, val.province);
                this.cityItems = dsyForComponent[0 + '_' + this.province];
                this.$nextTick(() => {
                    this.city = this.mapAddress(this.cityItems, val.city);
                    this.countyItems = dsyForComponent[0 + '_' + this.province + '_' + this.city];
                    this.$nextTick(() => {
                        this.county = this.mapAddress(this.countyItems, val.county);
                    });
                });
            },
            province(newVal) {
                this.cityItems = dsyForComponent[`0_${newVal}`];
                this.city = 0;
                this.countyItems = dsyForComponent[`0_${this.province}_${this.city}`];
                this.county = 0;
            },
            city(newVal) {
                this.countyItems = dsyForComponent[`0_${this.province}_${newVal}`];
                this.county = 0;
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
            close() {
                this.hasSubmit = false;
                $('#vipForm').modal('hide');
                this.vip = { name: '', phone: '', idCardType: 0, vipLevelId: '', gender: undefined };
            },
            mapAddress(arr, value) {
                if (!arr) {
                    return undefined;
                }

                const item = arr.find(i => {
                    return i.name.indexOf(value) >= 0;
                });
                return item && item.id;
            },
            addEditVip() {
                const vip = this.vip;
                this.hasSubmit = true;
                if ((vip.email && !this.mailFilter.test(vip.email))) {
                    return false;
                }
                if (!vip.phone ||
                    !vip.name ||
                    vip.name.length < 2) {
                    return false;
                }

                this.hasSubmit = false;
                const data = {
                    ...vip,
                    province: this.provinceItems[this.province] && this.provinceItems[this.province].name,
                    city: this.cityItems && this.cityItems[this.city] && this.cityItems[this.city].name,
                    county: this.countyItems && this.countyItems[this.county] && this.countyItems[this.county].name
                };
                let url = '/vipUser/addEditVip';
                if (vip.vipUserId) {
                    delete data.phone;
                    delete data.consumeAndDiscount;
                    delete data.vipConsumeList;
                }
                if (vip.customerId) {
                    url = '/customer/addToVip';
                }
                delete data.vipCards;
                http.get(url, data)
                    .then(res => {
                        this.close();
                        this.$emit('onSuccess');
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
