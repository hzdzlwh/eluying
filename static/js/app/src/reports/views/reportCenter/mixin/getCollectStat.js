import http from '../../../../common/http';
export const getCollectStat = {
    beforeRouteEnter(to, from, next) {
        http.get('/stat/getCollection').then(res => {
            next(vm => {
                const collectList = res.data.list;
                for(let i=0;i<collectList.length;i++){
                    if (collectList[i] === 301) {
                        vm.collectNum = 1;
                        vm.collectName = '已收藏';
                    }
                }
            })
        });
    }
};
