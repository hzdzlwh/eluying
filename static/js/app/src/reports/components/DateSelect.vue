<template>
    <div>
        <span class="date-select">
            <DdSelect v-model="type">
                <DdOption v-for="type in DATE_TYPE" :key="type.value" :value="type.value" :label="type.label"></DdOption>
            </DdSelect>
        </span>
        <DdDatepicker :disabled="dateDisabled" v-model="startDate" />
        <span>~</span>
        <DdDatepicker :disabled="dateDisabled" v-model="endDate" />
    </div>
</template>
<style>
    .date-select {
        width: 120px;
        display: inline-block;
    }
</style>
<script>
    import { DdDatepicker, DdSelect, DdOption } from 'dd-vue-component';
    import { mapMutations } from 'vuex';
    import util from '../../common/util';
    import types from '../store/types';
    export default{
        data() {
            return {
                DATE_TYPE: [
                    {
                        value: 0,
                        label: '最近7天'
                    },
                    {
                        value: 1,
                        label: '未来7天'
                    },
                    {
                        value: 2,
                        label: '今天'
                    },
                    {
                        value: 3,
                        label: '昨天'
                    },
                    {
                        value: 4,
                        label: '本周'
                    },
                    {
                        value: 5,
                        label: '本月'
                    },
                    {
                        value: 6,
                        label: '自定义'
                    }
                ],
                type: undefined,
                startDate: undefined,
                endDate: undefined,
                dateDisabled: true,
                flag: undefined
            };
        },
        created() {
            this.type = 0;
        },
        watch: {
            type(val) {
                this.dateDisabled = val !== 6;
                const today = new Date();
                switch (val) {
                    case 0:
                        this.startDate = util.dateFormat(util.diffDate(today, -7));
                        this.endDate = util.dateFormat(util.diffDate(today, -1));
                        break;
                    case 1:
                        this.startDate = util.dateFormat(util.diffDate(today, 1));
                        this.endDate = util.dateFormat(util.diffDate(today, 7));
                        break;
                    case 2:
                        this.startDate = util.dateFormat(today);
                        this.endDate = util.dateFormat(today);
                        break;
                    case 3:
                        this.startDate = util.dateFormat(util.diffDate(today, -1));
                        this.endDate = util.dateFormat(util.diffDate(today, -1));
                        break;
                    case 4:
                        const day = today.getDay();
                        this.startDate = util.dateFormat(util.diffDate(today, 1 - day));
                        this.endDate = util.dateFormat(util.diffDate(today, 7 - day));
                        break;
                    case 5:
                        const month = today.getMonth();
                        const year = today.getFullYear();
                        this.startDate = util.dateFormat(new Date(year, month, 1));
                        this.endDate = util.dateFormat(new Date(year, month + 1, 0));
                        break;
                }
            },
            startDate(newV, oldV) {
                if (newV === oldV) {
                    return false;
                }

                const diff = util.DateDiff(new Date(newV), new Date(this.endDate));

                if (diff > 30) {
                    this.endDate = util.dateFormat(util.diffDate(new Date(newV), 30));
                }

                if (diff < 0) {
                    this.endDate = newV;
                }

                this.emitDateChange();
            },
            endDate(newV, oldV) {
                if (newV === oldV) {
                    return false;
                }

                const diff = util.DateDiff(new Date(newV), new Date(this.startDate));

                if (diff < -30) {
                    this.startDate = util.dateFormat(util.diffDate(new Date(newV), -30));
                }

                if (diff > 0) {
                    this.startDate = newV;
                }

                this.emitDateChange();
            }
        },
        methods: {
            ...mapMutations([
                types.SET_DATE
            ]),
            emitDateChange() {
                clearTimeout(this.flag);
                this.flag = setTimeout(() => {
                    this.$emit('change', {
                        startDate: this.startDate,
                        endDate: this.endDate
                    });
                    this[types.SET_DATE]({
                        startDate: this.startDate,
                        endDate: this.endDate
                    });
                }, 300);
            }
        },
        components: {
            DdDatepicker,
            DdSelect,
            DdOption
        }
    };
</script>
