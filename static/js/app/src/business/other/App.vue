<template>
    <div class="app">
        <outer-container :title="disconuntAndChange">
            <inner-container :title="shortcutDiscount" :toggleView="shortcutView">
                <div slot="show">
                    <ul>
                        <li><span style="margin-right:123px;">夏日大酬宾</span><span>3 折</span></li>
                        <li><span style="margin-right:123px;">夏日大酬宾</span><span>3 折</span></li>
                    </ul>
                </div>
                <div slot="edit" style="padding-bottom: 20px;">
                    <ul>
                        <li style="display:flex;align-items:center;"><input class="dd-input" type="text" style="width:118px; margin-right:23px;" placeholder="折扣名称"><input style="width:56px; margin-right:8px;" class="dd-input" type="text" placeholder="优惠">折<span style="margin-left:20px;cursor: pointer;" class="delete-icon"></span></li>
                    </ul>
                    <div class="add-discount">
                        <span style="cursor: pointer;color: #178ce6;"><img style="margin-right: 4px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAIVBMVEUAAAAXjegYjOYXjugYjecZj+YZjukXjegajOkXjeYXjObcqVb2AAAACnRSTlMASuNVYF1FklCadOWS3AAAADZJREFUCNdjEFoFBooMigxgIMSwAMLgQmFwJEAZLAZoDNHI0kAwI9m82AxDDbJ2TJPhlsKdAQDzmRTUpGPOVQAAAABJRU5ErkJggg" alt="">新增折扣</span><span style="margin-left:65px;font-size:12px;color:#999999;">请输入0.1-9.9之间的数字</span>
                    </div>
                    <btn style="padding-left:20px;margin-top:16px;" @save="saveShortcutDiscount" @cancel="shortcutView = !shortcutView"></btn>
                </div>
            </inner-container>
            <inner-container :title="changeProcess" style="margin-top: 18px;" :toggleView="changeView">
                <div slot="show">
                    <ul>
                        <li><span>处理方式:</span><span style="margin-left:16px;">四舍五入</span></li>
                        <li><span style="display:inline-block;width:60px;text-align:right;">精确到:</span><span style="margin-left:16px;">元</span></li>
                    </ul>
                </div>
                <div slot="edit" style="padding-bottom: 20px;">
                    <ul>
                        <li>
                            <span>处理方式:</span><label style="margin-left:12px;"><input type="radio" value="0" v-model="processMethod"> 不处理</label><label style="margin-left:12px;"><input type="radio" value="1" v-model="processMethod"> 四舍五入</label><label style="margin-left:12px;"><input type="radio" value="2" v-model="processMethod"> 元后抹零</label>
                        </li>
                        <li><span style="display:inline-block;width:60px;text-align:right;">精确到:</span><label style="margin-left:12px;"><input type="radio" value="0" v-model="accurate"> 角</label><label style="margin-left:12px;"><input type="radio" value="1" v-model="accurate"> 元</label><label style="margin-left:12px;"><input type="radio" value="2" v-model="accurate"> 十元</label></li>
                    </ul>
                    <btn style="padding-left:20px;" @save="saveChangeProcess" @cancel="changeView = !changeView"></btn>
                </div>
            </inner-container>
        </outer-container>
        <outer-container :title="statisticParameter" style="margin: 20px 0;">
            <inner-container :title="specialHouse" :toggleView="specialView">
                <div slot="show">
                    <ul>
                        <li>自用房</li>
                        <li>免费房</li>
                    </ul>
                </div>
                <div slot="edit" style="padding-bottom: 20px;">
                    <ul>
                        <li>
                            <input type="checkbox" v-model="selfHouse"><span>自用房</span>
                        </li>
                        <li>
                            <input type="checkbox" v-model="freeHouse"><span>免费房</span>
                        </li>
                    </ul>
                    <btn style="padding-left:20px;" @cancel="specialView = !specialView"></btn>
                </div>
            </inner-container>
            <inner-container :title="intervalNight" style="margin-top: 18px;" :toggleView="intervalNightView">
                <div slot="show">
                    <ul>
                        <li><span>钟点房间夜量基数:</span><span></span></li>
                        <li style="display:flex;align-items:center;"><span style="display:inline-block;width:116px;text-align:right">间夜量计算时刻:</span><span></span><span style="font-size:12px;color:#999999;line-height:18px;width:168px;text-align:center;">每跨过一个计算时刻算一个房晚(正常入住、自用房、免费房)</span></li>
                    </ul>
                </div>
                <div slot="edit" style="padding-bottom: 20px;">
                    <ul>
                        <li>
                            <span>钟点房间夜量基数:</span><input type="text" class="dd-input" style="width:56px;margin:0 10px 0 23px;"><span>请输入0.1-1之间的数字</span>
                        </li>
                        <li style="display:flex;align-items:center;">
                            <span style="display:inline-block;width:116px;text-align:right">间夜量计算时刻:</span><input type="text" class="dd-input" style="width:56px;margin: 0 10px 0 23px;"><span style="font-size:12px;color:#999999;line-height:18px;width:168px;text-align:center;">每跨过一个计算时刻算一个房晚(正常入住、自用房、免费房)</span>
                        </li>
                    </ul>
                    <btn style="padding-left:20px;" @cancel="intervalNightView = !intervalNightView"></btn>
                </div>
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
                changeView: true,
                specialView: true,
                intervalNightView: true,
                processMethod: 0,
                accurate: 0,
                selfHouse: false,
                freeHouse: true
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
    .app{
        ul{
            padding: 8px 20px;
            li{
                height: 40px;
                line-height: 40px;
                .delete-icon{
                    width: 16px;
                    height: 16px;
                    display: inline-block;
                    background-image: url('../../../../../image/modal/room_modal_delete.png');
                }
            }
        }
        .add-discount{
            padding: 0 20px;
        }
    }
</style>
