<template>
    <div class="reset-book-shadow">
        <div class="reset-book-popup">
            <ul class="sell-num-btn">
                <li class="sell-clear-btn" :class="{ active: sellClearDish }" @click="reverseSellClearDish(1)">
                    已售完
                </li>
                <li class="reverse-num-btn" :class="{ active: !sellClearDish}" @click="reverseSellClearDish(2)">
                    沽清
                </li>
            </ul>
            <div class="book-reset-dish-name">{{info.name}}</div>
            <div class="book-sell-clear">
                <p class="book-sub-title" v-if="sellClearDish">
                    标记为已售完
                </p>
                <p class="book-dish-num" v-if="!sellClearDish">
                    <span class="book-dish-title">
                        库存数量
                    </span>
                    <span class="book-set-num">
                        <div class="reduce-dish-btn" @click="reduceDishNum">-</div>
                        <input type="text" v-model="sellClearNum">
                        <div class="increase-dish-btn" @click="increaseDishNum">+</div>
                    </span>
                </p>
            </div>
            <div class="book-reset-foot">
                <div class="book-btn-ensure" @click="resetBookDishNum">确定</div>
                <div class="book-btn-cancer" @click="cancerBookDishNum">取消</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .reset-book-shadow {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .reset-book-popup {
        background:#fafafa;
        box-shadow:0 2px 4px 0 rgba(0,0,0,0.15);
        border-radius:2px;
        width:185px;
        height:166px;
        border-top:2px solid #178ce6;
        .sell-num-btn {
            border-radius:4px;
            width:110px;
            height:20px;
            font-size: 12px;
            display: flex;
            justify-content: center;
            margin:20px auto 16px;
            .sell-clear-btn,.reverse-num-btn {
                box-sizing: border-box;
                border:1px solid #d9d9d9;
                width:56px;
                line-height:20px;
                text-align: center;
                color:#666666;
                cursor: pointer;
                &.active {
                    border: 1px solid #178ce6;
                    color: #178ce6;
                }
            }
            .sell-clear-btn {
                border-right: 0px;
                border-radius:4px 0 0 4px;
                &.active {
                    border-right: 0px;
                    color: #178ce6;
                }
            }
            .reverse-num-btn {
                border-left: 1px solid #178ce6;
                border-radius:0 4px 4px 0;
            }
        }
        .book-reset-dish-name {
            font-size:16px;
            color:#666666;
            line-height:16px;
            text-align:center;
        }
        .book-sell-clear {
            height: 40px;
            display: flex;
            align-items: center;
            .book-sub-title {
                width: 100%;
                text-align: center;
                font-size:12px;
                color:#666666;
                line-height:12px;
            }
            .book-dish-num {
                width: 100%;
                padding: 0 30px;
                display: flex;
                justify-content: space-between;
                .book-dish-title {
                    font-size: 12px;
                    color: #666666;
                    line-height: 24px;
                }
                .book-set-num {
                    width: 69px;
                    height: 24px;
                    border: 1px solid #cccccc;
                    border-radius: 2px;
                    .reduce-dish-btn, .increase-dish-btn {
                        width: 15px;
                        height: 100%;
                        float: left;
                        text-align:center;
                        line-height: 24px;
                        color: #cccccc;
                        cursor: pointer;
                    }
                    input {
                        width: 37px;
                        height: 22px;
                        float: left;
                        border:0;
                        border-left: 1px solid #cccccc;
                        border-right: 1px solid #cccccc;
                        text-align: center;
                    }
                }
            }
        }
        .book-reset-foot {
            width: 100%;
            height: 40px;
            padding:0 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .book-btn-ensure {
                width: 48px;
                line-height: 22px;
                text-align:center;
                border-radius: 2px;
                background: #178ce6;
                color: #fff;
                cursor: pointer;
            }
            .book-btn-cancer {
                background:#ffffff;
                border:1px solid #cccccc;
                border-radius:2px;
                width:48px;
                line-height:22px;
                text-align:center;
                font-size: 14px;
                color: #ccc;
                cursor: pointer;
            }
        }
    }
</style>

<script>
    import http from 'http';
    export default {
        props: {
            info: {}
        },
        data() {
            return {
                soldOut: Number,
                sellClearNum: Number,
                sellClearDish: true
            };
        },
        created() {
            if (this.info.soldOut === 1) {
                this.sellClearDish = true;
                this.soldOut = 1;
            } else if (this.info.soldOut === 0) {
                this.sellClearDish = false;
                this.soldOut = 0;
                this.sellClearNum = this.info.sellClearNum ? this.info.sellClearNum : 1;
            }
        },
        methods: {
            reverseSellClearDish(type) {
                if (type === 1) {
                    this.sellClearDish = true;
                    this.soldOut = 1;
                } else if (type === 2) {
                    this.sellClearDish = false;
                    this.soldOut = 0;
                    this.sellClearNum = this.info.sellClearNum ? this.info.sellClearNum : 1;
                }
            },
            resetBookDishNum() {
                let obj = {};
                if (!this.sellClearDish) {
                    obj = {
                        oprType: 1,
                        sellClearNum: this.sellClearNum,
                        dishId: JSON.stringify([this.info.dishId])
                    };
                } else if (this.sellClearDish) {
                    obj = {
                        oprType: 2,
                        dishId: JSON.stringify([this.info.dishId])
                    };
                }
                http.get('/dish/updateSellClearNum', obj).then(res => {
                    if (res.code === 1) {
                        this.$emit('resetBookDishNum', this.info.dishId, this.sellClearNum, this.soldOut);
                    }
                });
            },
            cancerBookDishNum() {
                this.$emit('cancerBookDishNum');
            },
            reduceDishNum() {
                if (this.sellClearNum > 1) {
                    this.sellClearNum -= 1;
                }
            },
            increaseDishNum() {
                this.sellClearNum += 1;
            }
        }
    };
</script>
