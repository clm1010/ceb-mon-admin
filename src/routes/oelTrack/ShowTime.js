import * as React from 'react'

export default class ShowTime extends React.Component {
  constructor (props) {
    super(props)
    this.state = { isShowingText: ' ' }
  }
  standfun (val) {
    if (val < 10) {
      return `0${val}`
    }
      return val
  }
  start = () => {
    //this.stop();
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      let now = new Date()
      let year = now.getFullYear() //获取年份
      let month = now.getMonth() //获取月份
      let date = now.getDate() //获取日期
      let hour = now.getHours() //获取小时
      let minute = now.getMinutes() //获取分钟
      let seconds = this.standfun(now.getSeconds()) //获取秒
      month += 1
      let isShowingText = `${year}-${month}-${date} ${hour}:${minute}:${seconds}`
      this.setState({ isShowingText })
    }, 1000)
  }
  componentDidMount () {
    this.start()
  }
  componentWillMount () {
  }
  componentWillUnmount () {
    clearInterval(this.interval)
  }
  render () {
    return (
      <span style={{ float: 'left' }}>
        {this.state.isShowingText}
      </span>
    )
  }
}
