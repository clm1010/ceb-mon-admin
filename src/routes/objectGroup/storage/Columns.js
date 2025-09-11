import Fenhang from '../../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})

export default  [
	{
		key: 'mo.appName',
		dataIndex: 'mo.appName',
		title: '应用分类名称',
	  },
	{
    key: 'mo.name',
    dataIndex: 'mo.name',
    title: '名称',
  },
  {
  	key: 'mo.hostname',
  	dataIndex: 'mo.hostname',
  	title: '主机名',
  },
  {
    key: 'mo.discoveryIP',
    dataIndex: 'mo.discoveryIP',
    title: '发现 IP',
  },
  {
  	key: 'mo.typ',
  	dataIndex: 'mo.typ',
  	title: '类别',
  },
  {
  	key: 'mo.keyword',
  	dataIndex: 'mo.keyword',
  	title: '对象关键字',
  },
  {
  	key: 'mo.branchName',
  	dataIndex: 'mo.branchName',
  	title: '所属机构',
  	render: (text, record) => {
  		return Fenhangmaps.get(text)
  	},
  },
  {
  	key: 'mo.mngtOrgCode',
  	dataIndex: 'mo.mngtOrgCode',
  	title: '管理机构',
  	render: (text, record) => {
  		return Fenhangmaps.get(text)
  	},
  },
  {
	title: '发现方式',
	dataIndex: 'mo.mngInfoSrc',
	key: 'mngInfoSrc',
  },
  {
  	key: 'mo.cabinet',
  	dataIndex: 'mo.cabinet',
  	title: '机柜位置',
  },
  {
  	key: 'mo.vendor',
  	dataIndex: 'mo.vendor',
  	title: '厂商',
  },
  {
  	key: 'mo.model',
  	dataIndex: 'mo.model',
  	title: '型号',
  },
]
