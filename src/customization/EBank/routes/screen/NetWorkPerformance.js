import React from 'react'
import ReactEcharts from "echarts-for-react";
import oelConfig from "./OelFilterConfig";
import { getScreenTitleByNameAndValue } from '../../../../services/screen'

class NetWorkPerformance extends React.Component {
    constructor(props) {
        super(props)
      }

    state = {
      autoPlay: 0,
      values:[]
    }

    querys=()=>{
      this.state.autoPlay = setInterval(() => {
        this.props.dispatch({
          type: 'screen/queryNetWorkPerformance',
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
      this.state.values = nextProps.netWorkPerformance;
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
      if(e.data[2] > 0){
        this.winOpenView(oelConfig.netWorkPerformance.nodeOelFilter, oelConfig.commonConfig.oelViewer,
          oelConfig.netWorkPerformance.nodeTitle)
      }
    };

    onEvents = {
      'click': this.onClicks,
    };

    getOtion() {
        let title = getScreenTitleByNameAndValue('screen_title', 'netWorkPerformance')
        let date = []
        for(let item of this.state.values){
          date.push(
            [item.titleLocation[0],item.titleLocation[1], item.key],
            [item.numLocation[0],item.numLocation[1], item.num === undefined ? 0 : item.num],
          )
        }
        let option = {
          title: {         //标题组件
            text: title,//'网络安全域告警(1,2级)',
            left: 'left',
            top: 'top',
            textStyle: {
              color: '#fff'
            }
          },
          xAxis: {
            show:false,
            min: -1,
            max: 11
          },
          yAxis: {
            show:false,
            min: -17,
            max: 15
          },
          series: [
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
                color: '#1E90FF',
                fontSize: 15,
                fontWeight:'bold'
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
              [0, 14, '区域名称'],
              [4, 14, '告警'],
              [7, 14, '区域名称'],
              [11, 14, '告警'],
            ],
          },
            {
              data: date,
              //   [
              //   [-1.1, 10, '核心交换域'],
              //   [4, 10, this.state.values[0] === 0? 0:this.state.values[0] ],
              //   [5.8, 10, '骨干网络域'],
              //   [11, 10, this.state.values[1] === 0?0:this.state.values[1]],
              //
              //   [-1.1, 6, '生产服务域'],
              //   [4, 6, this.state.values[2] === 0?0:this.state.values[2]],
              //   [5.8, 6, '海外分行域'],
              //   [11, 6, this.state.values[3] === 0?0:this.state.values[3]],
              //
              //   [-1.1, 2, '业务服务域'],
              //   [4,  2, this.state.values[4] === 0?0:this.state.values[4]],
              //   [5.8,2, '第三方服务域'],
              //   [11, 2, this.state.values[5]  === 0?0:this.state.values[5]],
              //
              //   [-1.1, -2, '总行云服务域'],
              //   [4,  -2, this.state.values[6] === 0?0:this.state.values[6]],
              //   [5.8,-2, 'IT管理域'],
              //   [11, -2, this.state.values[7] === 0?0:this.state.values[7]],
              //
              //   [-1.1, -6, '分行云服务域'],
              //   [4,  -6, this.state.values[8] === 0?0:this.state.values[8]],
              //   [5.8,-6, '办公服务域'],
              //   [11, -6, this.state.values[9] === 0?0:this.state.values[9]],
              //
              //   [-1.1, -10, '容器云服务域'],
              //   [4,  -10, this.state.values[10] === 0?0:this.state.values[10]],
              //   [5.8,-10, '投产准备域'],
              //   [11, -10, this.state.values[11] === 0?0:this.state.values[11]],
              //
              //   [-1.1, -14, '互联网服务域'],
              //   [4,  -14, this.state.values[12] === 0?0:this.state.values[12]],
              //   [5.8,-14, '开发测试域'],
              //   [11, -14, this.state.values[13] === 0?0:this.state.values[13]],
              //
              //   [-1.1, -18, '数据域'],
              //   [4,  -18, this.state.values[14] === 0?0:this.state.values[14]],
              // ],
              type: 'scatter',
              label:{
                normal: {
                  show: true,
                  formatter: function (param) {
                    if(param.data[2] === 0 || param.data[0] === -1.1 || param.data[0] === 5.8){
                      return '{colorW|' + param.data[2] + '}';
                    }else {
                      return '{colorR|' + param.data[2] + '}';
                    }
                  },
                  //position: 'top',
                  rich:{
                    colorW:{color: '#fff',fontSize:11,},
                    colorR:{color: '#f00',fontSize:11,}
                  },
                  align:'left',
                }
              },
              itemStyle: {
                normal: {
                  //opacity:0.1
                  color: '#07203F',
                  fontSize: 1
                },
              },
            }]
        };

      return option
    }

    render(){
      return (<
          ReactEcharts option = {this.getOtion()}
                       onEvents={this.onEvents}
                       style = {
                         {
                           height: '396px',
                           width: '100%',
                           backgroundColor:'#091732'
                         }
                       }
        />
      )
    }
}
export default NetWorkPerformance;
