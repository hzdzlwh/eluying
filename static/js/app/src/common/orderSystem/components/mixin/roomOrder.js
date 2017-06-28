import http from '../../../http';
import util from '../../../util';
export default {
    methods: {
        getRoomType(id) {
            http.get('/room/getStopInfo',
                id: id
            ).then(res => {
                return res.data.list;
            });
        },
        disabledStartDate(endDate) {
            const str = util.dateFormat(new Date(endDate));
            const arr = str.split('-');
            if (this.checkState === 'finish' || this.checkState === 'quick' || this.checkState === 'team') {
                return (date) => {
                    return date.valueOf() >= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                };
            }
            if (this.checkState === 'ing' || this.checkState === 'checkIn') {
                return (date) => {
                    return date.valueOf() <= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                };
            }
            if (this.checkState === 'book' || this.checkState === 'editOrder') {
                return (date) => {
                    return date.valueOf() >= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                };
            }
            return (date) => {
                return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
            };
        },
        disabledEndDate(startDate, type) {
            if (this.checkState === 'quick' || this.checkState === 'team') {
                const str = util.dateFormat(new Date(startDate));
                const arr = str.split('-');
                return (date) => {
                    return (date.valueOf() < (new Date(arr[0], arr[1], arr[2])).valueOf() || date.valueOf() > (new Date(arr[0], arr[1] - 1, arr[2])).valueOf() + 99 * 24 * 60 * 60 * 1000);
                };
            }
            if (this.checkState === 'finish') {
                if (util.isSameDay(new Date(startDate), new Date())) {
                    const str1 = util.dateFormat(new Date());
                    const arr1 = str1.split('-');
                    return (date) => {
                        return (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                    };
                } else {
                    const str = util.dateFormat(new Date(startDate));
                    const arr = str.split('-');
                    const str1 = util.dateFormat(new Date());
                    const arr1 = str1.split('-');
                    return (date) => {
                        return (date.valueOf() <= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf()) || (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                    };
                }
            } else {
                const str = util.dateFormat(new Date(startDate));
                const arr = str.split('-');
                return (date) => {
                    return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                };
            }
        },
        dateDiff(date1, date2) {
            http.get('/room/getStopInfo',
                startDate: date1,
                endDate: date2
            ).then(res => {
                return res.data
            })
        },
    }

}
