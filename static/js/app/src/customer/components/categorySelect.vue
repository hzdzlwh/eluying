<template>
    <div class="modal fade" role="dialog" id="categorySelectModal" data-backdrop="static">
        <div class="modal-dialog" style="width: 400px">
            <div class="modal-content">
                <button type="button" class="close" @click="close"><span>&times;</span></button>
                <h2 style="margin-bottom: 21px">{{title}}</h2>
                <div style="padding-left: 21px">
                    <div class="select-category"><input type="checkbox" class="dd-checkbox" v-model="all"><span>全部</span></div>
                    <div class="select-category">
                        <span class="select-category-name"><input type="checkbox" class="dd-checkbox" v-model="room">住宿</span>
                        <span class="select-category-nodes">
                            <span class="select-category-node" :key="node.id" v-for="node in roomNodeList">
                                <input v-model="node.selected" type="checkbox" class="dd-checkbox">{{node.nodeName}}</span>
                        </span>
                    </div>
                    <div class="select-category" v-if="restNodeList.length > 0">
                        <span class="select-category-name"><input type="checkbox" class="dd-checkbox" v-model="food">餐饮</span>
                        <span class="select-category-nodes">
                            <span class="select-category-node" :key="node.id" v-for="node in restNodeList">
                                <input v-model="node.selected" type="checkbox" class="dd-checkbox">{{node.nodeName}}</span>
                        </span>
                    </div>
                    <div class="select-category" v-if="enterNodeList.length > 0">
                    <span class="select-category-name">
                        <input type="checkbox" class="dd-checkbox" v-model="et">娱乐
                    </span>
                        <span class="select-category-nodes">
                        <span class="select-category-node" :key="node.id" v-for="node in enterNodeList">
                            <input v-model="node.selected" type="checkbox" class="dd-checkbox">{{node.nodeName}}</span>
                    </span>
                    </div>
                    <div class="select-category">
                        <input type="checkbox" class="dd-checkbox" v-model="shop"><span>商超</span>
                    </div>
                    <div>
                        <button class="dd-btn dd-btn-primary dd-btn-sm" @click="confirmSelect">确定</button>
                        <button class="dd-btn dd-btn-ghost dd-btn-sm" @click="close">取消</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .select-category {
        display: flex;
    input[type=checkbox] {
        margin-right: 6px;
    &:focus {
         outline: 0;
     }
    }
    span {
        margin-bottom: 19px;
    }
    .select-category-nodes {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0;
    span {
        margin-right: 6px;
    }
    }
    }
    .select-category-name {
        width: 62px;
    }

    .select-category-node {
        display: flex;
    }
    .modal-content {
        background: #fafafa;
        box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.15);
        border-radius: 2px;
        border-top: 4px solid #178ce6;
        padding: 20px;
    }
</style>
<script>
    import http from '../../common/http';

    export default{
        props: {
            onConfirm: Function,
            list: Array,
            type: ''
        },
        data() {
            return {
                enterNodeList: [],
                restNodeList: [],
                roomAllNodeList: [
                    {
                        nodeName: '正常入住',
                        nodeType: 0,
                        id: 0,
                        selected: false,
                        discount: undefined
                    },
                    {
                        nodeName: '钟点房',
                        nodeType: 0,
                        id: 1,
                        selected: false,
                        discount: undefined
                    },
                    {
                        nodeName: '自用房',
                        nodeType: 0,
                        id: 2,
                        selected: false,
                        discount: undefined
                    },
                    {
                        nodeName: '免费房',
                        nodeType: 0,
                        id: 3,
                        selected: false,
                        discount: undefined
                    }
                ],
                shop: undefined
            };
        },
        watch: {
            list(val) {
                this.initList(val);
            }
        },
        computed: {
            room: {
                get() {
                    return this.roomNodeList.every(i => i.selected);
                },
                set(v) {
                    this.roomNodeList.map(i => i.selected = v);
                }
            },
            food: {
                get() {
                    return this.restNodeList.every(i => i.selected);
                },
                set(v) {
                    this.restNodeList.map(i => i.selected = v);
                }
            },
            et: {
                get() {
                    return this.enterNodeList.every(i => i.selected);
                },
                set(v) {
                    this.enterNodeList.map(i => i.selected = v);
                }
            },
            all: {
                get() {
                    const arr = [this.room, this.shop, this.et, this.food];
                    return arr.every(i => i);
                },
                set(v) {
                    this.room = v;
                    this.shop = v;
                    this.et = v;
                    this.food = v;
                }
            },
            roomNodeList() {
                if (this.type === 'discount') {
                    return this.roomAllNodeList.filter(i => i.id === 0 || i.id === 1);
                }

                if (this.type === 'consume' || this.type === 'pay' || this.type === undefined) {
                    return this.roomAllNodeList;
                }
            },
            title() {
                return {
                    discount: '选择优惠项目',
                    consume: '选择消费累计项目',
                    pay: '选择可支付项目',
                    vipPayItems: '储值账户可支付项目'
                }[this.type];
            }
        },
        created() {
            this.getCategories();
        },
        methods: {
            getCategories() {
                http.get('/vipUser/getNodeInfo', {})
                    .then(res => {
                        this.enterNodeList = res.data.enterNodeList;
                        this.restNodeList = res.data.restNodeList;
                        this.enterNodeList.map(i => {
                            this.$set(i, 'selected', false);
                            this.$set(i, 'discount', undefined);
                        });
                        this.restNodeList.map(i => {
                            this.$set(i, 'selected', false);
                            this.$set(i, 'discount', undefined);
                        });
                    });
            },
            confirmSelect() {
                const list = [];
                this.roomNodeList.map(i => {
                    if (i.selected) {
                        list.push({ ...i });
                    }
                });
                this.enterNodeList.map(i => {
                    if (i.selected) {
                        list.push({ ...i });
                    }
                });
                this.restNodeList.map(i => {
                    if (i.selected) {
                        list.push({ ...i });
                    }
                });

                if (this.shop) {
                    list.push({
                        id: 0,
                        nodeType: 3,
                        nodeName: '商超',
                        selected: true
                    });
                }

                this.onConfirm(list);
                $('#categorySelectModal').modal('hide');
            },
            initList(list) {
                this.restNodeList.map(i => {
                    const node = list.find(item => item.id === i.id);
                    i.selected = !!node;
                });
                this.enterNodeList.map(i => {
                    const node = list.find(item => item.id === i.id);
                    i.selected = !!node;
                });
                this.roomNodeList.map(i => {
                    const node = list.find(item => item.id === i.id);
                    i.selected = !!node;
                });
                const shop = list.find(item => item.nodeType === 3);
                this.shop = !!shop;
            },
            close() {
                this.initList(this.list);
                $('#categorySelectModal').modal('hide');
            }
        }
    };
</script>
