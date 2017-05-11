<template>
    <label>
        <input class="dd-switch dd-switch-animbg" type="checkbox" :disabled='disabled' v-model="inputValue" :checked='inputValue'  >{{label}} </label>
</template>
<style lang='sass'>
@mixin borderRadius($radius:20px) {
    border-radius: $radius;
    border-top-left-radius: $radius;
    border-top-right-radius: $radius;
    border-bottom-left-radius: $radius;
    border-bottom-right-radius: $radius;
}

$duration: .4s;
$checkedColor: #ccc!important;
.dd-switch {
    width: 44px;
    height: 24px;
    position: relative;
    border: 1px solid #8ebdfa!important;
    background-color: #8ebdfa!important;
    /*box-shadow: #dfdfdf 0 0 0 0 inset;*/
    @include borderRadius(2px);
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    &:before {
        content: '✔';
        margin-top: 2px;
        margin-left: 2px;
        color: #fff;
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        position: absolute;
        font-size: 12px;
        top: 0px;
        left: 0;
        @include borderRadius(2px);
        background-color: #d0e5fd;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }
    &:checked {
        border-color: $checkedColor;
        /*box-shadow: $checkedColor 0 0 0 16px inset;*/
        background-color: $checkedColor;
        &:before {
            left: 21px;
            background-color: #e6e6e6;
            content: '✕';
        }
    }
    &.dd-switch-animbg {
        transition: background-color ease $duration;
        &:before {
            transition: left 0.3s;
        }
        &:checked {
            /*box-shadow: #dfdfdf 0 0 0 0 inset;*/
            background-color: $checkedColor;
            transition: border-color $duration, background-color ease $duration;
            &:before {
                transition: left 0.3s;
            }
        }
    }
    &.dd-switch-anim {
        transition: border cubic-bezier(0, 0, 0, 1) $duration, cubic-bezier(0, 0, 0, 1) $duration;
        &:before {
            transition: left 0.3s;
        }
        &:checked {
            /*box-shadow: $checkedColor 0 0 0 16px inset;*/
            background-color: $checkedColor;
            transition: border ease $duration,  ease $duration, background-color ease $duration*3;
            &:before {
                transition: left 0.3s;
            }
        }
    }
}
</style>
<script>
export default {
    name: 'switch',
    props: {
        value: {
            type: Number,
            default: 0
        },
        label: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            inputValue: !this.value
            // 样式写反了=-=就这样补丁了
        };
    },
    watch: {
        // value(val) {
        //     this.inputValue = val;
        // },
        inputValue(val, newval) {
            const value = newval ? 1 : 0;
            this.$emit('input', value);
        }
    }
};
</script>
