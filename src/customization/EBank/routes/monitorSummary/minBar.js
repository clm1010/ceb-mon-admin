import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { Icon, Row, Col } from 'antd'
import style from './index.less'
class minBar extends React.Component {
  constructor (props) {
    super(props)
    this.state.seriesData = this.state.seriesData
    this.state.yAxis = this.state.ydata
  }

  state = {
    seriesData: [],
    yAxis: [],
    setIntervalNum: 0,
  }

  //单击事件
  onChartClick = (e) => {

  }

  onEvents = {
    click: this.onChartClick,
  }

  querys = () => {
    this.state.setIntervalNum = setInterval(() => {
      this.props.dispatch({
        type: `monitorSummary/${this.props.path}`,
        payload: {
          uuid: this.props.uuid,
          sql: this.props.sql,
        },
      })
      // this.setState({
      //   showLoading:true
      // })
    }, 30000)
  }

  //初始化完开始调用
  componentDidMount () {
    this.querys()
  }

  //页面改变是更新数据
  componentWillReceiveProps (nextProps) {
    this.state.seriesData = nextProps.seriesData
    this.state.yAxis = nextProps.ydata
  }

  //关闭页面清理请求函数
  componentWillUnmount () {
    clearInterval(this.state.setIntervalNum)
  }

  render () {
    return (
      <div>
        {this.props.seriesData.length > 0 ?
          <ReactEcharts
            option={{
              title: {
                x: 'center',
                text: this.props.title,
                textStyle: {
                  padding: '1px',
                  color: '#FFFFFF',
                  fontSize: 24,
                },
              },
              tooltip: {
                trigger: 'item',
              },
              calculable: true,
              grid: {
                borderWidth: 0,
                x: '40',
                y: '40',
                x2: '1',
                y2: '20',
                //containLabel: true
              },
              xAxis: [
                {
                  type: 'value', //category
                  show: false,
                },
              ],
              yAxis: [
                {
                  type: 'category', //value
                  show: false,
                  data: this.state.yAxis,
                  axisLabel: {
                    rotate: 0,
                  },
                  axisLine: {
                    lineStyle: {
                      type: 'solid',
                      color: '#FFFFFF',
                      width: '2',
                    },
                  },
                },
              ],
              series: [
                {
                  name: 'TOP5-->应用告警分布',
                  type: 'bar',
                  itemStyle: {
                    normal: {
                      color (params) {
                        // build a color map as your need.
                        let colorList = [
                          '#800080', '#1f90e6', '#52c41a', '#f56a00', '#ed433c',
                        ]
                        return colorList[params.dataIndex]
                      },
                      barBorderRadius: 5,
                      label: {
                        show: true,
                        position: 'insideLeft',
                        formatter: '{c} {b}',
                        textStyle: {

                          fontSize: 15,
                          color: '#FFFFFF',
                        },
                      },
                    },
                  },
                  data: this.state.seriesData,
                  markPoint: {
                    tooltip: {
                      backgroundColor: 'rgba(0,0,0,0)',
                    },
                  },
                },
              ],
            }}
            onEvents={this.onEvents}
            /*showLoading={this.state.showLoading}*/
            style={{ height: `${this.props.heightBar}` }}
          />
          : <div style={{ height: `${this.props.heightBar}` }}>
            <div style={{ fontSize: 24, color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' }}>{this.props.title}</div>
            <Row>
              <Col>
                <div className={style.icont}>
                  <Icon type="bar-chart" style={{ fontSize: 100, color: '#00D2DB' }} spin={false} />
                  <p>暂无数据</p>
                </div>
              </Col>
            </Row>
          </div>
        }
      </div>
    )
  }
}

export default minBar
