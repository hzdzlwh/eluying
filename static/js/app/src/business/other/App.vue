<template>
    <div class="app">
        <outer-container :title="disconuntAndChange">
            <inner-container :title="shortcutDiscount"></inner-container>
            <inner-container :title="changeProcess" style="margin-top: 18px;"></inner-container>
        </outer-container>
        <outer-container :title="statisticParameter" style="margin-top: 20px;">
            <inner-container></inner-container>
            <inner-container></inner-container>
        </outer-container>
    </div>
</template>

<script>
    import outerContainer from './components/outerContainer';
    import innerContainer from './components/innerContainer';

    export default {
        data() {
            return {
                disconuntAndChange: '折扣及零头处理',
                statisticParameter: '统计参数',
                shortcutDiscount: '快捷折扣',
                changeProcess: '零头处理'
            }
        },
        components: {
            outerContainer,
            innerContainer
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    
</style>
