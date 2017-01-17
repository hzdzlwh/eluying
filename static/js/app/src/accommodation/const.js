/**
 * Created by lingchenxuan on 2016/12/23.
 */
// 订单状态
export const ORDER_STATUS = [
    {short: '待', long: '待处理', en: 'wait'},
    {short: '拒', long: '已拒绝', en: 'refuse'},
    {short: '预', long: '已预订', en: 'book'},
    {short: '住', long: '进行中', en: 'ing'},
    {short: '取', long: '已取消', en: 'cancel'},
    {short: '完', long: '已完成', en: 'finish'}
];

export const ID_CARD_TYPE = ['身份证', '军官证', '通行证', '护照', '其他'];
export const FOOD_STATE = ['已预订', '就餐中', '已结束', '已取消'];