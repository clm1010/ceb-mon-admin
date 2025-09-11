import React from 'react'
import { Icon, Steps } from 'antd'
const { Step } = Steps
class step extends React.Component {
  constructor(props) {
    super(props)
    this.state.items = this.props.items
    this.state.payload = this.props.payload
  }

  state = {
    items: [],
    payload: {}//传递的参数为JSON对象
  }

  querys = () => {
    this.state.setIntervalNum = setInterval(() => {
      if(!this.props.buttonState){
        console.log('关闭抽屉步骤定时任务测试！')
      }else{
        console.log('开启抽屉步骤条定时任务测试！')
        this.props.dispatch ({
          type: `${this.props.path}`,
          payload: this.state.payload
        })
      }
    }, 5000)
  }

  componentDidMount() {//buttonState为false关闭步骤条的自动刷新
    this.props.buttonState ? this.querys() : null

  }
  componentWillReceiveProps( nextProps ) {
    this.state.items = nextProps.items
    this.state.payload = nextProps.payload
  }

  componentWillUnmount() {
    this.props.buttonState ? clearInterval(this.state.setIntervalNum) : null
  }

//[{ status: '', title: '', description: '', icon: '' },{......}]需要这种数据格式才能生成指定的步骤条
  render() {
    return (
      <Steps>
        {
          (this.state.items && this.state.items.length > 0) ?
            this.state.items.map((item, index) => {
              return <Step status={item.status} key={index} title={item.title} description={item.description} icon={<Icon type={item.status === 'process' ? 'loading' : item.icon}/>} />
            })
            :
            null
        }
      </Steps>
    )
  }
}

export default step
