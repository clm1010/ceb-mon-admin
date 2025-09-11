import Fenhang from '../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})

export default  [
	{
    key: 'name',
    dataIndex: 'name',
    title: '通知规则名称',
  },
  {
    key: 'informType',
    dataIndex: 'informType',
    title: '通知类型',
    render: (text, record) => {
    	let info = ''
    	if (text === 'ALL') {
    		info = '全局通知规则'
    	} else if (text === 'ORDINARY') {
    		info = '普通通知规则'
    	}
    	return info
    },
  },
  {
	key: 'appCategory',
	dataIndex: 'appCategory',
	title: '应用',
	render: (text, record) => {
		let info = ''
		for (let data of record.appCategory) {
		    info = data.affectSystem
		}
		if (record.informType === 'ALL') {
			info = '全部应用'
		}
		return info
	},
  },
  {
    key: 'branch',
    dataIndex: 'branch',
    title: '所属机构',
    render: (text, record) => {
    	if (text === 'QH') {
    		return '全行'
    	}
    	return Fenhangmaps.get(text)
    },
  },
  {
    key: 'state',
    dataIndex: 'state',
    title: '激活状态',
    render: (text, record) => {
    	let info = ''
    	if (text) {
    		info = '激活'
    	} else {
    		info = '未激活'
    	}
    	return info
    },
  },
]
