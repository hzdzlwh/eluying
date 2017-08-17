<template>
    <div class="book-delect-tips">
        <div class="book-tips-header">
            提示
        </div>
        <div class="book-tips-center">
            确定删除该沽清菜品吗?
        </div>
        <div class="book-tips-footer">
            <div class="book-btn-ensure" @click="deleteDish">
                确定
            </div>
            <div class="book-btn-cancer" @click="bookCancer">
                取消
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .book-delect-tips {
        background:#fafafa;
        box-shadow:0 2px 4px 0 rgba(0,0,0,0.15);
        border-radius:2px;
        width:185px;
        height:166px;
        border-top: 2px solid #178ce6;
        .book-tips-header {
            width: 100%;
            line-height: 34px;
            font-size: 16px;
            text-align:center;
            margin-top: 10px;
        }
        .book-tips-center {
            width: 100%;
            text-align:center;
            line-height: 70px;
            font-size: 14px;
        }
        .book-tips-footer {
            width: 100%;
            display: flex;
            justify-content:space-between;
            align-items: center;
            padding: 0 32px;
            .book-btn-ensure, .book-btn-cancer {
                width: 48px;
                line-height: 24px;
                text-align:center;
                cursor:pointer;
                border-radius: 2px;
            }
            .book-btn-ensure {
                background: #178ce6;
                color: #fff;
            }
            .book-btn-cancer {
                border: 1px solid #ccc;
            }
        }
    }
</style>

<script>
    import http from 'http';
    export default {
        props: {
            info: {},
            subscript: 0
        },
        data() {
            return {
            };
        },
        created() {
        },
        methods: {
            bookCancer() {
                this.$emit('bookDeleteDishCancer');
            },
            deleteDish() {
                const obj = {
                    dishId: JSON.stringify([this.info.dishId]),
                    oprType: 0
                };
                http.get('/dish/updateSellClearNum', obj).then(res => {
                    if (res.code === 1) {
                        this.$emit('deleteBookDish', this.subscript);
                    }
                });
            }
        },
        watch: {

        },
        components: {

        }
    };
</script>
