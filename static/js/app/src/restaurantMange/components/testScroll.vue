/**
 * @Author: lwh
 * @Date:   2017-08-12 17:34:59
 * @Last Modified by:   lwh
 * @Last Modified time: 2017-08-14 10:08:01
 */

 <template>
     <div class="modal fade" role="dialog" data-backdrop="static" id="test">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span>修改桌位</span>
                    <button type="button" class="close"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <div style="height:300px;">
                        <div class="wrap" ref="wrap">
                            <ul>
                                <li v-for="i in 40" ref="liList">{{i}}</li>
                            </ul>
                        </div>
                    </div>
                </div>  
                <div class="modal-foot">
                    <button class="dd-btn dd-btn-ghost" >取消</button>
                    <button class="dd-btn dd-btn-primary">确定</button>
                </div>
            </div>
        </div>
    </div>
 </template>

<script>
import IScroll from 'iscroll';
export default{
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            heightList: []
        };
    },
    created() {
        this.$nextTick(() => {
           // this.scroll = new IScroll(this.$refs.wrap, { probeType: 3, mouseWheel: true, scrollbars: false });
           this.calculateHeight();
        });
    },
    methods: {
        calculateHeight() {
            const liList = this.$refs.liList;
            console.log(liList[0].offsetHeight);
            let height = 0;
            this.heightList.push(height);
            liList.map(li => {
                height += li.clientHeight;
                this.heightList.push(height);
            });
        }
    },
    watch: {
        visible(newValue) {
            if (newValue) {
                $('#test').modal('show');
                const liList = this.$refs.liList;
                console.log(liList[0].offsetHeight);
            }
        }
    }
};
</script>

 <style lang="scss" scoped>
    /*.wrap{
        width: 200px;
        height: 300px;
        border: 1px solid #ccc;
        overflow: hidden;
        position: absolute;
        z-index: 1;
        ul{
            position: absolute;
            z-index: 1;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            width: 100%;
            -webkit-transform: translateZ(0);
            -moz-transform: translateZ(0);
            -ms-transform: translateZ(0);
            -o-transform: translateZ(0);
            transform: translateZ(0);
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-text-size-adjust: none;
            -moz-text-size-adjust: none;
            -ms-text-size-adjust: none;
            -o-text-size-adjust: none;
            text-size-adjust: none;
        }
    }*/
    .wrap{
        width: 200px;
        height: 300px;
        border: 1px solid #ccc;
        overflow: scroll;
    }
 </style>
