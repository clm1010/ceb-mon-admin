import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { Button, DatePicker, Form, Modal, Row, Select } from 'antd'
const { RangePicker } = DatePicker
import moment from 'moment'
const LineChart = ({ dispatch,
                   visible,
                   data,
                   startTime,
                   endTime,
                   circle,
                   appCode,
                   }) => {
  const onOk = (dates) => {
    // let q = "appCode =="+ appCode+";"
    // const a = moment(dates[0] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
    // const b = moment(dates[1] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
    // q += `dataTime=timein=(${a},${b})`
    dispatch({
      type: 'totalnet/scoreLine',
      payload: {
        appCode: appCode,
        startTime: moment(dates[0]).valueOf(),
        endTime: moment(dates[1]).valueOf(),
      }
    })
    dispatch({
      type: 'totalnet/setState',
      payload: {
        startTime: moment(dates[0]).valueOf(),
        endTime: moment(dates[1]).valueOf(),
      },
    })
  }
  const select = (value) => {
    // let query = "appCode =="+ appCode+","
    // query = query + "dataTime >= "+ (new Date().valueOf()-value*3600*1000)
    dispatch({
      type: 'totalnet/scoreLine',
      payload: {
        appCode: appCode,
        startTime: new Date().valueOf()-value*3600*1000,
        endTime: new Date().valueOf(),
      }
    })

    dispatch({
      type: 'totalnet/setState',
      payload: {
        circle: value,
      },
    })
  }

  const changeDateArray = (date) =>{
    const newDate = []
    date.forEach(f =>{
      newDate.push(new Date(f).format('yyyy-MM-dd'))
    })
    return newDate
  }

  const option = {
    xAxis: {
      type: 'category',
      data: data.arr ? changeDateArray(data.arr[0].dataTime): [],
      // data: cpuLineChart.x,
    },
    yAxis: {
      type: 'value',
      max: 100,
      splitLine: {
        show: false,
      },
      // axisLabel: {
      //   formatter: '{value} %',
      // },
    },
    toolbox: {
      show: true,
      x: 'left',
      padding: 35,
    },
    tooltip: {
      trigger: 'axis',
    },
    series: [{
      data: data.arr ? data.arr[0].score :[],
      type: 'line',
      // 在折现图上显示数据
      label:{
        normal:{
          show:true,
          position:'inside'
        }
      }
      // areaStyle: {},
      // trigger: 'item'
    }],
    dataZoom: [
      {
        xAxisIndex: 0,
        filterMode: 'empty',
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty',
      },
      {
        yAxisIndex: 0,
        filterMode: 'empty',
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'empty',
      },
    ],
  }


  const onCancel = () => { // 弹出窗口中点击取消按钮触发的函数
    dispatch({
      type: 'totalnet/setState',
      payload: {
        echartsVisible: false,
      },
    })
  }

  const modalOpts = {
    title: '查看评分变化趋势',
    visible,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    zIndex: 100,
  }

  return (
    <Modal {...modalOpts} width="75%" footer={[<Button key="cancel" onClick={onCancel}>关闭</Button>]}>
      <Form layout="horizontal">
        <Row gutter={4} style={{ marginTop: 4, marginBottom: 20 }}>
          <span style={{ float: 'right', fontSize: '12px', marginRight: '10px' }}>
            <Select  defaultValue={circle} style={{ width: 110 }} size="small" onChange={select} >
              <Select.Option value="120">五天之内</Select.Option>
              <Select.Option value="240">十天之内</Select.Option>
              <Select.Option value="360">十五天之内</Select.Option>
              <Select.Option value="720">三十天之内</Select.Option>
              <Select.Option value="1440">两个月之内</Select.Option>
              <Select.Option value="2160">三个月之内</Select.Option>
              <Select.Option value="4320">半年之内</Select.Option>
              <Select.Option value="8760">一年之内</Select.Option>
            </Select>
          </span>
          <span style={{ float: 'right', fontSize: '12px', marginRight: '10px' }}>
            范围 : <RangePicker defaultValue={[moment(startTime), moment(endTime)]}  showTime={{ format: 'HH:mm:ss' }} size="small" format="YYYY-MM-DD"  onOk={onOk}/>
          </span>
        </Row>
      </Form>
    <div className="examples">
      <div className="parent">
        <ReactEcharts
          option={option}
          style={{ height: '280px', width: '100%', padding: 0 }}
        />
      </div>
    </div>
    </Modal>
  )
}

export default LineChart
