import { Modal, Table, Row, Col, DatePicker } from 'antd'
import moment from 'moment'
const { RangePicker } = DatePicker
const modal = ({
 dispatch, visible, q, dataSource,
}) => {
  const onOk = (dates) => {
		let	statr = moment(dates[0]).unix()
		let end = moment(dates[1]).unix()
		let timesql = ` and firstOccurrence > to_date('${new Date(statr * 1000).format('yyyy-MM-dd hh:mm:ss')}','yyyy-MM-dd hh24:mi:ss') and  firstOccurrence <= to_date('${new Date(end * 1000).format('yyyy-MM-dd hh:mm:ss')}','yyyy-MM-dd hh24:mi:ss')`
		dispatch({
			type: 'monitorSummary/queryHistory',
			payload: {
				q,
				filter: q + timesql,
			},
		})
  }

  const onCancel = () => {
    dispatch({
      type: 'monitorSummary/setState',
      payload: {
        modalVisible: false,
        dataSource: [],
        q: '',
      },
    })
  }

  const modalOpts = {
    title: '历史告警',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }

	const colmuns = [
	{
      key: 'n_CustomerSeverity',
      dataIndex: 'N_CUSTOMERSEVERITY',
      width: 150,
      title: '告警级别',
    },
    {
      key: 'oz_AlarmID',
      dataIndex: 'OZ_ALARMID',
      width: 200,
      title: '原始序列号',
    },
    {
      key: 'n_AppName',
      dataIndex: 'N_APPNAME',
      width: 230,
      title: '应用系统名称',
    },
	{
    key: 'nodeAlias',
    dataIndex: 'NODEALIAS',
    width: 150,
    title: 'IP地址',
  },
  {
    key: 'node',
    dataIndex: 'NODE',
    width: 220,
    title: '主机名',
  },
  {
    key: 'n_ComponentType',
    dataIndex: 'N_COMPONENTTYPE',
    width: 120,
    title: '告警大类',
  },
  {
    key: 'alertGroup',
    dataIndex: 'ALERTGROUP',
    width: 220,
    title: '告警组',
  },
  {
    key: 'n_ObjectDesCr',
    dataIndex: 'N_OBJECTDESCR',
    width: 300,
    title: '告警对象',
  },
  {
    key: 'n_SumMaryCn',
    dataIndex: 'N_SUMMARYCN',
    width: 400,
    title: '告警描述',
  },
  {
    key: 'firstOccurrence',
    dataIndex: 'FIRSTOCCURRENCE',
    width: 220,
    title: '首次发生时间',
    render: (text, record) => {
      let time = record.FIRSTOCCURRENCE
      return new Date(time).format('yyyy-MM-dd hh:mm:ss')
    },
  },
  {
    key: 'lastOccurrence',
    dataIndex: 'LASTOCCURRENCE',
    width: 220,
    title: '最后发生时间',
    render: (text, record) => {
      let time = record.LASTOCCURRENCE
      return new Date(time).format('yyyy-MM-dd hh:mm:ss')
    },
  },
  {
  	key: 'tally',
  	dataIndex: 'TALLY',
  	width: 150,
  	title: '重复次数',
  },
  {
    key: 'n_RecoverType',
    dataIndex: 'N_RECOVERTYPE',
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
    dataIndex: 'N_MGTORG',
    width: 60,
    title: '管理机构',
  },
  {
    key: 'n_OrgName',
    dataIndex: 'N_ORGNAME',
    width: 60,
    title: '所属机构',
  },
	]

  return (
    <Modal {...modalOpts} width="1200">
      <Row>
        <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
          <RangePicker style={{ width: 300, marginBottom: 5 }} showTime={{ format: 'HH:mm:ss' }} size="small" format="YYYY-MM-DD HH:mm:ss" onOk={onOk} />
        </Col>
        <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
          <Table
            scroll={{ y: 900, x: 2000 }}
            columns={colmuns}
            dataSource={dataSource}
            simple
            size="small"
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default modal
