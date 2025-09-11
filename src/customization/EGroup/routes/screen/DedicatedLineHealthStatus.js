import React from 'react'
import ReactEcharts from 'echarts-for-react'
import oelConfig from "./OelFilterConfig";
import lineConfig from './DedicatedLineHealthStatusConfig'

class DedicatedLineHealthStatus extends React.Component {

  constructor(props) {
    super(props)
  }

  state={
    lineHealthData:[],
    autoPlay : 0,
  };

  querys=()=>{
    this.state.autoPlay = setInterval(() => {
      this.props.dispatch({
        type: 'screen/queryDedicatedLineHealthStatus',
        payload: {
          uuid:this.props.uuid,
        }
      })
    }, 60000);
  };

  componentDidMount(){
    this.querys()
  }

  componentWillReceiveProps(nextProps) {
    this.state.lineHealthData = nextProps.lineHealthData;
  }

  componentWillUnmount() {
    clearInterval(this.state.autoPlay)
  }

  winOpenView = (oelFilter, oelViewer, title)=>{
    let url = './oel?oelFilter='+ oelFilter
      + '&oelViewer=' + oelViewer
      + '&filterDisable=true'
      + '&title=' + title;
    let obj = window.open(url, title, 'width=1024,height=768,top=80,left=120');
    obj.document.title = title
  };

  onClicks = (e) => {
    if('lines' === e.seriesType){
      this.winOpenView(oelConfig.DedicatedLineHealthStatus.lineOelFilter, oelConfig.commonConfig.oelViewer,
        oelConfig.DedicatedLineHealthStatus.lineTitle)
    }
  };

  onEvents = {
    'click': this.onClicks,
  };

  getColor=(room, line)=>{
    if('SD' === room){
      return line.lineColorSD;
    }else{
      return line.lineColorJX;
    }
  };

  getLocation=(room, SDLocation, JXLocation)=>{
    if('SD' === room){
      return SDLocation;
    }else{
      return JXLocation;
    }
  };

  getOtion() {
    let lineData = [];
    let rooms = [];
    let SDLocation = [1, -4];
    let JXLocation = [13,-4];
    rooms.push('SD');
    rooms.push('JX');
    let resultSet = lineConfig;
    if(this.state.lineHealthData.length !== 0){
      resultSet = this.state.lineHealthData
    }else{
      resultSet.map(item=>{
        item.lineColorSD='#00CD00';
        item.lineColorJX='#00CD00';
      })
    }
    for(let line of resultSet){
      for(let room of rooms){
        //console.log(room)
        lineData.push({
          //name: '中国联通',
          coords: [line.location,this.getLocation(room, SDLocation, JXLocation)],
          lineStyle: {
            normal: {
              color: this.getColor(room, line),
              width: this.getColor(room, line) !== '#00CD00'? 3.0:1.0,
            }
          },
        })
      }
    }

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
        text: '第三方专线健康状态',
        textStyle: {
          color: '#fff'
        }
      },
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
        // 上地，酒仙桥
        {
          type: 'graph',
          layout: 'none',
          coordinateSystem: 'cartesian2d',
          symbolSize: 70,
          symbol: 'image:///build.png',
          //symbolRotate:45,
          itemStyle:{
            normal:{
              color:'#C0C0C0',
            }
          },
          label: {
            normal: {
              show: true,
              rotate:45,
              color:'#1E90FF',
              fontSize:18,
            }
          },
          data: [{
            name: '上地机房',
            value: SDLocation,
            tooltip:{
              formatter:'上地机房'
            },
            label: {
              normal: {
                position: 'left'
              }
            }
          }, {
            name: '酒仙桥机房',
            value: JXLocation,
            tooltip:{
              formatter:'酒仙桥机房'
            },
            label: {
              normal: {
                position: 'right'
              }
            }
          }],
        },
        // 上半部分
        {
          type: 'scatter',
          layout: 'none',
          symbol: 'circle',
          symbolSize: 16,
          label: {
            normal: {
              show: true,
              position:'right',
              color:'#fff',
              fontSize:10,
              formatter: '{b}',
              rotate: 45
            }
          },
          tooltip:{
            formatter:'{b}'
          },
          itemStyle: {
            normal: {
              color: '#00CD00',
              borderColor: '#fff',
              borderWidth: 2
            }
          },
          data: [
            {
              name: '金融城域网LBS',
              value: [-10, 16]
            },
            {
              name: '金融城域网CCPC ',
                value: [-6, 19],
            },{
              name: '黄金交易所交易',
              value: [-2, 22],
            }, {
              name: '黄金交易所清算',
              value: [2, 25],
            },{
              name: '网联支付上海',
              value: [6, 25],
            },{
              name: '网联支付北京',
              value: [10, 25],
            },{
              name: '网联支付深圳',
              value: [14, 22],
            },{
              name: '信用卡石景山生产',
              value: [18, 19],
            },{
              name: '信用卡苏州灾备',
              value: [22, 16],
            },
          ],
        },
        // 下半部分
        {
          type: 'scatter',
          layout: 'none',
          symbol: 'circle',
          symbolSize: 16,
          label: {
            normal: {
              show: true,
              position:'right',
              color:'#fff',
              fontSize:12,
              formatter:'{b}',
              rotate: -45
            }
          },
          tooltip:{
            formatter:'{b}'
          },
          itemStyle: {
            normal: {
              color: '#00CD00',
              borderColor: '#fff',
              borderWidth: 2
            }
          },
          data: [
            {
              name: '电信短信平台',
              value: [-11, -26],
            }, {
              name: '移动短信平台 ',
              value: [-7, -29],
            },{
              name: '联通短信平台',
              value: [-3, -32],
            }, {
              name: '微信支付 ',
              value: [1, -35],
            },{
              name: '深圳通',
              value: [5, -35],
            }, {
              name: '腾讯财付通 ',
              value: [9, -35],
            },{
              name: '支付宝',
              value: [13, -35],
            },{
              name: '中国银联无卡支付 ',
              value: [17, -32],
            },{
              name: '中国银联',
              value: [21, -29],
            }, {
              name: '人民银行 ',
              value: [25, -26],
            }],
        },
        // 连线
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
          data: lineData,
        },
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

export default DedicatedLineHealthStatus
