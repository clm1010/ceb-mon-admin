import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Tree, Table, Row, Col, Input } from 'antd'

const Search = Input.Search

const formItemLayout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 14,
    },
}

const modal = ({
    dispatch,
    loading,
    visible,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    },
    lablelist,
    lablepagination,
    labelgroupUUID,
    treeNodes,
    either,
    lableInfoVal,
    lableInfoVal1,
}) => {
    let selectItemObj = either ? lableInfoVal : lableInfoVal1
    let searchobj = {}
    const onOk = () => {
        validateFields((errors) => {
            if (errors) {
                return
            }
            let lableInfoVal = []
            selectItemObj.forEach((obj) => {
                let item = { uuid: obj.uuid, name: obj.name }
                lableInfoVal.push(item)
            })
            if(either){
                dispatch({
                    type: 'policyRule/updateState',
                    payload: {
                        lableInfoVal: lableInfoVal,
                        labelVisible: false,
                    },
                })
            }else{
                dispatch({
                    type: 'policyRule/updateState',
                    payload: {
                        lableInfoVal1: lableInfoVal,
                        labelVisible: false,
                    },
                })
            }
            resetFields()
        })
    }

    const onCancel = () => {
        resetFields()
        dispatch({
            type: 'policyRule/updateState',
            payload: {
                labelVisible: false,
            },
        })
    }
    const getCheckbox = (record, data)=>{
        let flag = false
        data.forEach((item)=>{
            if(item.uuid == record.uuid){
                flag = true
            }
        })
        return flag
    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            selectItemObj = selectedRows
        },
        getCheckboxProps: record =>{
			return  ({
				defaultChecked: getCheckbox(record, selectItemObj),
				name: record.name,
			  })
		  }
    }

    const onSearch = (val) => {
        let data = {}
        if (val && either) {
            data = { q: `key=='*${val}*' and key!='ump_env*' and key!='ump_tool*' and enabled==true` }
        }
        if(val && !either){
            data = { q: `key=='*${val}*' and (key=='ump_env*' or key=='ump_tool*') and enabled==true` }
        }
        dispatch({
            type: 'policyRule/lablequery',
            payload: data,
        })
    }
	const onSelect = (selectedKeys, info) => {
		let groupkey = ''
		if (selectedKeys && selectedKeys.length > 0) {
			groupkey = selectedKeys[0]
		}
		if (searchobj && searchobj.input && searchobj.input.refs && searchobj.input.refs.input) {
			searchobj.input.refs.input.value = ''
        }
        let q = ''
        if(!either){
            q = "(key=='ump_env*' or key=='ump_tool*') and enabled==true "
        }else(
            q = "key!='ump_env*' and key!='ump_tool*' and enabled==true "
        )
		dispatch({
			type: 'policyRule/lablequery',
			payload: {
                groupUUID: groupkey,
                q:q,
			},
		})
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				labelgroupUUID: selectedKeys,
			},
		})
	}
    const onPageChange = (page) => {
        let q = ''
        if(!either){
            q = "(key=='ump_env*' or key=='ump_tool*') and enabled==true"
        }else(
            q = "key!='ump_env*' and key!='ump_tool*' and enabled==true"
        )
        let data = {
            current: page.current - 1,
            page: page.current - 1,
            pageSize: page.pageSize,
            q: q,
        }
        if (labelgroupUUID && labelgroupUUID.length > 0) {
			data = { ...data, groupUUID: labelgroupUUID[0] }
        }

        dispatch({
            type: 'policyRule/lablequery',
            payload: data,
        })
    }

    function getChild(child) { //這个就是获取组件对象
        searchobj = child
    }

    const columns = [
        {
            title: '标签名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '标签键',
            dataIndex: 'key',
            key: 'key',
        }, {
            title: '标签值',
            dataIndex: 'value',
            key: 'value',
        }, {
            title: '是否启用',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (text, record) => {
                if (text) return '是'
                else return '否'
            }
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
    ]

    const modalOpts = {
        title: '标签选择',
        visible,
        onOk,
        okText: '保存',
        onCancel,
        wrapClassName: 'vertical-center-modal',
        width: 750,
        maskClosable: false,
        zIndex: 950
    }

    return (
        <Modal {...modalOpts} height="600px">
            <Row gutter={24}>
                <Col lg={4} md={5} sm={5} xs={24} className="content-inner">
                    <div>标签组</div>
                    <div>
                        <Tree
                            showLine
                            onSelect={onSelect}
                            defaultExpandAll
                        >
                            {treeNodes}
                        </Tree>

                    </div>
                </Col>
                <Col lg={20} md={19} sm={19} xs={24}>
                    <Row gutter={24}>
                        <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                            <Search
                                id="123"
                                placeholder="请输标签名称查询"
                                style={{ width: '100%', marginBottom: '12px' }}
                                onSearch={onSearch}
                                ref={getChild}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                            <Table
                                key={new Date()}
                                bordered
                                columns={columns} //表结构字段
                                simple
                                size="small"
                                dataSource={lablelist} //表数据
                                loading={loading} //页面加载
                                rowKey={record => record.uuid}
                                pagination={lablepagination} //分页配置
                                onChange={onPageChange} //分页、排序、筛选变化时触发，目前只使用了分页事件的触发
                                rowSelection={rowSelection}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Modal>
    )
}

modal.propTypes = {
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool,
    item: PropTypes.object,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
}

export default Form.create()(modal)
