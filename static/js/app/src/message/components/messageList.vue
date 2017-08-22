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
                    <a href="#read" data-toggle="tab">已读</a>
                </li>
                <li>
                    <a href="#unread" data-toggle="tab">未读</a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane fade in active" id="read">
                    <ul>
                        <li v-for="item in readList"></li>
                    </ul>
                    <dd-pagination @currentchange="" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
                </div>
                <div class="tab-pane fade in" id="unread">
                    <ul>
                        <li></li>
                    </ul>
                    <dd-pagination @currentchange="" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import http from '../../common/http';
import { DdPagination } from 'dd-vue-component';
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
            pages: 3,
            pageNo: 1
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
        getUnreadOrderMsg() {
            http.get('/msg/list', { page: 1, status: 0, pageLimit: 10 }).then(res => {
                if (res.code === 1) {
                    this.unreadOrderMsg = res.data.orderMsgList;
                }
            });
        },
        getReadOrderMsg() {
            http.get('/msg/list', { page: 1, status: 1, pageLimit: 10 }).then(res => {
                if (res.code === 1) {
                    this.readOrderMsg = res.data.orderMsgList;
                }
            });
        },
        getUnreadSystemMsg() {
            http.get('/msg/systemMsgList', { page: 1, status: 0, pageLimit: 10 }).then(res => {
                if (res.code === 1) {
                    this.unreadSystemMsg = res.data.list;
                }
            });
        },
        getReadSystemMsg() {
            http.get('/msg/systemMsgList', { page: 1, status: 1, pageLimit: 10 }).then(res => {
                if (res.code === 1) {
                    this.readSystemMsg = res.data.list;
                }
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
                margin-bottom: 16px;
                li{
                    width: 46px;
                    a{
                        background: #fff;
                        color: #178ce6;
                    }
                    &.active{
                        border: 1px solid #e6e6e6;
                        border-bottom: 1px solid #fff;
                        a{
                            color: #666;
                        }
                    }
                }
            }
        }
    }
</style>
