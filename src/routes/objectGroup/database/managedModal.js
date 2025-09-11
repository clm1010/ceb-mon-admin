import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button, Table, Alert } from 'antd'
import fenhang from '../../../utils/fenhang'

const modal = ({
	dispatch,
	visible,
	choosedRows,
	manageState,
	managedType,
	managedData,
}) => {
	let text = `您一共选中${choosedRows.length}条记录,${managedData.length}条成功`
	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let key = obj.key
		let value = obj.value
		maps.set(key, value)
	})
	//根据同步的不同
	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'database/setState',				//@@@
			payload: {
				managedModalVisible: false,
				manageState: true,
				managedData: [],
			},
		})
	}

	const modalOpts = {
		    title: managedType === 'managed' ? '批量纳管' : '批量取消纳管',
		    visible,
		    wrapClassName: 'vertical-center-modal',
		    maskClosable: false,
		    onCancel,
		    footer: null,
	}

	const columns = [{
	  title: '设备名',
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
	  title: 'IP',
	  dataIndex: 'discoveryIP',
	  width: '50%',
	  key: 'discoveryIP',
	}, {
	  title: '纳管状态',
	  dataIndex: 'managedStatus',
	  width: '15%',
	  key: 'managedStatus',
	}]

	return (
  <Modal {...modalOpts} width={650} height="600px">
    {
			manageState ?
  <div><Alert message="正在为您进行批量操作,请稍等!" type="info" showIcon /><br /></div>
			:
  <div>
    <Alert message={text} type="success" showIcon /><br />
    <div>
      <Table
        dataSource={managedData}
        columns={columns}
        pagination={false}
        scroll={{ y: 250 }}
        size="small"
        bordered
      />
      <br />
    </div>
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
