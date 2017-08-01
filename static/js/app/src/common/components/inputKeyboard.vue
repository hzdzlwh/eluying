<template>
        <div class="modal fade roomModals" id="keyboard" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">填写人数</span><span>大圆桌4</span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <inpuVaild :isInt='true' v-model='val' />
                            <table >
                                <tbody @click='addValue'>
                                    <tr>
                                        <td>1</td>
                                        <td>2</td>
                                        <td>3</td>
                                    </tr>
                                    <tr>
                                        <td>4</td>
                                        <td>5</td>
                                        <td>6</td>
                                    </tr>
                                    <tr>
                                        <td>7</td>
                                        <td>8</td>
                                        <td>9</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>0</td>
                                        <td>D</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <span @click='close'>取消</span><span @click='submit'>确定</span>
                    </div>
                </div>
            </div>
        </div>
</template>
<style scoped lang="scss" rel="stylesheet/scss">
#keyboard {
    .modal-dialog{
        width: 300px;
        .roomModals-header{
            display:flex;
            justify-content: space-between;
            align-items:flex-start;
        }
        table{
            width: 100%;
            text-align: center;
            border-spacing: 10px;
            border-collapse: inherit;
            tr{
                margin: 10px -10px;
            }
            td {
                border: 1px solid black;
                margin:0 10px;
            }
        }
    }
}
</style>
<script>
import inpuVaild from './inputVaild.vue';
export default {
    props: {
        visible: Boolean,
        num: Number,
        numChange: Function
    },
    data() {
        return {
            val: 10
        };
    },
    computed: {

    },
    methods: {
        addValue(e) {
            if (e.target.innerText === 'D') {
                this.val = Number(this.val.toString().slice(0, -1));
            }
            if (e.target.innerText && !isNaN(Number(e.target.innerText))) {
                this.val = Number(this.val + e.target.innerText);
            }
        },
        changeValue(val) {
            this.val = val;
        },
        close() {
            this.$emit('close');
        },
        submit() {
            this.$emit('numChange', this.num);
            this.close();
        }
    },
    watch: {
        visible(val) {
            if (val) {
                $('#keyboard').modal({ backdrop: 'static' });
            } else {
                $('#keyboard').modal('hide');
            }
        },
        num(val) {
            this.val = val;
        }
    },
    components: {
        inpuVaild
    }
};
</script>
