/**
 * Created by lingchenxuan on 2017/2/9.
 */
import echarts from 'echarts/dist/echarts.common.min';
const color = ['#4ec0e6', '#e86d6d', '#6c96ff', '#7bd769', '#fbd400', '#ffbb53', '#f68633', '#6f68b4'];
const tooltip = {
    trigger: 'item',
    backgroundColor: 'rgba(255,255,255,0.95)',
    textStyle: {
        color: '#666'
    },
    extraCssText: 'box-shadow:0px 0px 5px 0px rgba(0,0,0,0.15);border-radius:2px;'
};

export function setLine(series, xAxisData, yAxisName, id = 'line', legendMode = 'true') {
    const chart = echarts.init(document.getElementById(id));
    chart.setOption({
        dataZoom: [{
            type: 'slider',
            filterMode: 'filter'
        },],
        legend: {
            top: 0,
            data: series.map(i => i.name),
            selectedMode: legendMode
        },
        tooltip: {
            ...tooltip,
            formatter: "{b}<br>{a}: {c}"
        },
        xAxis: {
            boundaryGap: false,
            type: 'category',
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            data: xAxisData
        },
        yAxis: {
            type: 'value',
            splitArea: {
                show: true
            },
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            name: yAxisName
        },
        series: series.map(i => ({
            ...i,
            type: 'line',
            showAllSymbol: true
        })),
        color
    });
}

export function setPie(data, title, id = 'pie') {
    const chart = echarts.init(document.getElementById(id));
    chart.setOption({
        title: {
            text: title
        },
        tooltip: {
            ...tooltip,
            formatter: "{b}: ¥{c}<br>所占比例{d}%"
        },
        legend: {
            bottom: 0,
            data: data.map(i => i.name)
        },
        series: [{
            type: 'pie',
            radius: ['40%', '60%'],
            data
        }],
        color
    })
}

export function setBar(data, yAxisName, xAxisData, id = 'bar') {
    const chart = echarts.init(document.getElementById('bar'));
    chart.setOption({
        tooltip: {
            ...tooltip,
            formatter: "{b}: {c}"
        },
        dataZoom: [{
            type: 'slider',
            filterMode: 'filter'
        },],
        xAxis: {
            type: 'category',
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            data: xAxisData
        },
        yAxis: {
            type: 'value',
            splitArea: {
                show: true
            },
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            name: yAxisName
        },
        series: [{
            type: 'bar',
            data: data,
            itemStyle: {
                normal: {
                    color: '#82beff',
                    barBorderRadius: 2
                }
            },
            barWidth: 16,
            label: {
                normal: {
                    formatter: '{c}',
                    show: true,
                    position: 'top',
                    textStyle: {
                        color: '#000'
                    }
                }
            }
        }]
    });
}