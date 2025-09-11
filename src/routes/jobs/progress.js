import React from 'react'
import { Progress } from 'antd'

class progress extends React.Component {
  constructor(props) {
    super(props)
    this.state.strokeWidth = this.props.strokeWidth
    this.state.percent = this.props.percent
    this.state.status = this.props.status
    this.state.percentState = this.props.percentState
    this.state.all = this.props.all
    this.state.doneNum = this.props.doneNum
    this.state.payload  = this.props.payload
  }

  querys = () => {
    this.state.setIntervalNum = setInterval(() => {
      if(!this.props.buttonState){
        console.log('关闭进度条定时任务测试！')
      }else{
        console.log('开启进度条定时任务测试！')
        this.props.dispatch ({
          type: `${this.props.path}`,
          payload: this.state.payload
        })
      }
    }, 5000)
  }

  componentDidMount() {
    this.props.buttonState ? this.querys() : null
  }

  state = {
    setIntervalNum: 0,
    strokeWidth: '',//进度条宽度
    percent: 0,//进度条进度
    status:　'',//进度条类型 success exception normal active
    all: 0,//当percentState为false时，使用这个参数
    doneNum: 0,//当percentState为false时，使用这个参数
    percentState: true,//当他为true时   直接使用百分比   为false使用format函数渲染
    buttonState: false,//true开启定时任务  false关闭定时任务
    path: '',//请求路径
    payload: {}//传递的参数为JSON对象
  }

  componentWillReceiveProps( nextProps ) {
    this.state.strokeWidth = nextProps.strokeWidth
    this.state.percent = nextProps.percent
    this.state.status = nextProps.status
    this.state.percentState = nextProps.percentState
    this.state.doneNum = nextProps.doneNum
    this.state.all = nextProps.all
    this.state.payload  = nextProps.payload
  }

  componentWillUnmount() {
    this.props.buttonState ? clearInterval(this.state.setIntervalNum) : null
  }

  render() {
    return(
      <Progress
        strokeWidth={this.state.strokeWidth}
        percent={this.state.percent}
        status={this.state.status}
        format={this.state.percentState ?  '' : () => this.state.doneNum+'/'+this.state.all}
      />
    )
  }
}

export default progress
