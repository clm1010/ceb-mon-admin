import React from 'react'
import PropTypes from 'prop-types'
import {genFilterDictOptsByName} from "../../../utils/FunctionTool"
import Fenhang from '../../../utils/fenhang'
let Fenhangmaps = new Map()
let Intermaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})
let interFace = []
interFace = genFilterDictOptsByName("interfaceType","string")
console.log(interFace)
interFace.forEach((obj, index) => {
	Intermaps.set(obj.key, obj.value)
})
console.log(Intermaps)
export default  (sortInfo) => {
	return(
		[
			{
				key: 'appName',
				dataIndex: 'appName',
					title: '所属应用分类名称',
					width: 135,
					sorter: false,
			  },
			{
			  key: 'name',
			  dataIndex: 'name',
			  title: '名称',
			  type: 'String',
			  application: 'show,create,update,filter,query',
				applicationType: 'String',
				  isvalidate: true,
				  width: 200,
				  sorter: true,
				  sortOrder: sortInfo?sortInfo.columnKey === 'name' && sortInfo.order:false,
			},
			{
			  key: 'discoveryIP',
			  dataIndex: 'discoveryIP',
				  title: '管理IP',
				  width: 100,
				  sorter: true,
				  sortOrder: sortInfo?sortInfo.columnKey === 'discoveryIP' && sortInfo.order:false,
			},
			{
			  key: 'protocolStatus',
			  dataIndex: 'protocolStatus',
				  title: '端口协议状态',
				  width: 110,
				  sorter: true,
				  sortOrder: sortInfo?sortInfo.columnKey === 'protocolStatus' && sortInfo.order:false,
			  render: (text, record) => {
				  let info = ''
				  if (text === '1') {
					  info = 'UP'
				  } else {
					  info = 'DOWN'
				  }
				  return info
				  },
			},
			{
			  key: 'status',
			  dataIndex: 'status',
				  title: '端口状态',
				  width: 85,
				  sorter: true,
				  sortOrder: sortInfo?sortInfo.columnKey === 'status' && sortInfo.order:false,
			  render: (text, record) => {
				  let info = ''
				  if (text === '1') {
					  info = 'UP'
				  } else {
					  info = 'DOWN'
				  }
				  return info
			  },
			},
			{
			  key: 'location',
			  dataIndex: 'location',
				  title: '区域',
				  width: 175,
				  sorter: false,
			},
			{
			  key: 'relatedPolicyInstances',
			  dataIndex: 'relatedPolicyInstances',
				  title: '关联策略总数',
				  width: 110,
				  sorter: false,
			},
			{
			  key: 'issuedPolicyInstances',
			  dataIndex: 'issuedPolicyInstances',
				  title: '已下发策略数',
				  width: 110,
				  sorter: false,
			},
			{
			  key: 'unissuedPolicyInstances',
			  dataIndex: 'unissuedPolicyInstances',
				  title: '未下发策略数',
				  width: 110,
				  sorter: false,
			},
			{
			  key: 'issueFailedPolicyInstances',
			  dataIndex: 'issueFailedPolicyInstances',
				  title: '下发失败策略数',
				  width: 130,
				  sorter: false,
			},
			{
			  key: 'notStdPolicyInstances',
			  dataIndex: 'notStdPolicyInstances',
				  title: '非标准策略数',
				  width: 110,
				  sorter: false,
			},
			{
				key: 'branchName',
				dataIndex: 'branchName',
				  title: '所属行名称',
				  width: 100,
				  sorter: false,
			  render: (text, record) => {
				return Fenhangmaps.get(text)
				},
			},
			{
			  key: 'description',
			  dataIndex: 'description',
				  title: '接口描述',
				  width: 125,
				  sorter: false,
			  },
			  {
			  key: 'alias',
			  dataIndex: 'alias',
				  title: '别名',
				  width: 100,
				  sorter: false,
			},
			{
			  key: 'portName',
			  dataIndex: 'portName',
				  title: '物理名称',
				  width: 125,
				  sorter: false,
			},
			{
			  key: 'bandwidth',
			  dataIndex: 'bandwidth',
				  title: '采集带宽',
				  width: 100,
				  sorter: false,
			},
			{
			  key: 'realBandwidth',
			  dataIndex: 'realBandwidth',
				  title: '实际带宽',
				  width: 100,
				  sorter: false,
			},
			{
			  key: 'duplex',
			  dataIndex: 'duplex',
				  title: '双工类型',
				  width: 85,
				  sorter: false,
			},
			{
			  key: 'intfLogicType',
			  dataIndex: 'intfLogicType',
				  title: '物理逻辑类型',
				  width: 110,
				  sorter: false,
			},
			{
			  key: 'intfType',
			  dataIndex: 'intfType',
				  title: '类型',
				  width: 65,
				  sorter: false,
			},
			{
			  key: 'ip',
			  dataIndex: 'ip',
				  title: '接口IP',
				  width: 100,
				  sorter: false,
			},
			{
			  key: 'snmpIndex',
			  dataIndex: 'snmpIndex',
				  title: '接口索引',
				  width: 100,
				  sorter: false,
			},
			{
			  key: 'firstClass',
			  dataIndex: 'firstClass',
				  title: '一级专业分类',
				  width: 110,
				  sorter: false,
			},
			{
			  key: 'secondClass',
			  dataIndex: 'secondClass',
				  title: '二级专业分类',
				  width: 110,
				  sorter: false,
			},
			{
				  key: 'thirdClass',
				  dataIndex: 'thirdClass',
				  title: '三级专业分类',
				  width: 110,
				  sorter: false,
			  },
			{
			  key: 'activatedBy',
			  dataIndex: 'activatedBy',
				  title: '激活者',
				  width: 75,
				  sorter: false,
			},
			{
			  key: 'code',
			  dataIndex: 'code',
				  title: '对象编码',
				  width: 85,
				  sorter: false,
			},
			{
			  key: 'mngInfoSrc',
			  dataIndex: 'mngInfoSrc',
				  title: '发现方式',
				  width: 85,
				  sorter: false,
			},
			{
			  key: 'onlineStatus',
			  dataIndex: 'onlineStatus',
				  title: '在线状态',
				  width: 85,
				  sorter: false,
			},
			  {
			  key: 'managedStatus',
			  dataIndex: 'managedStatus',
				  title: '纳管状态',
				  width: 85,
				  sorter: false,
			},
			{
			  key: 'createdBy',
			  dataIndex: 'createdBy',
				  title: '创建者',
				  width: 75,
				  sorter: false,
			},
			{
			  key: 'createdTime',
			  dataIndex: 'createdTime',
				  title: '创建时间',
				  width: 150,
				  sorter: false,
			  render: (text, record) => {
				  return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
			  },
			},
			{
			  key: 'deactivatedBy',
			  dataIndex: 'deactivatedBy',
				  title: '去激活者',
				  width: 85,
				  sorter: false,
			},
			{
			  key: 'deleteTime',
			  dataIndex: 'deleteTime',
				  title: '删除时间',
				  width: 100,
				  sorter: false,
			  render: (text, record) => {
				  return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
			  },
			},
			{
			  key: 'deletedBy',
			  dataIndex: 'deletedBy',
				  title: '删除者',
				  width: 75,
				  sorter: false,
			},
			{
			  key: 'firstSecArea',
			  dataIndex: 'firstSecArea',
				  title: '一级安全域',
				  width: 125,
				  sorter: false,
			},
			{
			  key: 'secondSecArea',
			  dataIndex: 'secondSecArea',
				  title: '二级安全域',
				  width: 100,
				  sorter: false,
			},
			{
			  key: 'haCollectTime',
			  dataIndex: 'haCollectTime',
				  title: 'HA 状态采集时间',
				  width: 135,
				  sorter: false,
			  render: (text, record) => {
				  return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
			  },
			},
			{
			  key: 'haMode',
			  dataIndex: 'haMode',
				  title: '主备模式',
				  width: 85,
				  sorter: false,
			},
			{
			  key: 'haRole',
			  dataIndex: 'haRole',
				  title: '主备地位',
				  width: 85,
				  sorter: false,
			},
			{
			  key: 'keyword',
			  dataIndex: 'keyword',
				  title: '对象关键字',
				  width: 200,
				  sorter: false,
			},
			{
			  key: 'mngtOrg',
			  dataIndex: 'mngtOrg',
				  title: '设备管理机构',
				  width: 110,
				  sorter: false,
			},
			{
			  key: 'mngtOrgCode',
			  dataIndex: 'mngtOrgCode',
				  title: '设备管理机构编码',
				  width: 135,
				  sorter: false,
			},
			{
			  key: 'monitorStatus',
			  dataIndex: 'monitorStatus',
				  title: '监控状态',
				  width: 85,
				  sorter: false,
			},
			{
			  key: 'org',
			  dataIndex: 'org',
				  title: '设备所属机构',
				  width: 110,
				  sorter: false,
			},
			{
			  key: 'orgCode',
			  dataIndex: 'orgCode',
				  title: '设备所属机构编码',
				  width: 135,
				  sorter: false,
			},
			{
			  key: 'appCode',
			  dataIndex: 'appCode',
				  title: '所属应用分类编码',
				  width: 135,
				  sorter: false,
			},
			{
			  key: 'typ',
			  dataIndex: 'typ',
			  title: '接口类型',
			  width: 135,
			  sorter: false,
			  render: (text, record) => {
				  let info = ''
				  if (text === 'interIntf') {
					  info = '互联接口'
				  } else if (text === 'lineIntf'){
					  info = '线路接口'
				  }
				  return info
			  }
			},
			{
			  key: 'syncStatus',
			  dataIndex: 'syncStatus',
				  title: '端口同步状态',
				  width: 110,
				  sorter: false,
			  render: (text, record) => {
				  let info = ''
				  if (text === 'success') {
					  info = '成功'
				  } else {
					  info = '失败'
				  }
				  return info
			  },
			},
			{
			  key: 'syncTime',
			  dataIndex: 'syncTime',
				  title: '同步时间',
				  width: 140,
				  sorter: false,
			  render: (text, record) => {
				  return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
			  },
			}, {
			  key: 'updateHistory',
			  dataIndex: 'updateHistory',
				  title: '更新历史',
				  width: 85,
				  sorter: false,
			},
			{
			  key: 'updatedBy',
			  dataIndex: 'updatedBy',
				  title: '最后更新者',
				  width: 100,
				  sorter: false,
			},
			{
			  key: 'updatedTime',
			  dataIndex: 'updatedTime',
				  title: '最后更新时间',
				  width: 140,
				  sorter: false,
			  render: (text, record) => {
				  return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
			  },
			},
			{
			  key: 'usage',
			  dataIndex: 'usage',
				  title: '资源用途',
				  width: 85,
				  sorter: false,
			},
			{
			  key: 'objectID',
			  dataIndex: 'objectID',
				  title: 'ObjectID',
				  width: 120,
				  sorter: false,
			},
			{
			  key: 'contact',
			  dataIndex: 'contact',
				  title: '联系人',
				  width: 75,
				  sorter: false,
			},
			  {
			  key: 'mac',
			  dataIndex: 'mac',
				  title: 'MAC 地址',
				  width: 100,
				  sorter: false,
			},
			{
			  key: 'mtu',
			  dataIndex: 'mtu',
				  title: 'MTU',
				  width: 75,
				  sorter: false,
			},
		  {
			  key: 'belongsTo.branchName',
			  dataIndex: 'belongsTo.branchName',
				  title: '所属行名称',
				  width: 100,
				  sorter: false,
			  render: (text, record) => {
				  return Fenhangmaps.get(text)
			  },
		  },
		  {
			  key: 'belongsTo.firstSecArea',
			  dataIndex: 'belongsTo.firstSecArea',
				  title: '一级安全域',
				  width: 125,
				  sorter: false,
		  },
		  {
			  key: 'belongsTo.secondSecArea',
			  dataIndex: 'belongsTo.secondSecArea',
				  title: '二级安全域',
				  width: 100,
				  sorter: false,
		  },
		  {
			  key: 'belongsTo.mngtOrg',
			  dataIndex: 'belongsTo.mngtOrg',
				  title: '设备管理机构',
				  width: 110,
				  sorter: false,
		  },
		  {
			  key: 'belongsTo.mngtOrgCode',
			  dataIndex: 'belongsTo.mngtOrgCode',
				  title: '设备管理机构编码',
				  width: 135,
				  sorter: false,
		  },
		  {
			  key: 'belongsTo.org',
			  dataIndex: 'belongsTo.org',
				  title: '设备所属机构',
				  width: 110,
				  sorter: false,
		  },
		  {
			  key: 'belongsTo.orgCode',
			  dataIndex: 'belongsTo.orgCode',
				  title: '设备所属机构编码',
				  width: 135,
				  sorter: false,
			  render: (text, record) => {
				  return Fenhangmaps.get(text)
			  },
		  },
		  {
			  key: 'belongsTo.appName',
			  dataIndex: 'belongsTo.appName',
				  title: '所属应用分类名称',
				  width: 135,
				  sorter: false,
		  },
			  {
			  key: 'belongsTo.appCode',
			  dataIndex: 'belongsTo.appCode',
				  title: '所属应用分类编码',
				  width: 135,
				  sorter: false,
		  },
		  {
			  key: 'belongsTo.ObjectID',
			  dataIndex: 'belongsTo.ObjectID',
				  title: 'ObjectID',
				  width: 100,
				  sorter: false,
		  },
		  {
			  key: 'belongsTo.contact',
			  dataIndex: 'belongsTo.contact',
				  title: '联系人',
				  width: 75,
				  sorter: false,
		  },
		  {
			  key: 'belongsTo.discoveryIP',
			  dataIndex: 'belongsTo.discoveryIP',
				  title: '发现IP',
				  width: 100,
				  sorter: false,
		  },
		  {
			  key: 'belongsTo.objectID',
			  dataIndex: 'belongsTo.objectID',
				  title: '对象关键字',
				  width: 160,
				  sorter: false,
		  },
			  {
			  key: 'belongsTo.syncStatus',
			  dataIndex: 'belongsTo.syncStatus',
				  title: '所属设备同步状态',
				  width: 135,
				  sorter: false,
			  render: (text, record) => {
				  let info = ''
				  if (text === 'success') {
					  info = '成功'
				  } else {
					  info = '失败'
				  }
				  return info
			  },
		  },
		  {
			  key: 'belongsTo.firstClass',
			  dataIndex: 'belongsTo.firstClass',
				  title: '一级分类',
				  width: 100,
				  sorter: false,
		  },
		  {
			  key: 'belongsTo.secondClass',
			  dataIndex: 'belongsTo.secondClass',
				  title: '二级分类',
				  width: 100,
				  sorter: false,
		  },
		  {
			  key: 'belongsTo.managedStatus',
			  dataIndex: 'belongsTo.managedStatus',
				  title: '纳管状态',
				  width: 100,
				  sorter: false,
		  },
	  
	  ]
	)
} 
