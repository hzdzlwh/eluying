<template>
    <div>
        <div class="modal fade roomModals" id="personsDetail" role="dialog" data-backdrop="static">
            <div class="modal-dialog" style="width: 545px">
                <div class="modal-content" style="width: 545px;max-height: 443px">
                    <div class="roomModals-header" style="border-bottom: 1px solid #e6e6e6">
                        <span class="header-text personsDetail-title">入住人详情</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="personsDetail-body">
                        <div class="personsDetail-leftList">
                            <div style="max-height: 346px;overflow－x: hidden; overflow-y: auto">
                                <div class="personsDetail-leftItem"
                                     :class="{'selected': person.selected}"
                                     v-for="(person, index) in personsList"
                                     v-if="personsList && personsList.length > 0">
                                    <div @click="changeShowPerson(index)" style="flex-grow: 1">
                                        <p>{{person.name}}</p>
                                        <p style="font-size: 12px">{{person.idCardNum}}</p>
                                    </div>
                                    <span class="delete-icon" style="margin: 0 4px 0" @click="deletePerson(person)" v-show="editAble"></span>
                                </div>
                            </div>
                            <div class="personsDetail-leftBtn" v-show="editAble">
                                <div style="display: flex; align-items: center; cursor: pointer;" @click="addNewPerson">
                                    <span class="increase-icon" style="display: inline-block"></span>新增入住人
                                </div>
                            </div>
                        </div>
                        <div class="personsDetail-rightForm">
                            <div class="personsDetail-rightItem" style="justify-content: space-between">
                                <div class="personDetail-rightContainer">
                                    <span class="personsDetail-rightText">姓名</span>
                                    <input type="text" v-model="name" maxlength="20" class="dd-input personsDetail-input" :disabled="!editAble" />
                                </div>
                                <div>
                                    <span class="personsDetail-rightText">性别</span>
                                    <div style="width: 74px; display: inline-block">
                                        <dd-select v-model="genderType" :disabled="!editAble">
                                            <dd-option v-for="gender in genderList" :value="gender.id" :label="gender.name" :key="gender.id"></dd-option>
                                        </dd-select>
                                    </div>
                                </div>
                                <span class="personsDetail-errorTip" v-show="nameErrorRequire">必填项</span>
                            </div>
                            <div class="personsDetail-rightItem">
                                <span class="personsDetail-rightText">证件号</span>
                                <div class="personsDetail-card-container">
                                    <dd-select v-model="idCardType" :disabled="!editAble">
                                        <dd-option v-for="card in cardsList" :value="card.id" :label="card.name" :key="card.id+card.name">
                                        </dd-option>
                                    </dd-select>
                                </div>
                                <input class="dd-input personsDetail-cardNum" placeholder="证件号码" maxlength="32" v-model="idCardNum" :disabled="!editAble">
                                <span class="personsDetail-errorTip" v-show="idCardNumErrorRequire">必填项</span>
                            </div>
                            <div class="personsDetail-rightItem">
                                <span class="personsDetail-rightText">生日</span>
                                <div class="personsDetail-input">
                                    <dd-datepicker v-model="birthday" :disabled="!editAble"></dd-datepicker>
                                </div>
                            </div>
                            <p class="personsDetail-rightItem">
                                <span class="personsDetail-rightText">手机号</span>
                                <input type="text"
                                       class="dd-input personsDetail-input"
                                       maxlength="20"
                                       v-model="phone"
                                       @input="checkPhone"
                                       :disabled="!editAble" />
                                <span class="personsDetail-errorTip" v-show="phoneErrorRules">格式有误</span>
                            </p>
                            <p class="personsDetail-rightItem">
                                <span class="personsDetail-rightText">车牌号</span>
                                <input type="text" class="dd-input personsDetail-input" maxlength="20" v-model="carNum" :disabled="!editAble" />
                            </p>
                            <p class="personsDetail-rightItem">
                                <span class="personsDetail-rightText">国籍</span>
                                <input type="text" class="dd-input personsDetail-input" maxlength="20" v-model="country" :disabled="!editAble" />
                            </p>
                            <p class="personsDetail-rightItem">
                                <span class="personsDetail-rightText">地址</span>
                                <input type="text" class="dd-input personsDetail-largeInput" maxlength="100" v-model="address" :disabled="!editAble" />
                            </p>
                            <p class="personsDetail-rightItem">
                                <span class="personsDetail-rightText">邮箱</span>
                                <input type="text" class="dd-input personsDetail-largeInput"
                                       maxlength="32"
                                       v-model="email"
                                       @input="checkEmail"
                                       :disabled="!editAble" />
                                <span class="personsDetail-errorTip" v-show="emailErrorRules">格式有误</span>
                            </p>
                            <div class="personsDetail-rightFoot" v-show="editAble">
                                <button class="dd-btn dd-btn-ghost" style="margin-right: 16px" @click="cancel">取消</button>
                                <button class="dd-btn dd-btn-primary" @click="savePersonInfo">保存</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" type="text/css" rel="stylesheet/scss">
    @import "~dd-common-css/src/variables";
    #personsDetail .dd-select-input {
        width: 74px !important;
    }
    .personsDetail-title {
        font-size: 16px;
        color: #666666;
        font-weight: bold;
    }
    .personsDetail-body {
        display: flex;
        justify-content: flex-start;
    }
    .personsDetail-leftList {
        width: 180px;
        background: #fafafa;
        border-right: 1px solid #e6e6e6;
        box-shadow: 0 2px 4px;
        .selected {
            border-right: 2px solid #178ce6;
            color: #178ce6;
        }
    }
    .personsDetail-leftItem {
        border-bottom: 2px solid #e6e6e6;
        padding: 10px 0 10px 20px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .personsDetail-leftBtn {
        margin: 10px 0 0 20px;
        color: #178ce6;
    }
    .personsDetail-rightForm {
        flex-grow: 1;
        background: #fafafa;
        padding: 20px;
    }
    .personsDetail-rightItem {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        position: relative;
    }
    .personsDetail-errorTip {
        position: absolute;
        color: orangered;
        font-size: 12px;
        top: 24px;
        left: 50px;
    }
    .personDetail-rightContainer {
        display: flex;
        align-items: center;
    }
    .personsDetail-rightText {
        width: 42px;
        text-align: right;
        margin-right: 8px;
    }
    .personsDetail-input {
        width: 110px !important;
        .dd-input {
            width: 110px !important;
        }
    }
    .personsDetail-largeInput {
        flex-grow: 1;
    }
    .personsDetail-rightFoot {
        display: flex;
        margin-left: 50px;
    }
    .personsDetail-card-container .dd-input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .personsDetail-cardNum {
        flex-grow: 1;
        border-left: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
</style>
<script>
    import { DdSelect, DdOption, DdDatepicker } from 'dd-vue-component';
    import { ID_CARD_TYPE, SEX_TYPE } from '../../../ordersManage/constant';
    import http from '../../http';
    import modal from '../../modal';
    import reg from '../../validate';
    import { mapActions, mapState } from 'vuex';
    import types from '../store/types';

    export default{
        props: {
            orderId: {
                type: Number,
                default: undefined
            },
            roomOrderId: {
                type: Number,
                default: undefined
            },
            show: {
                type: Boolean,
                default: false
            },
            editAble: {
                type: Boolean,
                default: true
            },
            id: Number,
            type: Number
        },
        data() {
            return {
                ID_CARD_TYPE,
                SEX_TYPE,
                editNewPerson: false,
                name: undefined,
                genderType: 2,
                idCardType: 0,
                idCardNum: undefined,
                birthday: undefined,
                phone: undefined,
                carNum: undefined,
                country: undefined,
                address: undefined,
                email: undefined,
                personsList: [],
                selectedPerson: {},
                nameErrorRequire: false,
                idCardNumErrorRequire: false,
                emailErrorRules: false,
                phoneErrorRules: false
            };
        },
        computed: {
            cardsList() {
                return ID_CARD_TYPE.map((item, index) => {
                    return { id: index, name: item };
                });
            },
            genderList() {
                return SEX_TYPE.map((item, index) => {
                    return { id: index, name: item };
                });
            }
        },
        methods: {
            ...mapActions([types.GET_ORDER_DETAIL]),
            resetData() {
                this.name = undefined;
                this.genderType = 2;
                this.idCardType = 0;
                this.idCardNum = undefined;
                this.birthday = undefined;
                this.phone = undefined;
                this.carNum = undefined;
                this.country = undefined;
                this.address = undefined;
                this.email = undefined;
                this.resetErrorTip();
            },
            resetErrorTip() {
                this.nameErrorRequire = false;
                this.idCardNumErrorRequire = false;
                this.emailErrorRules = false;
                this.phoneErrorRules = false;
            },
            checkEmail() {
                const invalid = this.email && this.email.length > 0 && !(reg.email.test(this.email));
                if (invalid) {
                    this.emailErrorRules = true;
                } else {
                    this.emailErrorRules = false;
                }
            },
            checkPhone() {
                const invalid = this.phone && this.phone.length > 0 && !(reg.phone.test(this.phone));
                if (invalid) {
                    this.phoneErrorRules = true;
                } else {
                    this.phoneErrorRules = false;
                }
            },
            hideModal() {
                this.$emit('closePersonsDetail');
                $('#personsDetail').modal('hide');
                this[types.GET_ORDER_DETAIL]({ orderId: this.id, orderType: this.type });
            },
            changeShowPerson(index) {
                this.editNewPerson = false;
                this.personsList.map((person, tag) => {
                    if (tag === index) {
                        person.selected = true;
                        const params = { orderId: this.orderId, roomOrderId: this.roomOrderId, checkInUserId: person.id };
                        http.get('/order/getCheckInUsersAllInfo', params)
                            .then(res => {
                                const checkInUser = res.data.checkInUser;
                                this.selectedPerson = res.data.checkInUser;
                                if (checkInUser) {
                                    this.name = checkInUser.name;
                                    this.genderType = checkInUser.sex;
                                    this.idCardType = checkInUser.idCardType;
                                    this.idCardNum = checkInUser.idCardNum;
                                    this.birthday = checkInUser.birthday;
                                    this.phone = checkInUser.phone;
                                    this.carNum = checkInUser.carNum;
                                    this.country = checkInUser.country;
                                    this.address = checkInUser.address;
                                    this.email = checkInUser.email;
                                }
                            });
                    } else {
                        person.selected = false;
                    }
                });
            },
            savePersonInfo() {
                let invalid = false;
                if (!this.name || this.name.length <= 0) {
                    invalid = true;
                    this.nameErrorRequire = true;
                }
                if (!this.idCardNum || this.idCardNum.length <= 0) {
                    invalid = true;
                    this.idCardNumErrorRequire = true;
                }
                if (this.email && this.email.length > 0 && !reg.email.test(this.email)) {
                    invalid = true;
                    this.emailErrorRules = true;
                }
                if (this.phone && this.phone.length > 0 && !(reg.phone.test(this.phone))) {
                    invalid = true;
                    this.phoneErrorRules = true;
                }
                if (invalid) {
                    return false;
                }
                const person = {
                    name: this.name,
                    phone: this.phone,
                    address: this.address,
                    sex: this.genderType,
                    idCardType: this.idCardType,
                    idCardNum: this.idCardNum,
                    carNum: this.carNum,
                    birthday: this.birthday,
                    country: this.country,
                    email: this.email
                };
                const params = { orderId: this.orderId, roomOrderId: this.roomOrderId, checkInUser: JSON.stringify(person) };
                if (this.editNewPerson) {
                    http.get('/order/addRoomCheckInUser', params)
                        .then(res => {
                            modal.alert('保存成功！');
                            this.getUsersAndInfo();
                        });
                } else {
                    params.checkInUserId = this.selectedPerson.id;
                    http.get('/order/updateRoomCheckInUsers', params)
                        .then(res => {
                            modal.alert('保存成功！');
                        });
                }
            },
            deletePerson(person) {
                const params = { orderId: this.orderId, roomOrderId: this.roomOrderId, checkInUserId: person.id };
                modal.confirm({ title: '删除入住人', message: '确认删除此入住人吗？' }, () => { this.deletePersonMethod(params); });
            },
            deletePersonMethod(params) {
                http.get('/order/deleteRoomCheckInUser', params)
                    .then(res => {
                        this.getUsersAndInfo();
                    });
            },
            addNewPerson() {
                this.resetData();
                this.editNewPerson = true;
                this.personsList.map(person => {
                    person.selected = false;
                });
            },
            cancel() {
                if (this.editNewPerson) {
                    this.resetData();
                } else {
                    this.resetErrorTip();
                    this.name = this.selectedPerson.name;
                    this.genderType = this.selectedPerson.sex;
                    this.idCardType = this.selectedPerson.idCardType;
                    this.idCardNum = this.selectedPerson.idCardNum;
                    this.birthday = this.selectedPerson.birthday;
                    this.phone = this.selectedPerson.phone;
                    this.carNum = this.selectedPerson.carNum;
                    this.country = this.selectedPerson.country;
                    this.address = this.selectedPerson.address;
                    this.email = this.selectedPerson.email;
                }
            },
            getUsersAndInfo() {
                const params = { orderId: this.orderId, roomOrderId: this.roomOrderId };
                http.get('/order/getCheckInUsersBasicInfo', params)
                    .then(res => {
                        if (res.data.checkInUsers && res.data.checkInUsers.length > 0) {
                            this.personsList = [...res.data.checkInUsers];
                            this.personsList.map((person, index) => {
                                if (index === 0) {
                                    this.$set(person, 'selected', true);
                                } else {
                                    this.$set(person, 'selected', false);
                                }
                            });
                        }
                        const nextParams = { orderId: this.orderId, roomOrderId: this.roomOrderId, checkInUserId: this.personsList[0].id };
                        return http.get('/order/getCheckInUsersAllInfo', nextParams);
                    })
                    .then(res => {
                        const checkInUser = res.data.checkInUser;
                        this.selectedPerson = res.data.checkInUser;
                        if (checkInUser) {
                            this.name = checkInUser.name;
                            this.genderType = checkInUser.sex;
                            this.idCardType = checkInUser.idCardType;
                            this.idCardNum = checkInUser.idCardNum;
                            this.birthday = checkInUser.birthday;
                            this.phone = checkInUser.phone;
                            this.carNum = checkInUser.carNum;
                            this.country = checkInUser.country;
                            this.address = checkInUser.address;
                            this.email = checkInUser.email;
                        }
                    });
            }
        },
        watch: {
            show(newVal) {
                if (newVal) {
                    $('#personsDetail').modal('show');
                    this.getUsersAndInfo();
                } else {
                    $('#personsDetail').modal('hide');
                }
            }
        },
        components: {
            DdSelect,
            DdOption,
            DdDatepicker
        }
    };
</script>
