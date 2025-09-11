import { Tag } from 'antd'
export default  [
	{
    key: 'n_CustomerSeverity',
    dataIndex: 'n_CustomerSeverity',
    width: 50,
    title: '告警级别',
    render: (text, record) => {
    	let info = ''
			if (text === 1) {
				info = <div><Tag color="#C50000">故障</Tag></div>
			} else if (text === 2) {
				info = <div><Tag color="#B56300">告警</Tag></div>
			} else if (text === 3) {
				info = <div><Tag color="#CDCD00">预警</Tag></div>
			} else if (text === 4) {
				info = <div><Tag color="#4F94CD">提示</Tag></div>
			} else if (text === 100) {
				info = <div><Tag color="#68228B">信息</Tag></div>
			}
			return info
	  },
    },
    {
      key: 'serial',
      dataIndex: 'serial',
      width: 100,
      title: '原始序列号',
    },
    {
      key: 'n_AppName',
      dataIndex: 'n_AppName',
      width: 200,
      title: '应用系统名称',
    },
	{
    key: 'nodeAlias',
    dataIndex: 'nodeAlias',
    width: 80,
    title: 'IP地址',
  },
  {
    key: 'node',
    dataIndex: 'node',
    width: 120,
    title: '主机名',
  },
  {
    key: 'n_ComponentType',
    dataIndex: 'n_ComponentType',
    width: 70,
    title: '告警大类',
  },
  {
    key: 'alertGroup',
    dataIndex: 'alertGroup',
    width: 100,
    title: '告警组',
  },
  {
    key: 'n_ObjectDesCr',
    dataIndex: 'n_ObjectDesCr',
    width: 150,
    title: '告警对象',
  },
  {
    key: 'n_SumMaryCn',
    dataIndex: 'n_SumMaryCn',
    width: 400,
    title: '告警描述',
  },
  {
    key: 'firstOccurrence',
    dataIndex: 'firstOccurrence',
    width: 150,
    title: '首次发生时间',
    render: (text, record) => {
      let time = record.firstOccurrence
      return new Date(time).format('yyyy-MM-dd hh:mm:ss')
    },
  },
  {
    key: 'lastOccurrence',
    dataIndex: 'lastOccurrence',
    width: 150,
    title: '最后发生时间',
    render: (text, record) => {
      let time = record.lastOccurrence
      return new Date(time).format('yyyy-MM-dd hh:mm:ss')
    },
  },
  {
    key: 'n_RecoverType',
    dataIndex: 'n_RecoverType',
    width: 100,
    title: '是否可恢复',
    render: (text, record) => {
    	let info = ''
			if (text === '0') {
				info = '否'
			} else if (text === '1') {
				info = '是'
			}
			return info
	  },
  },
  {
    key: 'n_MgtOrg',
    dataIndex: 'n_MgtOrg',
    width: 60,
    title: '管理机构',
  },
  {
    key: 'n_OrgName',
    dataIndex: 'n_OrgName',
    width: 60,
    title: '所属机构',
  },
]
