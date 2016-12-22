<template>
    <div class="shopcart" v-if="selectedRoomsCount > 0">
        <p class="shopcart-count">已选择{{selectedRoomsCount}}个房间</p>
        <div class="shopcart-rooms">
            <div class="shopcart-room" v-for="room in selectedRooms">{{room}}</div>
        </div>
        <div class="shopcart-action">
            <button class="dd-btn dd-btn-primary">补录</button>
            <button class="dd-btn dd-btn-primary" @click="showModal">预定</button>
            <button class="dd-btn dd-btn-primary">直接入住</button>
        </div>
    </div>
</template>
<style lang="sass">
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
    }
</style>
<script>
    export default{
        props: {
            selectedEntries: Array
        },
        computed: {
            selectedRooms() {
                const temp = {};
                this.selectedEntries.map(e => {
                    temp[e.id] = `${e.cName}-${e.rName}`;
                });
                return temp;
            },
            selectedRoomsCount() {
                return Object.keys(this.selectedRooms).length;
            }
        },
        data(){
            return{
                msg:'hello vue'
            }
        },
        methods: {
            showModal() {
                $('#registerInfoModal').modal('show');
            }
        }
    }
</script>
