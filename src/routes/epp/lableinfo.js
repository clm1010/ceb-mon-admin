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
    },
    lablelist,
    lablepagination,
    labelgroupUUID,
    treeNodes,
    lableInfoVal,
}) => {
    let selectItemObj = lableInfoVal
    let searchobj = {}
    const onOk = () => {
        validateFields((errors) => {
            if (errors) {
                return
            }
            // let temp = lableInfoVal.filter(q => q.key=='ump_tool')
            // selectItemObj.forEach((obj) =>{
            //     // let item = { uuid: obj.uuid, name: obj.name ,key:obj.key}
            //     if(obj.key != 'ump_tool'){
            //         temp.push(obj)
            //     }
            // })
            dispatch({
                type: 'tool/updateState',
                payload: {
                    lableInfoVal: lableInfoVal,
                    labelVisible: false,
                },
            })
        })
    }

    const onCancel = () => {
        dispatch({
            type: 'tool/updateState',
            payload: {
                labelVisible: false,
            },
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
		dispatch({
			type: 'tool/lablequery',
			payload: {
                groupUUID: groupkey,
                // q:"key!= 'ump_tool*'"
			},
		})
		dispatch({
			type: 'tool/updateState',
			payload: {
				labelgroupUUID: selectedKeys,
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
        // onChange: (selectedRowKeys, selectedRows) => {
		// 	selectItemObj = selectedRows
        // },
        getCheckboxProps: record =>{
			return  ({
                // disabled: (record.key=='ump_tool'),
				defaultChecked: getCheckbox(record, selectItemObj),
				name: record.name,
			})
        },
        onSelect:(record, selected, selectedRows, nativeEvent)=>{
            if(selected){
                lableInfoVal.push(record)
                dispatch({
                    type: 'tool/updateState',
                    payload: { lableInfoVal },
                })
            }else{
                let temp = lableInfoVal.filter(item=>item.uuid !=record.uuid)
                dispatch({
                    type: 'tool/updateState',
                    payload: { lableInfoVal:temp },
                })
            }
        }
    }

    const onSearch = (val) => {
        let data = {}
        let groupkey = ''
        if (labelgroupUUID && labelgroupUUID.length > 0) {
			groupkey = labelgroupUUID[0]
		}
        if (val) {
            data = {groupUUID: groupkey,q: `name=='*${val}*'`}
        }
        let q = `name=='*${val}*'`
		dispatch({
			type: 'policyRule/updateState',
			payload: { serachVal: q },
		})
        dispatch({
            type: 'tool/lablequery',
            payload: data,
        })
    }

    const onPageChange = (page) => {
        let data = {
            current: page.current - 1,
            page: page.current - 1,
            pageSize: page.pageSize,
            // q: "key!= 'ump_tool*'",
        }
        if (labelgroupUUID && labelgroupUUID.length > 0) {
			data = { ...data, groupUUID: labelgroupUUID[0] }
        }

        dispatch({
            type: 'tool/lablequery',
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
            render: (text, record) => <div title={text}>{text}</div>,
            width:'25%'
		}, {
			title: '标签键',
			dataIndex: 'key',
            key: 'key',
            width:'30%'
		}, {
			title: '标签值',
			dataIndex: 'value',
            key: 'value',
            width:'15%',
            ellipsis:true
		},{
			title: '是否启用',
			dataIndex: 'enabled',
			key: 'enabled',
			render:(text,record)=>{
				if(text) return '是'
				else return '否'
            },
            width:'10%'
		}, {
			title: '描述',
			dataIndex: 'description',
            key: 'description',
            width:'20%'
		},
    ]
    
    const modalOpts = {
        title: '标签选择',
        visible,
        onOk,
        okText: '保存',
        onCancel,
        wrapClassName: 'vertical-center-modal',
        width: 800,
        maskClosable: false,
    }

    return (
        <Modal {...modalOpts} height="630px">
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
                    <Row gutter={24}>
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
