import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Table, Button } from 'antd'

const modal = ({
	dispatch,
  	visible,
	errorList,
}) => {
  const onCancel = () => {
   dispatch({
			type: 'ruleInstance/showRuleModal',
			payload: {
				errorVisible: false,
			},
		})
  }

/*   const columns = [{
  title: '错误类型',
  dataIndex: 'itemStatus',
  key: 'itemStatus',
	}, {
  title: '错误详细信息',
  dataIndex: 'itemError',
  key: 'itemError',
  }];
   */
  const columns = [{
    title: '错误类型',
    dataIndex: 'Status',
    key: 'Status',
  },
  {
    title: '错误详情信息',
    dataIndex: 'Error',
    key: 'Error',
  }]

let arrerror = []
if (errorList.itemErrors && !errorList.itemErrors == '') {
    let objerror = {}
    for (let o of errorList.itemErrors) {
    objerror.Status = o.itemStatus
    objerror.Error = o.itemError
    arrerror.push(objerror)
    }
  }
if (errorList.triggerErrors && !errorList.triggerErrors == '') {
  let objerror = {}
  for (let o of errorList.triggerErrors) {
    objerror.Status = o.triggerStatus
    objerror.Error = o.triggerError
    arrerror.push(objerror)
    }
}
const dataSource = arrerror

//const dataSource = errorList.itemErrors

  const modalOpts = {
    title: '下发失败的错误详情',
    visible,
    onCancel,
    maskClosable: false,
    footer: <Button key="submit" type="primary" onClick={onCancel}>确认</Button>,
  }

  return (
    <Modal {...modalOpts} height="600" width="1000">
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
   			/>
    </Modal>
  )
}

modal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
}

export default Form.create()(modal)
