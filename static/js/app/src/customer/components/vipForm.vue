<template>
    <div id="vipForm" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="top-fixed">
                    <span class="dialog-close" ng-click="close()">&times;</span>
                </div>
                <div class="add-container">
                    <div class="vip-info">
                        <p class="dialog-mainTitle" v-if="!vip.vipUserId">新增会员</p>
                        <p class="dialog-mainTitle" v-if="vip.vipUserId">编辑会员</p>
                        <p class="dialog-subTitle">基本信息</p>
                        <div class="vipInfo">
                            <p>
                                <span class="newVip">
                                    <img v-if="!vip.detail" src="//static.dingdandao.com/start.png">姓名</span>
                                <input v-model="vip.name" type="text" maxlength="16" >
                            </p>
                            <span v-if="(vip.modify || !vip.vipUserId) && hasSubmit && (vip.name.length === 0 || !vip.name)" class="tip-name">必填字段</span>
                            <span v-if="(vip.modify || !vip.vipUserId) && hasSubmit && vip.name.length === 1" class="tip-name">格式错误</span>
                            <p>
                                <span class="newVip"><img v-if="!vip.vipUserId" src="//static.dingdandao.com/start.png">手机号</span>
                                <input v-model="vip.phone" type="text" maxlength="11" >
                            </p>
                            <span v-if="!vip.vipUserId && hasSubmit && (vip.phone.length === 0 || !vip.phone)" class="tip-phone">必填字段</span>
                            <span v-if="(vip.modify || !vip.vipUserId) && hasSubmit && vip.phone.length > 0 && vip.phone.length !== 11" class="tip-phone">格式错误</span>
                            <table class="single-line">
                                <tr>
                                    <td>
                                        <label><img v-if="!vip.vipUserId || (vip.modify && !vip.isAutoUpgrade)" src="//static.dingdandao.com/start.png">会员等级</label>
                                        <div v-if="!vip.vipUserId || (vip.modify && !vip.isAutoUpgrade)" class="select1 gender-select">
                                            <dd-select placeholder="-会员等级－">
                                                <dd-option v-for="level in levels" :value="level.vipLevelId" :label="level.vipLevelName"></dd-option>
                                            </dd-select>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>会员卡号</label>
                                        <input style="width: 240px;margin-left: 4px;height: 24px;" v-if="!vip.detail" v-model="vip.vipCardNum" type="text" maxlength="18" >
                                    </td>
                                </tr>
                                <tr>
                                    <td class="identification">
                                        <label>证件号</label>
                                        <div v-if="!vip.detail" class="select1 idcard-select">
                                            <dd-select>
                                                <dd-option v-for="type in idCardType" :value="type.key" :label="type.name"></dd-option>
                                            </dd-select>
                                        </div>
                                        <input v-if="!vip.detail" v-model="vip.idCardNum" type="text" minlength="2" maxlength="18">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="birthday">
                                        <label>生日</label>
                                        <div v-if="!vip.detail" style="display: inline-block;width: 115px">
                                            <dd-datepicker></dd-datepicker>
                                        </div>
                                    </td>
                                    <td class="gender">
                                        <label>性别</label>
                                        <div v-if="!vip.detail" class="select1 gender-select">
                                            <dd-select>
                                                <dd-option value="0" label="男"></dd-option>
                                                <dd-option value="1" label="女"></dd-option>
                                            </dd-select>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div class="formrow clearfloat">
                                <div class="slabel">地区</div>
                                <div class="scontent" v-if="!vip.detail">

                                </div>
                            </div>
                            <p>
                                <span class="newVip">邮箱</span>
                                <input v-model="vip.email" type="text" minlength="2" maxlength="30" >
                            </p>
                            <span v-if="vip.email && !mailFilter.test(vip.email) && hasSubmit && (vip.modify || !vip.vipUserId)" class="tip-email">邮箱格式错误</span>
                            <p>
                                <span class="newVip">备注</span>
                                <textarea v-model="vip.remark" type="text" placeholder="-请填写描述-" maxlength="140" ></textarea>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="dialog-foot">
                    <button v-if="!vip.detail" class="dd-btn dd-btn-sm dd-btn-primary" ng-click="createVip()">确定</button>
                    <button v-if="vip.detail" class="dd-btn dd-btn-sm dd-btn-primary" ng-click="modify()">编辑</button>
                    <button v-if="!vip.detail" class="dd-btn dd-btn-sm dd-btn-ghost" ng-click="close()">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="sass" rel="stylesheet/scss" scoped>
.modal-dialog {
    width: 340px;
}
.modal-content {
    background: #fafafa;
    border-radius: 2px;
    border-top: 4px solid #178ce6;
    box-shadow:0px 2px 4px 0px rgba(0,0,0,0.15);
    padding: 0;
    overflow-x: visible;
    position: relative;
    .top-fixed{
        width: 100%;
        overflow-x: hidden;
        .dialog-close{
            width: 20px;
            text-align: center!important;
            font-size: 20px!important;
            color: #999999!important;
            cursor: pointer;
            float: right;
            position: relative;
            top: 0;
            margin-left: 16px;
        }
        .dialog-close:hover{
            color: #666666!important;
        }
    }
    .add-container{
        margin-bottom: 22px;
        .dialog-mainTitle{
            font-size:16px;
            color:#178ce6;
            text-align:left;
            margin-left: 20px;
            margin-bottom: 8px;
        }
        .dialog-subTitle {
            font-size:14px;
            color:#178ce6;
            text-align:left;
            margin-left: 20px;
        }
    }
}
.vipInfo {
    margin: 16px 0 18px;

    .formrow{
        width: 308px;
        height: 24px;
        margin: 0 auto 16px;
        color: #666666;
        .slabel{
            width: 56px;
            height: 24px;
            line-height: 24px;
            float: left;
            text-align: right;
            margin-right: 4px;
            .require{
                position: relative;
                top: -1px;
                right: 3px;
            }
        }
        .scontent{
            width: 240px;
            height: 24px;
            line-height: 24px;
            float: left;
            text-align: left;
            .selectBox{
                display: block;
                width: 85%;
                .item{
                    width: 100%;
                    height: 24px;
                    background:#ffffff;
                    padding-left: 8px;
                }
                .item.selected{
                    position: relative;
                    border:1px solid #cccccc;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    .triangle{
                        width:0;
                        height:0;
                        border-left:4px solid transparent;
                        border-right:4px solid transparent;
                        border-top:6px solid #cccccc;
                        position: absolute;
                        right: 3px;
                        top: 10px;
                    }
                }
                .toselect-container{
                    display: none;
                    height: 120px;
                    overflow-y: auto;
                    position: relative;
                    z-index: 2;
                    margin-top: -1px;
                    border-bottom: 1px solid #cccccc;
                    background: #ffffff;
                }
                .item.toselect{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-left: 2px;
                }
                .toselect-container.toselect-first {
                    border-left:1px solid #cccccc;
                    .toselect {
                        margin-left: 0;
                    }
                }
                .toselect-container.toselect-last {
                    border-right:1px solid #cccccc;
                }
                .item.toselect:hover{
                    background:#edeef4;
                }
            }
            .selectBox.small{
                font-size: 14px!important;
                width: 80px;
                float: left;
            }
            input{
                display: block;
                width: 85%;
                height: 24px;
                background:#ffffff;
                border:1px solid #cccccc;
                border-radius:2px;
                padding-left: 8px;
                padding-right: 8px;
            }
            .thumbpic{
                width: 200px;
                height: 150px;
                background: white;
                float: left;
                margin-right: 15px;
                img{
                    width: 100%;
                    height: 100%;
                }
                .cross{
                    width: 100%;
                    position: relative;
                    height: 1px;
                    .item1, .item2{
                        width: 111.8%;
                        height: 1px;
                        background: green;
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                    .item1{
                        transform:rotate(20deg);
                    }
                    .item2{
                        transform:rotate(-20deg);
                    }
                }
            }
        }
    }

    p {
        width: 308px;
        margin: 0 auto 16px;
        .newVip {
            width: 56px;
            text-align: right;
            vertical-align: top;
            height: 20px;
            line-height: 20px;
            display: inline-block;
            color: #666666;
            img {
                margin-right: 4px;
            }
        }
        /*.modifyVip {
          margin-left: 4px;
        }*/
        input {
            width: 240px;
            height: 24px;
            margin-left: 8px;
        }
        textarea {
            width: 240px;
            height: 184px;
            margin-left: 8px;
            border:1px solid #cccccc;
            border-radius:2px;
        }
    }
    .single-line {
        //overflow: hidden;
        width: 340px;
        margin: 0 auto;
        color: #666666;
        tr {
            margin-bottom: 16px;
            display: inline-block;
        }
        label {
            font-size:14px;
            font-weight: normal;
            color:#666666;
            text-align:right;
            margin-bottom: 0;
            width: 72px;
        }
        .select1 {
            margin-left: 8px;
            display: inline-block;
        }
        .vipLeave-text-container {
            display: inline-block;
            width: 240px;
            .vip-level-detail {
                display: none;
                position: absolute;
                background: #fafafa;
                box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.15);
                border-radius: 2px;
                width: 200px;
                z-index: 10;
                div:first-child {
                    padding: 8px 16px;
                    color: #666666;
                    font-size: 16px;
                    border-bottom: 1px solid #e6e6e6;
                    margin-bottom: 8px;
                }
                .discount-item {
                    width: 100%;
                    padding: 0 16px;
                    margin-bottom: 11px;
                    display: inline-flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #999999;
                    font-size: 14px;
                }
            }
        }
        .gender {
            label {
                width: 48px;
                line-height: 24px;
                height: 24px;
            }
            float: left;
            .gender-select {
                width: 73px;
                background: #fff url("//static.dingdandao.com/27822A44-62B9-4B12-9550-EC005EAA3D33@1x.png") 100px no-repeat;
                background-position: 60px;
                span {
                    width: 120%
                }
            }
        }
        .identification {
            label {
                width: 72px;
                float: left;
                display: inline-block;
            }
            .idcard-select {
                width: 70px;
                background: #fff url("//static.dingdandao.com/27822A44-62B9-4B12-9550-EC005EAA3D33@1x.png") 57px no-repeat;
                display: inline-block;
                float: left;
                border-radius: 0px;
                border-right: none;
            }
            .idcard-num {
                display: inline-block;
                width: 240px;
                margin-left: 4px;
            }
            span {
                width: 100%;
                padding-right: 15px;
            }
            input {
                width: 170px;
                float: right;
                display: inline-block;
                height: 24px;
                line-height: 24px;
                border: solid 1px #cccccc;
            }
        }
        .birthday {
            float: left;
            label {
                height: 24px;
                line-height: 24px;
                width: 72px;
            }
            input {
                width: 110px;
                margin-left: 4px;
            }
            .birthday-content {
                display: inline-block;
                width: 94px;
                margin-left: 8px;
            }
        }
    }
    input, textarea {
        padding: 0 8px;
        resize: none;
    }
    .consume-container {
        margin-bottom: 8px;
        label {
            font-size: 14px;
            color: #666666;
            text-align: right;
            width: 72px;
            vertical-align: top;
            margin: 0;
        }
        .consume-tips {
            display: inline-block;
        }
        .consum-text {
            font-size: 12px;
            color: #999999;
            padding-left: 16px;
        }
        .vip-leavelUpgrade-tip {
            position: absolute;
            display: none;
            width: 200px;
            background:#fafafa;
            box-shadow:0px 2px 4px 0px rgba(0,0,0,0.15);
            border-radius:2px;
            z-index: 10;
            div:first-child {
                padding: 8px 16px;
                color: #666666;
                font-size: 16px;
                border-bottom: 1px solid #e6e6e6;
            }
            div:last-child {
                padding: 8px 16px;
                font-size: 14px;
                color: #999999;
            }
        }
    }
    .tip-img-container {
        display: inline-block;
        height: 16px;
        position: relative;
        img {
            cursor: pointer;
        }
        .tip-img-subContainer {
            width: 16px;
            height: 16px;
        }
        .consume-subContainer:hover {
            .vip-leavelUpgrade-tip {
                display: block;
            }
        }
        .level-detail-subContainer:hover {
            .vip-level-detail {
                display: block;
            }
        }
    }
}
.dialog-foot {
    margin: 0 0 20px 80px;
    button {
        width: 50px;
        height: 24px;
        line-height: 20px;
        font-size:14px;
        text-align:center;
        border: 1px solid #178ce6;
        border-radius: 2px;
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
                    {key: '0', name: '身份证'},
                    {key: '1', name: '军官证'},
                    {key: '2', name: '通行证'},
                    {key: '3', name: '护照'},
                    {key: '4', name: '其他'},
                ]
            }
        },
        watch: {
            visible(val) {
                if (val) {
                    $('#vipForm').modal('show');
                } else {
                    $('#vipForm').modal('hide');
                }
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
            }
        },
        components: {
            DdSelect,
            DdOption,
            DdDatepicker
        }
    }
</script>
