/**
 * @Author: lwh
 * @Date:   2017-08-07 19:20:30
 * @Last Modified by:   lwh
 * @Last Modified time: 2017-08-12 17:56:27
 */

 <template>
     <div class="modal fade" role="dialog" data-backdrop="static" id="relevanceOrder">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span>关联订单</span>
                    <button type="button" class="close" @click="hideModal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <div class="search">
                        <input type="text" class="dd-input" v-model="keyword" placeholder="房号/客户姓名/入住人/手机号/订单号" @keyup.enter="search" ref="searchInput">
                        <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th v-for="c in columns">{{c}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="o in orderList">
                                    <td>{{o.orderNum}}</td>
                                    <td>{{o.customerName}}</td>
                                    <td>{{o.customerPhone}}</td>
                                    <td>{{o.origin}}</td>
                                    <td :title="o.roomNums"><div class="autocut">{{o.roomNums}}</div></td>
                                    <td :title="o.itemDescription"><div class="autocut">{{o.itemDescription}}</div></td>
                                    <td>{{ORDER_STATUS[o.orderState].long}}</td>
                                    <td @click="connect(o)">确认关联</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="foot">
                        <div>
                            <span><small>共计</small> {{total}}笔记录</span>
                        </div>
                        <dd-pagination @currentchange="getOrderList" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
                    </div>
                </div>
            </div>
        </div>
    </div>
 </template>

<script>
import http from '../../common/http.js';
import { ORDER_STATUS } from '../../ordersManage/constant';
import { DdPagination } from 'dd-vue-component';
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            keyword: '',
            limit: 10,
            pageNo: 1,
            pages: 0,
            orderList: [],
            columns: [
                '订单号',
                '客户姓名',
                '手机号',
                '客户来源',
                '房号',
                '订单内容',
                '订单状态',
                '操作'
            ],
            ORDER_STATUS,
            total: undefined
        };
    },
    created() {
        this.getOrderList();
    },
    methods: {
        connect(orderDetail) {
            this.$emit('sendRelevanceOrder', orderDetail);
            this.hideModal();
        },
        search() {
            this.pageNo = 1;
            this.getOrderList();
        },
        getOrderList(page) {
            http.get('/order/searchOrder', {
                keyword: this.keyword,
                pageNo: page || this.pageNo,
                limit: this.limit,
                searchType: 1
            }).then(res => {
                if (res.code === 1) {
                    this.orderList = res.data.list;
                    this.total = res.data.orderAmount;
                    this.pages = Math.ceil(res.data.orderAmount / 10);
                }
            });
        },
        hideModal() {
            this.$emit('hideModal');
        }
    },
    watch: {
        visible(newValue) {
            if (newValue) {
                $('#relevanceOrder').modal('show');
            } else {
                $('#relevanceOrder').modal('hide');
            }
        }
    },
    components: {
        DdPagination
    }
};
 </script>

 <style lang="scss" scoped>
     .modal-dialog{
        width: 942px;
        .modal-content{
            padding: 0;
            border-top: 2px solid #178ce6;
            .modal-header{
                span{
                    font-size: 18px;
                    color: #666666;
                }
            }
            .modal-body{
                padding: 16px 24px 0;
                .search{
                    position: relative;
                    width: 270px;
                    img{
                        position: absolute;
                        top: 7px;
                        left: 253px;
                    }
                }
                .table-container{
                    height: 454px;
                    margin-bottom: 20px;
                    table{
                        width: 100%;
                        box-shadow: 0 0 5px 0 rgba(0,0,0,0.15);
                        thead{
                            tr{
                                height: 54px;
                                background: #f0f0f0;
                                th:nth-child(1){
                                    width: 160px;
                                }
                                th:nth-child(6){
                                    width: 90px;
                                }
                            }
                        }
                        tbody{
                            tr{
                                height: 41px;
                                &:nth-child(2n){
                                    background: #f7f7f7;
                                }
                                td{
                                    .autocut{
                                        width: 90px;
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
                                td:nth-child(8){
                                    color: #178ce6;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                }
                .foot{
                    display: flex;
                    justify-content: space-between;
                }
            }
        }
     }
 </style>
