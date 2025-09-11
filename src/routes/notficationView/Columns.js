import Fenhang from '../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
  Fenhangmaps.set(obj.key, obj.value)
})

export default [
  {
    key: 'alarmId',
    dataIndex: 'alarmId',
    title: '告警ID',
    width: 75,
    sorter: (a, b) => a.alarmId.localeCompare(b.alarmId),
  },
  {
    key: 'branch',
    dataIndex: 'branch',
    title: '分支机构',
    width: 50,
    sorter: (a, b) => a.branch.localeCompare(b.branch),
    render: (text, record) => {
      return Fenhangmaps.get(text)
    },
  },
  {
    key: 'receiverUserName',
    dataIndex: 'receiverUserName',
    title: '接收人',
    width: 50,
    sorter: (a, b) => a.receiverUserName.localeCompare(b.receiverUserName),
  },
  {
    key: 'receiver',
    dataIndex: 'receiver',
    title: '联系电话',
    width: 50,
    sorter: (a, b) => {
      let A = a.receiver.toUpperCase();
      let B = b.receiver.toUpperCase();
      if (A < B) {
        return -1;
      }
      if (A > B) {
        return 1;
      }
      return 0;
    }
  },
  {
    key: 'createdBy',
    dataIndex: 'createdBy',
    title: '创建者',
    width: 50,
  },
  {
    key: 'createdTime',
    dataIndex: 'createdTime',
    title: '创建时间',
    width: 75,
    render: (text, record) => {
      return new Date(text).format('yyyy-MM-dd hh:mm:ss')
    },
  },
  {
    key: 'updatedBy',
    dataIndex: 'updatedBy',
    title: '最后更新者',
    width: 50,
  },
  {
    key: 'sender',
    dataIndex: 'sender',
    title: '发送者',
    width: 50,
  },
  {
    key: 'sendTime',
    dataIndex: 'sendTime',
    title: '发送时间',
    width: 75,
    render: (text, record) => {
      return new Date(text).format('yyyy-MM-dd hh:mm:ss')
    },
  },
  {
    key: 'firstOccurrence',
    dataIndex: 'firstOccurrence',
    title: '告警发生时间',
    width: 75,
    render: (text, record) => {
      return new Date(text).format('yyyy-MM-dd hh:mm:ss')
    },
  },
  {
    key: 'lastOccurrence',
    dataIndex: 'lastOccurrence',
    title: '告警最后更新时间',
    width: 75,
    render: (text, record) => {
      return new Date(text).format('yyyy-MM-dd hh:mm:ss')
    },
  },
  {
    key: 'updatedTime',
    dataIndex: 'updatedTime',
    title: '最后更新时间',
    width: 75,
    render: (text, record) => {
      return new Date(text).format('yyyy-MM-dd hh:mm:ss')
    },
  },
  {
    key: 'notificationType',
    dataIndex: 'notificationType',
    title: '通知方式',
    width: 50,
  },
  {
    key: 'readChannel',
    dataIndex: 'readChannel',
    title: '阅读渠道',
    width: 50,
    render: (text, record) => {
      let result = ''
      if(text == 'UIMP'){
        result = '光大通'
      }else if(text == 'MUMP'){
        result = '光大家'
      }
      return result
    },
  },
  {
    key: 'result',
    dataIndex: 'result',
    title: '发送结果',
    width: 50,
  },
  {
    key: 'isRead',
    dataIndex: 'isRead',
    title: '是否阅读',
    width: 50,
    render: (text, record) => {
      return text ? "是" : "否"
    }
  },
  {
    key: 'readTime',
    dataIndex: 'readTime',
    title: '阅读时间',
    width: 50,
    render: (text, record) => {
      if(text === 0){
        return
      }
      return new Date(text).format('yyyy-MM-dd hh:mm:ss')
    }
  },
  {
    key: 'content',
    dataIndex: 'content',
    width: 300,
    title: '通知内容',
  }
]
