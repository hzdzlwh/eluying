<template>
    <div>
        <outer-container style="width:600px; float:left;" :title='consumeItem' :add="addItem" @openItemModal="openItemModal">
        </outer-container>
        <outer-container style="width:200px; position:fixed; margin-left:620px;" :title='classifyManage' :add="addClassify" @openClassifyModal="openClassifyModal">
            <div>
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
                            <td><span>修改</span>/<span>删除</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </outer-container>
        <item-modal :item="item"></item-modal>
        <classify-modal :classify-props="classify" @onSuccess="getTypesList"></classify-modal>
    </div>
</template>

<script>
    import outerContainer from './components/outerContainer';
    import itemModal from './components/itemModal';
    import classifyModal from './components/classifyModal';
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
                classifyLists: []
            }
        },
        created() {
            this.getTypesList();
        },
        methods: {
           getTypesList() {
                http.get('/goods/getOtherGoodsTypeList', {}).then(res => {
                    if (res.code === 1) {
                        this.classifyLists = res.data.list;
                    }
                });
           },
           openItemModal() {
                $('#itemModal').modal('show');
           },
           openClassifyModal(name) {
                this.classify = name ? { name } : { name: '' };
                $('#classifyModal').modal('show');
           }
        },
        components: {
            outerContainer,
            itemModal,
            classifyModal
        }
    }
</script>

<style>
    
</style>