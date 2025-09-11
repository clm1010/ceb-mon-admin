export default  [
	{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
	{
      title: '别名',
      dataIndex: 'alias',
      key: 'alias',
    },
    {
      title: '主机名',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: '所属行名称',
      dataIndex: 'branchName',
      key: 'branchName',
    }, {
      title: '发现ip',
      dataIndex: 'discoveryIP',
      key: 'discoveryIP',
    }, {
      title: '一级专业分类',
      dataIndex: 'firstClass',
      key: 'firstClass',
    }, {
      title: '二级专业分类',
      dataIndex: 'secondClass',
      key: 'secondClass',
    }, {
      title: '三级专业分类',
      dataIndex: 'thirdClass',
      key: 'thirdClass',
    }, {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (text, record) => {
      	return new Date(text).format('yyyy-MM-dd hh:mm:ss')
      },
    }, {
      title: '厂商',
      dataIndex: 'vendor',
      key: 'vendor',
    }, {
      title: '激活者',
      dataIndex: 'activatedBy',
      key: 'activatedBy',
    }, {
      title: '机柜',
      dataIndex: 'cabinet',
      key: 'cabinet',
    }, {
      title: '创建方式',
      dataIndex: 'createMethod',
      key: 'createMethod',
    }, {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
    }, {
      title: '去激活者',
      dataIndex: 'deactivatedBy',
      key: 'deactivatedBy',
    }, {
      title: '删除时间',
      dataIndex: 'deleteTime',
      key: 'deleteTime',
      render: (text, record) => {
      	return (text ? new Date(text).format('yyyy-MM-dd hh:mm:ss') : '')
      },
    }, {
      title: '删除者',
      dataIndex: 'deletedBy',
      key: 'deletedBy',
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '一级安全域',
      dataIndex: 'firstSecArea',
      key: 'firstSecArea',
    }, {
      title: '主备地位',
      dataIndex: 'haRole',
      key: 'haRole',
	  render: (text, record) => {
      	return (text ? '是' : '否')
      },
    }, {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
    }, {
      title: '在线状态',
      dataIndex: 'onlineStatus',
      key: 'onlineStatus',
    }, {
      title: '二级安全域',
      dataIndex: 'secondSecArea',
      key: 'secondSecArea',
    }, {
      title: '同步状态',
      dataIndex: 'syncStatus',
      key: 'syncStatus',
    }, {
      title: '同步时间',
      dataIndex: 'syncTime',
      key: 'syncTime',
      render: (text, record) => {
      	return (text ? new Date(text).format('yyyy-MM-dd hh:mm:ss') : '')
      },
    }, {
      title: '更新历史',
      dataIndex: 'updateHistory',
      key: 'updateHistory',
    }, {
      title: '最后更新者',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    }, {
      title: '最后更新时间',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      render: (text, record) => {
      	return (text ? new Date(text).format('yyyy-MM-dd hh:mm:ss') : '')
      },
    },
  ]
