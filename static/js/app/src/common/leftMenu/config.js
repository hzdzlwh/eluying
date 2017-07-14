export default [
    {
        name: 'business',
        path: '/view/settings/business/category/room.html',
        title: '业务设置',
        children: [
            {
                name: 'room',
                path: '/view/settings/business/category/room.html',
                title: '住宿'
            },
            {
                name: 'restaurant',
                path: '/view/settings/business/restaurant/restaurant.html',
                title: '餐饮'
            },
            {
                name: 'entertainment',
                path: '/view/settings/business/category/entertainment.html',
                title: '娱乐'
            },
            {
                name: 'shop',
                path: '/view/settings/business/category/shop.html',
                title: '商超'
            }
        ]
    },
    {
        name: 'salesite',
        path: '/view/settings/salesite/operation/operation.html',
        title: '微官网设置',
        children: [
            {
                name: 'operation',
                path: '/view/settings/salesite/operation/operation.html',
                title: '网站运营'
            },
            {
                name: 'info',
                path: '/view/settings/salesite/info/info.html',
                title: '基本信息'
            },
            {
                name: 'detail',
                path: '/view/settings/salesite/detail/detail.html',
                title: '详情介绍'
            }
        ]
    },
    {
        name: 'codesite',
        path: '/view/settings/codesite/operation/codeOperation.html',
        title: '一码通网站设置',
        children: [
            {
                name: 'codeOperation',
                path: '/view/settings/codesite/operation/codeOperation.html',
                title: '网站运营'
            }
        ]
    },
    {
        name: 'payment',
        path: '/view/settings/payment/method/method.html',
        title: '收款设置',
        children: [
            {
                name: 'method',
                path: '/view/settings/payment/method/method.html',
                title: '收款方式'
            }
        ]
    },
    {
        name: 'guest',
        path: '/view/settings/guest/source/source.html',
        title: '客源设置',
        children: [
            {
                name: 'source',
                path: '/view/settings/guest/source/source.html',
                title: '客源列表'
            }
        ]
    },
    {
        name: 'linesite',
        path: '/view/settings/linesite/operation/lineOperation.html',
        title: '排队网站设置',
        children: [
            {
                name: 'lineOperation',
                path: '/view/settings/linesite/operation/lineOperation.html',
                title: '网站运营'
            }
        ]
    },
    {
        name: 'rights',
        path: '/view/settings/rights/virtual/virtual.html',
        title: '权益设置',
        children: [
            {
                name: 'virtual',
                path: '/view/settings/rights/virtual/virtual.html',
                title: '虚拟币'
            }
        ]
    }
]
