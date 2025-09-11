import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { oelView } from '../../utils/distribution'

class HeatChart extends React.Component {
    constructor(props) {
        super(props)
        this.data = this.props.list
        this.title = this.props.title
        this.dispatch = this.props.dispatch
        this.loading = this.props.loading
        this.appName = this.props.appName
        this.acknowleged = this.props.acknowleged
    }

    componentWillReceiveProps(props) {
        this.data = this.props.list
        this.title = this.props.title
        this.appName = this.props.appName
        this.acknowleged = this.props.acknowleged
    }

    getOtion() {
        let hours = ['', '', '', '', '', '', '']

        let days = ['DWDM', '存储设备', '网络相关',
            '主机', '数据库', '中间件', '应用可用性', '应用系统']

        let data = this.data.map((item) => {
            return [item[1], item[0], item[4], item[2], item[3], item[5], item[6], item[7], item[8]]
        })

        const option = {
            tooltip: {
                formatter(params) {
                    let res = ''
                    if (params.value[2] === 9) {
                        res = '告警请求失败'
                    } else if (params.value[2] === 8) {
                        res = '没有请求到告警'
                    } else if (params.value[2] === 1) {
                        res = '告警级别：一级故障'
                    } else if (params.value[2] === 2) {
                        res = '告警级别：二级告警'
                    } else if (params.value[2] === 3) {
                        res = '告警级别：三级预警'
                    } else if (params.value[2] === 4) {
                        res = '告警级别：四级提示'
                    } else if (params.value[2] === 5) {
                        res = '告警级别：五级信息'
                    }
                    return res
                },
            },
            animation: true,
            grid: {
                height: '100%',
                y: '0%',
            },
            xAxis: {
                type: 'category',
                data: hours,
            },
            yAxis: {
                type: 'category',
                data: days,
                splitArea: {
                    show: true,
                },
            },
            visualMap: {
                type: 'piecewise',
                splitNumber: 2,
                pieces: [
                    {
                        value: 100,
                        color: '#68228B',
                    },
                    {
                        value: 1,
                        color: '#C50000',
                    },
                    {
                        value: 2,
                        color: '#B56300',
                    },
                    {
                        value: 3,
                        color: '#CDCD00',
                    },
                    {
                        value: 4,
                        color: '#4F94CD',
                    },
                    {
                        value: 5,
                        color: '#68228B',
                    },
                    {
                        value: 8,
                        color: 'gray',
                    },
                    {
                        value: 9,
                        color: 'black',
                    },
                ],

                dimension: 2,
                align: 'left',
                show: false,
                orient: 'horizontal', //'vertical'  horizontal
                left: 'right', //center
                top: 'top',
                bottom: '15%',
            },
            series: [{
                name: '告警数',
                type: 'heatmap',
                data,
                label: {
                    normal: {
                        show: true, //是否显示叉叉
                        formatter(v) {
                            let res = `${v.value[3]} [${v.value[7]}]`.split('')
                            let str = ''
                            for (let index = 1; index <= res.length; index++) {
                                str += res[index - 1]
                                if (index % 16 == 0)  str += '\n'
                            }
                            return str
                        },
                    },
                    extraCssText: 'width:120px;white-space:pre-wrap'
                },
                itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        borderWidth: 10,
                        borderType: 'solid',
                    },
                    /*
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                    */
                },
            }],
        }
        return option
    }

    onChartClick(event) {
        let preFilter = ''

        if (event.data[5] !== undefined && event.data[5] !== '') {
            preFilter += ` AND N_AppName='${event.data[5]}'`
        }
        if (event.data[6] !== undefined && event.data[6] !== '' && event.data[6] !== 'all') {
            preFilter += ` AND Acknowledged=${event.data[6]}`
        }
        if (event.data[8] !== undefined && event.data[8] !== '') {
            preFilter += ` AND FirstOccurrence>='${event.data[8]}'`
        }
        preFilter = `preFilter=${preFilter}`

        window.open(`/oel?${preFilter}&oelFilter=${event.data[4]}&oelViewer=${oelView}&filterDisable=true&title=${event.data[3]}`, `${event.data[4]}`, '', 'false')
    }

    render() {
        let onEvents = {
            click: this.onChartClick,
        }
        return (<ReactEcharts option={
            this.getOtion()
        }
            style={
                {
                    height: '600px',
                    width: '100%',
                }
            }
            onEvents={onEvents}
        />
        )
    }
}

export default HeatChart
