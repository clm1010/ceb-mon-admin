import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Row, Col, Table } from 'antd'

const modal = ({
    dispatch,
    visible,
    dataSource,
    pagination,
    loading,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        validateFieldsAndScroll,
    },
}) => {
    let selectItemObj = {}
	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				return
			}
			/*
			此处需要把选择的信息，保存到state中去
			*/
			dispatch({
				type: 'oelTrack/setState',
				payload: {
					ruleInfoVal: selectItemObj,
					trackRuleModalvisible: false,
				},
			})
		})
	}
    const columns = [
        {
            title: '定时器名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '定时定义',
            dataIndex: 'timedef',
            key: 'timedef',
            render: (text, record) => {
                let arr = record.allInterval
                let str = arr.join(',')
                str += ' 分'
                if (record.typ == 'TIMELIMIT') {
                    str = `在限期到达之前${str}`
                }
                return str
            },
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description',

        },
    ]
    const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
        resetFields()
        dispatch({
            type: 'oelTrack/setState', //抛一个事件给监听这个type的监听器
            payload: {
                trackRuleModalvisible: false,
                timeFileinfo: {},
                timertype: '',
            },
        })
    }
    const rowSelection = {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            let obj = {}
            if (selectedRowKeys && selectedRowKeys.length > 0) {
                obj = { actions: selectedRows[0].actions, name: selectedRows[0].name }
            }
            selectItemObj = obj
        },
    }
    const onPageChange = (page) => {
        let data = {
            current: page.current - 1,
            page: page.current - 1,
            pageSize: page.pageSize,
        }
        if (stdgroupUUID && stdgroupUUID.length > 0) {
            data = { ...data, groupUUID: stdgroupUUID[0] }
        }

        dispatch({
            type: 'oelTrack/setState',
            payload: data,
        })
    }
    const modalOpts = {
        title: '选择跟踪规则',
        visible,
        onOk,
        onCancel,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
        zIndex: 1000,
    }
    return (
        <Modal {...modalOpts} width="700px">
            <div className='radioSytpe'>
            <Row gutter={12} >
                <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                    <Table
                        key={new Date()}
                        bordered
                        columns={columns} //表结构字段
                        simple
                        size="small"
                        dataSource={dataSource} //表数据
                        loading={loading.effects['oelTrack/trackRule']} //页面加载
                        rowKey={record => record.uuid}
                        pagination={pagination} //分页配置
                        onChange={onPageChange} //分页、排序、筛选变化时触发，目前只使用了分页事件的触发
                        rowSelection={rowSelection}
                    />
                </Col>
            </Row>
            </div>
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
