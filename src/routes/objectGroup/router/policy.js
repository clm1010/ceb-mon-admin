import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal } from 'antd'

const modal = ({
	dispatch,
	visible,
}) => {
	const onCancel = () => {
		dispatch({
			type: 'router/setState',
			payload: {
				policyVisible: false,
			},
		})
	}

	const modalOpts = {
		    title: '策略预览',
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
  <Modal {...modalOpts} width={650} height="600px" />
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
