/**
 * Created by zhaoyongsheng on 17/2/9.
 */
import util from '../../common/util';
import Store from '../store';

export function getTableData({ list, firstTitle, secondTitle, foot }) {
    const width = 1000 / 9;
    const startDate = new Date(Store.state.date.startDate);
    const endDate = new Date(Store.state.date.endDate);
    const days = util.DateDiff(startDate, endDate) + 1;
    const dayWidth = days >= 7 ? width : (1000 - width * 2) / days;
    const columns = [
        {
            title: firstTitle,
            fixed: true,
            dataIndex: 'name',
            width: width
        },
        {
            title: secondTitle,
            fixed: true,
            dataIndex: 'total',
            width: width,
            className: 'text-right'
        }
    ];

    const dates = util.getDateBetween(startDate, endDate);
    dates.map(date => {
        columns.push({
            title: util.dateFormatWithoutYear(date),
            dataIndex: util.dateFormat(date),
            width: dayWidth,
            className: 'text-right'
        });
    });

    if (foot) {
        list.push({
            name: '综合合计',
            dateValues: dates.map((d, i) => {
                const value = list.reduce((a, b) => {
                    return a + b.dateValues[i].value
                }, 0);

                return {
                    date: util.dateFormat(d),
                    value: value.toFixed(2) == value ? value : Number(value.toFixed(2))
                };
            })
        });
    }

    const format = (list) => (
        list.map(i => {
            const data = {
                name: i.name
            };
            const total = i.dateValues.reduce((a, b) => {
                data[b.date] = b.value;
                return a + b.value;
            }, 0);
            data.total = total.toFixed(2) == total ? total : total.toFixed(2);
            if (i.children && i.children.length > 0) {
                data.children = format(i.children);
            }

            return data;
        })
    );

    const dataSource = format(list);
    if (foot) {
        dataSource[dataSource.length - 1].foot = foot;
    }

    return { dataSource, columns };
}