<template>
    <div class="message-list">
        <div class="title-container">
            <img src="/static/image/order-message-icon.png" v-if="visibleType === 'orderMessage'">
            <img src="/static/image/system-message-icon.png" v-else>
            <h4>{{ visibleType === 'orderMessage'? '订单消息' : '系统消息'}}</h4>
        </div>
        <div class="list-container">
            <ul class="nav nav-tabs">
                <li class="active">
                    <a href="#unread" data-toggle="tab">未读</a>
                </li>
                <li>
                    <a href="#read" data-toggle="tab">已读</a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane fade in active" id="unread">
                    <ul v-if="unreadList.length > 0">
                        <li v-for="item in unreadList" @click="showOrderDetail(item)">
                            <div class="item-left">
                                <span v-if="visibleType === 'orderMessage'">{{orderMegType[item.msgType]}}</span>
                                <span class="autocut" :title="item.content">{{item.content}}</span>
                            </div>
                            <div>
                                <span>{{item.time}}</span>
                            </div>
                        </li>
                    </ul>
                    <div v-else>目前没有未读消息</div>
                    <div class="page-container" v-if="visibleType === 'orderMessage'">
                        <dd-pagination @currentchange="getUnreadOrderMsg" :visible-pager-count="6" :show-one-page="false" :page-count="unreadOrderMsgPages" :current-page="unreadOrderMsgPageNo" />
                    </div>
                    <div class="page-container" v-else>
                        <dd-pagination @currentchange="getUnreadSystemMsg" :visible-pager-count="6" :show-one-page="false" :page-count="unreadSystemMsgPages" :current-page="unreadSystemMsgPageNo" />
                    </div>
                </div>
                <div class="tab-pane fade in" id="read">
                    <ul v-if="readList.length > 0">
                        <li v-for="item in readList" @click="showOrderDetail(item)">
                            <div class="item-left">
                                <span v-if="visibleType === 'orderMessage'">{{orderMegType[item.msgType]}}</span>
                                <span class="autocut" :title="item.content">{{item.content}}</span>
                            </div>
                            <div>
                                <span>{{item.time}}</span>
                            </div>
                        </li>
                    </ul>
                    <div class="no-message" v-else>目前没有已读消息</div>
                    <div class="page-container" v-if="visibleType === 'orderMessage'">
                        <dd-pagination @currentchange="getReadOrderMsg" :visible-pager-count="6" :show-one-page="false" :page-count="readOrderMsgPages" :current-page="readOrderMsgPageNo" />
                    </div>
                    <div class="page-container" v-else>
                        <dd-pagination @currentchange="getReadSystemMsg" :visible-pager-count="6" :show-one-page="false" :page-count="readSystemMsgPages" :current-page="readSystemMsgPageNo" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import http from '../../common/http';
import bus from '../../common/eventBus';
import { DdPagination } from 'dd-vue-component';
import util from '../../common/util';
export default{
    props: {
        visibleType: {
            type: String,
            default: 'orderMessage'
        }
    },
    data() {
        return {
            unreadOrderMsg: [],
            unreadSystemMsg: [],
            readOrderMsg: [],
            readSystemMsg: [],
            unreadOrderMsgPages: 0,
            readOrderMsgPages: 0,
            unreadSystemMsgPages: 0,
            readSystemMsgPages: 0,
            unreadOrderMsgPageNo: 1,
            readOrderMsgPageNo: 1,
            unreadSystemMsgPageNo: 1,
            readSystemMsgPageNo: 1,
            orderMegType: [
                '系统消息',
                '直销网站订单消息',
                '团队接单订单消息',
                '餐饮扫码下单消息',
                '销售下单'
            ]
        };
    },
    created() {
        this.getUnreadOrderMsg();
        this.getReadOrderMsg();
        this.getUnreadSystemMsg();
        this.getReadSystemMsg();
    },
    computed: {
        readList() {
            if (this.visibleType === 'orderMessage') {
                return this.readOrderMsg;
            } else if (this.visibleType === 'systemMessage') {
                return this.readSystemMsg;
            }
        },
        unreadList() {
            if (this.visibleType === 'orderMessage') {
                return this.unreadOrderMsg;
            } else if (this.visibleType === 'systemMessage') {
                return this.unreadSystemMsg;
            }
        }
    },
    methods: {
        getUnreadOrderMsg(page) {
            this.unreadOrderMsgPageNo = page || this.unreadOrderMsgPageNo;
            http.get('/msg/list', { page: this.unreadOrderMsgPageNo, status: 0, pageLimit: 10 }).then(res => {
                if (res.code === 1) {
                    this.unreadOrderMsg = res.data.orderMsgList;
                    this.unreadOrderMsgPages = Math.ceil(res.data.totalCount / 10);
                    this.unreadOrderMsg.forEach(item => {
                        item.time = util.dateFormatLong(new Date(item.time)).substring(0, 16);
                    });
                }
            });
        },
        getReadOrderMsg(page) {
            this.readOrderMsgPageNo = page || this.readOrderMsgPageNo;
            http.get('/msg/list', { page: this.readOrderMsgPageNo, status: 1, pageLimit: 10 }).then(res => {
                if (res.code === 1) {
                    this.readOrderMsg = res.data.orderMsgList;
                    this.readOrderMsgPages = Math.ceil(res.data.totalCount / 10);
                    this.readOrderMsg.forEach(item => {
                        item.time = util.dateFormatLong(new Date(item.time)).substring(0, 16);
                    });
                }
            });
        },
        getUnreadSystemMsg(page) {
            this.unreadSystemMsgPageNo = page || this.unreadSystemMsgPageNo;
            http.get('/msg/systemMsgList', { page: this.unreadSystemMsgPageNo, status: 0, pageLimit: 10 }).then(res => {
                if (res.code === 1) {
                    this.unreadSystemMsg = res.data.list;
                    this.unreadSystemMsgPages = Math.ceil(res.data.totalCount / 10);
                    this.unreadSystemMsg.forEach(item => {
                        item.time = util.dateFormatLong(new Date(item.time)).substring(0, 16);
                        item.content = item.content.replace(/<[^>]+>/g, '');
                    });
                }
            });
        },
        getReadSystemMsg(page) {
            this.readSystemMsgPageNo = page || this.readSystemMsgPageNo;
            http.get('/msg/systemMsgList', { page: this.readSystemMsgPageNo, status: 1, pageLimit: 10 }).then(res => {
                if (res.code === 1) {
                    this.readSystemMsg = res.data.list;
                    this.readSystemMsgPages = Math.ceil(res.data.totalCount / 10);
                    this.readSystemMsg.forEach(item => {
                        item.time = util.dateFormatLong(new Date(item.time)).substring(0, 16);
                        item.content = item.content.replace(/<[^>]+>/g, '');
                    });
                }
            });
        },
        showOrderDetail(item) {
            if (this.visibleType === 'orderMessage') {
                bus.$emit('onShowDetail', { type: item.orderType, orderId: item.orderId });
            }
            http.get('/msg/setRead', { msgId: item.messageId }).then(res => {
            });
        }
    },
    components: {
        DdPagination
    }
};
</script>

<style lang="scss" scoped>
    .message-list{
        padding: 23px;
        .title-container{
            display: flex;
            img{
                margin-right: 7px;
            }
            h4{
                line-height: 20px;
            }
        }
        .list-container{
            margin-top: 22px;
            .nav{
                border-bottom: 1px solid #e6e6e6;
                margin-bottom: 0px;
                li{
                    width: 46px;
                    background: #fafafa;
                    a{
                        color: #178ce6;
                    }
                    &.active{
                        border: 1px solid #e6e6e6;
                        border-bottom: 1px solid #fff;
                        a{
                            color: #666;
                            background: #fff;
                        }
                    }
                }
            }
            .tab-content{
                ul{
                    background: #fafafa;
                    li{
                        display: flex;
                        justify-content: space-between;
                        height: 46px;
                        line-height: 46px;
                        border-bottom: 1px solid #e6e6e6;
                        cursor: pointer;
                    }
                }
                .page-container{
                    padding-top: 28px;
                    text-align: right;
                    background: #fafafa;
                }
                .no-message{
                    padding-top: 20px;
                    background: #fafafa;
                    text-align: center;
                }
            }
        }
        .item-left{
            display: flex;
            align-items: center;
            .autocut {  
                display: inline-block;
                width:510px;  
                overflow:hidden;  
                white-space:nowrap;  
                text-overflow:ellipsis;  
                -o-text-overflow:ellipsis;  
                -icab-text-overflow: ellipsis;  
                -khtml-text-overflow: ellipsis;  
                -moz-text-overflow: ellipsis;  
                -webkit-text-overflow: ellipsis;  
            }
        }
        
    }
</style>
