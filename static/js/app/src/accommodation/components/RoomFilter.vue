<template>
    <div style="position: relative" v-clickoutside="hide">
        <div class="calendar-room-filter-label" @click="toggleSelect">
            <span style="cursor: pointer">筛选房型</span>
            <img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png">
        </div>
        <div v-if="visible" class="calendar-room-select">
            <ul>
                <li @click="toggleAll(allSelected)">
                    <span
                        class="calendar-room-select-icon"
                        :class="{'calendar-room-selected': allSelected}"
                    ></span>
                    <span style="cursor: pointer">全选</span>
                </li>
                <li v-for="c in categoriesTemp" @click="select(c)">
                    <span
                        class="calendar-room-select-icon"
                        :class="{'calendar-room-selected': c.selected}"
                    ></span>
                    <span style="cursor: pointer">{{c.cName}}</span>
                </li>
            </ul>
            <div class="calendar-room-select-action">
                <button @click="confirm" class="dd-btn dd-btn-primary dd-btn-sm">确定</button>
            </div>
        </div>
    </div>
</template>
<style lang="scss" rel="stylesheet/scss">
    @import "~dd-common-css/src/variables";
    .calendar-room-filter-label {
        position: relative;
        height: 32px;
        width: 140px;
        line-height: 32px;
        text-align: center;
        background: #ebebeb;
        cursor: pointer;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
    }
    .calendar-room-select {
        cursor: default;
        position: absolute;
        top: 32px;
        left: 0;
        z-index: 1;
        width: 140px;
        background: $gary-background;
        box-shadow: 0 0 5px 0 rgba(0,0,0,0.15);
        border-radius: 2px;
        ul {
            max-height: 192px;
            overflow: auto;
        }
        li {
            height: 24px;
            line-height: 24px;
            margin: 0 1px;
            padding: 0 7px;
            text-align: left;
            cursor: pointer;
            &:hover {
                background: $blue-lighter;
            }
        }
    }
    .calendar-room-select-icon {
        width: 14px;
        height: 14px;
        border-radius: 100%;
        border: 1px solid $gary-light;
        display: inline-block;
        position: relative;
        margin-right: 4px;
        cursor: pointer;
    }
    .calendar-room-selected {
        background: $blue;
        &::after {
             content: "";
             position: absolute;
             top: 1px;
             left: 4px;
             width: 4px;
             height: 8px;
             border: 1px solid #fff;
             border-top-width: 0;
             border-left-width: 0;
             transform: rotate(45deg);
        }
    }
    .calendar-room-select-action {
        text-align: right;
        margin: 0 8px;
        border-top: 1px solid $gary-light;
        padding: 4px 0;
    }
</style>
<script>
    import Clickoutside from 'dd-vue-component/src/utils/clickoutside';
    export default{
        props: {
            categories: Array
        },
        data() {
            return {
                visible: false,
                categoriesTemp: []
            };
        },
        methods: {
            toggleSelect() {
                if (this.visible) {
                    this.visible = false;
                } else {
                    this.categoriesTemp = this.categories.map(c => ({ ...c }));
                    this.visible = true;
                }
            },
            confirm() {
                this.visible = false;
                this.$emit('change', this.categoriesTemp);
            },
            select(c) {
                c.selected = !c.selected;
            },
            toggleAll() {
                this.allSelected = !this.allSelected;
            },
            hide() {
                this.visible = false;
            }
        },
        computed: {
            allSelected: {
                get: function() {
                    for (let i = 0; i < this.categoriesTemp.length; i ++) {
                        if (this.categoriesTemp[i].selected === false) {
                            return false;
                        }
                    }
                    return true;
                },
                set: function(val) {
                    for (let i = 0; i < this.categoriesTemp.length; i ++) {
                        this.categoriesTemp[i].selected = val;
                    }
                }
            }
        },
        directives: {
            Clickoutside
        }
    };
</script>
