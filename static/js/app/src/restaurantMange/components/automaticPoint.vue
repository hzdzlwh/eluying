<template>
    <div class="restaurant-point-shade">
        <div class="restaurant-point-popup">
            <div class="point-popup-header">
                请选择打印机
                <div class="close-point" @click="closePoint">x</div>
            </div>
            <div class="point-popup-container">
                <div class="front-pointer">
                    <p class="point-title">前台打印机</p>
                    <p v-for="pointer in frontPointers" class="point-items">
                        <span>
                            <label><input type="checkbox">{{pointer.pointerName}}</label>
                        </span>
                        <span>
                            状态：
                            <i v-if="pointer.status === 0">关闭</i>
                            <i v-else-if="pointer.status === 1">可用</i>
                            <i v-else-if="pointer.status === 2">离线</i>
                            <i v-else-if="pointer.status === 3">缺纸</i>
                        </span>
                        <span>
                            历史已打次数
                            <i>{{pointer.pointedNum}}</i>
                        </span>
                    </p>
                </div>
                <div class="back-pointer">
                    <p class="point-title">后厨打印机</p>
                    <p v-for="pointer in backPointers">
                        <span>
                            <label><input type="checkbox">{{pointer.pointerName}}</label>
                        </span>
                        <span>
                            状态：
                            <i v-if="pointer.status === 0">关闭</i>
                            <i v-else-if="pointer.status === 1">可用</i>
                            <i v-else-if="pointer.status === 2">离线</i>
                            <i v-else-if="pointer.status === 3">缺纸</i>
                        </span>
                        <span>
                            历史已打次数
                            <i>{{pointer.pointedNum}}</i>
                        </span>
                    </p>
                </div>
            </div>
            <div class="point-popup-footer">
                <button class="pointer-saver" @click="saverPoint">确定</button>
                <button class="pointer-cancer" @click="closePoint">取消</button>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    .restaurant-point-shade {
        position: fixed;
        width:100%;
        height:100%;
        top:0;
        left:0;
        background:rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1200;
    }
</style>
<style lang="scss" scoped>
    .restaurant-point-popup {
        width:400px;
        background:#fff;
        padding: 10px 0;
        .point-popup-header {
            border-bottom: 1px solid #ccc;
            line-height: 34px;
            font-size: 16px;
            padding: 0 10px;
            .close-point {
                float: right;
                width: 34px;
                line-height:34px;
                text-align:center;
                cursor: pointer;
                &:hover {
                    background: red;
                    color: #fff;
                }
            }
        }
        .point-popup-container {
            border-bottom: 1px solid #ccc;
            padding:5px 20px;
            .point-title {
                font-size: 16px;
                font-weight: bold;
                color: #111;
            }
            .point-items {
                width: 100%;
                line-height: 24px;
            }
        }
        .point-popup-footer {
            height: 34px;
            button {
                float:right;
                margin-left: 20px;
                width:100px;
                line-height:40px;
                text-align:center;
                border-radius: 5px;
            }
            .pointer-saver {
                background: blue;
                color: #fff;
            }
            .pointer-cancer {
                background: #fff;
                color: #333;
            }
        }
    }
</style>

<script>
    import http from 'http';
    import { mapState } from 'vuex';
    export default {
        props: {
            operationId: Number,
            caterOrderId: Number
        },
        data() {
            return {
                frontPointers: [],
                backPointers: [],
                printerIds: [1]
            };
        },
        computed: {
            ...mapState(['restId'])
        },
        created() {
            if (this.restId !== 0) {
                this.getPointer();
            }
        },
        methods: {
            getPointer() {
                const obj = {
                    caterOrderId: this.caterOrderId,
                    restId: this.restId,
                    operationId: this.operationId === undefined ? -1 : this.operationId
                };
                http.get('/printer/listPrinter4Cater', obj).then(res => {
                    if (res.code === 1) {
                        this.frontPointers = res.data.front;
                        this.backPointers = res.data.back;
                    }
                });
            },
            closePoint() {
                this.$emit('closeAutomaticPoint');
            },
            saverPoint() {
                this.$emit('saverPoint', this.printerIds);
            }
        },
        watch: {
        }
    };
</script>
