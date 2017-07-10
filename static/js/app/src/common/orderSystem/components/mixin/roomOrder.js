import http from '../../../http';
import util from '../../../util';
export default {
    methods: {
        handleVipCardChange(id, forceChange) {
            // 切换了会员卡后房间更多折扣的处理逻辑，没有折扣选择不使用
            if (this.checkState !== 'editOrder' || forceChange) {
                this.rooms.map(r => {
                    r.moreDiscount = id;
                });
            }
            if (Number(this.vipCardInfo.discount) === 10 && (this.checkState !== 'editOrder' || forceChange)) {
                this.rooms.map(r => {
                    r.moreDiscount = 0;
                });
            }
            if (this.rooms.length > 0) {
                if (forceChange) {
                    this.forceChangePrice = true;
                }
                // 更改渠道
                this.modifyRooms(this.rooms);
            }
        },
        handleMoreDiscountClick(index, ev) {
            ev.stopPropagation();
            document.querySelector(`#js-more-discount-${index} .dd-select-input`).click();
        },
         getQuickDiscounts() {
                http.get('/quickDiscount/getList', {
                        nodeId: 0,
                        nodeType: 0
                    })
                    .then(res => {
                        this.quickDiscounts = res.data.list.map(item => {
                            return {
                                ...item,
                                label: item.description + '  ' + item.discount + '折'
                            };
                        });
                        this.discountPlans = [];
                        this.discountPlans.push({
                            label: '快捷折扣',
                            discounts: res.data.list.map(item => {
                                return {
                                    id: item.id,
                                    name: item.description,
                                    discount: item.discount
                                };
                            })
                        });
                    });
            },
            quickDiscountIdChange(room) {
                this.forceChangePrice = true;
                this.modifyRooms([room]);
            },
            // 计算vip折扣价，如果没有vip折扣价返回原价
            getVipPrice(room) {
                return Number((room.originPrice * this.vipDiscount).toFixed(2));
            },
    }

}
