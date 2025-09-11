import React from 'react'
import ReactEcharts from 'echarts-for-react'
import branchCfg from '../utils/branch.js'
import oelConfig from './OelFilterConfig'
import { getScreenTitleByNameAndValue } from '../../../../services/screen'

class Barchart extends React.Component {

  constructor(props) {
    super(props)
    this.alerts = this.props.alerts;
    this.state.alerts = this.props.alerts;
  }

  state={
    alerts:[],
    autoPlay : 0,
    lineWidth :10,
  }

  querys=()=>{
    this.state.autoPlay = setInterval(() => {
      this.props.dispatch({
        type: 'screen/queryBarcharts',
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
    this.state.alerts = nextProps.alerts
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
    if('node' === e.dataType){
      this.winOpenView(oelConfig.backBoneNetWord.nodeOelFilter, oelConfig.commonConfig.oelViewer,
        oelConfig.backBoneNetWord.nodeTitle)
    }else if('edge' === e.dataType){
      this.winOpenView(oelConfig.backBoneNetWord.lineOelFilter, oelConfig.commonConfig.oelViewer,
        oelConfig.backBoneNetWord.lineTitle)
    }

  };

  onEvents = {
    'click': this.onClicks,
  };

  getOtion() {
    let cities = []
    let lines = []
    let resultset = []
    let alertTemp = this.state.alerts
    //console.log(alertTemp)
    if (alertTemp != undefined && alertTemp != '') {
      if (this.state.alerts[0].success === true) {
        resultset = this.state.alerts[0].resultset
      }
    }

    for ( const city of branchCfg ) {
      let n_customerSeverity = -1
      let nodeColor = '#00CD00'
      let lineColorSD = '#00CD00'
      let lineColorJX = '#00CD00'
      let lineColorWH = '#00CD00'
      resultset.forEach((item) => {
        if (item.N_OrgId === city.key) {
          n_customerSeverity = item.Severity
          // item.lineColorSD( 0 绿色, 1 红色(中断)， 2 黄色(丢包，响应时间高于))
          if(item.lineColorSD === 1){
            lineColorSD = '#f00'
          }else if(item.lineColorSD === 2) {
            lineColorSD = '#ffff00'
          }
          if(item.lineColorJX === 1){
            lineColorJX = '#f00'
          }else if(item.lineColorJX === 2) {
            lineColorJX = '#ffff00'
          }
          if(item.lineColorWH === 1){
            lineColorWH = '#f00'
          }else if(item.lineColorWH === 2) {
            lineColorWH = '#ffff00'
          }
          // lineColorSD = item.lineColorSD === 1?'#f00':lineColorSD
          // lineColorJX = item.lineColorJX === 1?'#f00':lineColorJX
          // lineColorWH = item.lineColorWH === 1?'#f00':lineColorWH
        }
      })
      switch (n_customerSeverity){
        case 1 :
          nodeColor = 'orange'
          break
        case 2 :
          nodeColor = 'orange'
          break
        case 3 :
          nodeColor = 'yellow'
          break
        case 4 :
          nodeColor = 'blue'
          break
        case 100 :
          nodeColor = 'purple'
          break
        default:
          nodeColor = '#00CD00'
      }

      cities.push( {
        name: city.value,
        symbolSize:city.size,
        label: {
          normal: {
            textStyle: {
              //fontFamily: '宋体',
              fontSize:20
            },
            color:city.color,
          }},
        itemStyle: {
          normal: {
            color: nodeColor,
            borderColor: '#fff',
            borderWidth: 2
          }
        },
      } )
      if(city.value !== '香港' && city.value !== '悉尼' && city.value !== '首尔' && city.value !== '卢森堡' && city.value !== '武汉灾备中心'){
        lines.push ({
          source: city.value,
          target: '武汉灾备中心',
          name: '',
          tooltip: {
            trigger: 'item',
            formatter: function(params, ticket, callback) {
              return params.data.name;
            }
          },
          lineStyle: {
            normal: {
              width: lineColorWH === '#00CD00' ? 1.0 : this.state.lineWidth,
              curveness: 0.2,
              opacity: lineColorWH === 0 ? 0 : 0.5,
              color: lineColorWH
            }
          },
          effect: {
            show: true,
            constantSpeed: 30,
            symbol: 'arrow',
            symbolSize: 6,
            trailLength: 0,
          },
        })
      }
      if(city.value !== '酒仙桥机房' && city.value !== '上地机房' && city.value !== '武汉灾备中心' ){
        lines.push ({
          source: city.value,
          target: '酒仙桥机房',
          name: '',
          tooltip: {
            trigger: 'item',
            formatter: function(params, ticket, callback) {
              return params.data.name;
            }
          },
          lineStyle: {
            normal: {
              width: lineColorJX !== '#00CD00' ? this.state.lineWidth : 1.0,
              curveness: 0.2,
              opacity: lineColorJX === 0  ? 0 : 0.5,
              color: lineColorJX
            }
          }
        })
      }
      if(city.value !== '酒仙桥机房' && city.value !== '上地机房' && city.value !== '武汉灾备中心' ){
        lines.push ({
          source: city.value,
          target: '上地机房',
          name: '',
          tooltip: {
            trigger: 'item',
            formatter: function(params, ticket, callback) {
              return params.data.name;
            }
          },
          lineStyle: {
            normal: {
              width: lineColorSD !== '#00CD00' ? this.state.lineWidth : 1.0,
              curveness: 0.2,
              opacity: lineColorSD === 0 ? 0 : 0.5,
              color: lineColorSD
            }
          },
        })
      }

    }
    let title = getScreenTitleByNameAndValue('screen_title', 'barChart')
    let option = {
      title: {
        text: title,//'骨干网健康状态',
        textStyle: {
          color: '#fff'
        }
      },
      geo: {
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [{
        type: 'graph',
        tooltip: {},
        ribbonType: true,
        layout: 'circular',

        circular: {
          rotateLabel: true
        },
        symbolSize: 10,
        roam: true,
        focusNodeAdjacency: true,

        label: {
          normal: {
            position: 'center',
            fontWeight: 'bold',
            formatter: '{b}',
            normal: {
              textStyle: {
                fontFamily: '宋体'
              }
            }
          }
        },

        edgeSymbol: ['circle'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          normal: {
            textStyle: {
              fontSize: 13,
              fontWeight: 'bold',
              fontFamily: '宋体'
            }
          }
        },

        itemStyle: {
          normal: {
            label: {
              rotate: true,
              show: true,
              textStyle: {
                color: '#fff',
                fontWeight: 'bold'
              }
            },
            color: ["#393f51", "#393f51", "#393f51", "#393f51", "#393f51", "#393f51", "#393f51", "#85d6f7", "#85d6f7", "#85d6f7", "#85d6f7", "#85d6f7", "#85d6f7", "#85d6f7", "#85d6f7", "#85d6f7", "#85d6f7"] /* 内的颜色#393f51，外的颜色#85d6f7 */
          },
          emphasis: {
            label: {
              show: true
            }
          }
        },

        data: cities,
        links: lines,
      }]
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
                         height: '396px',
                         width: '100%'
                       }
                     }
      />
    )
  }
}

export default Barchart
