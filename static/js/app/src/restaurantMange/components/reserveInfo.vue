/**
 * @Author: lwh
 * @Date:   2017-08-07 11:16:56
 * @Last Modified by:   lwh
 * @Last Modified time: 2017-08-12 10:52:17
 */

<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="reserveInfo">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span>填写预订信息</span>
                    <button type="button" class="close" @click="hideModal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <div class="userVip-list" v-clickoutside="hideVipList" v-show="vipListShow" @click.stop="()=>{}">
                        <p class="userVip-item" v-for="vip in vipList" @click="setVipInfo(vip)">
                            <span class="vip-level">
                                [<span class="vip-level-text">{{ vip.level }}</span>]
                            </span>
                            <span class="vip-name">{{ vip.name }}</span>
                            <span class="vip-phone">{{ vip.phone }}</span>
                        </p>
                    </div>
                    <div class="item">
                        <span>客户姓名：</span>
                        <div style="width:200px;">
                            <input type="text" class="dd-input" style="width:200px;" v-model="name" @input="changeVipList(1)">
                        </div>
                        <span class="relevance-order" @click="showRelevanceOrder">关联订单</span>
                    </div>
                    <div><span style="display:inline-block;width:70px;text-align:right;">手机号：</span><input type="number" class="dd-input" style="width:200px;" v-model="phone" @input="changeVipList(2)"></div>
                    <div class="item">
                        <span>客户来源：</span>
                        <div style="width:200px;">
                            <dd-select v-model="userOriginType">
                                <dd-option :key="origin" v-for="origin in userSelfOrigins" :value="origin" :label="origin.name">
                                    <span :title="origin.name">{{origin.name}}</span>
                                </dd-option>
                                <dd-group-option v-for="item in userGroupOrigins" :label="item.label" :key="item" v-if="item.origins.length > 0">
                                    <dd-option v-for="origin in item.origins" :key="origin" :value="origin" :label="origin.id > 0 ? origin.name : `企业(${origin.name})`">
                                            <div class="user-group-origin">
                                                <span class="user-group-company" :title="origin.name">
                                                    {{ origin.name }}
                                                </span>
                                                <span class="user-group-img" v-if="!origin.type" :title="origin.info"></span>
                                            </div>
                                    </dd-option>
                                </dd-group-option>
                            </dd-select>
                        </div>
                    </div>
                    <div class="item" v-show="showVipCardSelect">
                        <span style="display:inline-block;width:70px;text-align:right;">会员卡：</span>
                        <div style="width:200px;">
                            <dd-select v-model="vipCardId">
                                <dd-option :value="0" label="不使用">
                                    不使用
                                </dd-option>
                                <dd-group-option v-for="item in vipCardsAndLevel" :label="item.label" :key="item" v-if="item.levels && item.levels.length > 0">
                                    <dd-option v-for="level in item.levels" :key="level" :value="level.id" :label="level.name+(level.serialNum || '')">
                                        <span :title="level.serialNum" class="text-over-ellips">{{level.name}} {{level.serialNum}}</span>
                                    </dd-option>
                                </dd-group-option>
                            </dd-select>
                        </div>
                    </div>
                    <div><span>就餐人数：</span><input type="number" max="1000" class="dd-input" style="width:200px;" v-model.number="eatNum"></div>
                    <div class="item">
                        <span style="display:inline-block;width:70px;text-align:right;">用餐时间：</span>
                        <div>
                            <DatePicker v-model='date' @change='' :clearable='false' type="datetime" placeholder="选择日期时间" format='yyyy-MM-dd HH:mm'></DatePicker>
                        </div>
                    </div>
                    <div class="item">
                        <span style="display:inline-block;width:70px;text-align:right;">销售员：</span>
                        <div style="width:200px;">
                            <dd-select v-model="saleId">
                                <dd-option :value="-1" label="无">
                                    无
                                </dd-option>
                                <dd-option v-for="sale in saleList" :key="sale.employeeId"  :value="sale.employeeId" :label="sale.realName + (sale.phone ? '(' + sale.phone+ ')' : '')">
                                    <span class="text-over-ellips" :title="sale.realName + (sale.phone ? '(' + sale.phone+ ')' : '')">{{sale.realName + (sale.phone ? '(' + sale.phone+ ')' : '')}}</span>
                                </dd-option>
                            </dd-select>
                        </div>
                    </div>
                    <div class="order-remark">
                        <span>订单备注：</span>
                        <textarea style="width:300px;height:80px;" v-model="remark"></textarea>
                    </div>
                </div>
                <div class="modal-foot">
                    <button class="dd-btn dd-btn-ghost" @click="hideModal">取消</button>
                    <button class="dd-btn dd-btn-primary" @click="addCaterOrder">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { DdSelect, DdOption, DdGroupOption } from 'dd-vue-component';
import Clickoutside from 'dd-vue-component/src/utils/clickoutside';
import { DatePicker } from 'element-ui';
import http from '../../common/http.js';
import util from '../../common/util.js';
import { mapState } from 'vuex';
export default {
    directives: {
        Clickoutside
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            customerSource: 1,
            date: new Date((new Date().valueOf() + 1800000)),
            userOriginType: undefined,
            userSelfOrigins: [],
            userGroupOrigins: [],
            vipList: [],
            vipListShow: false,
            vipDiscountDetail: {},
            name: '',
            phone: '',
            vipCardId: undefined,
            vipCardsAndLevel: [],
            saleList: [],
            saleId: -1,
            eatNum: undefined,
            remark: ''
        };
    },
    created() {
        this.getChannels();
        this.getSaleList();
    },
    computed: {
        ...mapState(['restId']),
        showVipCardSelect() {
            return this.vipDiscountDetail && this.vipDiscountDetail.isVip;
        }
    },
    methods: {
        hideModal() {
            this.$emit('hideModal');
            this.refreshData();
        },
        showRelevanceOrder() {
            this.hideModal();
            this.$emit('showRelevaneOrder');
        },
        getChannels() {
            http.get('/user/getChannels', {
                type: 2,
                isAll: true
            })
                .then((res) => {
                    const originsList = res.data.list;
                    const otherOrigins = [];
                    this.userGroupOrigins.push({
                        label: '企业',
                        origins: []
                    });
                    this.userGroupOrigins.push({
                        label: '其他',
                        origins: []
                    });
                    originsList.forEach(origin => {
                        if (origin.id === -1 || origin.id === -4) {
                            this.userSelfOrigins.push(origin);
                            if (origin.id === -1) this.userOriginType = origin;
                        }

                        if (origin.id === -5) {
                            origin.companyList.forEach(company => {
                                const companyName = `企业名称:${company.companyName}(${company.companyType ? '可挂帐' : '不可挂帐'})`;
                                const number = `企业编号:${company.contractNum || ''}`;
                                const name = `联系人:${company.contactName || ''}`;
                                const phone = `联系人电话:${company.contactPhone || ''}`;
                                company.name = company.companyName;
                                company.companyId = company.id;
                                company.id = origin.id;
                                company.info = `${companyName}\n${number}\n${name}\n${phone}`;
                            });
                            this.userGroupOrigins[0].origins = origin.companyList;
                        }

                        if (origin.id > 0) {
                            origin.info = origin.name;
                            otherOrigins.push(origin);
                        }
                    });
                    this.userGroupOrigins[1].origins = otherOrigins;
                });
        },
        changeVipList(num) {
            if (num === 2 && this.phone) {
                this.getVipDiscount(this.phone, true);
            }
            const params = num === 1 ? {
                name: this.name
            } : {
                phone: this.phone
            };
            if ((num === 1 && this.name.length >= 1) || (num === 2 && this.phone.length >= 4)) {
                clearTimeout(this.timeCount);
                this.timeCount = setTimeout(() => {
                    this.getVipList(params, num);
                }, 500);
            }
        },
        getVipList(params, position) {
            http.get('/vipUser/search', params)
                .then(res => {
                    this.vipList = res.data.list;
                    this.vipListShow = res.data.list && res.data.list.length > 0;
                    this.setVipListPosition(position);
                });
        },
        hideVipList() {
            this.vipListShow = false;
            this.vipList = [];
        },
        setVipInfo(vip) {
            this.name = vip.name;
            this.phone = vip.phone;
            this.vipId = vip.vipId;
            this.vipListShow = false;
            this.getVipDiscount(vip.phone, true);
            this.userOriginType = this.getOrigin(-4);
        },
        getVipDiscount(phone, setOrigin) {
            if (phone === this.vipDiscountDetail.phone) {
                return;
            }
            this.vipDiscountDetail.phone = phone;
            const params = {
                phone: phone
            };
            http.get('/vipUser/getVipDiscount', params)
                .then(res => {
                    this.vipDiscountDetail = { ...res.data,
                        phone: phone,
                        tag: res.data.vipDetail && res.data.vipDetail.level
                    };
                    if (this.vipDiscountDetail.isVip) {
                        if (setOrigin) {
                            this.userOriginType = this.getOrigin(-4);
                        }
                        this.vipId = res.data.vipDetail.vipId;
                        // 生成会员卡下拉框,规定不使用-0，会员等级，-1
                        this.vipCardsAndLevel = [];
                        this.vipCardsAndLevel.push({
                            label: '会员',
                            levels: [{
                                name: res.data.vipDetail.level,
                                id: -1,
                                discountList: res.data.vipDetail.discountList,
                                vipId: res.data.vipDetail.vipId
                            }]
                        });
                        const cards = res.data.cards.map(card => {
                            return {
                                id: card.id,
                                name: card.name,
                                serialNum: card.serialNum,
                                discountList: card.discountList
                            };
                        });
                        this.vipCardsAndLevel.push({
                            label: '会员卡',
                            levels: cards
                        });
                        // 默认选择一个选项，优先级：会员卡（最新办理的优先级高）>等级会员。
                        this.$nextTick(() => {
                            if (cards && cards.length > 0) {
                                this.vipCardId = cards[0].id;
                            } else {
                                this.vipCardId = -1;
                            }
                        });
                    } else {
                        this.userOriginType = this.getOrigin(-1);
                    }
                });
        },
        getOrigin(id, companyId) {
            // -5企业，-4会员
            if (id === -5) {
                return this.userGroupOrigins[0].origins.find(i => companyId === i.companyId);
            } else {
                return this.userSelfOrigins.find(i => id === i.id) || this.userGroupOrigins[1].origins.find(i => id === i.id);
            }
        },
        setVipListPosition(position) {
            const vipList = document.querySelector('.userVip-list');
            if (vipList) {
                vipList.style.left = 86 + 'px';
                vipList.style.top = position === 1 ? 40 + 'px' : 80 + 'px';
            }
        },
        getCompanyDiscount(params) {
            http.get('/contractCompany/getContractDiscount', params)
                .then(res => {
                    const discountList = res.data;
                    this.vipDiscountDetail = {
                        isVip: false,
                        vipDetail: discountList,
                        tag: '企业'
                    };
                });
        },
        getSaleList() {
            http.get('/user/getEmployeeList', {
                salerType: 2
            }).then(res => this.saleList = res.data.list);
        },
        addCaterOrder() {
            const params = {};
            params.boardList = JSON.stringify([]);
            params.customerName = this.name;
            params.customerPhone = this.phone;
            params.origin = this.userOriginType.name;
            params.originId = this.userOriginType.id;
            if (this.userOriginType.id === -4 || this.userOriginType.id === -5) {     // 会员和企业
                if (this.userOriginType.id === -5) {
                    params.discountChannel = 2;
                    params.discountRelatedId = this.userOriginType.companyId;
                }
                if (this.userOriginType.id === -4) {
                    if (this.vipCardId === -1) {   // 使用会员等级
                        params.discountChannel = 1;
                        params.discountRelatedId = this.vipCardId;
                    } else if (this.vipCardId > 0) {    // 使用会员卡
                        params.discountChannel = 4;
                        params.discountRelatedId = this.vipCardId;
                    }
                }
            }
            params.peopleNum = this.eatNum;
            params.reserveTime = util.dateFormatLong(new Date(this.date)).substring(0, 16);
            if (this.saleId !== -1) {
                params.salerId = this.saleId;
            }
            params.remark = this.remark;
            params.restId = this.restId;
            params.operationType = 0;
            http.get('/catering/addOrder', params).then(res => {
                if (res.code === 1) {
                    this.hideModal();
                }
            });
        },
        refreshData() {
            this.name = '';
            this.phone = '';
            this.userOriginType = undefined;
            this.remark = '';
            this.vipDiscountDetail = {};
            this.eatNum = undefined;
            this.saleId = -1;
        }
    },
    watch: {
        visible(newVale) {
            if (newVale) {
                $('#reserveInfo').modal('show');
            } else {
                $('#reserveInfo').modal('hide');
            }
        },
        userOriginType(origin) {
            if (!origin) {
                return false;
            }
            const originType = origin.id;
            const companyId = origin.companyId;
            if (originType === -5) {
                this.getCompanyDiscount({
                    contractCompanyId: companyId
                });
                this.vipCardId = -5;
                return;
            }

            if (originType === -4 && this.phone) {
                this.getVipDiscount(this.phone, true);
            }

            if (originType !== -5 && originType !== -4) {
                // this.vipCardId = 0;
                this.vipDiscountDetail = {};
            }
        }
    },
    components: {
        DdSelect,
        DdOption,
        DatePicker,
        DdGroupOption
    }
};
</script>

<style lang="scss">
    .modal-content{
        padding-top: 0;
        padding-bottom: 10px;
        .modal-body{
            border-bottom: 1px solid #e5e5e5;
            > div{
                margin-bottom: 16px;
            }
            .relevance-order{
                margin-left: 10px;
                color: #178ce6;
                cursor: pointer;
            }
            .userVip-list{
                position: absolute;
                background: #fafafa;
                z-index: 2;
            }
        }
        .modal-foot{
            padding-top: 15px;
            text-align: right;
        }
        .item{
            display: flex;
        }
        .order-remark{
            display: flex;
        }
    }
    .el-input__inner{
        height: 24px !important;
    }
</style>
