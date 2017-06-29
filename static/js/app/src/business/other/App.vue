<template>
    <div class="app">
        <outer-container :title="disconuntAndChange">
            <inner-container :title="shortcutDiscount" :toggleView="shortcutView">
                <div slot="show">
                    <ul>
                        <li><span>夏日大酬宾</span><span>3折</span></li>
                    </ul>
                </div>
                <div slot="edit">
                    <ul>
                        <li><input type="text"><input type="text">折<span></span></li>
                    </ul>
                    <btn @save="saveShortcutDiscount" @cancel="shortcutView = !shortcutView"></btn>
                </div>
            </inner-container>
            <inner-container :title="changeProcess" style="margin-top: 18px;" :toggleView="changeView">
                <div slot="show">
                    <ul>
                        <li><span>处理方式:</span><span>四舍五入</span></li>
                    </ul>
                </div>
                <div slot="edit">
                    <ul>
                        <li>
                            <span>处理方式:</span><label><input type="radio" name="">不处理</label>
                        </li>
                    </ul>
                    <btn @save="saveChangeProcess" @cancel="changeView = !changeView"></btn>
                </div>
            </inner-container>
        </outer-container>
        <outer-container :title="statisticParameter" style="margin-top: 20px;">
            <inner-container :title="specialHouse">
                
            </inner-container>
            <inner-container :title="intervalNight" style="margin-top: 18px;">
                
            </inner-container>
        </outer-container>
    </div>
</template>

<script>
    import outerContainer from './components/outerContainer';
    import innerContainer from './components/innerContainer';
    import btn from './components/button';

    export default {
        data() {
            return {
                disconuntAndChange: '折扣及零头处理',
                statisticParameter: '统计参数',
                shortcutDiscount: '快捷折扣',
                changeProcess: '零头处理',
                specialHouse: '特殊房统计',
                intervalNight: '间夜量计算',
                shortcutView: true,
                changeView: true
            }
        },
        components: {
            outerContainer,
            innerContainer,
            btn
        },
        methods: {
            saveShortcutDiscount() {
                console.log('saveShortcutDiscount');
            },
            saveChangeProcess() {
                console.log('saveChangeProcess');
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    
</style>
