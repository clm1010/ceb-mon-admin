import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { Col, Icon, Row } from 'antd'
import style from './index.less'

class bar extends React.Component {
  constructor (props) {
    super(props)
    this.state.historyNum = this.props.hisroryNum
    this.state.oelNum = this.props.seriesData
    this.state.x = this.props.xdata
  }

  state = {
    historyNum: [],
    oelNum: [],
    x: [],
    setIntervalNum: 0,
  }

  //点击事件
  onChartClick = (e) => {
    if (e.seriesName === '历史告警') {
      switch (e.name) {
        case '蜜罐F5':
          this.props.dispatch({
            type: 'monitorSummary/queryHistory',
            payload: {
              q: 'select * from reporter_status where N_SummaryCN like \'%安全告警：F5设备%\'  and N_MaintainStatus =0',
            },
          })
          break
        case '全流量':
          this.props.dispatch({
            type: 'monitorSummary/queryHistory',
            payload: {
              q: 'select * from reporter_status where  N_SummaryCN like \'%攻击类型%\' and N_MaintainStatus =0 and N_CustomerSeverity < 4',
            },
          })
          break
        case '登录失败':
          this.props.dispatch({
            type: 'monitorSummary/queryHistory',
            payload: {
              q: 'select * from reporter_status where N_CustomerSeverity < 4  and N_AppName !=\'统一监控管理平台（UMP）\' and N_MaintainStatus =0 and (N_SummaryCN like \'%01017%\' or  N_SummaryCN like \'%堡垒机%\'  or N_SummaryCN like \'%系统用户登陆失败报警%\' )',
            },
          })
          break
        case '异常端口':
          this.props.dispatch({
            type: 'monitorSummary/queryHistory',
            payload: {
              q: 'select * from reporter_status where (AlertGroup like \'%PortConnect%\' or N_SummaryCN like \'%异常流量警报%\' or N_SummaryCN like \'%windows服务器发现异常端口%\' ) and  N_MaintainStatus =0 and N_CustomerSeverity < 4 and N_AppName !=\'统一监控管理平台（UMP）\'',
            },
          })
          break
        case '异常连接':
          this.props.dispatch({
            type: 'monitorSummary/queryHistory',
            payload: {
              q: 'select * from reporter_status where (AlertGroup like \'%IpConnect%\' or N_SummaryCN like \'%SYN超阈值%\' or N_SummaryCN like \'%互联网web外网卡对外主动建链%\' or N_SummaryCN like \'%windows服务器发现异常外部IP连接%\' )  and N_MaintainStatus =0 and N_CustomerSeverity < 4 and N_AppName !=\'统一监控管理平台（UMP）\'',
            },
          })
          break
        default:
          this.props.dispatch({
            type: 'monitorSummary/queryHistory',
            payload: {
              q: 'select * from reporter_status where (N_SummaryCN like \'%WAF日志发现关键字报警%\' or N_SummaryCN like \'%护网应用安全检查发现异常%\' or N_SummaryCN like \'%MDlog%\' ) and N_CustomerSeverity < 4  and  N_MaintainStatus !=1',
            },
          })
          break
      }
    } else {
      switch (e.name) {
        case '蜜罐F5':
          window.open(`/oel?oelFilter=${this.props.f5Filter}&oelViewer=${this.props.viewFilter}&filterDisable=true&title=${this.props.f5Title}`, `${this.props.oelFilter}`, '', 'false')
          break
        case '全流量':
          window.open(`/oel?oelFilter=${this.props.folwFilter}&oelViewer=${this.props.viewFilter}&filterDisable=true&title=${this.props.folwTitle}`)
          break
        case '登录失败':
          window.open(`/oel?oelFilter=${this.props.loginFilter}&oelViewer=${this.props.viewFilter}&filterDisable=true&title=${this.props.loginTitle}`)
          break
        case '异常端口':
          window.open(`/oel?oelFilter=${this.props.portFilter}&oelViewer=${this.props.viewFilter}&filterDisable=true&title=${this.props.portTitle}`)
          break
        case '异常连接':
          window.open(`/oel?oelFilter=${this.props.connectFilter}&oelViewer=${this.props.viewFilter}&filterDisable=true&title=${this.props.connectTitle}`)
          break
        default:
          window.open(`/oel?oelFilter=${this.props.middleFilter}&oelViewer=${this.props.viewFilter}&filterDisable=true&title=${this.props.middleTitle}`)
          break
      }
    }
    //window.open(`/oel?oelFilter=8414df37-77b4-4a6b-9b19-6b7b7dc48ed1&oelViewer=e6501413-f909-4dac-8a17-e7bd3d056b3f&filterDisable=true&title=总行_超时待接管告警`)
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

  //更新时调用
  componentWillReceiveProps (nextProps) {
    this.state.historyNum = nextProps.hisroryNum
    this.state.oelNum = nextProps.seriesData
    this.state.x = nextProps.xdata
  }

  //关闭页面清理请求函数
  componentWillUnmount () {
    clearInterval(this.state.setIntervalNum)
  }

  render () {
    return (
      <div>
        {
          this.props.showLoading && this.props.xdata.length > 0 ?
            <div>
              <div style={{textAlign: 'center', fontSize: '40px', color: '#FFFFFF', fontWeight: 'bold'}}
              >运维安全监控视图
              </div>
              <ReactEcharts
                option={{
                  title: {
                    x: 'center',
                    text: this.props.title,
                    show: false,
                    textStyle: {
                      fontSize: 35,
                      color: '#FFFFFF',
                    },
                  },
                  tooltip: {
                    trigger: 'item',
                  },
                  toolbox: {
                    show: false,
                    feature: {
                      dataView: { show: true, readOnly: false },
                      restore: { show: true },
                      saveAsImage: { show: true },
                    },
                  },
                  calculable: true,
                  grid: {
                    borderWidth: 0,
                    x: '40',
                    y: '40',
                    x2: '1',
                    y2: '20',
                  },
                  xAxis: [
                    {
                      type: 'category',
                      show: true,
                      data: this.state.x,
                      axisLine: {
                        lineStyle: {
                          type: 'solid',
                          color: '#FFFFFF',
                          width: '2',
                        },
                      },
                    },
                  ],
                  yAxis: [
                    {
                      type: 'value',
                      show: true,
                      axisLine: {
                        lineStyle: {
                          type: 'solid',
                          color: '#FFFFFF',
                          width: '2',
                          fontSize: 10,
                        },
                      },
                      max (value) {
                        return value.max + 10
                      },
                    },
                  ],
                  series: [
                    {
                      name: '监控统计',
                      type: 'bar',
                      itemStyle: {
                        normal: {
                          color (params) {
                            // build a color map as your need.
                            let colorList = [
                              '#ed433c', '#f56a00', '#febe2d', '#1f90e6', '#800080', '#52c41a',
                            ]
                            return colorList[params.dataIndex]
                          },
                          barBorderRadius: 5,
                          label: {
                            show: true,
                            position: 'top',
                            formatter: '未关闭\n{c}',
                            textStyle: {
                              color: '#FFFFFF',
                              fontSize: 15,
                            },
                          },
                        },
                      },
                      data: this.state.oelNum,
                      markPoint: {
                        tooltip: {
                          backgroundColor: 'rgba(0,0,0,0)',
                        },
                      },
                    },
                    {
                      name: '历史告警',
                      type: 'bar',
                      itemStyle: {
                        normal: {
                          color (params) {
                            // build a color map as your need.
                            let colorList = [
                              '#ed433c', '#f56a00', '#febe2d', '#1f90e6', '#800080', '#52c41a',
                            ]
                            return colorList[params.dataIndex]
                          },
                          barBorderRadius: 5,
                          label: {
                            show: true,
                            position: 'top',
                            formatter: '当日累计\n{c}',
                            textStyle: {
                              color: '#FFFFFF',
                              fontSize: 15,
                            },
                          },
                        },
                      },
                      data: this.state.historyNum,
                      markPoint: {
                        tooltip: {
                          backgroundColor: 'rgba(0,0,0,0)',
                        },
                      },
                    },
                  ],
                }}
                onEvents={this.onEvents}
                opts={{ renderer: 'canvas', width: 'auto', height: `${this.props.heightBar}` }}
              />
            </div>
            :
            <div style={{ minHeight: `${this.props.heightBar - '10px'}` }}>
              <Row>
                <Col>
                  <div className={style.icontBar}>
                    <Icon type={this.props.showLoading ? 'bar-chart' : 'check-circle'} style={{ fontSize: 150, color: this.props.showLoading ? '#00D2DB' : '#87DC49' }} spin={false} />
                    <p style={{ paddingTop: '5px' }}>{this.props.showLoading ? '暂无数据' : '暂未发生告警' }</p>
                  </div>
                </Col>
              </Row>
            </div>
        }
      </div>
    )
  }
}

export default bar
