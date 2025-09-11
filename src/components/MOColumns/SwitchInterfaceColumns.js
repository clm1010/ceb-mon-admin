 import Fenhang from './fenhang'
import ProtocolStatusInfos from './ResourceInfo/ProtocolStatusInfo'
import IntfTypeInfos from './ResourceInfo/IntfTypeInfo'
import {genFilterDictOptsByName} from "../../utils/FunctionTool"
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})
let ProtocolStatusmap = new Map()
ProtocolStatusInfos.forEach((obj, index) => {
	ProtocolStatusmap.set(obj.key, obj.value)
})
let IntfTypeInfomap = new Map()
IntfTypeInfos.forEach((obj, index) => {
	IntfTypeInfomap.set(obj.key, obj.value)
})
let interFace = genFilterDictOptsByName("interfaceType","string")
export default  [
    {
      name: 'discoveryIP',
      displayName: '管理IP',
      tpe: 'String',
	  application: 'show,filter,query',
	  applicationType: 'String',
	  isvalidate: false,

    },
    {
      name: 'portName',
      displayName: '物理名称',
      tpe: 'String',
	  application: 'show,create,update,filter',
	  applicationType: 'String',
	  isvalidate: false,
	  isdisabled: true,
    },
    {
      name: 'IP',
      displayName: '接口IP',
      tpe: 'String',
	  application: 'show,create,update,filter',
	  applicationType: 'String',
	  isvalidate: false,
    },
    {
      name: 'snmpIndex',
      displayName: '接口索引',
      tpe: 'int',
	  application: 'show,filter',
	  applicationType: 'int',
	  isvalidate: false,
	  isdisabled: true,
    },
    {
      name: 'belongsTo.objectID',
      displayName: ' 父对象',
      tpe: 'String',
      application: 'show,filter',
      applicationType: 'String',
      isvalidate: false,
      isdisabled: true,
    },
    {
      name: 'belongsTo.onlineStatus',
      displayName: ' 父设备在线状态',
      tpe: 'String',
      application: 'show,filter',
      applicationType: 'String',
      isvalidate: false,
      isdisabled: true,
    },
        {
      name: 'belongsTo.managedStatus',
      displayName: ' 父设备纳管状态',
      tpe: 'String',
      application: 'show,filter',
      applicationType: 'String',
      isvalidate: false,
      isdisabled: true,
    },
    {
      name: 'belongsTo.firstSecArea',
      displayName: ' 父设备一级安全域',
      tpe: 'String',
      application: 'show,filter',
      applicationType: 'String',
      isvalidate: false,
      isdisabled: true,
    },
    {
      name: 'belongsTo.model',
      displayName: ' 父设备型号',
      tpe: 'String',
      application: 'show,filter',
      applicationType: 'String',
      isvalidate: false,
      isdisabled: true,
    },
    {
      name: 'belongsTo.appName',
      displayName: '父设备所属应用名称',
      tpe: 'String',
	  application: 'show,filter',
	  applicationType: 'String',
	  isvalidate: true,
    },
    {
      name: 'branchName',
      displayName: ' 所属机构代码',
      tpe: 'String',
      application: 'show,filter',
      applicationType: 'String',
      isvalidate: false,
      isdisabled: true,
    },
    {
      name: 'performanceCollect',
      displayName: ' 性能数据采集标志',
      tpe: 'String',
      application: 'show,filter',
      applicationType: 'String',
      isvalidate: false,
      isdisabled: true,
    },
    {
      name: 'iisreset',
      displayName: '端口监控标志',
      tpe: 'String',
      application: 'show,filter',
      applicationType: 'String',
      isvalidate: false,
      isdisabled: true,
    },
    {
      name: 'syslogMonitoring',
      displayName: 'syslog监控标志',
      tpe: 'String',
      application: 'show,filter',
      applicationType: 'String',
      isvalidate: false,
      isdisabled: true,
    },
    {
      name: 'typ',
      displayName: '接口类型',
      tpe: 'String',
      application: 'filter',
      applicationType: 'select',
      options: interFace,
    },
    {
      name: 'USERNAME',
      displayName: '用户名',
      tpe: 'String',
    application: 'show,create,update,filter,query',
    applicationType: 'String',
    isvalidate: true,
    },
]
