import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Row, Modal, Table, TreeSelect, Select, message, Cascader, Radio } from 'antd'
import fenhang from '../../../utils/fenhang'
import { genDictOptsByName } from "../../../utils/FunctionTool"
import { ozr } from '../../../utils/clientSetting'
import { myCompanyName } from '../../../utils/config'
const FormItem = Form.Item
const SHOW_ALL = TreeSelect.SHOW_ALL
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
}
const formItemLayout2 = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
}
const formItemLayout3 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
}
const formItemLayout4 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
const modal = ({
  dispatch,
  visible,
  type,
  item,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  modalType,
  checkStatus,
  isClose,
  timeList,
  treeData,
  roleUUIDs,
  user,
  changeValue
}) => {
  let icon = ''	//done,success,fail,checking
  if (checkStatus == 'done') { icon = 'reload' } else if (checkStatus == 'success') { icon = 'check' } else if (checkStatus == 'fail') { icon = 'close' } else if (checkStatus == 'checking') { icon = 'loading' }

  let appType = new Array()
  if (type !== 'create' && item.domain) {
    let arr = item.domain
    appType = arr.split('-')
  }
  let maps = new Map()
  fenhang.forEach((obj, index) => {
    let keys = obj.key
    let values = obj.value
    maps.set(keys, values)
  })
  const onOk = () => {
    if (type === 'see') {
      dispatch({
        type: 'userinfo/updateState',
        payload: {
          modalType: 'create',
          currentItem: {},
          modalVisible: false,
          isClose: false,
        },
      })
      return
    }
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      if (type === 'create') {
        if ((!data.newPassword1) || data.newPassword1 === '') {
          message.error('请输入密码！')
          return
        }
        if (!data.passwordRepeat1) {
          data.passwordRepeat1 = ''
        }
        if (!data.newPassword1) {
          data.newPassword1 = ''
        }
        if (data.newPassword1 !== data.passwordRepeat1) {
          message.error('两次密码不一致，请重新输入！')
          return
        }
        let roles = []
        roleUUIDs.forEach((item) => {
          let value = {
            uuid: item.value,
          }
          roles.push(item.value)
        })
        let domain
        if (data.domain) {
          domain = data.domain.join('-')
        } else if (data.domain1) {
          domain = maps.get(data.branch)
        }
        let saveitem = {
          branch: data.branch,
          description: data.description,
          domain: domain,
          email: data.email,
          mobile: data.mobile,
          name: data.name,
          status: data.status,
          username: data.username,
          roleUUIDs: roles,
          extAuth:data.extAuth,
        }
        if (data.echatID) {
          saveitem.echatID = data.echatID
        }
        saveitem.newPassword = data.newPassword1
        saveitem.passwordRepeat = data.newPassword1
        let mobileReg = /^[1][3,4,5，6,7,8,9][0-9]{9}$/
        let emailReg = /^([a-zA-Z0-9]+[\-|_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[\-|_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        // let emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[\-|_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

        function reg_check_val(nickname) {
          let regex = new RegExp('^[0-9a-zA-Z_]{1,35}$')
          let res = regex.test(nickname)
          if (res == true && nickname.indexOf(' ') == -1) {
            return true
          }
          return false
        }

        if (!mobileReg.test(data.mobile)) {
          Modal.warning({
            title: '电话格式错误，请重新输入！',
            okText: 'OK',
          })
        } else if (!emailReg.test(data.email)) {
          Modal.warning({
            title: '邮件格式错误，请重新输入！',
            okText: 'OK',
          })
        } else if (!reg_check_val(saveitem.username)) {
          Modal.warning({
            title: '用户名格式错误，请重新输入！',
            okText: 'OK',
          })
        } else {
          resetFields()
          dispatch({
            type: `userinfo/${type}`,
            payload: saveitem,
          })
        }
        if ('EBank' === myCompanyName) {
          if (data.extAuth) {
            dispatch({
              type: `userinfo/authAdd`,
              payload: [data.username],
            })
          } else {
            dispatch({
              type: `userinfo/authDelete`,
              payload: [data.username],
            })
          }
        }
      }
    })
  }

  const onCancel = () => {
    resetFields()
    dispatch({
      type: 'userinfo/updateState',
      payload: {
        modalType: 'create',
        currentItem: {},
        modalVisible: false,
        isClose: false,
      },
    })
  }
  const columns = [
    {
      title: '角色名',
      dataIndex: 'name',
      key: 'name',
      width: 20,
    }, {
      title: '创建时间',
      dataIndex: 'time',
      key: 'time',
      width: 50,
      render: (text, record) => {
        if (record.createdTime !== 0 && record.createdTime !== '') {
          let time = record.createdTime
          let createdTime = new Date(time).format('yyyy-MM-dd hh:mm:ss')
          return createdTime
        }
      },
    }, {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 20,
    },
  ]

  const modalOpts = {
    title: `${type === 'create' ? '用户信息新增' : '用户信息查看'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }
  const onChange = (value) => {
    dispatch({
      type: 'userinfo/updateState',
      payload: {
        roleUUIDs: value,
      },
    })
  }
  const filterTreeNode = (inputValue, treeNode) => {
    if (treeNode.props.title.includes(inputValue)) {
      return true
    }
    return false
  }
  const tProps = {
    treeData,
    onChange,
    multiple: true,
    treeCheckable: true,
    treeCheckStrictly: true,
    showCheckedStrategy: SHOW_ALL,
    searchPlaceholder: 'Please select',
    style: {
      width: 300,
    },
  }
  const showGroupName = (data) => {
    let arrs = []
    if (data && data.length > 0) {
      data.forEach((item) => {
        if (arrs.length > 0) {
          arrs = [...arrs, { value: item.uuid, label: item.name }]
        } else {
          arrs = [{ value: item.uuid, label: item.name }]
        }
      })
    }
    return arrs
  }

  let dictArr = JSON.parse(localStorage.getItem('dict'))['userDomain']
  let depentTree = []
  let options = []
  if (dictArr) {
    dictArr.forEach((opt) => {
      let arr = opt.key.split('-')
      let i = 0
      const fun = (options, arr) => {
        let object = {}
        if (options.length == 0 || options.find(o => o.key == arr[i]) == null) {
          object.label = arr[i]
          object.value = arr[i]
          object.key = arr[i]
          options.push(object)
        } else if (i < arr.length) {
          options.map(item => {
            if (item.key == arr[i]) {
              i++
              fun(item.children, arr)
            }
          })
        }
        i++
        if (i < arr.length) {
          object.children = []
          fun(object.children, arr)
        }
        return options
      }
      depentTree = fun(options, arr)
    })
  }
  const onSelectValue = (value) => {
    dispatch({
      type: 'userinfo/updateState',
      payload: {
        changeValue: value,
      }
    })
  }

  //机构查询条件搜索
  const mySearchInfo = (input, option) => {
    return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0)
  }
  return (
    <Modal {...modalOpts} width="600px">
      <Form >
        <Row>
          <div style={{ float: 'left' }}>
            <span style={{ float: 'left', marginTop: 2 }}>
              <FormItem label="用户ＩＤ" {...formItemLayout}>
                {getFieldDecorator('username', {
                  initialValue: item.username,
                  rules: [{ required: true }],
                })(<Input style={{ width: '180px' }} disabled={type === 'see'} maxLength="20" />)}
              </FormItem>
            </span>
            <span style={{ float: 'right', marginTop: 2, marginLeft: 10 }}>
              <div style={{ position: 'relative' }} id="area1" />
              <FormItem label="机　　构" {...formItemLayout}>
                {getFieldDecorator('branch', {
                  initialValue: item.branch,
                  rules: [{ required: true }],
                })((!user.branch || user.branch === 'EB') ?
                  <Select
                    // disabled={type === 'see'}
                    showSearch
                    onSelect={onSelectValue}
                    filterOption={mySearchInfo}
                    //getPopupContainer={() => document.getElementById('area1')}
                    style={{ width: '180px' }}
                  >
                    {fenhang.map(d => <Option key={d.key}>{d.value}</Option>)}
                  </Select>
                  :
                  <Select
                    // disabled
                    showSearch
                    onSelect={onSelectValue}
                    filterOption={mySearchInfo}
                    //getPopupContainer={() => document.getElementById('area1')}
                    style={{ width: '180px' }}
                  >
                    {fenhang.map(d => <Option key={d.key}>{d.value}</Option>)}
                  </Select>)}
              </FormItem>
            </span>
          </div>
          <div style={{ float: 'left' }}>
            <span style={{ float: 'left', marginTop: 2 }}>
              <FormItem label="用户名称" {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: item.name,
                  rules: [{ required: true }],
                })(<Input style={{ width: '180px' }} disabled={type === 'see'} />)}
              </FormItem>
            </span>
            {
              (changeValue === 'ZH' || changeValue === 'QH' || changeValue === 'EB') ?
                <span style={{ float: 'right', marginTop: 2, marginLeft: 10 }}>
                  <FormItem label="部　　门" {...formItemLayout}>
                    {getFieldDecorator('domain', {
                      initialValue: ((type !== 'create') ? appType : null),
                      rules: [{
                        required: true,
                        type: 'array',
                      },],
                    })(
                      <Cascader options={depentTree} style={{ width: '180px' }} disabled={type === 'see' ? true : false} changeOnSelect={true}></Cascader>
                    )}
                  </FormItem>
                </span>
                :
                null
            }
            {
              !(changeValue === 'ZH' || changeValue === 'QH' || changeValue === 'EB') ?
                <span style={{ float: 'right', marginTop: 2, marginLeft: 10 }}>
                  <FormItem label="部　　门" {...formItemLayout}>
                    {getFieldDecorator('domain1', {
                      initialValue: changeValue,
                      rules: [],
                    })(
                      <Select
                        disabled={true}
                        showSearch
                        onSelect={onSelectValue}
                        filterOption={mySearchInfo}
                        getPopupContainer={() => document.getElementById('area1')}
                        style={{ width: '180px' }}
                      >
                        {fenhang.map(d => <Option key={d.key}>{d.value}</Option>)}
                      </Select>
                    )}
                  </FormItem>
                </span>
                :
                null
            }
          </div>
          <div style={{ float: 'left' }}>
            <div style={{ position: 'relative' }} id="area2" />
            <span style={{ float: 'left', marginTop: 2 }}>
              <FormItem label="用户状态" {...formItemLayout}>
                {getFieldDecorator('status', {
                  initialValue: item.status,
                  rules: [{ required: true }],
                })(<Select
                  disabled={type === 'see'}
                  style={{ width: '180px' }}
                  showSearch
                //getPopupContainer={() => document.getElementById('area2')}
                >
                  {genDictOptsByName('status')}
                  {/*<Select.Option value="ENABLED">正常</Select.Option>*/}
                  {/*<Select.Option value="DISABLED">锁定</Select.Option>*/}

                </Select>)}
              </FormItem>
            </span>
            <span style={{ float: 'right', marginTop: 2, marginLeft: 10 }}>
              <FormItem label="邮　　件" {...formItemLayout}>
                {getFieldDecorator('email', {
                  initialValue: item.email,
                  rules: [{ required: true }],
                })(<Input style={{ width: '180px' }} disabled={type === 'see'} />)}
              </FormItem>
            </span>
          </div>
          <div style={{ float: 'left' }}>
            <span style={{ float: 'left', marginTop: 2 }}>
              <FormItem label="电　　话" {...formItemLayout}>
                {getFieldDecorator('mobile', {
                  initialValue: item.mobile,
                  rules: [{ required: true }],
                })(<Input style={{ width: '180px' }} disabled={type === 'see'} />)}
              </FormItem>
            </span>
          </div>
          {
            'EBank' === myCompanyName ?
              <div style={{ float: 'left' }}>
                <span style={{ float: 'left', marginTop: 2 }}>
                  <FormItem label="光大家权限" {...formItemLayout}>
                    {getFieldDecorator('extAuth', {
                      initialValue: true,
                    })(<Radio.Group name="radiogroup" style={{ width: '180px' }} >
                      <Radio value={true}>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>)}
                  </FormItem>
                </span>
              </div> :
              null
          }
          {
            user.branch === 'EB' ?
              <div style={{ float: 'left', marginLeft: 5 }}>
                <FormItem label={ozr('echatID')} {...formItemLayout}>
                  {getFieldDecorator('echatID', {
                    initialValue: item.echatID ? item.echatID : '',
                    rules: [{ required: ozr('echatRequired') }],
                  })(<Input style={{ width: '180px' }} disabled={type === 'see'} />)}
                </FormItem>
              </div>
              :
              null
          }
          <div style={{ float: 'left' }}>
            <span style={{ float: 'left', marginTop: 2 }}>
              <FormItem label="用户描述" {...formItemLayout2}>
                {getFieldDecorator('description', {
                  initialValue: item.description,
                })(<Input style={{ width: '475px' }} disabled={type === 'see'} />)}
              </FormItem>
            </span>
          </div>
          {
            ((type == 'create')) ?
              <div>
                <div style={{ float: 'left' }}>
                  <span style={{ float: 'left', marginTop: 2 }}>
                    <FormItem label="输入密码" {...formItemLayout2}>
                      {getFieldDecorator('newPassword1', {
                        initialValue: '',
                        rules: [{ required: true }],
                      })(<Input style={{ width: '475px' }} disabled={type === 'see'} type="password" />)}
                    </FormItem>
                  </span>
                </div>
                <div style={{ float: 'left' }}>
                  <span style={{ float: 'left', marginTop: 2 }}>
                    <FormItem label="重复密码" {...formItemLayout2}>
                      {getFieldDecorator('passwordRepeat1', {
                        initialValue: item.passwordRepeat,
                        rules: [{ required: true }],
                      })(<Input style={{ width: '475px' }} disabled={type === 'see'} type="password" />)}
                    </FormItem>
                  </span>
                </div>
                <div style={{ float: 'left', marginLeft: 6 }}>
                  <div style={{ position: 'relative', overFlow: 'scroll' }} id="area" />
                  <FormItem label="角色" {...formItemLayout3}>
                    {getFieldDecorator('selectRole', {
                      initialValue: showGroupName(item.roles),
                      rules: [{ type: 'array' }],
                    })(<TreeSelect
                      filterTreeNode={filterTreeNode}
                      disabled={type === 'see'}
                      dropdownStyle={{ maxHeight: '300px', overFlow: 'scroll' }}
                      {...tProps}
                      getPopupContainer={() => document.getElementById('down')}
                    />)}
                  </FormItem>
                </div>
              </div>
              :
              null
          }

        </Row>
        <div id="down">
          <Table
            columns={columns}
            dataSource={timeList}
            simple
            size="small"
            pagination={false}
          />
        </div>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
