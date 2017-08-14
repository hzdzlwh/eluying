<template>
    <div class="reset-book-popup">
        <ul class="sell-num-btn">
            <li class="sell-clear-btn" :class="{ active: sellClearDish }" @click="sellClear">
                已售完
            </li>
            <li class="reverse-num-btn" :click="{ active: reverseNumDish}" @click="reverseNum">
                沽清
            </li>
        </ul>
        <title>{{title}}</title>
        <div class="book-sell-clear">
            <p class="book-sub-title" v-if="sellClearDish">
                标记为已售完
            </p>
            <p class="book-dish-num" v-if="reverseNumDish">
                <span class="book-dish-title">
                    库存数量
                </span>
                <span class="book-set-num">
                    <div class="reduce-dish-btn" @click="reduceDishNum">-</div>
                    <input type="text" v-model="bookDishNum">
                    <div class="increase-dish-btn" @click="increaseDishNum">+</div>
                </span>
            </p>
        </div>
        <div class="book-reset-foot">
            <div class="book-btn-ensure" @click="resetBookDishNum">确定</div>
            <div class="book-btn-cancer" @click="cancerBookDishNum">取消</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .reset-book-popup {
        font-family:MicrosoftYaHei;
        background:#fafafa;
        box-shadow:0 2px 4px 0 rgba(0,0,0,0.15);
        border-radius:2px;
        width:185px;
        height:166px;
        .sell-num-btn {
            border-radius:4px;
            width:110px;
            height:20px;
            font-size: 12px;
            display: flex;
            justify-content: center;
            margin:20px auto 16px;
            .sell-clear-btn,.reverse-num-btn {
                box-size: border-box;
                border:1px solid #d9d9d9;
                width:56px;
                line-height:20px;
                text-align: center;
                color:#666666;
                cursor: pointer;
                &.active {
                    border: 1px solid rgba(0,0,0,0.05);
                    color: #178ce6;
                }
            }
            .sell-clear-btn {
                border-right: 0;
                border-radius:4px 0 0 4px;
            }
            .reverse-num-btn {
                border-left: 1px solid rgba(0,0,0,0.05);
                border-radius:0 4px 4px 0;
            }
        }
        title {
            font-size:16px;
            color:#666666;
            line-height:16px;
            text-align:center;
        }
        .book-sell-clear {
            height: 40px;
            .book-sub-title {
                text-align: center;
                vertical-align: middle;
                font-size:12px;
                color:#666666;
                line-height:12px;
            }
            .book-dish-num {

            }
        }
    }
</style>

<script>
    export default {
        data() {
            return {
            };
        },
        created() {
        },
        methods: {
        }
    };
</script>
