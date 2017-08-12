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
                        <input type="text" class="dd-input" placeholder="房号/客户姓名/入住人/手机号/订单号" @keyup.enter="" ref="searchInput">
                        <img class="search-icon" @click="" src="//static.dingdandao.com/vipSearch.png">
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
                                    <td>{{}}</td>
                                    <td>{{}}</td>
                                    <td>{{}}</td>
                                    <td>{{}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <dd-pagination @currentchange="" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
                </div>
                <div class="modal-foot">
                </div>
            </div>
        </div>
    </div>
 </template>

<script>
import http from '../../common/http.js';
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
            ]
        };
    },
    created() {
        this.getOrderList();
    },
    methods: {
        getOrderList() {
            http.get('/order/searchOrder', {
                keyword: this.keyword,
                pageNo: this.pageNo,
                limit: this.limit,
                searchType: 1
            }).then(res => {
                if (res.code === 1) {
                    this.orderList = res.data.list;
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
                padding: 16px 24px;
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
                    table{
                        width: 100%;
                    }
                }
            }
        }
     }
 </style>
