import React from "react"
import { Row, Col, Card, List, Badge } from "antd"
import ReactEcharts from 'echarts-for-react';
import "./statistics.less"

class Statistics extends React.Component {
    constructor(props) {
        super(props)
        this.state.q = props.traceBack.q
        this.state.StatisticsValues = props.traceBack.StatisticsValues
    }
    state = {

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            q: nextProps.traceBack.q,
            StatisticsValues: nextProps.traceBack.StatisticsValues,
        };
    }
    onClick = (CardType) => {
        const appNameSelected = {}
        let app_q = ';('
        if (CardType == 'appName') {
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
                // CardType: CardType,
                appNameSelected
            }
        })
        if (CardType == 'appName') {
            this.props.dispatch({
                type: 'traceBack/queryGrain',
                payload: {
                    CardType: CardType,
                    q: this.state.q,
                    app_q
                }
            })
        } else {
            this.props.dispatch({
                type: 'traceBack/queryGrain',
                payload: {
                    CardType: CardType,
                    q: this.state.q
                }
            })
        }
    }
    dataTransPie = (value) => {
        let data = value || []
        let arr = []
        data.forEach(element => {
            const obj = {itemStyle:{normal:{}}}
            obj.value = element.docCount
            switch (element.key) {
                case '100': obj.name = '五级信息', obj.itemStyle.normal.color = '#722ed1'
                    break;
                case '4': obj.name = '四级提示', obj.itemStyle.normal.color = '#1f90e6'
                    break;
                case '3': obj.name = '三级预警', obj.itemStyle.normal.color = '#febe2d'
                    break;
                case '2': obj.name = '二级告警', obj.itemStyle.normal.color = '#f56a00'
                    break;
                case '1': obj.name = '一级故障', obj.itemStyle.normal.color = '#ed433c'
                    break;
            }
            arr.push(obj)
        })
        return arr
    }
    dataTranscategory = (value, Axis) => {
        let data = value || []
        let xAxis = [], yAxis = []
        data.forEach((item) => {
            xAxis.push(item.key)
            yAxis.push(item.docCount)
        })
        return Axis == "xAxis" ? xAxis : yAxis
    }
    render() {
        const bodyStyle = {
            height: "180px",
            // paddingTop: '40px'
        }
        const bodyStyleToal = {
            color: '#e60012',
            fontSize: 60,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
        const headStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
        const option = {
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    type: 'pie',
                    data: this.dataTransPie(this.state.StatisticsValues.n_customerseverity_g),
                    label: {
                        normal: {
                            formatter: '{b}:{c}' + '\n\r' + '({d}%)',
                            show: true,
                            position: 'left'
                        },
                    },
                    center: ['50%', '60%'],
                    radius: '60%',
                }
            ]

        }
        const option1 = {
            tooltip: {},
            color: ['#eb2f96'],
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                top: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.dataTranscategory(this.state.StatisticsValues.n_ComponentType_g, "xAxis"),
                axisTick: {
                    alignWithLabel: true
                },
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: this.dataTranscategory(this.state.StatisticsValues.n_ComponentType_g, "yAxis"),
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#000000',
                                },
                                position: 'top',
                            },
                        },
                    },
                }
            ]
        }
        return (
            <div style={{ height: '30%' }}>
                <Row gutter={[8, 4]} >
                    <Col span={6}>
                        <Card title="告警总数" bordered={false} onClick={() => this.onClick('alarmTotal')} hoverable={true} headStyle={headStyle} bodyStyle={{ ...bodyStyle, ...bodyStyleToal }}>
                            <div >{this.state.StatisticsValues.totalNum}</div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="告警级别" bordered={false} onClick={() => this.onClick('alarmLeven')} hoverable={true} headStyle={headStyle} bodyStyle={{ ...bodyStyle }}>
                            <ReactEcharts option={option} style={{ height: '100%' }} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="告警分类" bordered={false} onClick={() => this.onClick('alarmType')} hoverable={true} headStyle={headStyle} bodyStyle={{ ...bodyStyle }}>
                            <ReactEcharts option={option1} style={{ height: '100%' }} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="应用系统" bordered={false} onClick={() => this.onClick('appName')} hoverable={true} headStyle={headStyle} bodyStyle={{ ...bodyStyle }}>
                            <List
                                className="appName"
                                dataSource={this.state.StatisticsValues.n_appname_g}
                                size="small"
                                split={false}
                                renderItem={(item, index) => (
                                    <List.Item >
                                        <>
                                            {index >= 3 ?
                                                <span style={{ display: "inline-block", width: '25%' }}>{index + 1}</span> :
                                                <span style={{ display: "inline-block", width: '25%' }}>
                                                    <Badge
                                                        count={index + 1}
                                                        style={{ backgroundColor: '#fff', color: '#eb2f96', boxShadow: '0 0 0 1px #eb2f96 inset' }}
                                                    />
                                                </span>

                                            }
                                            <span style={{ display: "inline-block", width: '50%' }}>{item.key}</span>
                                            <span style={{ display: "inline-block", width: '25%' }}>{item.docCount}</span>
                                        </>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Statistics