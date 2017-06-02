<template>
    <div>
        <div class="modal fade roomModals" id="personsDetail" role="dialog" data-backdrop="static">
            <div class="modal-dialog" style="width: 545px">
                <div class="modal-content" style="width: 545px">
                    <div class="roomModals-header" style="border-bottom: 1px solid #e6e6e6">
                        <span class="header-text personsDetail-title">入住人详情</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="personsDetail-body">
                        <div class="personsDetail-leftList">
                            <div class="personsDetail-leftItem"
                                 :class="{'selected': person.selected}"
                                 v-for="(person, index) in personsList"
                                 @click="changeShowPerson(index)"
                                 v-if="personsList && personsList.length > 0">
                                <div>
                                    <p>{{person.name}}</p>
                                    <p style="font-size: 12px">{{person.idCardNum}}</p>
                                </div>
                                <span class="delete-icon" style="margin: 0 4px 0" @click="deletePerson(person)" v-show="editAble"></span>
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
                            </div>
                            <div class="personsDetail-rightItem">
                                <span class="personsDetail-rightText">生日</span>
                                <div class="personsDetail-input">
                                    <dd-datepicker v-model="birthday" :disabled="!editAble"></dd-datepicker>
                                </div>
                            </div>
                            <p class="personsDetail-rightItem">
                                <span class="personsDetail-rightText">手机号</span>
                                <input type="text" class="dd-input personsDetail-input" maxlength="20" v-model="phone" :disabled="!editAble" />
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
                                <input type="text" class="dd-input personsDetail-largeInput" maxlength="32" v-model="email" :disabled="!editAble" />
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
            personsList: {
                type: Array,
                default: []
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
                email: undefined
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
            },
            hideModal() {
                this.$emit('closePersonsDetail');
                $('#personsDetail').modal('hide');
            },
            changeShowPerson(index) {
                this.editNewPerson = false;
                this.personsList.map((person, tag) => {
                    if (tag === index) {
                        person.selected = true;
                        this.name = person.name;
                        this.idCardType = person.idCardType;
                        this.idCardNum = person.idCardNum;
                    } else {
                        person.selected = false;
                    }
                });
            },
            savePersonInfo() {
                modal.alert('保存成功！');
            },
            deletePerson(person) {
                modal.confirm({ title: '删除入住人', message: '确认删除此入住人吗？' });
            },
            addNewPerson() {
                this.resetData();
                this.editNewPerson = true;
                this.personsList.map(person => {
                    person.selected = false;
                });
            },
            cancel() {
                let selectedPerson;
                if (this.editNewPerson) {
                    this.resetData();
                } else {
                    this.personsList.map(person => {
                        if (person.selected) {
                            selectedPerson = person;
                        }
                    });
                    this.name = selectedPerson.name;
                    this.idCardType = selectedPerson.idCardType;
                    this.idCardNum = selectedPerson.idCardNum;
                }
            }
        },
        watch: {
            show(newVal) {
                if (newVal) {
                    $('#personsDetail').modal('show');
                } else {
                    $('#personsDetail').modal('hide');
                }
            },
            personsList(newVal) {
                if (newVal && newVal.length > 0) {
                    this.name = newVal[0].name;
                    this.idCardType = newVal[0].idCardType;
                    this.idCardNum = newVal[0].idCardNum;
                    newVal.map((person, index) => {
                        if (index === 0) {
                            this.$set(person, 'selected', true);
                        } else {
                            this.$set(person, 'selected', false);
                        }
                    });
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
