import React from 'react'
import ReactEcharts from 'echarts-for-react'

class Barchart extends React.Component {
  constructor (props) {
    super(props)
    this.data = this.props.data
    this.title = this.props.title
    this.dispatch = this.props.dispatch
    this.loading = this.props.loading
  }

  componentWillReceiveProps (props) {
    this.data = this.props.data
    this.title = this.props.title
  }

  getOtion () {
    let seriesData = []

    for (let _data of this.data) {
      switch (_data.level) {
        case '100':
          seriesData.push({
            value: _data.number,
            severity: 100,
            dispatch: this.dispatch,
            itemStyle: {
              normal: {
                color: 'B23AEE',
                label: {
                  show: true,
                  textStyle: {
                    color: '#000000',
                  },
                  position: 'top',
                },
              },
            },
          })
          break
        case '4':
          seriesData.push({
            value: _data.number,
            severity: 4,
            dispatch: this.dispatch,
            itemStyle: {
              normal: {
                color: '#63B8FF',
                label: {
                  show: true,
                  textStyle: {
                    color: '#000000',
                  },
                  position: 'top',
                },
              },
            },
          })
          break
        case '3':
          seriesData.push({
            value: _data.number,
            severity: 3,
            dispatch: this.dispatch,
            itemStyle: {
              normal: {
                color: '#ffff00',
                label: {
                  show: true,
                  textStyle: {
                    color: '#000000',
                  },
                  position: 'top',
                },
              },
            },
          })
          break
        case '2':
          seriesData.push({
            value: _data.number,
            severity: 2,
            dispatch: this.dispatch,
            itemStyle: {
              normal: {
                color: '#FFB329',
                label: {
                  show: true,
                  textStyle: {
                    color: '#000000',
                  },
                  position: 'top',
                },
              },
            },
          })
          break
        case '1':
          seriesData.push({
            value: _data.number,
            severity: 1,
            dispatch: this.dispatch,
            itemStyle: {
              normal: {
                color: '#FF0000',
                label: {
                  show: true,
                  textStyle: {
                    color: '#000000',
                  },
                  position: 'top',
                },
              },
            },
          })
          break
      }
    }

    const option = {
      title: {
        text: this.title,
        left: 'center',
        textStyle: {
          color: '#333',
          fontSize: 12,
        },
      },
      grid: {
        top: 40,
        left: '0%',
        right: '0%',
        bottom: '0%',
        containLabel: true,
      },
      xAxis: {
        data: ['1', '2', '3', '4', '100'],
      },
      yAxis: [{
        type: 'value',
        axisLable: {
          show: false,
        },
      }],
      series: [{
        type: 'bar',
        data: seriesData,
      }],
    }
    return option
  }

  render () {
    return (<ReactEcharts option={
        this.getOtion()
      }
      style={
        {
          height: '150px',
          width: '100%',
        }
      }
    />
    )
  }
}

export default Barchart
