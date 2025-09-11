import React from 'react'
import ReactEcharts from 'echarts-for-react'
import 'echarts/map/js/china'

class DataCenterRoom extends React.Component {

    constructor(props) {
        super(props)
    }

    state = {
      autoPlay : 0,
      sdColor:'#00FF00',
      jxColor:'#00FF00',
      whColor:'#00FF00',
    }

    componentWillUnmount() {
      clearInterval(this.autoPlay())
    }

    querys=()=>{
      this.state.autoPlay = setInterval(() => {
        this.props.dispatch({
          type: 'screen/queryDataRoomPingAlarms',
          payload: {
            uuid:this.props.uuid,
          }
        })
      }, 6000);
    }

    componentDidMount(){
      this.querys()
    }

    componentWillReceiveProps(nextProps) {
      this.state.sdColor = (nextProps.sdColorFlag < 0.5) ? '#00FF00':'#FF0000'
      this.state.jxColor = (nextProps.jxqColorFlag < 0.5) ? '#00FF00':'#FF0000'
      this.state.whColor = (nextProps.wuColorFlag < 0.5) ? '#00FF00':'#FF0000'
    }

    getOption() {
        let data = [
            {name: '上地', value: 50},
            {name: '酒仙桥', value: 50},
            {name: '武汉', value: 50}
        ];
        let geoCoordMap = {
        '上地':[115.46,39.92],
        '酒仙桥':[117.46,39.92],
        '武汉':[114.31,30.52],
        };

        let convertData = function (data) {
            let res = [];
                let geoCoord = geoCoordMap[data.name];
                if (geoCoord) {
                    res.push({
                        name: data.name,
                        value: geoCoord.concat(data.value)
                    });
                }
            return res;
        };

        let series = [
          {
            name:'上地',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data[0]),
            symbolSize: function (val) {
                return val[2] / 10;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'left',
                    show: true,
                    color:'#fff',
                }
            },
            itemStyle: {
                normal: {
                    shadowBlur: 10,
                    shadowColor: '#333',
                    color:this.state.sdColor
                }
            },
            zlevel: 1
        },{
            name:'酒仙桥',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data[1]),
            symbolSize: function (val) {
                return val[2] / 10;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true,
                    color:'#fff',
                }
            },
            itemStyle: {
                normal: {
                    shadowBlur: 10,
                    shadowColor: '#333',
                    color:this.state.jxColor
                }
            },
            zlevel: 1
        },{
            name:'武汉',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data[2]),
            symbolSize: function (val) {
                return val[2] / 10;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true,
                    color:'#fff',
                }
            },
            itemStyle: {
                normal: {
                    shadowBlur: 10,
                    shadowColor: '#333',
                    color:this.state.whColor
                }
            },
            zlevel: 1
        },
        ]

        let option = {
        title: {         //标题组件
            text: '数据中心机房网络连通性',
            left: 'left',
            top: 'top',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip : {
            trigger: 'item',
            triggerOn: 'click',
            backgroundColor: 'transparent',
            alwaysShowContent: false,
            position (pos,params) {
                if(params.name === '上地')
                    pos[0] = pos[0] - 50
                return pos
            },
            formatter(parmas){
            }
            
        },
        geo: {
            map: 'china',
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#4169E1',//'#323c48',
                    borderColor: '#091732'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series : series        
        };

        return option
    }

    render(){
        return (<
            ReactEcharts option = {
                this.getOption()
              }
              style = {
                {
                  height: '256px',
                  width: '100%',
                }
              }
        />)
    }
}

export default DataCenterRoom
