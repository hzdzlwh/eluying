<template>
    <div>
        <outer-container style="width:600px; float:left;" :title='consumeItem' :add="addItem">
        </outer-container>
        <outer-container style="width:200px; position:fixed; margin-left:620px;" :title='classifyManage' :add="addClassify"></outer-container>
    </div>
</template>

<script>
    import outerContainer from './components/outerContainer';

    export default {
        data() {
            return {
                consumeItem: '消费项目',
                addItem: '新增项目',
                classifyManage: '分类管理',
                addClassify: '新增分类'
            }
        },
        components: {
            outerContainer
        }
    }
</script>

<style>
    
</style>