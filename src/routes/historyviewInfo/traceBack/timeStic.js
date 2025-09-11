import React from "react"
import { Card, Select } from "antd"
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

class TimeStic extends React.Component {
    constructor(props) {
        super(props)
        this.state.CardType = props.traceBack.CardType
        this.state.q = props.traceBack.q
        this.state.TimeSticValues = props.traceBack.TimeSticValues
        this.state.appNameSelected = props.traceBack.appNameSelected
        this.state.StatisticsValues = props.traceBack.StatisticsValues
    }
    state = {
        CardType: 'alarmTotal',
        grain: 'minute'
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            CardType: nextProps.traceBack.CardType,
            q: nextProps.traceBack.q,
            TimeSticValues: nextProps.traceBack.TimeSticValues,
            appNameSelected: nextProps.traceBack.appNameSelected,
            StatisticsValues: nextProps.traceBack.StatisticsValues,
            grain: prevState.grain
        }
    }

    onTypeChange = (value) => {
        const appNameSelected = {}
        let app_q = ';('
        if (value == 'appName') {
            const appNameValues = this.state.StatisticsValues.n_appname_g
            appNameValues.forEach((element, index) => {
                app_q += `n_appname==${element.key} or `
                index < 3 ? appNameSelected[element.key == '' ? ' ' : element.key] = true : appNameSelected[element.key == '' ? ' ' : element.key] = false
            })
            app_q = app_q.substring(0, app_q.length - 3) + ')'
        }
        this.props.dispatch({
            type: 'traceBack/updateState',
            payload: {
                // CardType: value,
                appNameSelected
            }
        })
        if (value == 'appName') {
            this.props.dispatch({
                type: 'traceBack/queryGrain',
                payload: {
                    CardType: value,
                    q: this.state.q,
                    app_q,
                }
            })
        } else {
            this.props.dispatch({
                type: 'traceBack/queryGrain',
                payload: {
                    CardType: value,
                    q: this.state.q,
                }
            })
        }
    }
    onChartClick = (params) => {
        // 粒度 时间 类型
        let grain = this.state.grain
        let grainLong
        switch (grain) {
            case 'minute': grainLong = 60 * 1000
                break;
            case '10m': grainLong = 10 * 60 * 1000
                break;
            case '30m': grainLong = 30 * 60 * 1000
                break;
            case 'hour': grainLong = 60 * 60 * 1000
                break;
        }
        let time = params.name
        let startTime = moment(time).valueOf()
        let endTime = startTime + grainLong
        let q = this.state.q
        let CardType = this.state.CardType
        if (CardType == "alarmLeven") {
            switch (params.seriesName) {
                case '一级告警':
                    q += ";n_CustomerSeverity==1"
                    break;
                case '二级告警': q += ";n_CustomerSeverity==2"
                    break;
                case '三级告警':
                    q += ";n_CustomerSeverity==3"
                    break;
                case '四级告警': q += ";n_CustomerSeverity==4"
                    break;
                case '五级告警': q += ";n_CustomerSeverity==100"
                    break;
                default:
                    q += ";n_CustomerSeverity==100"
            }
        } else if (CardType == "alarmType") {
            q += `;n_ComponentType==${params.seriesName}`
        } else if (CardType == "appName") {
            q += `;n_AppName==${params.seriesName}`
        }
        /* 
            时间 firstOccurrence=timein=(2022-09-17T21:00:25,2022-09-24T21:00:25)
        */
        const a = moment(startTime / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
        const b = moment(endTime / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
        let _q = q.split(';').filter(e => !e.includes("timein")).filter(e => !e.includes("hiscope")).join(';')
        _q += `;firstOccurrence=timein=(${a},${b})`
        this.props.dispatch({
            type: 'traceBack/queryDetails',
            payload: {
                q: _q,
                pageSize: 100
            }
        })

    }
    onGrainChange = (params) => {
        this.setState({
            grain: params
        })
        if (this.state.CardType == 'appName') {
            let app_q = ';('
            const appNameValues = this.state.StatisticsValues.n_appname_g
            appNameValues.forEach((element) => {
                app_q += `n_appname==${element.key} or `
            })
            app_q = app_q.substring(0, app_q.length - 3) + ')'
            this.props.dispatch({
                type: 'traceBack/queryGrain',
                payload: {
                    grain: params,
                    CardType: this.state.CardType,
                    q: this.state.q,
                    app_q
                }
            })
        } else {
            this.props.dispatch({
                type: 'traceBack/queryGrain',
                payload: {
                    grain: params,
                    CardType: this.state.CardType,
                    q: this.state.q
                }
            })
        }
    }

    render() {
        const {
            GrainValues,
        } = this.state.TimeSticValues
        const {
            appNameSelected
        } = this.state
        const color = ['#f52656', '#f52686', '#f526e5', '#cc26f5', '#6c26f5', '#265cf5', '#2695f5', '#26d8f5', '#26f5b2', '#26f53f', '#f5e526', '#f5b526']
        let appTitleName = []
        const appNameValues = []
        /* 
            获取x轴数据
        */
        const xAxisValues = []
        const getXdata = (value) => {
            let data = value || []
            data.forEach(element => {
                xAxisValues.push(new Date(element.key * 1000).format('yyyy-MM-dd hh:mm:ss'))
            });
        }
        getXdata(GrainValues)

        const Trans = (value) => {
            let data = value || []
            let result = []
            data.forEach(element => {
                result.push(element.docCount)
            });
            return result
        }

        const Trans1 = (value, name) => {
            let data = value || []
            let resArr = []
            data.forEach((element) => {
                let aa = []
                if (element.aggregations && element.aggregations.length > 0) {
                    element.aggregations.filter(e => e.name == '')
                    aa = element.aggregations[0].buckets
                }
                let index = aa.findIndex(e => e.key == name)
                if (index != -1) {
                    resArr.push(aa[index].docCount)
                } else {
                    resArr.push(0)
                }
            })
            return resArr
        }
        /* 
            遍历获取应用系统,并设置值的类型,初始化值
        */
        const getAppName = (value) => {
            if (this.state.CardType == 'appName') {
                const data = value || []
                const sets = new Set()
                let n = 0
                data.forEach((element) => {
                    let aa = []
                    if (element.aggregations && element.aggregations.length > 0) {
                        // element.aggregations.filter(e =>e.name == 'grain_group')
                        aa = element.aggregations[0].buckets
                    }
                    aa.forEach((element) => {
                        if (element.key == '') {
                            sets.add(' ')
                        } else {
                            sets.add(element.key)
                        }
                    })
                })
                appTitleName = [...sets]
                appTitleName.forEach((value) => {
                    const obj = {
                        name: value,
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: color[n++]
                            }
                        },
                        data: []
                    }
                    appNameValues.push(obj)
                })
            }

        }
        getAppName(GrainValues)
        /* 
            遍历获取应用系统,并赋值
        */
        const Trans2 = (value) => {
            if (this.state.CardType == 'appName') {
                let data = value || []
                data.forEach((element) => {
                    let aa = []
                    if (element.aggregations && element.aggregations.length > 0) {
                        // element.aggregations.filter(e =>e.name == 'grain_group')
                        aa = element.aggregations[0].buckets
                    }
                    // let aa = element.grain_group ? element.grain_group.buckets : []
                    appNameValues.forEach((item) => {
                        item.data.push(0)
                    })
                    aa.forEach((element) => {
                        let index = appNameValues.findIndex(e => e.name == element.key || (e.name == ' ' && element.key == ''))
                        if (index != -1) {
                            appNameValues[index].data[appNameValues[index].data.length - 1] = element.docCount
                        }
                    })
                })
            }
        }
        Trans2(GrainValues)

        const TitleContent = (
            <div>
                <Select defaultValue='alarmTotal' value={this.state.CardType} style={{ width: 120 }} onChange={this.onTypeChange}>
                    <Select.Option value="alarmTotal">告警总数</Select.Option>
                    <Select.Option value="alarmLeven">告警级别</Select.Option>
                    <Select.Option value="alarmType">告警分类</Select.Option>
                    <Select.Option value="appName">应用系统</Select.Option>
                </Select>
            </div>
        )
        const ExtraContent = (
            <div>
                粒度：
                <Select defaultValue='minute' value={this.state.grain} style={{ width: 120 }} onChange={this.onGrainChange}>
                    <Select.Option value="minute">1分钟</Select.Option>
                    <Select.Option value="10m">10分钟</Select.Option>
                    <Select.Option value="30m">30分钟</Select.Option>
                    <Select.Option value="hour">1小时</Select.Option>
                </Select>
            </div>
        )
        const option = {
            tooltip: {},
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                top: '10%',
                containLabel: true
            },
            dataZoom: [{
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'empty',
            }
            ],
            xAxis: {
                type: 'category',
                data: xAxisValues,
                axisTick: {
                    alignWithLabel: true
                },
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: Trans(GrainValues),
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#eb2f96'
                        }
                    }
                }
            ]
        }
        const option1 = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['五级告警', '四级告警', '三级告警', '二级告警', '一级告警'],
            },
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                top: '10%',
                containLabel: true
            },
            dataZoom: [{
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'empty',
            }
            ],
            xAxis: {
                type: 'category',
                data: xAxisValues,
                axisTick: {
                    alignWithLabel: true
                },
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '五级告警',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '50%',
                    itemStyle: {
                        normal: {
                            color: '#722ed1'
                        }
                    },
                    data: Trans1(GrainValues, '100')
                },
                {
                    name: '四级告警',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '50%',
                    itemStyle: {
                        normal: {
                            color: '#1f90e6'
                        }
                    },
                    data: Trans1(GrainValues, '4')
                },
                {
                    name: '三级告警',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '50%',
                    itemStyle: {
                        normal: {
                            color: '#febe2d'
                        }
                    },
                    data: Trans1(GrainValues, '3')
                },
                {
                    name: '二级告警',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '50%',
                    itemStyle: {
                        normal: {
                            color: '#f56a00'
                        }
                    },
                    data: Trans1(GrainValues, '2')
                },
                {
                    name: '一级告警',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '50%',
                    itemStyle: {
                        normal: {
                            color: '#ed433c'
                        }
                    },
                    data: Trans1(GrainValues, '1')
                }
            ]
        }
        const option2 = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['操作系统', '数据库', '中间件', '存储', '硬件', '应用', '安全', '网络', '自检', '机房环境', '私有云', '桌面云'],
                selected: {
                    '操作系统': true, '数据库': true, '中间件': true, '存储': true, '硬件': true, '应用': true,
                    '安全': false, '网络': false, '自检': false, '机房环境': false, '私有云': false, '桌面云': false,
                }
            },
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                top: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: xAxisValues,
                axisTick: {
                    alignWithLabel: true
                },
            },
            yAxis: {
                type: 'value'
            },
            dataZoom: [{
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'empty',
            }
            ],
            series: [
                {
                    name: '操作系统',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: color[0]
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '25%',
                    data: Trans1(GrainValues, '操作系统')
                },
                {
                    name: '数据库',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: color[1]
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '25%',
                    data: Trans1(GrainValues, '数据库')
                },
                {
                    name: '中间件',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: color[2]
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '25%',
                    data: Trans1(GrainValues, '中间件')
                },
                {
                    name: '存储',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: color[3]
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '25%',
                    data: Trans1(GrainValues, '存储')
                },
                {
                    name: '硬件',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: color[4]
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '25%',
                    data: Trans1(GrainValues, '硬件')
                },
                {
                    name: '应用',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: color[5]
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '25%',
                    data: Trans1(GrainValues, '应用')
                },
                {
                    name: '安全',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: color[6]
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '25%',
                    data: Trans1(GrainValues, '安全')
                },
                {
                    name: '网络',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: color[7]
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '25%',
                    data: Trans1(GrainValues, '网络')
                },
                {
                    name: '自检',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: color[8]
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '25%',
                    data: Trans1(GrainValues, '自检')
                },
                {
                    name: '机房环境',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: color[9]
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '25%',
                    data: Trans1(GrainValues, '机房环境')
                },
                {
                    name: '私有云',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: color[10]
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '25%',
                    data: Trans1(GrainValues, '私有云')
                },
                {
                    name: '桌面云',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: color[11]
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    barMaxWidth: '25%',
                    data: Trans1(GrainValues, '桌面云')
                },
            ]
        }
        const option3 = {
            legend: {
                data: appTitleName,
                selected: appNameSelected,
                type: 'scroll',
                right: 10,
                left: 10,
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            dataZoom: [{
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'empty',
            }
            ],
            xAxis: {
                type: 'category',
                data: xAxisValues,
                axisTick: {
                    alignWithLabel: true
                },
            },
            yAxis: {
                type: 'value'
            },
            series: appNameValues
        }
        const onEvents = {
            'click': this.onChartClick
        }
        const alarmTotal = (
            <ReactEcharts option={option} notMerge={true} onEvents={onEvents} />
        )
        const alarmLeven = (
            <ReactEcharts option={option1} notMerge={true} onEvents={onEvents} />
        )
        const alarmType = (
            <ReactEcharts option={option2} notMerge={true} onEvents={onEvents} />
        )
        const appName = (
            <ReactEcharts option={option3} notMerge={true} onEvents={onEvents} />
        )
        const showByTime = () => {
            let showEchar
            switch (this.state.CardType) {
                case 'alarmTotal': showEchar = alarmTotal
                    break;
                case 'alarmLeven': showEchar = alarmLeven
                    break;
                case 'alarmType': showEchar = alarmType
                    break;
                case 'appName': showEchar = appName
                    break;
            }
            return showEchar
        }
        return (
            <div style={{ marginTop: 6, height: '25%' }}>
                <Card title={TitleContent} extra={ExtraContent} >
                    {showByTime()}
                </Card>
            </div>
        )
    }
}

export default TimeStic