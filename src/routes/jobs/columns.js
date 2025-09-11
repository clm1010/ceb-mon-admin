export default  [
  {
    title: '任务名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '进度',
    dataIndex: 'progress',
    key: 'progress',
  }, {
    title: '定时任务',
    dataIndex: 'timed',
    key: 'timed',
    render: (text, record) => {
      if(record.timed){
        return '是'
      }else{
        return '否'
      }
    }
  }, {
    title: '提交者',
    dataIndex: 'userId',
    key: 'userId',
  }, {
    title: '提交时间',
    dataIndex: 'submitTime',
    key: 'submitTime',
    render: (text, recode) => {
      return new Date(text).format('yyyy-MM-dd hh:mm:ss')
    }
  }, {
    title: '完成时间',
    dataIndex: 'finishTime',
    key: 'finishTime',
    render: (text, recode) => {
      return new Date(text).format('yyyy-MM-dd hh:mm:ss')
    }
  }
]
