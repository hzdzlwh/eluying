<template>
        <div class="modal fade roomModals" id="keyboard" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <div class="header-text">{{dish}}</div>
                            <inpuVaild :isInt='true' v-model='val' :className='"reset-keyboard-num"' :max='2000' />
                            </div>
                    <div class="roomModals-body">
                        <div class="content-item">
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
                                        <td>0</td>
                                        <td colspan="2"><img src="/static/image/icon/delete.png" alt=""></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div @click='close' class="reset-btn-base reset-btn-canel">取消</div><div @click='submit' class="reset-btn-base reset-btn-submit">确定</div>
                    </div>
                </div>
            </div>
        </div>
</template>
<style>
    .reset-keyboard-num{
        border:1px solid #99a9bf!important;
        height:32px!important;
    }
</style>
<style scoped lang="scss" rel="stylesheet/scss">
#keyboard {
    .modal-content{
        padding:0;
    }
    .roomModals-footer{
        padding:8px;
        display:flex;
        justify-content: space-between;
        .reset-btn-base{
            line-height:34px;
            background-color: #fff;
            cursor:pointer;
        }
        .reset-btn-canel{
            color: #99a9bf;
            border:1px solid #99a9bf;
        }
        .reset-btn-submit{
                        width: 144px;
             margin: 0;
            color: #178ce6;
            border: 1px solid #178ce6;
        }
    }
    .modal-dialog{
        width: 240px;
        .header-text{

        }
        .roomModals-header{
            display: block;
            height: auto;
            padding:15px 8px 8px;
            border-bottom:1px solid #e0e6ed;
            .header-text{
                font-size:24px;
                color:#475669;
            }
        }
        .content-item{
            border-bottom:1px solid #e0e6ed;
            padding:0;
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
                border:1px solid #99a9bf;
                border-radius:4px;
                width:67px;
                height:32px;
                text-align:center;
                font-size:18px;
                color:#99a9bf;
                cursor:pointer;
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
        dish: String
    },
    data() {
        return {
            val: 0
        };
    },
    computed: {

    },
    methods: {
        addValue(e) {
            if (e.target.innerText === '') {
                this.val = Number(this.val.toString().slice(0, -1));
            }
            if (e.target.innerText && !isNaN(Number(e.target.innerText))) {
                const num = Number(this.val + e.target.innerText);
                if (num > 2000) {
                    this.val = 2000;
                } else {
                    this.val = num;
                }
            }
        },
        changeValue(val) {
            this.val = val;
        },
        close() {
            this.$emit('close');
        },
        submit() {
            this.close();
            this.$emit('numChange', this.val);
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.val = this.num;
                $('#keyboard').modal({ backdrop: 'static' });
            } else {
                $('#keyboard').modal('hide');
            }
        }
    },
    components: {
        inpuVaild
    }
};
</script>
