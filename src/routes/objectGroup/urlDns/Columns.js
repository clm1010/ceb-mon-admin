
import Fenhang from '../../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})

export default  [
	{
    key: 'mo.name',
    dataIndex: 'mo.name',
    title: '名称',
  },
  {
    key: 'mo.discoveryIP',
    dataIndex: 'mo.discoveryIP',
    title: '节点地址',
  },
  {
    key: 'mo.protocol',
    dataIndex: 'mo.protocol',
    title: '协议',
  },
  {
    key: 'mo.port',
    dataIndex: 'mo.port',
    title: '端口',
  },
  {
    key: 'mo.keyword',
    dataIndex: 'mo.keyword',
    title: '关键字',
  },
  {
    key: 'mo.appName',
    dataIndex: 'mo.appName',
    title: '所属应用分类名称',
  },
  {
    key: 'mo.branchName',
    dataIndex: 'mo.branchName',
    title: '所属行名称',
    render: (text, record) => {
  		return Fenhangmaps.get(text)
  	},
  },
  {
    key: 'mo.createdBy',
    dataIndex: 'mo.createdBy',
    title: '创建人',
  },
  {
    key: 'mo.createdTime',
    dataIndex: 'mo.createdTime',
    title: '创建时间',
    render: (text, record) => {
      return new Date(text).format('yyyy-MM-dd hh:mm:ss')
    },
  },
  {
    key: 'mo.updatedBy',
    dataIndex: 'mo.updatedBy',
    title: '更新人',
  },
  {
    key: 'mo.updatedTime',
    dataIndex: 'mo.updatedTime',
    title: '更新时间',
    render: (text, record) => {
      return new Date(text).format('yyyy-MM-dd hh:mm:ss')
    },
  }
]
