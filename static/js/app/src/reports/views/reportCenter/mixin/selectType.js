import http from 'http';
export const getRoomType = {
    data() {
        return {
            roomType: '-1~',
            roomTypeAll: [{
                id: -1,
                name: '全部房型',
                roomType: '-1~'
            }]
        };
    },
    methods: {
        getRoomType() {
            http.get('/room/getRoomCategories')
                .then(res => {
                    if (res.code === 1) {
                        const roomList = res.data.list;
                        roomList.forEach(room => {
                            room.id = room.cId;
                            room.name = room.cName;
                            room.roomType = `-1~${room.cId}`;
                            this.roomTypeAll.push(room);
                        });
                    }
                });
        }

    },
    watch: {
        roomType() {
            this.pageNo = 1;
            this.getData();
        }
    }
};
export const getZoneType = {
    data() {
        return {
            zoneType: '-1~',
            zoneTypeAll: [{
                id: -1,
                name: '全部区域',
                zoneType: '-1~'
            }]
        };
    },
    methods: {
        getZoneType() {
            http.get('/room/getZoneList')
                .then(res => {
                    if (res.code === 1) {
                        const zoneList = res.data.list;
                        zoneList.forEach(zone => {
                            zone.id = zone.zoneId;
                            zone.name = zone.zoneName;
                            zone.zoneType = `-1~${zone.zoneId}`;
                            this.zoneTypeAll.push(zone);
                        });
                    }
                });
        }
    },
    watch: {
        zoneType() {
            this.pageNo = 1;
            this.getData();
        }
    }
};
export const getCheckType = {
    data() {
        return {
            checkTypeAll: [{
                id: -1,
                name: '全部入住类型',
                checkType: -1
            }, {
                id: 0,
                name: '正常入住',
                checkType: 0
            }, {
                id: 2,
                name: '自用房',
                checkType: 2
            }, {
                id: 3,
                name: '免费房',
                checkType: 3
            }, {
                id: 1,
                name: '钟点房',
                checkType: 1
            }],
            checkType: -1
        };
    },
    watch: {
        checkType() {
            this.pageNo = 1;
            this.getData();
        }
    }
};
export const getOriginType = {
    data() {
        return {
            userOriginType: '-2~',
            userSelfOrigins: [{
                id: '',
                name: '全部客源渠道',
                originType: '-2~',
                type: 2
            }],
            userGroupOrigins: []
        };
    },
    methods: {
        getOrigin() {
            // 获取全部客户来源渠道
            http.get('/user/getChannels', { type: 2, isAll: false })
                .then((res) => {
                // 拼接originType 企业渠道：企业id~-5 会员-4～-4 自定义渠道 渠道id～渠道id
                    if (res.code === 1) {
                        const originsList = res.data.list;
                        const otherOrigins = [];
                        originsList.forEach(origin => {
                            if (origin.id < 0) {
                                origin.originType = `${origin.id}~${origin.id}`;
                                this.userSelfOrigins.push(origin);
                            } else if (origin.id > 0) {
                                origin.originType = `${origin.id}~${origin.id}`;
                                origin.info = origin.name;
                                otherOrigins.push(origin);
                            }
                        });
                        this.userGroupOrigins.push({ label: '其他', origins: otherOrigins });
                        // this.userOriginType = this.userSelfOrigins[0].originType;
                    }
                });
        }
    },
    watch: {
        userOriginType() {
            this.pageNo = 1;
            this.getData();
        }
    }
};
export const getStatType = {
    data() {
        return {
            statTypeAll: [{
                id: 0,
                name: '入住类型',
                statType: 0
            }, {
                id: 1,
                name: '房间类型',
                statType: 1
            }, {
                id: 2,
                name: '客源渠道',
                statType: 2
            }],
            statType: 0
        };
    },
    watch: {
        statType() {
            this.getData();
        }
    }
};
export const getRestType = {
    data() {
        return {
            restTypeAll: [{
                id: -1,
                name: '全部餐厅',
                restType: '-1~'
            }],
            restType: '-1~'
        };
    },
    methods: {
        getRestType() {
            http.get('/restaurant/listSimple')
                .then(res => {
                    if (res.code === 1) {
                        const restList = res.data.list;
                        this.restTypeOther = restList;
                        restList.forEach(rest => {
                            rest.id = rest.restId;
                            rest.name = rest.restName;
                            rest.restType = `-1~${rest.restId}`;
                            this.restTypeAll.push(rest);
                        });
                    }
                });
        }
    },
    watch: {
        restType() {
            this.pageNo = 1;
            this.getData();
            this.dishTypeAll = [{
                id: -1,
                name: '全部菜品分类'
            }];
            this.name = '全部菜品分类';
            this.getDishType();
        }
    }
};
export const getDishType = {
    data() {
        return {
            dishTypeAll: [{
                id: -1,
                name: '全部菜品分类'
            }],
            name: '全部菜品分类'
        };
    },
    methods: {
        getDishType() {
            const obj = {};
            if (this.restType.split('~')[1]) {
                obj.restId = this.restType.split('~')[1];
            }
            http.get('/dish/getDishTypes', obj)
                .then(res => {
                    if (res.code === 1) {
                        const dishType = res.data.list;
                        const dict = {};
                        dishType.forEach(dish => {
                            dish.name = dish.dishType;
                            if (!dict[dish.name]) {
                                dish.dishType = `-1~{dish.name}`;
                                this.dishTypeAll.push(dish);
                                dict[dish.name] = 1;
                            }
                        });
                    }
                });
        }
    },
    watch: {
        name() {
            this.pageNo = 1;
            this.getData();
        }
    }
};
export const getEmployeeType = {
    data() {
        return {
            employeeList: [
                {
                    realName: '全部操作人',
                    employeeId: 'ALL'
                },
                {
                    realName: '游客线上付款',
                    employeeId: -2
                },
                {
                    realName: '全部员工',
                    employeeId: -1
                }
            ],
            operatorId: 'ALL'
        };
    },
    methods: {
        getEmployeeList() {
            http.get('/user/getEmployeeList', {})
                .then(res => {
                    if (res.code === 1) {
                        this.employeeList = [...this.employeeList, ...res.data.list];
                    }
                });
        }
    },
    watch: {
        operatorId() {
            this.page = 1;
            this.getData();
        }
    }
};
export const getOrderType = {
    data() {
        return {
            orderTypeAll: [{
                id: -2,
                name: '全部订单类型',
                orderType: -2
            }, {
                id: -1,
                name: '组合订单',
                orderType: -1
            }, {
                id: 0,
                name: '餐饮',
                orderType: 0
            }, {
                id: 1,
                name: '娱乐',
                orderType: 1
            }, {
                id: 2,
                name: '商超',
                orderType: 2
            }, {
                id: 3,
                name: '住宿',
                orderType: 3
            }],
            orderType: -2
        };
    },
    watch: {
        orderType() {
            this.pageNo = 1;
            this.getData();
        }
    }
};
export const getChannelType = {
    data() {
        return {
            channels: [
                {
                    id: 'ALL',
                    name: '全部收款方式'
                }
            ],
            channelId: 'ALL'
        };
    },
    methods: {
        getChannels() {
            http.get('/user/getChannels', { type: 1, isAll: true })
                .then(res => {
                    if (res.code === 1) {
                        if (this.$route.path !== '/reportCenter/finance/rechargeDetails' && this.$route.path !== '/reportCenter/collect/305') {
                            this.channels = [...this.channels, ...res.data.list];
                        } else if (this.$route.path === '/reportCenter/finance/rechargeDetails' || this.$route.path === '/reportCenter/collect/305') {
                            const channel = res.data.list;
                            channel.forEach(item => {
                                if (item.name !== '企业余额抵扣' && item.name !== '企业挂账' && item.name !== '一码通' && item.name !== '会员卡余额抵扣' && item.name !== '会员余额抵扣' && item.name !== '虚拟币抵扣') {
                                    this.channels.push(item);
                                }
                            });
                        }
                    }
                });
        }
    },
    watch: {
        channelId() {
            this.page = 1;
            this.getData();
        }
    }
};
export const getMemberType = {
    data() {
        return {
            typeAll: [{
                id: -1,
                name: '全部类型',
                type: -1
            }, {
                id: 0,
                name: '会员',
                type: 0
            }, {
                id: 1,
                name: '会员卡',
                type: 1
            }],
            type: -1
        };
    },
    watch: {
        type() {
            this.pageNo = 1;
            this.getData();
            this.categoryTypeAll = [{
                id: -1,
                name: '会员卡/等级',
                categoryType: '-1~'
            }];
            this.categoryType = '-1~';
            this.getCategoryTypeAll();
        }
    }
};
export const getCategoryType = {
    data() {
        return {
            categoryTypeAll: [{
                id: -1,
                name: '会员卡/等级',
                categoryType: '-1~'
            }],
            categoryType: '-1~'
        };
    },
    methods: {
        getCategoryTypeAll() {
            if (this.type === 0) {
                http.get('/vipUser/getVipLevels')
                    .then(res => {
                        if (res.code === 1) {
                            const categoryList = res.data.list;
                            categoryList.forEach(category => {
                                category.id = category.vipLevelId;
                                category.name = category.vipLevelName;
                                category.categoryType = `-1~${category.vipLevelId}`;
                                this.categoryTypeAll.push(category);
                            });
                        }
                    });
            } else if (this.type === 1) {
                http.get('/vipCard/getVipCardSettings')
                    .then(res => {
                        if (res.code === 1) {
                            const categoryList = res.data.list;
                            categoryList.forEach(category => {
                                category.id = category.categoryId;
                                category.name = category.name;
                                category.categoryType = `-1~${category.categoryId}`;
                                this.categoryTypeAll.push(category);
                            });
                        }
                    });
            }
        }
    },
    watch: {
        categoryType() {
            this.pageNo = 1;
            this.getData();
        }
    }
};
