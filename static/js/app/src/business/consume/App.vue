<template>
    <div>
        <outer-container style="width:654px; float:left;" :title='consumeItem' :add="addItem" @openItemModal="openItemModal">
            <div class="item-wrap">
                <div v-for="item in itemLists">
                    <h4>{{item.name}}</h4>
                    <div class="table-wrap">
                        <table style="width: 100%;">
                            <thead>
                                <tr>
                                    <th>名称</th>
                                    <th>分类</th>
                                    <th>单位</th>
                                    <th>默认价格</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="list in item.childList">
                                    <td>{{list.name}}</td>
                                    <td>{{list.goodsTypeName}}</td>
                                    <td>{{list.unit}}</td>
                                    <td>{{list.price}}</td>
                                    <td><switchbtn @click.native="sendState(list)" v-model="list.state"></switchbtn></td>
                                    <td><span @click="openItemModal(list)">修改</span>/<span @click="deleteItem(list.goodsId)">删除</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </outer-container>
        <outer-container style="width:213px; position:fixed; margin-left:674px;" :title='classifyManage' :add="addClassify" @openClassifyModal="openClassifyModal">
            <div class="classify-tableWrap">
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="width: 50%">分类</th>
                            <th style="width: 50%">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="classify in classifyLists">
                            <td>{{classify.name}}</td>
                            <td><span @click="openClassifyModal(classify)">修改</span>/<span @click="deleteClassify(classify.goodsTypeId)">删除</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </outer-container>
        <item-modal :itemProps="item" @onSuccess="getItemList"></item-modal>
        <classify-modal :classify-props="classify" @onSuccess="refreshList"></classify-modal>
    </div>
</template>

<script>
    import outerContainer from './components/outerContainer';
    import itemModal from './components/itemModal';
    import classifyModal from './components/classifyModal';
    import modal from '../../common/modal';
    import switchbtn from '../../common/components/switch.vue';;
    import http from '../../common/http';
    

    export default {
        data() {
            return {
                consumeItem: '消费项目',
                addItem: '新增项目',
                classifyManage: '分类管理',
                addClassify: '新增分类',
                item: {},
                classify: {},
                classifyLists: [],
                itemLists: [],
                itemNames: []
            }
        },
        created() {
            this.getTypesList();
            this.getItemList();
        },
        methods: {
           getTypesList() {
                http.get('/goods/getOtherGoodsTypeList', {}).then(res => {
                    if (res.code === 1) {
                        this.classifyLists = res.data.list;
                    }
                });
           },
           getItemList() {
                http.get('/goods/getOtherGoodsList', {}).then(res => {
                    if (res.code === 1) {
                        this.itemLists = res.data.list;
                        this.itemNames = res.data.list.map(item => {
                            return { name: item.name, goodsTypeId: item.goodsTypeId };
                        })
                    }
                });
           },
           sendState(list) {
                http.get('goods/shelveOtherGoods', {goodsId: list.goodsId, state: list.state}).then(res => {
                });
           },
           refreshList() {
                this.getTypesList();
                this.getItemList();
           },
           deleteItem(id) {
                modal.confirm({message: '确定删除该项目吗？'}, () => {
                    http.get('/goods/deleteOtherGoods', {goodsId: id}).then(res => {
                        if (res.code === 1) {
                            this.getItemList();
                        }
                    });
                });
           },
           deleteClassify(id) {
                modal.confirm({message: '删除分类后，该分类下的所有项目将被一起删除'}, () => {
                    http.get('/goods/deleteOtherGoodsType', {goodsTypeId: id}).then(res => {
                        if (res.code === 1) {
                            this.getTypesList();
                            this.getItemList();
                        }
                    });
                });
           },
           openItemModal(item) {
                this.item = item ? { ...item, itemName: this.itemNames } : { itemName: this.itemNames, name: '', price: '', unit: '', newAdd: true };
                $('#itemModal').modal('show');
           },
           openClassifyModal(classify) {
                this.classify = classify || { name: '' };
                $('#classifyModal').modal('show');
           }
        },
        components: {
            outerContainer,
            itemModal,
            classifyModal,
            switchbtn
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    thead{
        tr {
            th{
                font-weight: bold;
            }
            th:last-child {
                text-align: right;
            }
        }
    }
    tbody {
        tr {
            td:last-child{
                color: #178CE6;
                cursor: pointer;
                text-align: right;

            }
        }
    }
    .item-wrap{
        padding: 18px 20px 0 20px;
        & > div {
            box-shadow: 0 0 5px 0 rgba(0,0,0,0.15);
            border-radius: 2px;
            border: 1px solid #e6e6e6;
            margin-bottom: 20px;
            h4{
                height: 37px;
                line-height: 37px;
                font-size: 16px;
                padding-left: 20px;
                border-bottom: 1px solid #e6e6e6;
                background: #f0f0f0;
            }
            .table-wrap{
                padding: 10px 20px;
                .dd-switch{
                    cursor: pointer;
                }
                label{
                    margin-bottom: 0px;
                }
            }
        }
    }
    .classify-tableWrap{
        padding: 20px;
        tbody{
            tr{
                height: 28px;
            }
        }
    }
</style>