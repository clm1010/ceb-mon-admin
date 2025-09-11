import React from 'react'
import ReactEcharts from 'echarts-for-react'
import 'echarts/map/js/china'
import oelConfig from "./OelFilterConfig";

class DataCenterRoom extends React.Component {

  constructor(props) {
    super(props)
  }

  state = {
    autoPlay : 0,
    dataList: ['#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00'],
    dataCenterLine:['#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00'],
  }

  querys=()=>{
    this.state.autoPlay = setInterval(() => {
      this.props.dispatch({
        type: 'screen/queryDataRoomPingAlarms',
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
    let valueList = []
    for(let item of nextProps.dataCenterRoompingFailed){
      valueList.push(item.value)
    }
    if(valueList.length != 0){
      this.state.dataList = valueList
    }
    this.state.dataCenterLine = nextProps.dataCenterRoomLine
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

      this.winOpenView(oelConfig.DataCenterRoom.nodeOelFilter, oelConfig.commonConfig.oelViewer,
        oelConfig.DataCenterRoom.nodeTitle)

  };

  onEvents = {
    'click': this.onClicks,
  };

  getOtion(){
    let option = {
        title: {         //标题组件
          text: '办公大楼及坐席健康状态',
          left: 'left',
          top: 'top',
          textStyle: {
            color: '#fff'
          }
        },
        //animationDurationUpdate: 1500,
        //animationEasingUpdate: 'quinticInOut',
        series: [
          {
          type: 'graph',
          layout: 'none',
          symbolSize: 16,
          roam: true,
          focusNodeAdjacency: false,
          draggable : true,
          symbol: 'circle',
          label: {
            normal: {
              show: true,
              // formatter: function(data) {
              //   return data.name+  '\n' + '(' +data.data.x + ';'+ data.data.y + ')';
              // },
              color: '#fff',
              //position: 'bottom'
              fontSize:16,
            }
          },
          edgeSymbol: ['', ''],
          edgeSymbolSize: [1, 9],
          data: [
              {
                name: '上地,酒仙桥',
                x: 375,
                y: 300,
                symbolSize: 75,
                label: {
                  normal: {
                    show: true,
                    //position:'left',
                    color:'#fff',
                    formatter: function(data) {
                      return '上地' + '\n' + '酒仙桥';
                    },
                  }
                },
                itemStyle:{
                  normal:{
                    color:'#1E90FF',
                    borderColor: '#fff',
                    borderWidth: 2
                  }

                }
              }, {
                name: '光大大厦机房',
                x: 225,
                y: 150,
                label: {
                  normal: {
                    show: true,
                    position:'top',
                    color:'#fff',
                    fontSize:16,
                  }
                },
                itemStyle:{
                  normal:{
                    color:this.state.dataList[4],
                    borderColor: '#fff',
                    borderWidth: 2,
                  }

                }
              },{
                name: '昌平开发测试',
                x: 175,
                y: 289,
                label: {
                  normal: {
                    show: true,
                    position:'top',
                    color:'#fff'
                  }
                },
                itemStyle:{
                  normal:{
                    color:this.state.dataList[5],
                    borderColor: '#fff',
                    borderWidth: 2
                  }

                }
              }, {
                name: '武汉客服中心',
                x: 185,
                y: 385  ,
                label: {
                  normal: {
                    show: true,
                    position:'top',
                    color:'#fff'
                  }
                },
                itemStyle:{
                  normal:{
                    color:this.state.dataList[8],
                    borderColor: '#fff',
                    borderWidth: 2
                  }

                }
              }, {
                name: '光大理财子公司',
                x: 262,
                y: 450  ,
                label: {
                  normal: {
                    show: true,
                    position:'bottom',
                    color:'#fff'
                  }
                },
                itemStyle:{
                  normal:{
                    color:'#00CD00',
                    borderColor: '#fff',
                    borderWidth: 2
                  }

                }
              },{
                name: '武汉灾备中心',
                x: 375 ,
                y: 500,
                label: {
                  normal: {
                    show: true,
                    position:'bottom',
                    color:'#fff',
                    fontSize:16,
                  }
                },
                itemStyle:{
                  normal:{
                    color:this.state.dataList[7],
                    borderColor: '#fff',
                    borderWidth: 2
                  }

                }
              }, {
                name: '天津后台中心',
                x: 488,
                y: 450,
                label: {
                  normal: {
                    show: true,
                    position:'bottom',
                    color:'#fff'
                  }
                },
                itemStyle:{
                  normal:{
                    color:this.state.dataList[9],
                    borderColor: '#fff',
                    borderWidth: 2
                  }

                }
              }, {
                name: '陶然亭机房',
                x: 375,
                y: 125,
                label: {
                  normal: {
                    show: true,
                    position:'top',
                    color:'#fff',
                    fontSize:16,
                  }
                },
                itemStyle:{
                  normal:{
                    color:this.state.dataList[2],
                    borderColor: '#fff',
                    borderWidth: 2
                  }

                }
              }, {
                name: '石景山办公机房',
                x: 565,
                y: 395,
                label: {
                  normal: {
                    show: true,
                    position:'bottom',
                    color:'#fff'
                  }
                },
                itemStyle:{
                  normal:{
                    color:this.state.dataList[0],
                    borderColor: '#fff',
                    borderWidth: 2
                  }

                }
              }, {
                name: '烽火科技大厦',
                x: 575,
                y: 289,
                label: {
                  normal: {
                    show: true,
                    position:'top',
                    color:'#fff'
                  }
                },
                itemStyle:{
                  normal:{
                    color:this.state.dataList[3],
                    borderColor: '#fff',
                    borderWidth: 2
                  }

                }
              }, {
                name: 'F3光大中心',
                x: 488,
                y: 150,
                label: {
                  normal: {
                    show: true,
                    position:'top',
                    color:'#fff'
                  }
                },
                itemStyle:{
                  normal:{
                    color:this.state.dataList[1],
                      borderColor: '#fff',
                    borderWidth: 2,
                  }

                }
              }
            ],
          links:[
            {
              source: '上地,酒仙桥',
              target: '陶然亭机房',
              lineStyle: {
                normal: {
                  width:this.state.dataCenterLine[0] === '#00CD00'?3:6,
                  curveness: 0.3,
                  color:this.state.dataCenterLine[0]
                }
              }
            },  {
              source: '上地,酒仙桥',
              target: '光大大厦机房',
              lineStyle: {
                normal: {
                  width:this.state.dataCenterLine[1] === '#00CD00'?3:6,
                  curveness: 0.3,
                  color:this.state.dataCenterLine[1]
                }
              }
            },  {
              source: '上地,酒仙桥',
              target: '昌平开发测试',
              lineStyle: {
                normal: {
                  width:this.state.dataCenterLine[2] === '#00CD00'?3:6,
                  curveness: 0.3,
                  color:this.state.dataCenterLine[2]
                }
              }
            }, {
              source: '上地,酒仙桥',
              target: '武汉客服中心',
              lineStyle: {
                normal: {
                  width:this.state.dataCenterLine[3] === '#00CD00'?3:6,
                  curveness: 0.3,
                  color:this.state.dataCenterLine[3]
                }
              }
            }, {
              source: '上地,酒仙桥',
              target: '光大理财子公司',
              lineStyle: {
                normal: {
                  width:this.state.dataCenterLine[4] === '#00CD00'?3:6,
                  curveness: 0.3,
                  color:this.state.dataCenterLine[4]
                }
              }
            },{
              source: '上地,酒仙桥',
              target: '武汉灾备中心',
              lineStyle: {
                normal: {
                  width:this.state.dataCenterLine[5] === '#00CD00'?3:6,
                  curveness: 0.3,
                  color:this.state.dataCenterLine[5]
                }
              }
            },{
              source: '上地,酒仙桥',
              target: '天津后台中心',
              lineStyle: {
                normal: {
                  width:this.state.dataCenterLine[6] === '#00CD00'?3:6,
                  curveness: 0.3,
                  color:this.state.dataCenterLine[6]
                }
              }
            },{
              source: '上地,酒仙桥',
              target: '石景山办公机房',
              lineStyle: {
                normal: {
                  width:this.state.dataCenterLine[7] === '#00CD00'?3:6,
                  curveness: 0.3,
                  color:this.state.dataCenterLine[7]
                }
              }
            }, {
              source: '上地,酒仙桥',
              target: '烽火科技大厦',
              lineStyle: {
                normal: {
                  width:this.state.dataCenterLine[8] === '#00CD00'?3:6,
                  curveness: 0.3,
                  color:this.state.dataCenterLine[8]
                }
              }
            },{
              source: '上地,酒仙桥',
              target: 'F3光大中心',
              lineStyle: {
                normal: {
                  width:this.state.dataCenterLine[9] === '#00CD00'?3:6,
                  curveness: 0.3,
                  color:this.state.dataCenterLine[9]
                }
              }
            },
          ],
          lineStyle: {
            normal: {
              opacity: 0.9,
              //width: 1,
              //curveness: 0.3,
              color: '#00CD00'
            }
          },
          force: {
            repulsion: 600,
            edgeLength: [0, 180],
            //layoutAnimation: true,
            //gravity:0.001
          }
        }]
  };
    return option
  }

  render() {
    return(
      <div>
        <ReactEcharts
          option={this.getOtion()}
          onEvents={this.onEvents}
          style={{height: '400px',
            width: '100%',}}
        />

      </div>
    )
  };
}

export default DataCenterRoom
