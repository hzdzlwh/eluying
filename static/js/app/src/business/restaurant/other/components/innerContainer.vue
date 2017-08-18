<template>
    <div class="inner-container">
        <div class="inner-title">
            <h4>{{title}}</h4><span style="font-size:12px;color:#999999;line-height:37px;" v-if="title === '特殊房统计'">是否计入住宿营收统计表(间夜量、平均房价、出租率)</span>
            <a @click="toggle" v-if="switchView && title !== '微官网'" style="cursor: pointer;">编辑</a>
        </div>
        <div class="inner-content">
            <slot name="show" v-if="switchView"></slot>
            <slot name="edit" v-else></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['title', 'toggleView'],
        data() {
            return {
                switchView: true
            };
        },
        methods: {
            toggle() {
                this.switchView = !this.switchView;
                if (this.title === '零头处理' && !this.switchView) {
                    this.$emit('getChangeProcess');
                }
            }
        },
        watch: {
            toggleView(newValue) {
                this.toggle();
            }
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
    .inner-container{
        box-shadow: 0 0 5px 0 rgba(0,0,0,0.15);
        border-radius: 2px;
        .inner-title{
            display: flex;
            justify-content: space-between;
            height: 37px;
            padding: 0 20px;
            background: #f0f0f0;
            h4{
                height: 37px;
                line-height: 37px;
            }
            a{
                height: 37px;
                line-height: 37px;
            }
        }
    }
</style>
