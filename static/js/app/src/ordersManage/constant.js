/**
 * Created by lingchenxuan on 2017/3/27.
 */
export const ORDER_TYPE = {
    COMBINATION: -1,
    ACCOMMODATION: 3,
    ENTERTAINMENT: 1,
    RETAIL: 2,
    CATERING: 0
};
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

export const ORDER_STATUS_ICON = {
    '-1': {text: '待付款', borderColor: '#ffffff #ffba75', backgroundColor: '#ffba75'},
    '2': {text: '已预订', borderColor: '#ffffff #ffba75', backgroundColor: '#ffba75'},
    '3': {text: '进行中', borderColor: '#ffffff #82beff', backgroundColor: '#82beff'},
    '4': {text: '已取消', borderColor: '#ffffff #bfbfbf', backgroundColor: '#bfbfbf'},
    '5': {text: '已完成', borderColor: '#ffffff #bfbfbf', backgroundColor: '#bfbfbf'}
};
