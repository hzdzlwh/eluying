 /**
 * Created by lingchenxuan on 2017/1/9.
 */
import Router from 'vue-router';
import dataCenter from './views/dataCenter.vue';
import reportCenter from './views/reportCenter/reportCenter.vue';
import operation from './views/overview/operation/operation.vue';
// import dailyReport from './views/overview/operation/dailyReport.vue';
import container from './views/container.vue';
import channel from './views/overview/channel.vue';
import sale from './views/overview/sale.vue';
import accommodation from './views/accommodation/accommodation.vue';
// import accommodationDaily from './views/accommodation/daily.vue';
import childContainer from './views/childContainer.vue';
import food from './views/catering/operation/food.vue';
import restaurant from './views/catering/operation/restaurant.vue';
import statistics from './views/entertainment/operation/statistics.vue';
import detail from './views/entertainment/operation/detail.vue';
import retail from './views/retail.vue';
import overallRank from './views/membership/overallRank.vue';
import dealDetail from './views/membership/dealDetail.vue';
import payStatistics from './views/membership/payStatistics.vue';
import flowChannels from './views/overview/flow/channels.vue';
import flowRecords from './views/overview/flow/records.vue';
import receivable from './views/overview/flow/receivable.vue';
import flowPrepiad from './views/overview/flow/prepaid.vue';
import insurance from './views/insurance.vue';
import reportAccommodation from './views/reportCenter/accommodation/accommodation.vue';
import todayRoom from './views/reportCenter/accommodation/todayRoom.vue';
import todayGuest from './views/reportCenter/accommodation/todayGuest.vue';
import historyGuest from './views/reportCenter/accommodation/historyGuest.vue';
import todayLeave from './views/reportCenter/accommodation/todayLeave.vue';
import todayArrive from './views/reportCenter/accommodation/todayArrive.vue';
import morrowLeave from './views/reportCenter/accommodation/morrowLeave.vue';
import morrowArrive from './views/reportCenter/accommodation/morrowArrive.vue';
import forecastRoom from './views/reportCenter/accommodation/forecastRoom.vue';
import businessRoom from './views/reportCenter/accommodation/businessRoom.vue';
// import clearRoom from './views/reportCenter/accommodation/clearRoom.vue';
import reportCatering from './views/reportCenter/catering/catering.vue';
import dishesStatistics from './views/reportCenter/catering/dishesStatistics.vue';
import dishesPresent from './views/reportCenter/catering/dishesPresent.vue';
// import reportEntertainment from './views/reportCenter/entertainment/entertainment.vue';
// import reportRetail from './views/reportCenter/retail/retail.vue';
import reportFinance from './views/reportCenter/finance/finance.vue';
import receiptDetails from './views/reportCenter/finance/receiptDetails.vue';
import receiptGather from './views/reportCenter/finance/receiptGather.vue';
// import recordedDetails from './views/reportCenter/finance/recordedDetails.vue';
import transferDetails from './views/reportCenter/finance/transferDetails.vue';
// import ARDetails from './views/reportCenter/finance/ARDetails.vue';
import ARGather from './views/reportCenter/finance/ARGather.vue';
import rechargeDetails from './views/reportCenter/finance/rechargeDetails.vue';
import reportManage from './views/reportCenter/manage/manage.vue';
import reportDaily from './views/reportCenter/manage/dailyReport.vue';
// import reportBazaar from './views/reportCenter/bazaar/bazaar.vue';
// import reportMember from './views/reportCenter/member/member.vue';
import collect from './views/reportCenter/collect/collect.vue';
import noCollect from './views/reportCenter/collect/noCollect.vue';
import auth from '../common/auth';
export const routeList = {
    todayRoom,
    todayGuest,
    todayArrive,
    todayLeave,
    morrowArrive,
    morrowLeave,
    businessRoom,
    forecastRoom,
    dishesStatistics,
    dishesPresent,
    receiptDetails,
    receiptGather,
    rechargeDetails,
    transferDetails,
    ARGather
};
const insuranceAuth = auth.checkSwitch(auth.INSURANCE_ID);
export const routes = [
    {
        path: '/',
        redirect: '/dataCenter',
        meta: {
            invisible: true
        }
    },
    {
        path: '/dataCenter',
        component: dataCenter,
        meta: {
            name: '数据中心'
        },
        redirect: '/dataCenter/overview',
        children: [
            {
                path: '/dataCenter/overview',
                redirect: '/dataCenter/overview/operation',
                component: container,
                meta: {
                    name: '总览'
                },
                children: [
                    {
                        path: '/dataCenter/overview/operation',
                        // component: childContainer,
                        component: operation,
                        meta: {
                            name: '运营'
                        }
                        // redirect: '/dataCenter/overview/operation/operation',
                        // children: [
                            // {
                                // path: '/dataCenter/overview/operation/operation',
                                // meta: {
                                //     name: '统计'
                                // }
                            // }
                            // {
                            //     path: '/dataCenter/overview/operation/dailyReport',
                            //     component: dailyReport,
                            //     meta: {
                            //         name: '日报'
                            //     }
                            // }
                        // ]
                    },
                    {
                        path: '/dataCenter/overview/flow',
                        meta: {
                            name: '流水'
                        },
                        component: childContainer,
                        redirect: '/dataCenter/overview/flow/channels',
                        children: [
                            {
                                path: '/dataCenter/overview/flow/channels',
                                component: flowChannels,
                                meta: {
                                    name: '收款方式'
                                }
                            },
                            {
                                path: '/dataCenter/overview/flow/records',
                                component: flowRecords,
                                meta: {
                                    name: '收款记录'
                                }
                            },
                            {
                                path: '/dataCenter/overview/flow/prepaid',
                                component: flowPrepiad,
                                meta: {
                                    name: '预收账款'
                                }
                            },
                            {
                                path: '/dataCenter/overview/flow/receivable',
                                component: receivable,
                                meta: {
                                    name: '应收账款'
                                }
                            }
                        ]
                    },
                    {
                        path: '/dataCenter/overview/sale',
                        component: sale,
                        meta: {
                            name: '销售'
                        }
                    },
                    {
                        path: '/dataCenter/overview/channel',
                        component: channel,
                        meta: {
                            name: '渠道'
                        }
                    }
                ]
            },
            {
                path: '/dataCenter/accommodation',
                meta: {
                    name: '住宿'
                },
                component: container,
                redirect: '/dataCenter/accommodation/statistics',
                children: [
                    {
                        path: '/dataCenter/accommodation/statistics',
                        component: accommodation,
                        meta: {
                            name: '统计'
                        }
                    }
                    // {
                    //     path: '/dataCenter/accommodation/daily',
                    //     component: accommodationDaily,
                    //     meta: {
                    //         name: '日报'
                    //     }
                    // }
                ]
            },
            {
                path: '/dataCenter/catering',
                meta: {
                    name: '餐饮'
                },
                component: container,
                redirect: '/dataCenter/catering/operation',
                children: [
                    {
                        path: '/dataCenter/catering/operation',
                        meta: {
                            name: '运营'
                        },
                        redirect: '/dataCenter/catering/operation/restaurant',
                        component: childContainer,
                        children: [
                            {
                                path: '/dataCenter/catering/operation/restaurant',
                                meta: {
                                    name: '餐厅统计'
                                },
                                component: restaurant
                            },
                            {
                                path: '/dataCenter/catering/operation/food',
                                meta: {
                                    name: '菜品明细'
                                },
                                component: food
                            }
                        ]
                    }
                ]
            },
            {
                path: '/dataCenter/entertainment',
                meta: {
                    name: '娱乐'
                },
                component: container,
                redirect: '/dataCenter/entertainment/operation',
                children: [
                    {
                        path: '/dataCenter/entertainment/operation',
                        meta: {
                            name: '运营'
                        },
                        component: childContainer,
                        redirect: '/dataCenter/entertainment/operation/statistics',
                        children: [
                            {
                                path: '/dataCenter/entertainment/operation/statistics',
                                meta: {
                                    name: '娱乐统计'
                                },
                                component: statistics
                            },
                            {
                                path: '/dataCenter/entertainment/operation/detail',
                                meta: {
                                    name: '娱乐明细'
                                },
                                component: detail
                            }
                        ]
                    }
                ]
            },
            {
                path: '/dataCenter/retail',
                meta: {
                    name: '商超'
                },
                component: retail
            },
            {
                path: '/dataCenter/membership',
                meta: {
                    name: '会员卡'
                },
                component: container,
                redirect: '/dataCenter/membership/overallRank',
                children: [
                    {
                        path: '/dataCenter/membership/overallRank',
                        meta: {
                            name: '汇总排名'
                        },
                        component: overallRank
                    },
                    {
                        path: '/dataCenter/membership/dealDetail',
                        meta: {
                            name: '交易明细'
                        },
                        component: dealDetail
                    },
                    {
                        path: '/dataCenter/membership/payStatistics',
                        meta: {
                            name: '支付统计'
                        },
                        component: payStatistics
                    }
                ]
            },
            {
                path: '/dataCenter/insurance',
                meta: {
                    name: '保险',
                    invisible: !insuranceAuth
                },
                component: insurance
            }
        ]
    },
    {
        path: '/reportCenter',
        component: reportCenter,
        meta: {
            name: '报表中心'
        },
        redirect: '/reportCenter/collect',
        children: [
            {
                path: '/reportCenter/collect',
                meta: {
                    name: '收藏'
                },
                component: noCollect,
                redirect: '',
                children: [
                    {
                        path: ':id',
                        component: collect,
                        meta: {
                            name: ''
                        }
                    }
                ]
            },
            {
                path: '/reportCenter/accommodation',
                meta: {
                    name: '住宿'
                },
                component: reportAccommodation,
                redirect: '/reportCenter/accommodation/todayRoom',
                children: [
                    {
                        path: '/reportCenter/accommodation/todayRoom',
                        meta: {
                            name: '当前在住房报表'
                        },
                        component: todayRoom
                    },
                    {
                        path: '/reportCenter/accommodation/todayGuest',
                        meta: {
                            name: '当前在住客人报表'
                        },
                        component: todayGuest
                    },
                    {
                        path: '/reportCenter/accommodation/historyGuest',
                        meta: {
                            name: '历史入住客人报表'
                        },
                        component: historyGuest
                    },
                    {
                        path: '/reportCenter/accommodation/todayLeave',
                        meta: {
                            name: '本日预离房间报表'
                        },
                        component: todayLeave
                    },
                    {
                        path: '/reportCenter/accommodation/todayArrive',
                        meta: {
                            name: '本日预抵房间报表'
                        },
                        component: todayArrive
                    },
                    {
                        path: '/reportCenter/accommodation/morrowLeave',
                        meta: {
                            name: '次日预离房间报表'
                        },
                        component: morrowLeave
                    },
                    {
                        path: '/reportCenter/accommodation/morrowArrive',
                        meta: {
                            name: '次日预抵房间报表'
                        },
                        component: morrowArrive
                    },
                    {
                        path: '/reportCenter/accommodation/forecastRoom',
                        meta: {
                            name: '房间预测报表'
                        },
                        component: forecastRoom
                    },
                    {
                        path: '/reportCenter/accommodation/businessRoom',
                        meta: {
                            name: '客房营业统计表'
                        },
                        component: businessRoom
                    }
                    // {
                    //     path: '/reportCenter/accommodation/clearRoom',
                    //     meta: {
                    //         name: '客房清洁工作任务表'
                    //     },
                    //     component: clearRoom
                    // }
                ]
            },
            {
                path: '/reportCenter/catering',
                meta: {
                    name: '餐饮'
                },
                component: reportCatering,
                redirect: '/reportCenter/catering/dishesStatistics',
                children: [
                    {
                        path: '/reportCenter/catering/dishesStatistics',
                        meta: {
                            name: '菜品统计汇总表'
                        },
                        component: dishesStatistics
                    },
                    {
                        path: '/reportCenter/catering/dishesPresent',
                        meta: {
                            name: '菜品赠送明细表'
                        },
                        component: dishesPresent
                    }
                ]
            },
            // {
            //     path: '/reportCenter/entertainment',
            //     meta: {
            //         name: '娱乐'
            //     },
            //     component: reportEntertainment
            // },
            // {
            //     path: '/reportCenter/retail',
            //     meta: {
            //         name: '商超'
            //     },
            //     component: reportRetail
            // },
            {
                path: '/reportCenter/finance',
                meta: {
                    name: '财务'
                },
                component: reportFinance,
                redirect: '/reportCenter/finance/receiptDetails',
                children: [
                    {
                        path: '/reportCenter/finance/receiptDetails',
                        component: receiptDetails,
                        meta: {
                            name: '收款明细表'
                        }
                    },
                    {
                        path: '/reportCenter/finance/receiptGather',
                        component: receiptGather,
                        meta: {
                            name: '收款汇总表'
                        }
                    },
                    // {
                    //     path: '/reportCenter/finance/recordedDetails',
                    //     component: recordedDetails,
                    //     meta: {
                    //         name: '入账明细表'
                    //     }
                    // },
                    {
                        path: '/reportCenter/finance/transferDetails',
                        component: transferDetails,
                        meta: {
                            name: '转应收账明细表'
                        }
                    },
                    // {
                    //     path: '/reportCenter/finance/ARDetails',
                    //     component: ARDetails,
                    //     meta: {
                    //         name: 'AR收款明细表'
                    //     }
                    // },
                    {
                        path: '/reportCenter/finance/ARGather',
                        component: ARGather,
                        meta: {
                            name: 'AR结算汇总表'
                        }
                    },
                    {
                        path: '/reportCenter/finance/rechargeDetails',
                        component: rechargeDetails,
                        meta: {
                            name: '充值明细表'
                        }
                    }
                ]
            },
            {
                path: '/reportCenter/manage',
                meta: {
                    name: '经营'
                },
                component: reportManage,
                redirect: '/reportCenter/manage/daily',
                children: [
                    {
                        path: '/reportCenter/manage/daily',
                        meta: {
                            name: '营业日报表'
                        },
                        component: reportDaily
                    }
                ]
            }
            // {
            //     path: '/reportCenter/bazaar',
            //     meta: {
            //         name: '市场'
            //     },
            //     component: reportBazaar
            // },
            // {
            //     path: '/reportCenter/member',
            //     meta: {
            //         name: '会员'
            //     },
            //     component: reportMember
            // }
        ]
    }
];

(function mapChildren(routes) {
    routes.map(route => {
        if (route.children) {
            route.meta.children = route.children;
            mapChildren(route.children);
        }
    });
})(routes);

export const router = new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { x: 0, y: 0 };
    },
    base: '/view/reports/',
    linkActiveClass: 'active',
    routes
});
