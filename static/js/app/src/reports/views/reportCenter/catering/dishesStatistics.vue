<template>
    <div>
        <div class="report-reportCenter-date">
            <DateSelect/>
            <a :href="collect" class="report-btn">点击收藏</a>
            <a :href="exportUrl(0)" class="report-btn">导出Excel</a>
        </div>
        <h2 class="report-reportCenter-title">{{$route.meta.name}}</h2>
        <div class="report-reportCenter-top">
            <div class="date">日期 : <i>{{date.startDate}} ~ {{date.endDate}}</i></div>
            <div class="select-box">
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="restType" >
                        <dd-option :key="item.id" v-for="item in restTypeAll" :value="item.restType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="dishType" >
                        <dd-option :key="item.id" v-for="item in dishTypeAll" :value="item.dishType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
            </div>
        </div>
        <dd-table :columns="col" :data-source="vips" :bordered="true" id="table"></dd-table>
    </div>
</template>
<style lang="scss">
    .report-reportCenter-title {
        width: 100%;
        line-height: 56px;
        font-size: 1.5em;
        color: #746D66;
        text-align: center;
        font-family: border;
      }
      .report-reportCenter-top {
        width: 100%;
        height: 32px;
        padding: 5px 0;
        .date {
          float: left;
          line-height: 25.44px;
        }
        .select-box {
          float: left;
          .fr {
            float: left;
            margin-left: 20px;
          }
        }
      }
  #table {
    margin-top: 20px;
    max-height: 400px;
    padding-bottom: 12px;
  }
</style>
<script>
    import http from 'http';
    import { mapState } from 'vuex';
    import DateSelect from '../../../components/DateSelect.vue';
    import { DdDropdown, DdDropdownItem, DdSelect, DdOption , DdTable } from 'dd-vue-component';
    export default {
        props: {
            startDate: String,
            endDate: String
        },
        data() {
            return {
                restTypeAll: [{
                    id: -1,
                    name: '全部餐厅',
                    restType: '-1~'
                }],
                restTypeOther: [],
                restType: '-1~',
                dishTypeAll: [{
                    id: -1,
                    name: '全部菜品分类',
                    dishType: '-1~'
                }],
                dishTypeOther: [],
                dishType: '-1~',
                vips: [],
                vip: {},
                pages: 0,
                personCount: 0,
                pageNo: 1,
                col: [
                    {
                        title: '餐厅名称',
                        dataIndex: 'restName',
                        width: 100
                    },
                    {
                        title: '菜品种类',
                        render: (h, row) => <div>{row.dishTypeList && row.dishTypeList.map(function(item) {
                            return <div style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;" title={item.dishType} key={item.dishType}>{item.dishType}</div>;
                        })}</div>
                    }
                    // {
                    //     title: '菜品名称',
                    //     render: (h, row) => <div>{row.dishTypeList && row.dishTypeList.map(function(item) {
                    //         item.dishType && item.dishType.map(function(dish) {
                    //             return <div style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;" title={dish.dishName} key={item.dishName}>{item.dishName}</div>;
                    //         });
                    //     })}</div>
                    // }
                ]
            };
        },
        created() {
            this.getRestType();
            // this.getDishType();
            this.getData();
        },
        components: {
            DdDropdown,
            DdDropdownItem,
            DateSelect,
            DdSelect,
            DdOption,
            DdTable
        },
        computed: {
            ...mapState(['date'])
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
            },
            // getDishType() {
            //     http.get('/dish/getDishTypes')
            //     .then(res => {
            //         if (res.code === 1) {
            //             const dishType = res.data.list;
            //             dishType.forEach(dish => {
            //                 dish.name = dish.dishType;
            //                 this.dishTypeAll.forEach(item => {
            //                     if (dish.name !== item.name) {
            //                         this.dishTypeAll.push(dish);
            //                     } else {
            //                         console.log(1);
            //                     }
            //                 });
            //             });
            //         }
            //     });
            // },
            exportUrl(type) {
                const originParam = {
                    date: this.today
                };
                const paramsObj = {
                    exportType: type,
                    reportType: 18,
                    params: JSON.stringify(originParam)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            collect() {
            },
            getData() {
                http.get('/stat/getDishGather', { startDate: this.date.startDate, endDate: this.date.endDate, showPackageDish: 0 }).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.list;
                        console.log(this.vips);
                    };
                });
            }
        }
    };
</script>
