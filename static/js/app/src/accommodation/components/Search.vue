<template>
    <div class="acc-search" v-clickoutside="hideSearch">
        <div class="acc-search-wrapper">
            <div class="eluyun_search-grey_outer spriteImg acc-search-btn" v-if="searchKeyword === ''">
                <div class="eluyun_search-grey"></div>
            </div>
            <div class="eluyun_search-blue_outer spriteImg acc-search-btn" v-if="searchKeyword !== ''"
                 @click="search(1)">
                <div class="eluyun_search-blue"></div>
            </div>
            <input class="acc-search-keyword dd-input" type="text" placeholder="搜索房间号/客户姓名/手机号/订单号"
                   v-model="searchKeyword" @keyup.enter="search(1)">
            <div class="acc-search-results" v-if="resultsVisible">
                <div class="acc-search-count">{{searchResultsNum === 0 ? '没有搜索结果' : `共有${searchResultsNum}条搜索结果`}}</div>
                <div v-for="g in searchResults" @click="showOrder(g.orderId)">
                    <div class="acc-search-item" :orderId="g.orderId">
                        <div>
                            <span class="search-label">开始于:</span>
                            <span>{{g.startDate}}</span>
                        </div>
                        <div>
                            <span class="search-label">客户:</span>
                            <span>{{g.customerName}} {{g.customerPhone}}</span>
                        </div>
                        <div class="acc-search-order">
                            <span>
                                <span class="search-label">订单号:</span>
                                <span class="desc">{{g.orderNum}}</span>
                            </span>
                            <span class="search-label search-origin" :title="g.origin">{{g.origin}}</span>
                        </div>
                        <div class="acc-search-order-status" :class="ORDER_STATUS[g.orderState].en">{{ORDER_STATUS[g.orderState].long}}</div>
                    </div>
                </div>
                <div class="acc-search-page" v-if="searchResultsNum > limit">
                    <div class="acc-search-btn previous" @click="changePage(page-1);">
                        <div v-if="page > 1" class="eluyun_forward_outer spriteImg">
                            <div class="eluyun_forward"></div>
                        </div>
                        <div class="eluyun_3_outer spriteImg" v-if="page <= 1">
                            <div class="eluyun_3"></div>
                        </div>
                    </div>
                    <div class="acc-search-btn next" @click="changePage(page+1)">
                        <div class="eluyun_backward_outer spriteImg" v-if="page * limit < searchResultsNum">
                            <div class="eluyun_backward"></div>
                        </div>
                        <div class="eluyun_4_outer spriteImg" v-if="page * limit >= searchResultsNum">
                            <div class="eluyun_4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" rel="stylesheet/scss">
    .acc-search {
        position: absolute;
        right: 54px;
        top: 13px;
        z-index: 1039;
    }
    .acc-search-switch, .acc-search-btn {
        cursor: pointer;
        position: relative;
    }
    .acc-search-keyword {
        display: block;
        width: 280px;
        position: absolute;
        right: -5px;
        top: -3px;
        z-index: -1;
        padding: 0 8px;
    }
    .acc-search-results {
        background: #fafafa;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
        border-radius: 2px;
        width: 280px;
        position: absolute;
        right: -5px;
        top: 22px;
        padding: 4px 8px;
    }
    .acc-search-page {
        margin-top: 4px;
        display: flex;
        justify-content: flex-end;
    }
    .acc-search-item {
        position: relative;
        border-bottom: 1px solid #e6e6e6;
        padding: 7px 0;
        cursor: pointer;
        &:hover {
             background-color: #e1effa;
        }
    }
    .search-label {
        color: #999;
    }
    .acc-search-count {
        border-bottom: 1px solid #e6e6e6;
        padding-bottom: 4px;
        font-size: 12px;
        color: #999;
    }
    .acc-search-btn {
        margin-left: 24px;
    }
    .acc-search-order {
        display: flex;
        justify-content: space-between;
    }
    .acc-search-order-status {
        position: absolute;
        top: 4px;
        right: 0;
        font-size: 12px;
        text-align: center;
        width: 44px;
        height: 22px;
        line-height: 22px;
        color: #fff;
        &.book {
            background: #ffba75;
            &::before {
                border-right: solid #ffba75 11px;
            }
         }
        &.finish, &.cancel {
            background: #bfbfbf;
            &::before {
                border-right: solid #bfbfbf 11px;
            }
        }
        &.ing {
            background: #82beff;
            &::before {
                border-right: solid #82beff 11px;
            }
        }
        &::before {
             content: '';
             position: absolute;
             top: 0;
             left: -11px;
             border-top: solid transparent 11px;
             border-bottom: solid transparent 11px;
        }
    }
    .search-origin {
        max-width: 56px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>
<script>
    import Clickoutside from 'dd-vue-component/src/utils/clickoutside';
    import http from '../../common/http';
    import { ORDER_STATUS } from '../const';
    import bus from '../../common/eventBus';
    export default{
        data() {
            return {
                ORDER_STATUS,
                page: 1,
                searchResults: [],
                searchKeyword: '',
                limit: 4,
                resultsVisible: false,
                searchResultsNum: 0
            };
        },
        methods: {
            changePage(page) {
                if (page < 1 || page > Math.ceil(this.searchResultsNum / this.limit)) {
                    return false;
                }

                this.search(page);
            },
            search(page) {
                this.page = page;
                http.get('/order/searchOrder', {
                    keyword: this.searchKeyword,
                    pageNo: this.page,
                    limit: this.limit,
                    searchType: 0 // 所有订单
                }).then(
                    result => {
                        this.resultsVisible = true;
                        this.searchResults = result.data.list;
                        this.searchResultsNum = result.data.orderAmount;
                    }
                );
            },
            hideSearch() {
                this.page = 1;
                this.resultsVisible = false;
                this.searchResults = [];
                this.searchResultsNum = 0;
                this.searchKeyword = '';
            },
            showOrder(id) {
                this.resultsVisible = false;
                bus.$emit('onShowDetail', { type: -1, orderId: id });
            }
        },
        directives: {
            Clickoutside
        }
    };
</script>
