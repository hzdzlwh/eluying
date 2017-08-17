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
                    <p v-for="(pointer, index) in frontPointers" class="point-items">
                        <span class="printer-label">
                            <label><input type="checkbox" v-model="frontPoint[index][pointer.printerId]">{{pointer.printerName}}</label>
                        </span>
                        <span class="printer-status">
                            状态：
                            <span v-if="pointer.status === 0">关闭</span>
                            <span v-else-if="pointer.status === 1">可用</span>
                            <span v-else-if="pointer.status === 2">离线</span>
                            <span v-else-if="pointer.status === 3">缺纸</span>
                        </span>
                        <span class="printer-log">
                            历史已打次数：
                            <span>{{pointer.printedNum}}</span>
                        </span>
                    </p>
                </div>
                <div class="back-pointer">
                    <p class="point-title">后厨打印机</p>
                    <p v-for="(pointer, index) in backPointers" class="point-items">
                        <span class="printer-label">
                            <label><input type="checkbox" v-model="backPoint[index][pointer.printerId]">{{pointer.printerName}}</label>
                        </span>
                        <span class="printer-status">
                            状态：
                            <span v-if="pointer.status === 0">关闭</span>
                            <span v-else-if="pointer.status === 1">可用</span>
                            <span v-else-if="pointer.status === 2">离线</span>
                            <span v-else-if="pointer.status === 3">缺纸</span>
                        </span>
                        <span class="printer-log">
                            历史已打次数：
                            <span>{{pointer.printedNum}}</span>
                        </span>
                    </p>
                </div>
            </div>
            <div class="point-popup-footer">
                <div class="pointer-saver" @click="saverPoint">确定</div>
                <div class="pointer-cancer" @click="closePoint">取消</div>
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
        background:#fafafa;
        box-shadow:0 2px 4px 0 rgba(0,0,0,0.15);
        border-radius:2px;
        width:424px;
        border-top: 2px solid #178ce6;
        padding: 22px 20px;
        .point-popup-header {
            font-size:16px;
            color:#178ce6;
            line-height:16px;
            .close-point {
                float: right;
                width: 16px;
                line-height:16px;
                text-align:center;
                cursor: pointer;
                &:hover {
                    background: red;
                    color: #fff;
                }
            }
        }
        .point-popup-container {
            padding: 10px 0;
            .point-title {
                font-size:14px;
                color:#666666;
                line-height:24px;
            }
            .point-items {
                padding-left: 30px;
                font-size:14px;
                color:#666666;
                height: 24px;
                .printer-label {
                    display: block;
                    float: left;
                    label {
                        cursor: pointer;
                        margin: 0;
                    }
                    input {
                        vertical-align: text-bottom;
                    }
                }
                .printer-status {
                    display: block;
                    float: left;
                    margin-left: 24px;
                }
                .printer-log {
                    display: block;
                    float: left;
                    margin-left: 24px;
                }
            }
        }
        .point-popup-footer {
            height: 24px;
            .pointer-saver, .pointer-cancer {
                border-radius:2px;
                width:50px;
                float:left;
                margin-left: 20px;
                text-align:center;
                cursor: pointer;
            }
            .pointer-saver {
                line-height:24px;
                background:#178ce6;
                color: #fff;
            }
            .pointer-cancer {
                border:1px solid #178ce6;
                background: #fafafa;
                border-radius:2px;
                line-height: 22px;
                width:48px;
                color: #178ce6;
            }
        }
    }
</style>

<script>
    import http from 'http';
    export default {
        props: {
            operationId: Number,
            caterOrderId: Number,
            restId: Number
        },
        data() {
            return {
                frontPointers: [],
                backPointers: [],
                frontPoint: [],
                backPoint: [],
                printerIds: []
            };
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
                    operationId: this.operationId
                };
                http.get('/printer/listPrinter4Cater', obj).then(res => {
                    if (res.code === 1) {
                        this.frontPointers = res.data.front || [];
                        this.frontPoint = [];
                        this.frontPointers.forEach(item => {
                            const print = {};
                            print[item.printerId] = item.status === 1;
                            this.frontPoint.push(print);
                        });
                        this.backPointers = res.data.back || [];
                        this.backPoint = [];
                        this.backPointers.forEach(item => {
                            const print = {};
                            print[item.printerId] = item.status === 1;
                            this.backPoint.push(print);
                        });
                        console.log(this.frontPointers, this.backPointers);
                        console.log(this.frontPoint, this.backPoint);
                    }
                });
            },
            closePoint() {
                this.$emit('closeAutomaticPoint');
            },
            saverPoint() {
                const obj = {
                    restId: this.restId,
                    caterOrderId: this.caterOrderId,
                    operationId: this.operationId
                };
                const printList = this.frontPoint.concat(this.backPoint);
                console.log(printList);
                this.printerIds = [];
                printList.forEach(item => {
                    console.log(item);
                    for (var key in item) {
                        if (item[key]) {
                            this.printerIds.push(key);
                        }
                    }
                });
                obj.printerIds = JSON.stringify(this.printerIds);
                http.get('/printer/print', obj).then(res => {
                    if (res.code === 1) {
                        this.$emit('closeAutomaticPoint');
                    }
                });
            }
        },
        watch: {
        }
    };
</script>
