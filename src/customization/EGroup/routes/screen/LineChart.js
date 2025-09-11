import React from 'react'
import ReactEcharts from 'echarts-for-react'
import oelConfig from "./OelFilterConfig";

class Linechart extends React.Component {

  constructor(props) {
    super(props)
  }

  state={
    lineData:[0],
    coreA : 0,
    coreB : 0,
    coreC : 0,
    coreD : 0,
    storageAYD : 0,
    storageALT : 0,
    storageBLT : 0,
    storageBYD : 0,
    autoPlay : 0,
  }

  querys=()=>{
    this.state.autoPlay = setInterval(() => {
      this.props.dispatch({
        type: 'screen/queryDWDMBreakUpAlarms',
        payload: {
          uuid:this.props.uuid,
        }
      })
    }, 60000);
  }

  componentDidMount(){
    this.querys()
  }

  componentWillReceiveProps(nextProps) {
    //console.log(nextProps)
    this.state.lineData = nextProps.lineData;
    this.state.coreA = nextProps.coreA,
    this.state.coreB = nextProps.coreB,
    this.state.coreC = nextProps.coreC,
    this.state.coreD = nextProps.coreD,
    this.state.storageAYD = nextProps.storageAYD,
    this.state.storageALT = nextProps.storageALT,
    this.state.storageBLT = nextProps.storageBLT,
    this.state.storageBYD = nextProps.storageBYD
  }

  componentWillUnmount() {
    clearInterval(this.state.autoPlay)
  }

  winOpenView = (oelFilter, oelViewer, title)=>{
    let url = './oel?oelFilter='+ oelFilter
      + '&oelViewer=' + oelViewer
      + '&filterDisable=true'
      + '&title=' + title
    let obj = window.open(url, title, 'width=1024,height=768,top=80,left=120')
    obj.document.title = title
  };

  onClicks = (e) => {
    if('lines' === e.seriesType){
      this.winOpenView(oelConfig.DWDMDevice.lineOelFilter, oelConfig.commonConfig.oelViewer,
        oelConfig.DWDMDevice.lineTitle)
    }
  };

  onEvents = {
    'click': this.onClicks,
  };

  getOtion() {
    let option = {
      backgroundColor: {
        type: 'linear',
        x: 1,
        y: 1,
        x2: 1,
        y2: 1,
        colorStops: [{
          offset: 0, color: '#000' // 0% 处的颜色
        }, {
          offset: 1, color: '#091732' // 100% 处的颜色
        }],
        globalCoord: true // 缺省为 false
      },
      title: {
        text: '数据中心互联DWDM裸光健康状态',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip: {},
      xAxis: {
        type : 'value',
        boundaryGap : false,
        show: false,
      },
      yAxis: {
        type : 'value',
        show: false,
      },
      series: [
        {
          type: 'graph',
          layout: 'none',
          coordinateSystem: 'cartesian2d',
          symbolSize: 100,
          symbol: 'image:///build.png',
          //symbolRotate:90,
          itemStyle:{
            normal:{
              color:'#C0C0C0',
            }
          },
          label: {
            normal: {
              show: true,
              rotate:90,
              color:'#1E90FF',
              fontSize:18,
            }
          },
          data: [{
            name: '上地机房',
            value: [-10, -4],
            tooltip:{
              formatter:'上地机房'
            },
            label: {
              normal: {
                position:'top'
              }
            }
          }, {
            name: '酒仙桥机房',
            value: [16, -4],
            tooltip:{
              formatter:'酒仙桥机房'
            },
            label: {
              normal: {
                position:'top'
              }
            }
          }],
        },
        {
          type: 'graph',
          layout: 'none',
          coordinateSystem: 'cartesian2d',
          symbolSize: 50,
          symbol: 'image:///rt.png',
          label: {
            normal: {
              show: true,
              position:'left',
              color:'#fff',
              fontSize:16,
            }
          },
          data: [
            {
              name: '核心A',
              value: [-2, 20],
              tooltip:{
                formatter:'核心A'
              },
            }, {
              name: '核心A ',
              value: [8, 20],
              tooltip:{
                formatter:'核心A'
              },
              label: {
                normal: {
                  show: true,
                  position:'right',
                }
              },
            },{
              name: '核心B',
              value: [-2, 12],
              tooltip:{
                formatter:'核心B'
              }
            }, {
              name: '核心B ',
              value: [8, 12],
              tooltip:{
                formatter:'核心B'
              },
              label: {
                normal: {
                  position:'right',
                }
              },
            },{
              name: '核心C',
              value: [-2, 4],
              tooltip:{
                formatter:'核心C'
              }
            }, {
              name: '核心C ',
              value: [8, 4],
              tooltip:{
                formatter:'核心C'
              },
              label: {
                normal: {
                  position:'right',
                }
              },
            },{
              name: '核心D',
              value: [-2, -4],
              tooltip:{
                formatter:'核心D'
              }
            }, {
              name: '核心D ',
              value: [8, -4],
              tooltip:{
                formatter:'核心D'
              },
              label: {
                normal: {
                  position:'right',
                }
              },
            },{
              name: '存储A',
              value: [-2, -16],
              tooltip:{
                formatter:'存储A'
              }
            }, {
              name: '存储A ',
              value: [8, -16],
              tooltip:{
                formatter:'存储A'
              },
              label: {
                normal: {
                  position:'right',
                }
              },
            },{
              name: '存储B',
              value: [-2, -28],
              tooltip:{
                formatter:'存储B'
              }
            }, {
              name: '存储B ',
              value: [8, -28],
              tooltip:{
                formatter:'存储B'
              },
              label: {
                normal: {
                  position:'right',
                }
              },
            }],
        },
        {
          name: 'lineDemo',
          type: 'lines',
          symbol: ['none', 'none'],
          symbolSize: 10,
          coordinateSystem: 'cartesian2d',
          label: {
            show: true
          },
          lineStyle: {
            normal: {
              color:'#00CD00',
              width: 2,
              opacity: 1,
              curveness: 0
            }
          },
          data: [
            {
              name: '中国联通',
              coords: [[-2, 20],[8, 20]],
              lineStyle: {
                normal: {
                  color:this.state.coreA === 1?'#f00':'#00CD00',
                  width: 3,
                }
              },
            },{
              name: '共建恒业',
              coords: [[-2, 12],[8, 12]],
              lineStyle: {
                normal: {
                  color:this.state.coreB === 1?'#f00':'#00CD00',
                  width: 3,
                }
              },
            },{
              name: '歌华有线',
              coords: [[-2, 4],[8, 4]],
              lineStyle: {
                normal: {
                  color:this.state.coreC === 1?'#f00':'#00CD00',
                  width: 3,
                }
              },
            },{
              name: '中国联通',
              coords: [[-2, -4],[8, -4]],
              lineStyle: {
                normal: {
                  color:this.state.coreD === 1?'#f00':'#00CD00',
                  width: 3,
                }
              },
            }
            ,{
              name: '中国移动',
              coords: [[-2, -18], [8, -18]],
              lineStyle: {
                normal: {
                  color:this.state.storageAYD === 1?'#f00':'#00CD00',
                  width: 3,
                }
              },
            },
            {
              name: '中国联通',
              coords: [[8, -15], [-2, -15]],
              lineStyle: {
                normal: {
                  color:this.state.storageALT === 1?'#f00':'#00CD00',
                  width: 3,
                }
              },
            },
            {
              name: '中国联通',
              coords: [[8, -27], [-2, -27]],
              lineStyle: {
                normal: {
                  color:this.state.storageBLT === 1?'#f00':'#00CD00',
                  width: 3,
                }
              },
            },
            {
              name: '中国移动',
              coords: [[-2, -30], [8, -30]],
              lineStyle: {
                normal: {
                  color:this.state.storageBYD === 1?'#f00':'#00CD00',
                  width: 3,
                }
              },
            }
          ]
        },
        {
          zlevel: 20,
          type: 'scatter',
          symbol: 'circle',
          label: {
            normal: {
              show: true,
              formatter: function(param) {
                return param.data[2];
              },
              color: '#fff',
              fontSize: 10
            },
          },
          itemStyle: {
            normal: {
              //opacity:0.1
              color: '#07203F',
              // fontSize:20
            },
          },
          data: [
            [3, 22, '中国联通'],
            [3, 14, '共建恒业'],
            [3, 6, '歌华有线'],
            [3, -2, '中国联通'],
            [3, -14, '中国联通'],
            [3, -17, '中国移动'],
            [3, -26, '中国联通'],
            [3, -29, '中国移动'],
          ],
        }
      ]
    };
    return option
  }

  render() {
    return ( <
        ReactEcharts option = {
        this.getOtion()
      }
                     onEvents={this.onEvents}
                     style = {
                       {
                         height: '400px',
                         width: '100%',
                         backgroundColor:'#091732'
                       }
                     }
      />
    )
  }
}

export default Linechart
