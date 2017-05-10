<template>
    <div>
        <div class="checkInPerson-personsList" v-if="personsObj.persons && personsObj.persons.length > 0">
            <div class="checkInPerson-person" v-for="(person, index) in personsObj.persons">
                <span class="checkInPerson-person-icon"></span>
                <input class="dd-input checkInPerson-person-name" placeholder="入住人姓名" v-model="person.name" maxlength="16">
                <div class="checkInPerson-component-container">
                    <dd-select v-model="person.idCardType">
                        <dd-option v-for="card in cardsList" :value="card.id" :label="card.name" :key="card.id+card.name">
                        </dd-option>
                    </dd-select>
                </div>
                <input class="dd-input checkInPerson-person-cardNum" style="width: 170px;" placeholder="证件号码" v-model="person.idCardNum" maxlength="18">
                <span class="checkInPerson-delete-icon" @click="deletePerson(index)"></span>
            </div>
        </div>
        <div class="checkInPerson-btns">
            <div class="checkInPerson-btn" @click="addPerson(0)">
                <span class="checkInPerson-add-icon"></span>
                <span class="checkInPerson-text">添加入住人</span>
            </div>
            <div class="checkInPerson-btn" @click="addPerson(1)">
                <span class="checkInPerson-card-icon"></span>
                <span class="checkInPerson-text">读卡添加入住人</span>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    .checkInPerson-baseStyle {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #666666;
    }
    .checkInPerson-person {
        @extend .checkInPerson-baseStyle;
        padding-left: 32px;
        margin-top: 16px;
    }
    .checkInPerson-btns {
        @extend .checkInPerson-baseStyle;
        padding-left: 65px;
        margin-top: 16px;
    }
    .checkInPerson-btn {
        @extend .checkInPerson-baseStyle;
        cursor: pointer;
        margin-right: 24px;
        & > span {
            cursor: pointer;
        }
    }
    .checkInPerson-person-name {
        margin-right: 4px;
    }
    .checkInPerson-component-container .dd-input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .checkInPerson-person-cardNum {
        width: 170px;
        border-left: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .checkInPerson-person-icon {
        width: 16px;
        height: 15px;
        background: url("../../../../../../image/modal/room_modal_user.png");
        background-size: contain;
        margin-right: 17px;
    }
    .checkInPerson-delete-icon {
        width: 16px;
        height: 16px;
        background: url("../../../../../../image/modal/room_modal_min.png");
        background-size: contain;
        margin-left: 8px;
        cursor: pointer;
    }
    .checkInPerson-add-icon {
        width: 16px;
        height: 16px;
        background: url("../../../../../../image/modal/room_modal_add.png");
        background-size: contain;
        margin-right: 4px;
        cursor: pointer;
    }
    .checkInPerson-card-icon {
        width: 24px;
        height: 17px;
        background: url("../../../../../../image/modal/room_modal_card.png");
        background-size: contain;
        margin-right: 4px;
        cursor: pointer;
    }
</style>
<script>
    import { DdSelect, DdOption } from 'dd-vue-component';
    import { ID_CARD_TYPE } from '../../../ordersManage/constant';
    import modal from 'modal';
    import ieidc from '../../../ordersManage/utils/ieidc';
    export default{
        props: {
            personsObj: {
                type: Object,
                default: function() { return {}; }
            }
        },
        data() {
            return {
                ID_CARD_TYPE
            };
        },
        computed: {
            cardsList() {
                return ID_CARD_TYPE.map((item, index) => {
                    return { id: index, name: item };
                });
            }
        },
        methods: {
            addPerson(type) {
                if (type === 0) {
                    this.$emit('addPerson', this.personsObj.id, { idCardNum: '', idCardType: 0, name: '' });
                } else {
                    try {
                        ieidc.init();
                        const { idCardNum, name } = ieidc.read(3);

                        this.$emit('addPerson', this.personsObj.id, { idCardType: 0, idCardNum, name });
                    } catch (e) {
                        modal.warn(e);
                    }
                }
            },
            deletePerson(index) {
                this.$emit('deletePerson', this.personsObj.id, index);
            }
        },
        components: {
            DdSelect,
            DdOption
        }
    };
</script>
