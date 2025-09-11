import Fenhang from '../../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})

export default  [
	{
		key: 'mo.appName',
		dataIndex: 'mo.appName',
		title: '所属应用分类名称',
	  },
	{
	  title: '名称',
	  dataIndex: 'mo.name',
	  key: 'name',
	}, {
	  title: '发现IP',
	  dataIndex: 'mo.discoveryIP',
	  key: 'discoveryIP',
	}, {
	  title: '类别',
	  dataIndex: 'mo.typ',
	  key: 'typ',
	  render: (text, record) => {
	  	let info = ''
	  	if (text === 'PhysicaiIP') {
	  		info = '物理IP'
	  	} else if (text === 'FloatIP') {
	  		info = '浮动IP'
	  	} else if (text === 'MappingIP') {
	  		info = '映射IP'
	  	} else if (text === 'OtherIP') {
	  		info = '其它'
	  	} else if (text === 'UnknownIP') {
	  		info = '未知'
	  	}
	  	return info
	  },
	}, {
	  title: '关键字',
	  dataIndex: 'mo.keyword',
	  key: 'keyword',
	},
	{
		title: '模式组子类',
		dataIndex: 'mo.appRoleGroup',
		key: 'appRoleGroup',
	  }, {
	  title: '描述',
	  dataIndex: 'mo.description',
	  key: 'description',
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
