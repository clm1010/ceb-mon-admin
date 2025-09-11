import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button, Table, Alert } from 'antd'
import fenhang from '../../../utils/fenhang'

const modal = ({
	dispatch,
	visible,
	choosedRows, //选中的对象集合
	batchSyncState, //同步的状态
	batchsyncSuccessList, //同步成功的集合
	batchsyncFailureList, //同步失败的集合
}) => {
	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let key = obj.key
		let value = obj.value
		maps.set(key, value)
	})
	let type = ''
	let text = `您一共选中${choosedRows.length}条记录，${batchsyncSuccessList.length}条同步成功，${batchsyncFailureList.length}条失败!`
	//根据同步的不同
	if (batchsyncSuccessList.length === 0) {
			type = 'error'
	} else if (batchsyncFailureList.length === 0) {
			type = 'success'
	} else {
			type = 'warning'
	}
	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'switcher/setState',				//@@@
			payload: {
				batchSyncModalVisible: false,
				batchSyncState: true,
				batchsyncSuccessList: [],
				batchsyncFailureList: [],
			},
		})
	}

	const modalOpts = {
		    title: '批量同步',
		    visible,
		    wrapClassName: 'vertical-center-modal',
		    maskClosable: false,
		    onCancel,
		    footer: null,
	}

	const columns = [{
	  title: '同步设备名',
	  dataIndex: 'name',
	  width: '20%',
	  key: 'name',
	}, {
	  title: '所属分行',
	  dataIndex: 'branchName',
	  width: '15%',
	  key: 'branchName',
	  render: (text, record) => {
	  	for (let data of maps) {
	  		if (data[0] === record.branchName) {
	  				return data[1]
	  		}
	  	}
	  },
	}, {
	  title: '同步状态',
	  dataIndex: 'syncStatus',
	  width: '15%',
	  key: 'syncStatus',
	  render: (text, record) => {
	  	let state = ''
	  	if (record.syncStatus === 'success') {
	  			state = '同步成功'
	  	} else if (record.syncStatus === 'failed') {
	  			state = '同步失败'
	  	}
	  	return state
	  },
	}, {
	  title: '同步详情',
	  dataIndex: 'ext1',
	  width: '50%',
	  key: 'ext1',
	}]

	return (
  <Modal {...modalOpts} width={650} height="600px">
    {
			batchSyncState ?
  <div><Alert message="正在为您同步，请稍等!" type="info" showIcon /><br /></div>
			:
  <div>
    <Alert message={text} type={type} showIcon /><br />
    {
						batchsyncSuccessList.length == 0 ?
						null
						:
						<div>
  <Table
    dataSource={batchsyncSuccessList}
    columns={columns}
    pagination={false}
    scroll={{ y: 250 }}
    size="small"
    bordered
  />
  <br />
						</div>
					}
    {
						batchsyncFailureList.length == 0 ?
						null
						:
						<div>
  <Table
    dataSource={batchsyncFailureList}
    columns={columns}
    pagination={false}
    scroll={{ y: 250 }}
    size="small"
    bordered
  />
  <br />
						</div>
					}
    <div style={{ width: '100%', float: 'left' }}>
      <Button type="ghost" style={{ marginLeft: '13px', float: 'right' }} onClick={onCancel}>关闭</Button>
    </div>
  </div>
		}

  </Modal>
	)
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
