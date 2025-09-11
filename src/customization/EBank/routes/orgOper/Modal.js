import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Tooltip, Tag, Input } from 'antd'
const { Search } = Input

const modal = ({
	dispatch,
	visible,
	type,
	dataSource,
	item,
	loading,
	pagination,
	page,
}) => {
	const onOk = () => {
		dispatch({
			type: 'orgOper/querySuccess',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false
			},
		})																			//弹出窗口点击确定按钮触发的函数
	}

	const onCancel = () => {
		dispatch({
			type: 'orgOper/querySuccess',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false
			},
		})
	}

	const onPageChange = () => {
		dispatch({
			type: 'orgOper/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q: q === undefined ? '' : q,
			},
		})
		dispatch({
			type: 'orgOper/querySuccess',
			payload: {
				pageChange: new Date().getTime(),
			},
		})
	}

	const onAdd = (record) => {
		dispatch({
			type: 'orgOper/addOrgUser',
			payload: {
				orgId: item.id,
				username: record.name
			}
		})
	}

	const onDeletes = (record) => {
		dispatch({
			type: 'orgOper/deleteOrgUser',
			payload: {
				orgId: item.id,
				userId: record.id
			}
		})
	}

	const modalOpts = {
		title: type === 'add' ? '增加用户' : '查看/删除用户',
		visible,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	const columns = [
		{
			title: 'id',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'login',
			dataIndex: 'login',
			key: 'login',
		},
		{
			title: 'email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'isAdmin',
			dataIndex: 'isAdmin',
			key: 'isAdmin',
			render: (text, record) => {
				if (text) {
					return '是'
				}
				return '否'
			}
		},
		{
			title: 'isDisabled',
			dataIndex: 'isDisabled',
			key: 'isDisabled',
			render: (text, record) => {
				if (text) {
					return '是'
				}
				return '否'
			}
		},
		{
			title: 'lastSeenAtAge',
			dataIndex: 'lastSeenAtAge',
			key: 'lastSeenAtAge',
		},
		{
			title: 'authLabels',
			dataIndex: 'authLabels',
			key: 'authLabels',
			render: (text, record) => {
				let rest = text.map((item) => {
					return <Tag >{item}</Tag>
				})
				return <Tooltip placement="top" title={rest} >{rest}</Tooltip>
			},
		},
		{
			title: 'disabled',
			dataIndex: 'disabled',
			key: 'disabled',
			render: (text, record) => {
				if (text) {
					return '是'
				}
				return '否'
			}
		},
		{
			title: 'admin',
			dataIndex: 'admin',
			key: 'admin',
			render: (text, record) => {
				if (text) {
					return '是'
				}
				return '否'
			}
		},
		{
			title: '操作',
			width: 100,
			fixed: 'right',
			render: (text, record) => {
				return (
					<div>
						{type == 'add' ?
							<Button size="default" type="link" onClick={() => onAdd(record)} >增加到org</Button> :
							<Button size="default" type="link" onClick={() => onDeletes(record)}>org中删除</Button>}
					</div>
				)
			},
		},
	]

	const SearchUserName = (value) => {
		dispatch({
			type: 'orgOper/getOrgAllUser',
			payload: {
				orgId: item.id,
				username: value
			},
		})
	}

	return (
		<Modal {...modalOpts} width="60%" footer = {<Button key="cancel" onClick={onCancel}>关闭</Button>}>
			{
				type == 'add' ?
					<div style={{ marginBottom: 8 }}>
						<Search
							placeholder="请输入用户名称"
							onSearch={SearchUserName}
							style={{ width: 260 }}
						/>
					</div>
					:
					null
			}
			<Table
				scroll={{ x: 980 }} //滚动条
				bordered
				columns={columns}
				dataSource={dataSource}
				loading={loading}
				onChange={onPageChange}
				pagination={pagination}
				simple
				rowKey={record => record.uuid}
				size="small"
			/>
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

export default modal
