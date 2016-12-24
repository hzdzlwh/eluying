<template>
    <div class="shopcart" v-if="selectedRoomsCount > 0">
        <p class="shopcart-count">已选择{{selectedRoomsCount}}个房间</p>
        <div class="shopcart-rooms">
            <div class="shopcart-room" v-for="room in selectedRooms">{{room}}</div>
        </div>
        <div class="shopcart-action">
            <button class="dd-btn shopcart-addition" v-if="finishShow">补录</button>
            <button class="dd-btn shopcart-book" v-if="bookShow" @click="showInfoModal">预定</button>
            <button class="dd-btn shopcart-live" v-if="ingShow">直接入住</button>
        </div>
    </div>
</template>
<style lang="sass" rel="stylesheet/scss">
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
    export default{
        props: {
            selectedEntries: Array
        },
        computed: {
            selectedRooms() {
                const today = new Date();
                let p = false;
                let t = false;
                let f = false;
                const temp = {};
                this.selectedEntries.map(e => {
                    // 直接抄的浇浇代码
                    const date = new Date(e.date);
                    if (util.isSameDay(date, today)) {
                        t = true;
                    } else if(date > today) {
                        f = true;
                    } else if(date < today) {
                        p = true;
                    }

                    temp[e.id] = `${e.cName}-${e.rName}`;
                });
                this.finishShow = p&&!t&&!f || p&&t&&!f || p&&t&&f || p&&!t&&f;
                this.ingShow = p&&t&&!f || p&&t&&f || !p&&t&&!f || !p&&t&&f;
                this.bookShow = p&&!t&&f || !p&&t&&!f || !p&&t&&f || !p&&!t&&f;
                return temp;
            },
            selectedRoomsCount() {
                return Object.keys(this.selectedRooms).length;
            }
        },
        data(){
            return{
                finishShow: false,
                ingShow: false,
                bookShow: false
            }
        },
        watch: {
            selectedRoomsCount(val) {
                if (val > 0) {
                    $('.acc-container').css('bottom', '90px');
                } else {
                    $('.acc-container').css('bottom', '90px');
                }
            }
        },
        methods: {
            showInfoModal() {
                $('#registerInfoModal').modal('show');
            }
        }
    }
</script>
