import http from 'http';
import { mapState } from 'vuex';
export const getDishType = {
    data() {
        return {
            dishTypeAll: [
                {
                    id: -1,
                    name: '全部菜品分类',
                    dishType: '-1~'
                }
            ],
            dishType: '-1~'
        };
    },
    computed: {
        ...mapState(['restId'])
    },
    methods: {
        getDishType() {
            http.post('/dish/getDishTypes', { restId: this.restId })
                .then(res => {
                    if (res.code === 1) {
                        this.dishTypeAll = [
                            {
                                id: -1,
                                name: '全部菜品分类',
                                dishType: '-1~'
                            }
                        ];
                        this.dishType = '-1~';
                        const dishList = res.data.list;
                        dishList.forEach(dish => {
                            dish.id = dish.dishTypeId;
                            dish.name = dish.dishType;
                            dish.dishType = `-1~${dish.dishTypeId}`;
                            this.dishTypeAll.push(dish);
                        });
                    }
                });
        }
    },
    watch: {
        restId() {
            if (this.restId !== 0) {
                this.getDishType();
            }
        }
    }
};
