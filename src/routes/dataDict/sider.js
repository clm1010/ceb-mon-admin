import React from 'react'
import { Layout, Menu, Input, Button, message, Popconfirm, Modal, Upload } from 'antd'
import DictModal from './dictModal'
import Cookie from '../../utils/cookie'
import { config } from '../../utils'
const { uldataDict } = config.api

const confirm = Modal.confirm
const { Sider } = Layout
const { Search } = Input

function sider (dataDict) {
  const {
 list, currentItem, modalVisible, modalType, dispatch, loading,
 moImportFileList,
 showUploadList,
} = dataDict	// 这里把入参做了拆分，后面代码可以直接调用拆分的变量
	let cookie = new Cookie('cebcookie')
  const genMenu = (menuList) => {
    let menuItems = []
    menuList.forEach((element) => {
      menuItems.push(<Menu.Item key={element.key}>{element.name}</Menu.Item>)
    })
    return menuItems
  }

  const searchDict = (value) => {
    dispatch({
      type: 'dataDict/query',
      payload: {
        q: `name=='*${value}*'`,
      },
    })
  }

  const showAddModal = () => {
    dispatch({
      type: 'dataDict/setState',
      payload: {
        modalVisible: true,
        modalType: 'create',
      },
    })
  }

  const showEditModal = () => {
    dispatch({
      type: 'dataDict/setState',
      payload: {
        modalVisible: true,
        modalType: 'update',
      },
    })
  }

  const onDown = () => {
    confirm({
			title: '您确定要导出这些字典吗?',
			onOk() {
				dispatch({
					type: 'dataDict/onDown',
					payload: {
						filename: '数据字典'
					}
				})
			},
		})
  }

  const delDict = () => {
    if (currentItem !== undefined && currentItem.uuid !== undefined) {
      dispatch({
        type: 'dataDict/delete',
        payload: {
          id: currentItem.uuid,
        },
      })
    } else {
      message.warning('请选中要删除的数据字典')
    }
  }

  const changeMenuItem = (e) => {
    list.forEach((element) => {
      if (element.key === e.key) {
        dispatch({
          type: 'dataDict/setState',
          payload: {
            currentItem: element,
          },
        })
        dispatch({
          type: 'dataDictItem/query',
          payload: {
            searchDict: element,
          },
        })
      }
    })
  }

  const modalProps = {															// 这里定义的是弹出窗口要绑定的数据源
    dispatch,
    item: modalType === 'create' ? {} : currentItem,		// 要展示在弹出窗口的选中对象
    type: modalType,																		// 弹出窗口的类型是'创建'还是'编辑'
    visible: modalVisible,															// 弹出窗口的可见性是true还是false
    modalType,
    currentItem,
  }
  const mybeforeUpload = (file) => {
    return new Promise(
      function (resolve, reject) {
        confirm({
          title: '注意',
          content: `导入可能覆盖某些数据，确定导入${file.name}吗？`,
          okText: '是',
          cancelText: '否',
          onOk: () => {
            if (file.name && (file.name.endsWith('xls') || file.name.endsWith('xlsx'))) {
              resolve()
            } else {
              message.error('You can only upload excel file!');
              reject()
            }
          },
          onCancel: () => {
            reject()
          }
        })
      })
	}
  const myonchange = (info) => {
		let { fileList } = info
		if (info.file.status === 'uploading') {

		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`);


		}
		if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
		dispatch({
			type: 'dataDict/setState',
			payload: {
				moImportFileList: fileList,
			}
		})
	}

  const myonSuccess = (ret, file) => {
		dispatch({
			type: 'dataDict/setState',
			payload: {
				moImportFileList: moImportFileList,
				showUploadList: false,
				moImportResultVisible: true,
				moImportResultdataSource: ret,
				moImportResultType: 'success',
			}
		})
	}
	const onError = (err, result, file) => {
		dispatch({
			type: 'dataDict/setState',
			payload: {
				moImportFileList: moImportFileList,
				showUploadList: false,
				moImportResultVisible: true,
				moImportResultdataSource: [],
				moImportResultType: 'fail',
			}
		})
	}
  const uploadprops = {
		action: uldataDict,
		supportServerRender: true,
		showUploadList: showUploadList,
		headers: {
			Authorization: 'Bearer ' + cookie.getCookie(),
		},
		beforeUpload: mybeforeUpload,
		fileList: moImportFileList,
		onChange: myonchange,
		onSuccess: myonSuccess,
		onError: onError,
	}
  //导入
	const toshowupload = () => {
		dispatch({
			type: 'dataDict/setState',
			payload: {
				showUploadList: true,
			}
		})
	}

  return (
    <Sider width={330} style={{ overflow: 'hidden', background: '#fff', height: '100%' }}>
      <Search
        placeholder="输入字典名匹配查询"
        style={{ width: 184 }}
        onSearch={value => searchDict(value)}
      />
      <Button type="primary" icon="plus" size="small" style={{ marginLeft: 5, marginTop: 5, float: 'right' }} onClick={() => showAddModal()} />
      <Popconfirm title="你确定删除这个数据字典吗?" onConfirm={() => delDict()} okText="Yes" cancelText="No">
        <Button icon="minus" size="small" style={{ marginLeft: 5, marginTop: 5, float: 'right' }} />
      </Popconfirm>
      <Button icon="edit" size="small" style={{ marginLeft: 5, marginTop: 5, float: 'right' }} onClick={() => showEditModal()} />
      <Button icon="download" size="small" style={{ marginLeft: 5, marginTop: 5, float: 'right' }} onClick={() => onDown()} />
      <Upload style={{ marginLeft: 8 }} {...uploadprops}>
        <Button icon="upload" size="small" style={{ marginLeft: 5, marginTop: 5, float: 'right' }} onClick={() => toshowupload()} />
      </Upload>
      <div style={{
 overflow: 'hidden', overflowY: 'scroll', height: '90%', marginTop: 10,
}}
      >
        <Menu
          mode="inline"
          selectedKeys={[currentItem.key]}
          onClick={changeMenuItem}
        >
          {genMenu(list)}
        </Menu>
      </div>
      <DictModal {...modalProps} />
    </Sider>
  )
}

export default sider
