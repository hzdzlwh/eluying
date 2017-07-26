/*
 * @Author: lxj
 * @Date:   2017-07-25 10:41:02
 * @Last Modified by:   linxinjian
 * @Last Modified time: 2017-07-25 11:16:26
 * @email: 783384903@qq.com
 */

'use strict';
export default {
    '301': { component: 'todayRoom', name: '当前在住房间报表' },
    '302': { component: 'todayGuest', name: '当前在住客人报表' },
    '20': { component: 'todayLeave', name: '今日预离房间报表' },
    '22': { component: 'todayArrive', name: '今日预抵房间报表' },
    '21': { component: 'morrowLeave', name: '次日预离房间报表' },
    '23': { component: 'morrowArrive', name: '次日预抵房间报表' },
    '303': { component: 'historyGuest', name: '历史入住客人报表' },
    '304': { component: 'forecastRoom', name: '房间预测报表' },
    '19': { component: 'businessRoom', name: '客房营业统计表' },
    '401': { component: 'receiptDetails', name: '收款明细表' },
    '402': { component: 'receiptGather', name: '收款汇总表' },
    '403': { component: 'transferDetails', name: '转应收帐明细表' },
    '405': { component: 'ARGather', name: 'AR结算汇总表' },
    '305': { component: 'rechargeDetails', name: '充值明细表' },
    '502': { component: 'dishesStatistics', name: '菜品统计汇总表' },
    '501': { component: 'dishesPresent', name: '菜品赠送明细表' },
    '18': { component: 'dailyReport', name: '营业日报表' }
};
export const list = [
    {
        'name': '历史入住客人报表'
    },
    {
        'name': '收款明细表'
    },
    {
        'name': '收款汇总表'
    },
    {
        'name': '转应收账明细表'
    },
    {
        'name': 'AR结算汇总表'
    },
    {
        'name': '充值明细表'
    },
    {
        'name': '菜品统计汇总表'
    },
    {
        'name': '菜品赠送明细表'
    }
];