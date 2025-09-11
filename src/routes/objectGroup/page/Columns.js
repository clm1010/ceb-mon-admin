import Fenhang from '../../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})

export default  [
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
	  key: 'type',
	  render: (text, record) => {
	  	let info = ''
	  	if (text === 'penetrate') {
	  		info = '穿透'
	  	} else if (text === 'static') {
	  		info = '静态'
	  	}
	  	return info
	  },
	}, {
	  title: '关键字',
	  dataIndex: 'mo.keyword',
	  key: 'keyword',
	}, {
	  title: 'URL',
	  dataIndex: 'mo.url',
	  key: 'URL',
	}, {
	  title: '描述',
	  dataIndex: 'mo.description',
	  key: 'description',
	}, {
	  title: '端口',
	  dataIndex: 'mo.port',
	  key: 'Port',
	}, {
	  title: '协议',
	  dataIndex: 'mo.protocol',
	  key: 'Protocol',
	}, {
	  title: 'URI',
	  dataIndex: 'mo.uri',
	  key: 'URI',
	}, {
	  title: '应用分类名称',
	  dataIndex: 'mo.appName',
	  key: 'appName',
	}, {
	  title: '应用分类编码',
	  dataIndex: 'mo.appCode',
	  key: 'appCode',
	}, {
	  title: '所属机构',
	  dataIndex: 'mo.branchName',
	  key: 'branchName',
	  render: (text, record) => {
  		return Fenhangmaps.get(text)
  	},
	}, {
	  title: '管理机构',
	  dataIndex: 'mo.mngtOrgCode',
	  key: 'mngtOrgCode',
	  render: (text, record) => {
  		return Fenhangmaps.get(text)
  	},
	},
]
