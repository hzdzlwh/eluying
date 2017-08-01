<template>
    <div>
        <div class="modal fade roomModals" id="checkOut" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">预订人数</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title" style="margin-bottom:0;"><span>房间信息</span></p>
                            <table v-touch:tap="typing" v-touch:long="longTab">
                                <tbody>
                                    <tr>
                                        <td>7</td>
                                        <td>8</td>
                                        <td>9</td>
                                        <td data-code='D' rowspan="2">
                                            <icon name='del' />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>4</td>
                                        <td>5</td>
                                        <td>6</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>2</td>
                                        <td>3</td>
                                        <td data-code='K' rowspan="2" :class="{active: activeOk}">{{ okText || 'OK' }}</td>
                                    </tr>
                                    <tr>
                                        <td>{{ point ? '.' : '' }}</td>
                                        <td>0</td>
                                        <td data-code='F'>
                                            <icon name="keyfold" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
<script>
import http from '../../http';
export default {
    data() {
        return {
            
        };
    },
    computed: {
       
    },
    watch: {
        
    },
    components: {}
};
</script>