export const collect = {
    data() {
        return {
            collectNum: 0,
            collectName: '加入收藏'
        };
    },
    methods: {
        collectStat() {
            const reg = /^\/reportCenter\/collect/;
            if (reg.test(this.$route.path)) {
                this.collectNum = 1;
                this.collectName = '已收藏';
            }
        }
    },
    computed: {
        collectClass: function() {
            return {
                'report-collect': true,
                'report-collect-add': this.collectNum === 0,
                'report-collect-dis': this.collectNum === 1
            };
        }
    }
};
