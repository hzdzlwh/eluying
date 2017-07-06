<template>
    <div class="shopcart" v-if="selectedRoomsCount > 0">
        <p class="shopcart-count">已选择{{selectedRoomsCount}}个房间</p>
        <div class="shopcart-rooms">
            <div class="shopcart-room" v-for="room in selectedRooms">{{room}}</div>
        </div>
        <div class="shopcart-action">
        <!--     <button class="dd-btn shopcart-addition" v-if="finishShow" @click="check('finish')">补录</button> -->
            <button class="dd-btn shopcart-book" v-if="bookShow" @click="check('book')">预订</button>
            <button class="dd-btn shopcart-live" v-if="ingShow" @click="check('ing')">直接入住</button>
        </div>
    </div>
</template>
<style lang="scss" rel="stylesheet/scss">
    @import "~dd-common-css/src/variables";
    .shopcart{
        min-width: 1200px;
        width: 100%;
        position: fixed;
        padding: 10px 60px;
        bottom: 0;
        height: 90px;
        background: $gary-background;
    }
    .shopcart-rooms {
        width: 77%;
        height: 48px;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;
    }
    .shopcart-room {
        margin-right: 16px;
    }
    .shopcart-count {
        font-size: $font-size-sm;
        color: $gary-dark;
        margin-bottom: 8px;
    }
    .shopcart-action {
        position: absolute;
        bottom: 16px;
        right: 60px;
        .dd-btn {
            width: 120px;
            height: 36px;
            font-size: 16px;
            color: #fff;
            margin-left: 20px;
        }
    }
    .shopcart-addition {
        background: #f24949;
    }
    .shopcart-book {
        background: #ff9326;
    }
    .shopcart-live {
        background: #178ce6;
    }
</style>
<script>
    import util from '../../common/util';
    import modal from '../../common/modal';
    import bus from '../../common/eventBus';
    export default{
        props: {
            selectedEntries: Array
        },
        computed: {
            /**
             * {房间id: 房型-房间名}
             * @returns {{}}
             */
            selectedRooms() {
                const today = new Date();
                // const finstDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23);
                // const yesDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                let p = false;
                let t = false;
                let f = false;
                const temp = {};
                const roomDate = this.getRoomsWithDate();
                roomDate.map(e => {
                    // 直接抄的浇浇代码
                    const date = new Date(e.startDate);
                    if (
                        util.isSameDay(date, today)) {
                        t = true;
                    } else if (date > today) {
                        f = true;
                    } else if (date < today) {
                        p = true;
                    }

                    // temp[e.id] = `${e.cName}-${e.rName}`;
                });
                this.selectedEntries.map(e => temp[e.id] = `${e.cName}-${e.rName}`);
                // this.finishShow = p && !t && !f || p && t && !f || p && t && f || p && !t && f;
                // this.ingShow = (p && t && !f || p && t && f || !p && t && !f || !p && t && f) && !p;
                // this.bookShow = (p && !t && f || !p && t && !f || !p && t && f || !p && !t && f) && !p;
                this.bookShow = (!f && !p) || !p;
                this.ingShow = p || (!f && !p);
                this.t = t;
                this.p = p;
                this.f = f;
                return temp;
            },
            selectedRoomsCount() {
                return Object.keys(this.selectedRooms).length;
            }
        },
        data() {
            return {
                p: false,
                t: false,
                f: false,
                finishShow: false,
                ingShow: false,
                bookShow: false
            };
        },
        watch: {
            selectedRoomsCount(val) {
                $('.acc-container').css('bottom', val > 0 ? '90px' : '0');
            }
        },
        methods: {
            check(type) {
                // 根据操作行为，弹出确认框，清除不合适的日期
                const today = new Date();
                // const dialogConfig = {
                //     showTitle: false,
                //     okText: '清除'
                // };
                // const callback = () => {
                //     this.clear(type);
                //     bus.$emit('changeCheckState', type, this.getRoomsWithDate());
                // };
                let flag = true;
                const roomDate = this.getRoomsWithDate();
                if (roomDate.length > 1) {
                    if (type === 'ing') {
                        roomDate.map(e => {
                            if (new Date(e.startDate) > today) {
                                modal.alert('未来的房间不可直接入住');
                                flag = false;
                            }
                        });
                    }
                }
                if (flag) {
                    bus.$emit('changeCheckState', type, this.getRoomsWithDate());
                } else {
                    return false;
                }
                // if (type === 'finish') {
                //     if (this.t || this.f) {
                //         dialogConfig.message = '选择补录，系统将自动清除今天及以后的房态格子。';
                //         modal.confirm(dialogConfig, callback);
                //         return false;
                //     }
                // } else if (type === 'ing') {
                //     if (this.p) {
                //         dialogConfig.message = '选择直接入住，系统将自动清除今天以前的房态格子。';
                //         modal.confirm(dialogConfig, callback);
                //         return false;
                //     }
                // } else if (type === 'book') {
                //     if (this.p) {
                //         dialogConfig.message = '选择预定，系统将自动清除今天以前的房态格子。';
                //         modal.confirm(dialogConfig, callback);
                //         return false;
                //     }
                // }
            },
            clear(type) {
                const today = new Date();
                this.selectedEntries.map(e => {
                    const date = new Date(e.date);
                    // 补录清除今天和将来
                    if (type === 'finish') {
                        if (util.isSameDay(date, today) || date > today) {
                            e.selected = false;
                        }
                    }

                    // 预定清除过去
                    if (type === 'book' || type === 'ing') {
                        if (!util.isSameDay(date, today) && date < today) {
                            e.selected = false;
                        }
                    }
                });
            },
            getRoomsWithDate() {
                const temp = [];
                this.selectedEntries.map(e => {
                    if (!e.selected) {
                        return false;
                    }

                    if (temp.length === 0) {
                        temp.push({
                            roomId: e.id,
                            startDate: e.date,
                            endDate: e.date,
                            categoryType: e.cId
                        });
                    } else {
                        const lastItem = temp[temp.length - 1];
                        // 将时间连续的房子放到一起
                        if (e.id === lastItem.roomId && util.DateDiff(lastItem.endDate, e.date) === 1) {
                            lastItem.endDate = e.date;
                        } else {
                            temp.push({
                                roomId: e.id,
                                startDate: e.date,
                                endDate: e.date,
                                categoryType: e.cId
                            });
                        }
                    }
                });
                return temp;
            }
        }
    };
</script>
