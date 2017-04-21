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
    { short: '待', long: '待处理', en: 'wait' },
    { short: '拒', long: '已拒绝', en: 'refuse' },
    { short: '预', long: '已预订', en: 'book' },
    { short: '住', long: '进行中', en: 'ing' },
    { short: '取', long: '已取消', en: 'cancel' },
    { short: '完', long: '已完成', en: 'finish' }
];

export const ID_CARD_TYPE = ['身份证', '军官证', '通行证', '护照', '其他'];
export const FOOD_STATE = ['已预订', '就餐中', '已结束', '已取消'];

export const ORDER_STATUS_ICON = {
    '-1': { text: '待付款', borderColor: '#ffffff #ffba75', backgroundColor: '#ffba75' },
    '2': { text: '已预订', borderColor: '#ffffff #ffba75', backgroundColor: '#ffba75' },
    '3': { text: '进行中', borderColor: '#ffffff #82beff', backgroundColor: '#82beff' },
    '4': { text: '已取消', borderColor: '#ffffff #bfbfbf', backgroundColor: '#bfbfbf' },
    '5': { text: '已完成', borderColor: '#ffffff #bfbfbf', backgroundColor: '#bfbfbf' }
};

// 订单详情中使用
export const ORDER_STATE_TEXT = {
    [ORDER_TYPE.COMBINATION]: {
        '-1': { text: '待付款', color: 'red' },
        '2': { text: '已预订', color: 'yellow' },
        '3': { text: '进行中', color: 'blue' },
        '4': { text: '已取消', color: 'grey' },
        '5': { text: '已结束', color: 'grey' },
        '8': { text: '反结账', color: 'red' }
    },
    [ORDER_TYPE.ACCOMMODATION]: {
        '-1': { text: '待付款', color: 'red' },
        '0': { text: '已预订', color: 'yellow' },
        '1': { text: '已入住', color: 'blue' },
        '2': { text: '已退房', color: 'grey' },
        '3': { text: '已取消', color: 'grey' },
        '8': { text: '反结账', color: 'red' }
    },
    [ORDER_TYPE.CATERING]: {
        '-1': { text: '待付款', color: 'red' },
        '0': { text: '已预订', color: 'yellow' },
        '1': { text: '就餐中', color: 'blue' },
        '2': { text: '已结束', color: 'grey' },
        '3': { text: '已取消', color: 'grey' },
        '4': { text: '待处理', color: 'green' },
        '5': { text: '已拒绝', color: 'grey' },
        '8': { text: '反结账', color: 'red' }
    },
    [ORDER_TYPE.ENTERTAINMENT]: {
        '-1': { text: '待付款', color: 'red' },
        '0': { text: '已预订', color: 'yellow' },
        '1': { text: '进行中', color: 'blue' },
        '3': { text: '已取消', color: 'grey' },
        '2': { text: '已结束', color: 'grey' },
        '8': { text: '反结账', color: 'red' }
    },
    [ORDER_TYPE.RETAIL]: {
        '-1': { text: '待付款', color: 'red' },
        '1': { text: '进行中', color: 'blue' },
        '3': { text: '已取消', color: 'grey' },
        '2': { text: '已结束', color: 'grey' },
        '8': { text: '反结账', color: 'red' }
    }
};

// 订单列表中使用
export const ORDER_STATE_LIST = {
    '-1': [{ id: '-1', name: '全部状态' },
        { id: '0', name: '待处理' },
        { id: '1', name: '已拒绝' },
        { id: '2', name: '已预订' },
        { id: '3', name: '进行中' },
        { id: '4', name: '已取消' },
        { id: '5', name: '已结束' },
        { id: '8', name: '反结账' }],

    '3': [{ id: '-1', name: '全部状态' },
        { id: '2', name: '已预订' },
        { id: '3', name: '已入住' },
        { id: '4', name: '已取消' },
        { id: '5', name: '已退房' },
        { id: '6', name: '过期未入住' },
        { id: '7', name: '过期未退房' },
        { id: '8', name: '反结账' }],

    '0': [{ id: '-1', name: '全部状态' },
        { id: '0', name: '待处理' },
        { id: '2', name: '已预订' },
        { id: '3', name: '就餐中' },
        { id: '4', name: '已取消' },
        { id: '5', name: '已结束' },
        { id: '6', name: '过期未入厨' },
        { id: '7', name: '过期未结账' },
        { id: '8', name: '反结账' }],

    '1': [{ id: '-1', name: '全部状态' },
        { id: '2', name: '已预订' },
        { id: '3', name: '进行中' },
        { id: '4', name: '已取消' },
        { id: '5', name: '已结束' },
        { id: '6', name: '过期未使用' },
        { id: '7', name: '过期未结束' },
        { id: '8', name: '反结账' }],

    '2': [{ id: '-1', name: '全部状态' },
        { id: '3', name: '进行中' },
        { id: '4', name: '已取消' },
        { id: '5', name: '已结束' },
        { id: '8', name: '反结账' }]
};
