import Fenhang from '../../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})

export default  [
	{
		title: '应用分类名称',
		dataIndex: 'mo.appName',
		key: 'appName',
	  },
	{
	  title: '名称',
	  dataIndex: 'mo.name',
	  key: 'name',
	}, {
	  title: '管理IP',
	  dataIndex: 'mo.discoveryIP',
	  key: 'discoveryIP',
	}, {
	  title: '类别',
	  dataIndex: 'mo.typ',
	  key: 'typ',
	  render: (text, record) => {
	  	let info = ''
	  	if (text === 'Minicomputer') {
	  		info = '小型机'
	  	} else if (text === 'PCServer') {
	  		info = 'PC服务器'
	  	} else if (text === 'Blade_Console') {
	  		info = '刀笼及控制台'
	  	}
	  	return info
	  },
	}, {
	  title: '关键字',
	  dataIndex: 'mo.keyword',
	  key: 'keyword',
	}, {
	  title: '序列号',
	  dataIndex: 'mo.serialNum',
	  key: 'serialNum',
	}, {
	  title: '搜索代码',
	  dataIndex: 'mo.searchCode',
	  key: 'SearchCode',
	},  {
	  title: '应用分类编码',
	  dataIndex: 'mo.appCode',
	  key: 'appCode',
	}, {
	  title: '机房',
	  dataIndex: 'mo.room',
	  key: 'room',
	}, {
	  title: '机房模块',
	  dataIndex: 'mo.roomModule',
	  key: 'roomModule',
	}, {
	  title: '机柜',
	  dataIndex: 'mo.cabinet',
	  key: 'Cabinet',
	}, {
		title: '发现方式',
		dataIndex: 'mo.mngInfoSrc',
		key: 'mngInfoSrc',
	}, {
	  title: '厂商',
	  dataIndex: 'mo.vendor',
	  key: 'vendor',
	}, {
	  title: '管理机构',
	  dataIndex: 'mo.mngtOrgCode',
	  key: 'mngtOrg',
	  render: (text, record) => {
  		return Fenhangmaps.get(text)
  	},
	}, {
	  title: '所属机构',
	  dataIndex: 'mo.branchName',
	  key: 'branchName',
	  render: (text, record) => {
  		return Fenhangmaps.get(text)
  	},
	},
]
