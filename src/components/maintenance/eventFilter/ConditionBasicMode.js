import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Table, Button, Tabs, Row, Col, Icon, Tooltip, message, Badge, Alert, Collapse, Select, Spin } from 'antd'
import mystyle from './DataModal.less'
import AppSelectComp from '../../../components/appSelectComp'
import debounce from 'throttle-debounce/debounce'
import { request, config } from '../../../utils'

const { Panel } = Collapse;
const FormItem = Form.Item
const TabPane = Tabs.TabPane
const { appSearchFromCmdb } = config.api

const formItemLayoutAppNameEditing = {
	labelCol: {
		span: 4,
	},
	wrapperCol: {
		span: 16,
	},
}
const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
	},
}
const formItemLayout5 = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 15,
	},
}
const formItemLayout6 = {
	labelCol: {
		span: 9,
	},
	wrapperCol: {
		span: 15,
	},
}
const formItemLayout7 = {
	labelCol: {
		span: 10,
	},
	wrapperCol: {
		span: 14,
	},
}

const ConditionBasicMode = ({
	loading,
	dispatch,
	localPath,
	myform,
	isExpertRoles,
	type,
	isExpert,
	listHost1,
	listHost2,
	selectHostuuid,
	host2portMap,
	listPort1,
	listPort2,
	listApp1,
	listApp2,
	listQita1,
	listQita2,
	listDistributed2,
	selectedKeysHost1,
	selectedKeysHost2,
	selectedKeysPort1,
	selectedKeysPort2,
	selectedKeysApp1,
	selectedKeysApp2,
	selectedKeysQita1,
	selectedKeysQita2,
	paginationHost,
	paginationPort,
	paginationApp,
	paginationQita,
	buttonState,
	appSelect,
	forbind,
	forbindQita,
	optionAppNameEditing,
	optionCluster,
	optionNamespace,
	optionIndicator,
	appNameSelect,
	appDistributed,
	clusterDistributed,
	namespaceDistributed,
	indicatorDistributed,
	appDistributedFlag,
	clusterDistributedFlag,
	namespaceDistributedFlag,
	indicatorDistributedFlag,
}) => {
	//console.log('设备选择器全集port：',listPort1)
	//console.log('设备选择器全集：',listHost1)
	//console.log('其他域设备：', listQita2)
	//console.log('应用分类选择器：', listApp2)
	//console.log('设备选择器：', listHost2)
	let otherList = []
	let appList = []
	let hostList = []
	
	if (listQita2.length > 0) { //去重
		for (let other of listQita2) {
			if (otherList.indexOf(other) === -1) {
				otherList.push(other.keyword)
			}
		}
	}

	if (listApp2.length > 0) {
		for (let app of listApp2) {
			if (appList.indexOf(app) === -1) {
				appList.push(app.affectSystem)
			}
		}
	}

	if (listDistributed2.length > 0) {
		clusterDistributed = listDistributed2[0].application.clusters.map(obj => { return obj.name })
		namespaceDistributed = listDistributed2[0].application.namespaces.map(obj => { return obj.name })
		indicatorDistributed = listDistributed2[0].application.indicators.map(obj => { return obj.name })
		appDistributed = listDistributed2[0].application.name
	}

	if (listHost2.length > 0) {
		for (let host of listHost2) {

			if (hostList.indexOf(host) === -1) {
				//hostList.push(host.mo.discoveryIP ? host.mo.discoveryIP : host.mo.keyword)
				let hostname = host.mo.discoveryIP ? host.mo.discoveryIP : host.mo.keyword
				let hostPorts = host2portMap.get(host.mo.uuid)
				let ports = []
				if (hostPorts) {
					for (let port of hostPorts) {
						ports.push(port.portName)
					}
					if (ports.length > 0) {
						hostname += "(端口：" + ports.join(',') + ")"
					}
				}
				hostList.push(hostname)
			}
		}
	}
	let hostText = hostList.join(',')
	let appText = appList.join(',')
	let otherText = otherList.join(',')
	let ipNum = hostList.length + otherList.length
	//	console.log('网络设备选择器:', hostText)
	//	console.log('应用分类选择器:', appText)
	//	console.log('主机IP选择器：', otherText)
	//	console.log('去重后的其他域设备：',otherList)
	//	console.log('去重后的应用分类选择器:',appList)
	//	console.log('去重后的设备选择器:',hostList)
	let infos = (hostText === '' ? '' : `过滤的网络设备的IP为: ${hostText}`) + (appText === '' ? '' : ` 过滤的应用分类名称为: ${appText}`) + (otherText === '' ? '' : ` 过滤的其他域对象的IP为：${otherText}`) + (ipNum > 0 ? `。总共过滤ip数量为:${ipNum}` : '')
	if (infos === '') {
		if (appDistributed.length > 0) {
			infos = `过滤的应用是：${appDistributed}`
			if (clusterDistributed.length > 0) {
				infos += `, 过滤的集群是：${clusterDistributed.join(',')}`
			}
			if (namespaceDistributed.length > 0) {
				infos += `, 过滤的命名空间是：${namespaceDistributed.join(',')}`
			}
			if (indicatorDistributed.length > 0) {
				infos += `, 过滤的指标是：${indicatorDistributed.join(',')}`
			}
		} else {
			infos = '未定义过滤条件'
		}
	}
	//console.log('选择信息：', infos)
	//处理网络设备的展示-----start
	let listHost1new = []
	listHost1.forEach((item, index) => {
		let hasFlg = false
		listHost2.forEach((item2, index) => {
			if (item2.mo.uuid === item.mo.uuid) {
				hasFlg = true
			}
		})
		if (hasFlg) {
			//listHost2.push(item);
		} else {
			listHost1new.push(item)
		}
	})
	//处理网络设备的展示-----end
	//处理端口的展示-----start
	let listPort1new = []
	listPort1.forEach((item, index) => {
		let hasFlg = false
		listPort2.forEach((item2, index) => {
			if (item2.uuid === item.uuid) {
				hasFlg = true
			}
		})
		if (hasFlg) {
			//listHost2.push(item);
		} else {
			listPort1new.push(item)
		}
	})
	//处理端口的展示-----end
	//处理应用系统的展示-----start
	let listApp1new = []
	listApp1.forEach((item, index) => {
		let hasFlg = false
		listApp2.forEach((item2, index) => {
			if (item2.uuid === item.uuid) {
				hasFlg = true
			}
		})
		if (hasFlg) {
			//listHost2.push(item);
		} else {
			listApp1new.push(item)
		}
	})
	//处理应用系统的展示-----end
	//处理其他设备的展示-----start
	let listQita1new = []
	listQita1.forEach((item, index) => {
		let hasFlg = false
		listQita2.forEach((item2, index) => {
			if (item2.uuid === item.uuid) {
				hasFlg = true
			}
		})
		if (hasFlg) {
			//listHost2.push(item);
		} else {
			listQita1new.push(item)
		}
	})
	//处理其他设备的展示-----end
	const {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
	} = myform

	const appSelectProps = Object.assign({}, appSelect, {
		placeholders: '',
		name: '应用分类名称',
		modeType: 'combobox',
		required: false,
		dispatch,
		form: myform,
		disabled: false,
		compName: 'appQita',
		formItemLayout: formItemLayout7,
	})

	const columns = [
		{
			title: 'IP地址',
			dataIndex: 'mo.discoveryIP',
			key: 'mo.discoveryIP',
			width: 60,
			render: (text, record) => {
				return (
					<div>{text}</div>
				)
			},
		}, {
			title: '名称',
			dataIndex: 'mo.name',
			key: 'mo.name',
			width: 70,
			render: (text, record) => {
				return (
					<Tooltip title={text} placement="topLeft">
						{text}
					</Tooltip>
				)
			},
		},
	]

	const columns2 = [
		{
			title: 'IP地址',
			dataIndex: 'mo.keyword',
			key: 'mo.keyword',
			width: 60,
			render: (text, record) => {
				let info = 0
				if (host2portMap.get(record.mo.uuid)) {
					let moInfo = []
					//去重
					for (let mos of host2portMap.get(record.mo.uuid)) {
						if (moInfo.indexOf(mos) === -1) {
							moInfo.push(mos)
						}
					}
					info = moInfo.length
				}
				//console.log('已选设备的IP：', record.mo.discoveryIP)
				//console.log('该设备下已选择的端口：', info)
				return (
					<div>{info === 0 ? null : <Badge status="processing" />}{text}</div>
				)
			},
		}, {
			title: '名称',
			dataIndex: 'mo.name',
			key: 'mo.name',
			width: 70,
			render: (text, record) => {
				return (
					<Tooltip title={text} placement="topLeft">
						{text}
					</Tooltip>
				)
			},
		},
	]

	const columnsPort = [
		{
			title: '端口名',
			dataIndex: 'portName',
			key: 'portName',
			width: 95,
			render: (text, record) => {
				return (
					<div>
						<Tooltip title={record.portName} placement="topLeft" style={{ width: 95 }}>
							<span>{text}</span>
						</Tooltip>
					</div>
				)
			},
		},
	]
	const columnsApp = [
		{
			title: '应用分类名称',
			dataIndex: 'affectSystem',
			key: 'affectSystem',
			render: (text, record) => {
				let bizDesc = record.businessIntroduction
				return (
					<div>
						<Tooltip title={bizDesc} placement="topLeft">
							<span>{text}{record.branch ? `/ ${record.branch}` : ''}</span>

						</Tooltip>
					</div>
				)
			},
		}
	]
	const columnsApp1 = [
		{
			title: '应用分类名称',
			dataIndex: 'affectSystem',
			key: 'affectSystem',
			width: 200,
			render: (text, record) => {
				let bizDesc = record.businessIntroduction
				return (
					<div>
						<Tooltip title={bizDesc} placement="topLeft">
							<span>{text}</span>
						</Tooltip>
					</div>
				)
			},
		}
		// ,{
		// 	title: '告警大类',
		// 	dataIndex: 'catalog',
		// 	key: 'catalog',
		// 	width: 200,
		// 	render: (text, record) => {
		// 		const componentType = record.componentType
		// 		const uuid = record.uuid
		// 		return (
		// 			<Select
		// 				mode="multiple"
		// 				style={{ width: '100%' }}
		// 				placeholder="Please select"
		// 				defaultValue={componentType}
		// 				onSelect={typeSelect}
		// 				onDeselect={typeDeselect}
		// 			>
		// 				<Select.Option key={uuid} value="操作系统">操作系统</Select.Option>
		// 				<Select.Option key={uuid} value="数据库">数据库</Select.Option>
		// 				<Select.Option key={uuid} value="中间件">中间件</Select.Option>
		// 				<Select.Option key={uuid} value="存储">存储</Select.Option>
		// 				<Select.Option key={uuid} value="硬件">硬件</Select.Option>
		// 				<Select.Option key={uuid} value="应用">应用</Select.Option>
		// 				<Select.Option key={uuid} value="安全">安全</Select.Option>
		// 				<Select.Option key={uuid} value="网络">网络</Select.Option>
		// 				<Select.Option key={uuid} value="自检">自检</Select.Option>
		// 				<Select.Option key={uuid} value="机房环境">机房环境</Select.Option>
		// 				<Select.Option key={uuid} value="私有云">私有云</Select.Option>
		// 				<Select.Option key={uuid} value="桌面云">桌面云</Select.Option>
		// 				<Select.Option key={uuid} value="全栈云">全栈云</Select.Option>
		// 			</Select>
		// 		)
		// 	},
		// }
	]
	const columnsApp2 = [
		{
			title: '应用系统',
			dataIndex: 'affectSystem',
			key: 'affectSystem',
			width: 150,
			render: (text, record) => {
				let bizDesc = record.businessIntroduction
				return (
					<div>
						<Tooltip title={bizDesc} placement="topLeft">
							<span>{text}</span>
						</Tooltip>
					</div>
				)
			},
		},{
			title: '集群',
			dataIndex: 'catalog',
			key: 'catalog',
			width: 150,
			render: (text, record) => {
				const componentType = record.componentType
				const uuid = record.uuid
				return (
					<Select
						mode="multiple"
						style={{ width: '100%' }}
						placeholder="Please select"
						defaultValue={componentType}
						onSelect={typeSelect}
						onDeselect={typeDeselect}
					>
						<Select.Option key={uuid} value="操作系统">操作系统</Select.Option>
						<Select.Option key={uuid} value="数据库">数据库</Select.Option>
						<Select.Option key={uuid} value="中间件">中间件</Select.Option>
						<Select.Option key={uuid} value="存储">存储</Select.Option>
						<Select.Option key={uuid} value="硬件">硬件</Select.Option>
						<Select.Option key={uuid} value="应用">应用</Select.Option>
						<Select.Option key={uuid} value="安全">安全</Select.Option>
						<Select.Option key={uuid} value="网络">网络</Select.Option>
						<Select.Option key={uuid} value="自检">自检</Select.Option>
						<Select.Option key={uuid} value="机房环境">机房环境</Select.Option>
						<Select.Option key={uuid} value="私有云">私有云</Select.Option>
						<Select.Option key={uuid} value="桌面云">桌面云</Select.Option>
						<Select.Option key={uuid} value="全栈云">全栈云</Select.Option>
					</Select>
				)
			},
		}, {
			title: '命名空间',
			dataIndex: 'affectSystem',
			key: 'affectSystem',
			width: 150,
			render: (text, record) => {
				let bizDesc = record.businessIntroduction
				return (
					<div>
						<Tooltip title={bizDesc} placement="topLeft">
							<span>{text}</span>
						</Tooltip>
					</div>
				)
			},
		}, {
			title: '指标',
			dataIndex: 'affectSystem',
			key: 'affectSystem',
			width: 150,
			render: (text, record) => {
				let bizDesc = record.businessIntroduction
				return (
					<div>
						<Tooltip title={bizDesc} placement="topLeft">
							<span>{text}</span>
						</Tooltip>
					</div>
				)
			},
		}
	]

	const columnsQita = [
		{
			title: '对象名称',
			dataIndex: 'name',
			key: 'name',
			width: 60,
			render: (text, record) => {
				return (
					<div>
						<Tooltip title={text} placement="topLeft">
							<span>{text}</span>
						</Tooltip>
					</div>
				)
			},
		}, {
			title: '对象关键字',
			dataIndex: 'keyword',
			key: 'keyword',
			width: 70,
			render: (text, record) => {
				return (
					<div>
						<Tooltip title={text} placement="topLeft">
							<span>{text}</span>
						</Tooltip>
					</div>
				)
			},
		}, {
			title: '应用分类名称',
			dataIndex: 'appName',
			key: 'appName',
			width: 75,
			render: (text, record) => {
				return (
					<div>
						<Tooltip title={text} placement="topLeft">
							<span>{text}{record.mngtOrg ? `/ ${record.mngtOrg}` : ''}</span>
						</Tooltip>
					</div>
				)
			},
		},
	]

	const onPageChangeHost = (page) => {
		dispatch({
			type: `${localPath}/queryNetwork`,
			payload: {
				page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
				ageSize: page.pageSize,
			},
		})
	}

	const onPageChangePort = (page) => {
		dispatch({
			type: `${localPath}/queryPorts`,
			payload: {
				page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
				ageSize: page.pageSize,
			},
		})
	}

	const onPageChangeApp = (page) => {
		dispatch({
			type: `${localPath}/queryApp`,
			payload: {
				page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
				ageSize: page.pageSize,
			},
		})
	}

	const onPageChangeQita = (page) => {
		dispatch({
			type: `${localPath}/queryQita`,
			payload: {
				page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
				ageSize: page.pageSize,
			},
		})
	}

	const searchHost = () => {
		const data = {
			...getFieldsValue(),
		}
		let q = ''
		let name = data.hostName
		let ip = data.ip
		let validate = true
		let regex = '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.'
			+ '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.'
			+ '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.'
			+ '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$'
		/*
		if(ip !== ''){
			if(!ip.match(regex)){
				validate = false
			}
		}
		*/
		if (validate) {
			if (name && name !== '') {
				q = `${q} and name=='*${name}*'`
			}
			if (ip && ip !== '') {
				q = `${q} and discoveryIP=='*${ip}*'`
			}
			//console.log("localpath:"+localPath)
			dispatch({
				type: `${localPath}/updateState`,
				payload: {
					hostname: name,
					hostkeyword: ip,
				},
			})
			dispatch({
				type: `${localPath}/queryNetwork`,
				payload: {
					q,
				},
			})
		} else {
			Modal.warning({
				title: 'IP地址错误，请重新输入！',
				okText: 'OK',
			})
		}
	}

	const searchPort = () => {
		const data = {
			...getFieldsValue(),
		}
		let q = ''
		let portname = data.portname
		if (portname && portname !== '') {
			q = `${q} portName=='*${portname}*'`
		}

		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				portname,
			},
		})
		dispatch({
			type: `${localPath}/queryPorts`,
			payload: {
				q,
				uuid: selectHostuuid,
			},
		})
	}

	const searchApp = () => {
		const data = {
			...getFieldsValue(),
		}
		let q = ''
		let appName = data.appName
		//console.log('appName : ', appName)
		let jieshao = data.jieshao
		if (appName && appName !== '') {
			q = ` name=='*${appName}*'`
			if (jieshao && jieshao !== '') {
				q = ` name=='*${appName}*'` + ';' + ` businessIntroduction=='*${jieshao}*'`
			}
		} else if (jieshao && jieshao !== '') {
			q = ` businessIntroduction=='*${jieshao}*'`
		}
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				appName,
				bizDesc: jieshao,
			},
		})
		dispatch({
			type: `${localPath}/queryApp`,
			payload: {
				q,
			},
		})
	}

	const searchQita = () => {
		const data = {
			...getFieldsValue(),
		}
		let q = ''
		let nameQita = data.nameQita
		let keywordQita = data.keywordQita
		let appQita = data.appQita
		if (nameQita && nameQita !== '') {
			q = `${q}; name=='*${nameQita}*'`
		}
		if (keywordQita && keywordQita !== '') {
			q = `${q}; keyword=='${keywordQita}'`
		}
		if (appQita && appQita !== '') {
			q = `${q}; appName=='*${appQita}*'`
		}
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				nameQita,
				keywordQita,
				appQita,
			},
		})
		dispatch({
			type: `${localPath}/queryQita`,
			payload: {
				q,
			},
		})
	}

	const rowSelectionHost1 = {
		onChange: (selectedRowKeys, selectedRows) => {
			if (selectedRowKeys.length > 100) {
				message.warning('IP个数超出了100个，请再设置一个维护期，或者使用其它模式定义维护期')
				dispatch({
					type: `${localPath}/updateState`,
					payload: {
						selectedKeysHost1: selectedRowKeys,
						forbind: true
					},
				})
			} else {
				dispatch({
					type: `${localPath}/updateState`,
					payload: {
						selectedKeysHost1: selectedRowKeys,
						forbind: false
					},
				})
			}
		},
	}

	const rowSelectionHost2 = {
		onChange: (selectedRowKeys, selectedRows) => {
			dispatch({
				type: `${localPath}/updateState`,
				payload: {
					selectedKeysHost2: selectedRowKeys,
				},
			})
		},
	}

	const rowSelectionPort1 = {
		onChange: (selectedRowKeys, selectedRows) => {
			dispatch({
				type: `${localPath}/updateState`,
				payload: {
					selectedKeysPort1: selectedRowKeys,
				},
			})
		},
	}

	const rowSelectionPort2 = {
		onChange: (selectedRowKeys, selectedRows) => {
			dispatch({
				type: `${localPath}/updateState`,
				payload: {
					selectedKeysPort2: selectedRowKeys,
				},
			})
		},
	}

	const rowSelectionApp1 = {
		onChange: (selectedRowKeys, selectedRows) => {
			dispatch({
				type: `${localPath}/updateState`,
				payload: {
					selectedKeysApp1: selectedRowKeys,
				},
			})
		},
	}

	const rowSelectionApp2 = {
		onChange: (selectedRowKeys, selectedRows) => {
			dispatch({
				type: `${localPath}/updateState`,
				payload: {
					selectedKeysApp2: selectedRowKeys,
				},
			})
		},
	}

	const rowSelectionQita1 = {
		onChange: (selectedRowKeys, selectedRows) => {
			if (selectedRowKeys.length > 100) {
				message.warning('IP个数超出了100个，请再设置一个维护期，或者使用其它模式定义维护期')
				dispatch({
					type: `${localPath}/updateState`,
					payload: {
						selectedKeysQita1: selectedRowKeys,
						forbindQita: true
					},
				})
			} else {
				dispatch({
					type: `${localPath}/updateState`,
					payload: {
						selectedKeysQita1: selectedRowKeys,
						forbindQita: false
					},
				})
			}
		},
	}

	const rowSelectionQita2 = {
		onChange: (selectedRowKeys, selectedRows) => {
			dispatch({
				type: `${localPath}/updateState`,
				payload: {
					selectedKeysQita2: selectedRowKeys,
				},
			})
		},
	}

	const rightHost = () => {
		if (selectedKeysHost1 && selectedKeysHost1.length > 0) {

		} else {
			message.error('请选择需要移动的内容')
			return
		}
		listHost1.forEach((item, index) => {
			let hasflg = false
			selectedKeysHost1.forEach((key, index) => {
				if (key === item.mo.uuid) {
					hasflg = true
				}
			})
			if (hasflg) {
				listHost2.push(item)
			} else {

			}
		})
		let hash = {}
		let selectMo = listHost2.reduce((item, next) => {
			hash[next.mo.uuid] ? '' : hash[next.mo.uuid] = true && item.push(next)
			return item
		}, [])
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				listHost2: selectMo,
				appNameEditing: '',
				optionAppNameEditing: [],
			},
		})
	}

	const typeSelect = (e, a) => {
		const appKey = a.key	// app应用的 uuid 用于定位
		listApp2.forEach((item, index) => {
			if (item.uuid === appKey) {
				item.componentType.push(e)
				dispatch({
					type: `${localPath}/updateState`,
					payload: {
						listApp2: listApp2,
					},
				})
			}
		})
	}
	const typeDeselect = (e, a) => {
		const appKey = a.key	// app应用的 uuid 用于定位
		listApp2.forEach((item, index) => {
			if (item.uuid === appKey) {
				item.componentType = item.componentType.filter(c => c !== e);
				dispatch({
					type: `${localPath}/updateState`,
					payload: {
						listApp2: listApp2,
					},
				})
			}
		})
	}

	const leftHost = () => {
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				listPort2: [],
			},
		})

		if (selectedKeysHost2 && selectedKeysHost2.length > 0) {

		} else {
			message.error('请选择需要移动的内容')
			return
		}
		let newkeys = []
		listHost2.forEach((item, index) => {
			let hasflg = false
			selectedKeysHost2.forEach((key, index) => {
				if (key === item.mo.uuid) {
					hasflg = true
				}
			})
			if (hasflg) {

			} else {
				newkeys.push(item)
			}
		})
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				listHost2: newkeys,
			},
		})
	}

	const rightPort = () => {
		if (selectedKeysPort1 && selectedKeysPort1.length > 0) {

		} else {
			message.error('请选择需要移动的内容')
			return
		}
		listPort1.forEach((item, index) => {
			let hasflg = false
			selectedKeysPort1.forEach((key, index) => {
				if (key === item.uuid) {
					hasflg = true
				}
			})
			if (hasflg) {
				listPort2.push(item)
			} else {

			}
		})
		let ports = host2portMap.get(selectHostuuid)
		if (ports && ports.length > 0) {

		} else {
			ports = []
		}
		listPort2.forEach((item, index) => {
			ports.push(item)
		})

		let hash = {}
		let selectPorts = ports.reduce((item, next) => {
			hash[next.uuid] ? '' : hash[next.uuid] = true && item.push(next)
			return item
		}, [])
		host2portMap.set(selectHostuuid, selectPorts)
		//host2portMap.set(selectHostuuid, ports)
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				listPort2: selectPorts,
				host2portMap,
			},
		})
	}

	const leftPort = () => {
		if (selectedKeysPort2 && selectedKeysPort2.length > 0) {

		} else {
			message.error('请选择需要移动的内容')
			return
		}
		let newkeys = []
		listPort2.forEach((item, index) => {
			let hasflg = false
			selectedKeysPort2.forEach((key, index) => {
				if (key === item.uuid) {
					hasflg = true
				}
			})
			if (hasflg) {

			} else {
				newkeys.push(item)
			}
		})
		host2portMap.set(selectHostuuid, newkeys)
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				listPort2: newkeys,
				host2portMap,
			},
		})
	}

	const addComponentType = () => {
		listApp2
	}

	const onAppNameChange = (value) => {
		// 选中当前应用
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				appDistributed: value,
				clusterDistributed: [],
				optionCluster: [],
				namespaceDistributed: [],
				optionNamespace: [],
			},
		})
	}

	const convertAppName = (str) => {
		// 使用正则表达式匹配括号内的内容
		const match = str.match(/（([^)]+)）/);
		if (match) {
			// 如果匹配成功，将括号内的内容和括号外的内容用管道符 '|' 连接
			// return `${match[1]}|${str.replace(match[0], '')}`;
			return `${str.replace(match[0], '')}`;
		}
		// 如果没有匹配到括号内容，返回原字符串
		return str;
	}

	const getClustsByApp = (value) => {
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				clusterDistributedFlag: false,
				optionCluster: [],
			},
		})		 

		const appConvert = convertAppName(appDistributed)
		// 查询应用下的集群列表
		let q = `systemName=='*${appConvert}*'`
		const fieldName = 'cluster'

		if (value!==null && value!==undefined) {
			q += ` and cluster=='*${value}*'`
		}

		dispatch({
			type: `${localPath}/queryClustersByApp`,
			payload: {
				q,
				fieldName
			},
		})
	}

	const getApp = (value) => {
		if (value != '') {
			const q = `affectSystem=='*${value}*'`
			dispatch({
				type: `${localPath}/queryAppInCmdb`,
				payload: {
					q,
					page: 0,
					pageSize: 200
				},
			})
		}
	}

	const indicatorsFind = (value) => {
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				indicatorDistributedFlag: false,
				optionIndicator: [],
			},
		})
		 
		if (value === undefined) {
			value = ''
		}
		const q = `name=='*${value}*'`
		dispatch({
			type: `${localPath}/queryIndicators`,
			payload: {
				q,
				groupUUID: '97d114bf-dc7f-454f-8bb3-e7524c999b6b',
				sort: 'name'
			},
		})
	}

	const onClusterChange = (value) => {
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				clusterDistributed: value,
				namespaceDistributed: [],
				optionNamespace: [],
			},
		})
	}

	const getNamespaceByCluster = (value) => {

		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				namespaceDistributedFlag: false,
				optionNamespace: [],
			},
		}) 

		let clusterStr = ''
		if (clusterDistributed.length > 0) {
			clusterDistributed.forEach(item => clusterStr += `'${item}',`)
			clusterStr = clusterStr.substring(0, clusterStr.length - 1)	//去掉末尾循环产生的逗号
		}

		const appConvert = convertAppName(appDistributed)

		// 查询应用下的集群列表
		const clusters = clusterDistributed.length === 0 ? '' : ` and cluster=in=(${clusterStr})`
		let q = `systemName=='*${appConvert}*'` + clusters
		const fieldName = 'namespace'

		if (value!==null && value!==undefined) {
			q += ` and namespace=='*${value}*'`
		}

		dispatch({
			type: `${localPath}/queryNamespacesByCluster`,
			payload: {
				q,
				fieldName
			},
		})
	}

	const onNamespaceChange = (value) => {
		console.log('onNamespaceChange')
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				namespaceDistributed: value,
			},
		})
	}

	const onIndicatorChange = (value) => {
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				indicatorDistributed: value,
			},
		})
	}

	const rightApp = () => {
		if (selectedKeysApp1 && selectedKeysApp1.length > 0) {

		} else {
			message.error('请选择需要移动的内容')
			return
		}
		listApp1.forEach((item, index) => {
			let hasflg = false
			selectedKeysApp1.forEach((key, index) => {
				if (key === item.uuid) {
					hasflg = true
				}
			})

			if (hasflg) {
				item.componentType = []
				listApp2.push(item)
			} else {

			}
		})
		let hash = {}
		let selectApp = listApp2.reduce((item, next) => {
			hash[next.uuid] ? '' : hash[next.uuid] = true && item.push(next)
			return item
		}, [])
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				listApp2: selectApp,
			},
		})
	}

	const leftApp = () => {
		if (selectedKeysApp2 && selectedKeysApp2.length > 0) {

		} else {
			message.error('请选择需要移动的内容')
			return
		}
		let newkeys = []
		listApp2.forEach((item, index) => {
			let hasflg = false
			selectedKeysApp2.forEach((key, index) => {
				if (key === item.uuid) {
					hasflg = true
				}
			})
			if (hasflg) {

			} else {
				newkeys.push(item)
			}
		})
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				listApp2: newkeys,
				// appNameEditing:'',
				// ruleInstanceKey:new Date().getTime()
			},
		})
	}

	const rightQita = () => {
		if (selectedKeysQita1 && selectedKeysQita1.length > 0) {

		} else {
			message.error('请选择需要移动的内容')
			return
		}
		listQita1.forEach((item, index) => {
			let hasflg = false
			selectedKeysQita1.forEach((key, index) => {
				if (key === item.uuid) {
					hasflg = true
				}
			})
			if (hasflg) {
				listQita2.push(item)
			} else {

			}
		})
		let hash = {}
		let selectOth = listQita2.reduce((item, next) => {
			hash[next.uuid] ? '' : hash[next.uuid] = true && item.push(next)
			return item
		}, [])
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				listQita2: selectOth,
			},
		})
	}

	const leftQita = () => {
		if (selectedKeysQita2 && selectedKeysQita2.length > 0) {

		} else {
			message.error('请选择需要移动的内容')
			return
		}
		let newkeys = []
		listQita2.forEach((item, index) => {
			let hasflg = false
			selectedKeysQita2.forEach((key, index) => {
				if (key === item.uuid) {
					hasflg = true
				}
			})
			if (hasflg) {

			} else {
				newkeys.push(item)
			}
		})
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				listQita2: newkeys,
			},
		})
	}

	const host2Click = (record, index, event) => {
		dispatch({
			type: `${localPath}/queryPorts`, //查找ip地址的对应端口
			payload: {
				uuid: record.mo.uuid,
				selectHostuuid: record.mo.uuid,
			},
		})
		dispatch({
			type: `${localPath}/updateState`, //
			payload: {
				selectHostuuid: record.mo.uuid,
			},
		})
		dispatch({
			type: `${localPath}/controlButton`,
			payload: {
				buttonState: false,
			},
		})
	}
	return (
		<div>
			<Collapse bordered={false} >
				<Panel header="过滤条件" key="1">
					<Alert message={infos} type="info" showIcon /><br />
				</Panel>
			</Collapse>
			<Tabs defaultActiveKey="1" type="card">
				<TabPane tab={<span><Icon type="user" />网络设备选择器</span>} key="1">
					<div className={mystyle.overBox}>
						<div className={mystyle.overBoxInner}>
							<div className={mystyle.overBoxInnerPartLeft} style={{ float: 'left' }}>
								<Row >
									<Col span={10}>
										<FormItem label="名称" hasFeedback {...formItemLayout5}>
											{getFieldDecorator('hostName', {
												initialValue: '',
											})(<Input />)}
										</FormItem>
									</Col>
									<Col span={9}>
										<FormItem label="IP" hasFeedback {...formItemLayout5}>
											{getFieldDecorator('ip', {
												initialValue: '',
											})(<Input />)}
										</FormItem>
									</Col>
									<Col span={5}>
										<Button onClick={searchHost} size="large" icon="search" />
									</Col>
								</Row >
								<Row >
									<Col span={11}>
										<Table
											bordered
											columns={columns}
											dataSource={listHost1new}
											loading={loading}
											onChange={onPageChangeHost}
											pagination={paginationHost}
											simple
											rowKey={record => record.mo.uuid}
											size="small"
											rowSelection={rowSelectionHost1}
										/>
									</Col>
									<Col span={2} className={mystyle.buttonClick}>
										<div className={mystyle.buttonClickInner}>
											<Button disabled={type === 'see' || forbind || type === 'adjust'} onClick={rightHost} ><Icon type="right" /></Button>
											<Button disabled={type === 'see' || type === 'adjust'} onClick={leftHost} ><Icon type="left" /></Button>
										</div>
									</Col>
									<Col span={11}>
										<Table
											bordered
											columns={columns2}
											dataSource={listHost2}
											loading={loading}
											simple
											rowKey={record => record.mo.uuid}
											size="small"
											rowSelection={rowSelectionHost2}
											pagination={false}
											onRowClick={host2Click}
										/>
									</Col>
								</Row >
							</div>
							<div className={mystyle.overBoxInnerPartRight} style={{ float: 'right' }}>
								<Row>
									<Col span={14}>
										<FormItem label="端口" hasFeedback {...formItemLayout5}>
											{getFieldDecorator('portname', {
												initialValue: '',
											})(<Input />)}
										</FormItem>
									</Col>
									<Col span={8}>
										<Button onClick={searchPort} size="large" icon="search" />
									</Col>
								</Row >
								<Row>
									<Col span={10}>
										<Table
											bordered
											columns={columnsPort}
											dataSource={listPort1new}
											loading={loading}
											simple
											rowKey={record => record.uuid}
											size="small"
											rowSelection={rowSelectionPort1}
											onChange={onPageChangePort}
											pagination={paginationPort}
										/>
									</Col>
									<Col span={3} className={mystyle.buttonClick}>
										<div className={mystyle.buttonClickInner}>
											<Button disabled={type === 'see' || type === 'adjust'} onClick={rightPort} ><Icon type="right" /></Button>
											<Button disabled={type === 'see' || type === 'adjust'} onClick={leftPort} ><Icon type="left" /></Button>
										</div>
									</Col>
									<Col span={10}>
										<Table
											bordered
											columns={columnsPort}
											dataSource={listPort2}
											loading={loading}
											simple
											rowKey={record => record.uuid}
											size="small"
											rowSelection={rowSelectionPort2}
											pagination={false}
										/>
									</Col>
								</Row >
							</div>
						</div>
					</div>
				</TabPane>
				<TabPane tab={<span><Icon type="user" />应用分类选择器</span>} key="2">
					<div className={mystyle.overBox}>
						<div className={mystyle.overBoxInnerApp}>
							<Row >
								<Col span={8}>
									<FormItem label="应用分类名称" hasFeedback {...formItemLayout6}>
										{getFieldDecorator('appName', {
											initialValue: '',
										})(<Input />)}
									</FormItem>
								</Col>
								<Col span={8}>
									<FormItem label="业务功能介绍" hasFeedback {...formItemLayout6}>
										{getFieldDecorator('jieshao', {
											initialValue: '',
										})(<Input />)}
									</FormItem>
								</Col>
								<Col span={5}>
									<Button onClick={searchApp} size="large" style={{ marginLeft: '10px' }} icon="search" />
								</Col>
							</Row >
							<Row >
								<Col span={11}>
									<Table
										bordered
										columns={columnsApp}
										dataSource={listApp1new}
										loading={loading}
										onChange={onPageChangeApp}
										pagination={paginationApp}
										simple
										rowKey={record => record.uuid}
										size="small"
										rowSelection={rowSelectionApp1}
									/>
								</Col>
								<Col span={2} className={mystyle.buttonClick}>
									<div className={mystyle.buttonClickInner}>
										<Button disabled={type === 'see' || type === 'adjust'} onClick={rightApp} ><Icon type="right" /></Button>
										<Button disabled={type === 'see' || type === 'adjust'} onClick={leftApp} ><Icon type="left" /></Button>
									</div>
								</Col>
								<Col span={11}>
									<Table
										bordered
										columns={columnsApp1}
										dataSource={listApp2}
										loading={loading}
										simple
										rowKey={record => record.uuid}
										size="small"
										rowSelection={rowSelectionApp2}
										pagination={false}
									/>
								</Col>
							</Row >
						</div>
					</div>
				</TabPane>
				<TabPane tab={<span><Icon type="user" />主机IP选择器</span>} key="3">
					<div className={mystyle.overBox}>
						<div className={mystyle.overBoxInnerOther}>
							<Row >
								<Col span={6}>
									<FormItem label="对象名称" hasFeedback {...formItemLayout7}>
										{getFieldDecorator('nameQita', {
											initialValue: '',
										})(<Input />)}
									</FormItem>
								</Col>
								<Col span={7}>
									<FormItem label="对象关键字" hasFeedback {...formItemLayout7}>
										{getFieldDecorator('keywordQita', {
											initialValue: '',
										})(<Input placeholder="输入 *内容* 支持模糊查询" />)}
									</FormItem>
								</Col>
								<Col span={7}>
									<AppSelectComp {...appSelectProps} />
									{/*              					<FormItem label="应用分类名称" hasFeedback {...formItemLayout7}>
                						{getFieldDecorator('appQita', {
                 						initialValue: '',
                						})(<Input />)}
              					</FormItem>*/}
								</Col>
								<Col span={4}>
									<Button onClick={searchQita} size="large" style={{ marginLeft: '10px' }} icon="search" />
								</Col>
							</Row >
							<Row >
								<Col span={11}>
									<Table
										bordered
										columns={columnsQita}
										dataSource={listQita1new}
										loading={loading}
										onChange={onPageChangeQita}
										pagination={paginationQita}
										simple
										rowKey={record => record.uuid}
										size="small"
										rowSelection={rowSelectionQita1}
									/>
								</Col>
								<Col span={2} className={mystyle.buttonClick}>
									<div className={mystyle.buttonClickInner}>
										<Button disabled={type === 'see' || forbindQita || type === 'adjust'} onClick={rightQita} ><Icon type="right" /></Button>
										<Button disabled={type === 'see' || type === 'adjust'} onClick={leftQita} ><Icon type="left" /></Button>
									</div>
								</Col>
								<Col span={11}>
									<Table
										bordered
										columns={columnsQita}
										dataSource={listQita2}
										loading={loading}
										simple
										rowKey={record => record.uuid}
										size="small"
										rowSelection={rowSelectionQita2}
										pagination={false}
									/>
								</Col>
							</Row >
						</div>
					</div>
				</TabPane>
				<TabPane tab={<span><Icon type="block" />容器类选择器</span>} key="4">
					<div className={mystyle.overBox}>
						<div className={mystyle.overBoxInnerApp}>
							<Row>
								<Col>
									<FormItem hasFeedback {...formItemLayoutAppNameEditing} label="应用系统">
									{getFieldDecorator('appDistributed', {
										initialValue: appDistributed,
										rules: [
											// {
											// 	required: true,
											// },
										],
									})(
										<Select
											showSearch
											showArrow={false}
											placeholder="选择需要屏蔽的应用"
											allowClear={true}
											value={appDistributed}
											notFoundContent={appDistributedFlag === false ? <Spin size="small" /> : null}
											onSearch={debounce(800, getApp)}
											onChange={onAppNameChange}
										>
											{optionAppNameEditing}
										</Select>
									)}
									</FormItem>
								</Col>
							</Row >
							<Row >
								<Col span={24}>
									<FormItem hasFeedback {...formItemLayoutAppNameEditing} label="集群">
										<Select
											mode="multiple"
											showArrow={false}
											placeholder="选择应用下的需要屏蔽的集群（非必填）"
											value={clusterDistributed}
											notFoundContent={clusterDistributedFlag === false ? <Spin size="small" /> : null}
											onSearch={debounce(800, getClustsByApp)}
											onFocus={debounce(800, getClustsByApp)}
											onChange={onClusterChange}
										>
											{optionCluster}
										</Select>
									</FormItem>
								</Col>
							</Row >
							<Row >
								<Col span={24}>
									<FormItem hasFeedback {...formItemLayoutAppNameEditing} label="命名空间">
										<Select
											mode="multiple"
											showArrow={false}
											placeholder="选择需要屏蔽的命名空间（非必填）"
											value={namespaceDistributed}
											notFoundContent={namespaceDistributedFlag === false ? <Spin size="small" /> : null}
											onSearch={debounce(800, getNamespaceByCluster)}
											onFocus={debounce(800, getNamespaceByCluster)}
											onChange={onNamespaceChange}
										>
											{optionNamespace}
										</Select>
									</FormItem>
								</Col>
							</Row >
							<Row >
								<Col span={24}>
									<FormItem hasFeedback {...formItemLayoutAppNameEditing} label="指标">
										<Select
											mode="multiple"
											//showSearch
											showArrow={false}
											placeholder="选择要屏蔽的指标"
											value={indicatorDistributed}
											notFoundContent={indicatorDistributedFlag === false ? <Spin size="small" /> : null}
											onSearch={debounce(800, indicatorsFind)}
											onFocus={debounce(800, indicatorsFind)}
											onChange={onIndicatorChange}
										>
											{optionIndicator}
										</Select>
									</FormItem>
								</Col>
							</Row >
						</div>
					</div>
				</TabPane>
			</Tabs>
		</div>
	)
}

ConditionBasicMode.propTypes = {
	filter: PropTypes.object,
	queryPath: PropTypes.string,
	moFilterName: PropTypes.string,
	myform: PropTypes.object.isRequired,
}

export default ConditionBasicMode