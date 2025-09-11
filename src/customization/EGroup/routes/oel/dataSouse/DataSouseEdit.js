import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Button, Icon, Tabs, Row, Col, message } from 'antd'
import './position.css'
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
}
const formItemLayoutIP = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
}
const formItemLayout1 = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 15,
  },
}
const formItemLayout2 = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 4,
  },
}
const formItemLayout4 = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
}
const formItemLayout6 = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 15,
  },
}
const formItemLayout7 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
const modal = ({
	dispatch,
  currentItemdata,
  displayObsSrvsList,
  visible,
  type,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
}) => {
	const onOk = () => {
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      let displayObsSrvs = []
      let flag = false
      displayObsSrvsList.forEach((item) => {
      		let mingcheng0 = `mingcheng${item.index}`
			    let name = data[mingcheng0]
			    let serverIP0 = `serverIP${item.index}`
			    let serverIP = data[serverIP0]
			    let serverPort0 = `serverPort${item.index}`
			    let serverPort = data[serverPort0]
			    let username0 = `username${item.index}`
			    let username = data[username0]
			    let password0 = `password${item.index}`
			    let password = data[password0]

      	  let displayObs = {
      	  	 name,
      	  	 serverIP,
      	  	 serverPort,
      	  	 username,
      	  	 password,
      	  }
       if (displayObs.name === undefined) {
      		displayObs.name = ''
      	}
      	if (displayObs.serverIP === undefined) {
      		displayObs.serverIP = ''
      	}
      	if (displayObs.serverPort === undefined) {
      		displayObs.serverPort = ''
      	}
      	if (displayObs.username === undefined) {
      		displayObs.username = ''
      	}
      	if (displayObs.password === undefined) {
      		displayObs.password = ''
      	}


      	if (displayObs.name === '' && displayObs.serverIP === '' && displayObs.serverPort === '' && displayObs.username === '' && displayObs.password === '') {
      		  } else if (displayObs.name !== '' && displayObs.serverIP !== '' && displayObs.serverPort !== '' && displayObs.username !== '') {
      		  } else if (displayObs.name === '' && displayObs.serverIP === '' && displayObs.serverPort === undefined && displayObs.username === '' && displayObs.password === '') {
      		} else {
      			    //message.error("显示层OS信息请补充完整！")
      			    flag = true
      			    return
      		}
      	   if (displayObs.name === '') {

      	   } else {
      	   	 displayObsSrvs.push(displayObs)
      	   }
      })
      if (flag === true) {
      	message.error('显示层OS信息请补充完整！')
      	return
      }
      let primeObjSrv = {
      	     name: data.nameos1,
      	  	 serverIP: data.serverIPos1,
      	  	 serverPort: data.serverPortos1,
      	  	 username: data.usernameos1,
      	  	 password: data.passwordos1,
      	}
      let backupObjSrv = {
      	     name: data.nameos2,
      	  	 serverIP: data.serverIPos2,
      	  	 serverPort: data.serverPortos2,
      	  	 username: data.usernameos2,
      	  	 password: data.passwordos2,
      	}
      	//ostsdata是新定义的对象
      	let ostsdata = {}
      	if (backupObjSrv.name === undefined) {
      		backupObjSrv.name = ''
      	}
      	if (backupObjSrv.serverIP === undefined) {
      		backupObjSrv.serverIP = ''
      	}
      	if (backupObjSrv.serverPort === undefined) {
      		backupObjSrv.serverPort = ''
      	}
      	if (backupObjSrv.username === undefined) {
      		backupObjSrv.username = ''
      	}
      	if (backupObjSrv.password === undefined) {
      		backupObjSrv.password = ''
      	}

      		if (backupObjSrv.name === '' && backupObjSrv.serverIP === '' && backupObjSrv.serverPort === '' && backupObjSrv.username === '' && backupObjSrv.password === '') {
      		  } else if (backupObjSrv.name !== '' && backupObjSrv.serverIP !== '' && backupObjSrv.serverPort !== '' && backupObjSrv.username !== '') {
      		  } else if (backupObjSrv.name === '' && backupObjSrv.serverIP === '' && backupObjSrv.serverPort === undefined && backupObjSrv.username === '' && backupObjSrv.password === '') {
      		} else {
      			    message.error('汇聚层备OS信息请补充完整！')
      			    return
      			}
      	if (data.nameos2 === '') {
      		if (displayObsSrvs.length == 0) {
      			ostsdata = {
      		    name: data.name,
      		    primeObjSrv,
      		  }
      		} else {
      		  	ostsdata = {
      		      name: data.name,
      		      displayObsSrvs,
      		      primeObjSrv,
      		    }
      	 	}
      	} else if (displayObsSrvs.length == 0) {
      			ostsdata = {
      		    name: data.name,
      		    primeObjSrv,
      		    backupObjSrv,
      		  }
      		} else {
      		  	ostsdata = {
      		      name: data.name,
      		      displayObsSrvs,
      		      primeObjSrv,
      		      backupObjSrv,
      		    }
      	 	}

	 	  resetFields()//重置表单
			dispatch({
				type: `oelDataSouseset/${type}`,
				payload: ostsdata,
			})

	    dispatch({
				type: 'oelDataSouseset/updateState',
				payload: {
			    dataSouseeditVisible: false,
				},
			})
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		resetFields() //重置表单
		dispatch({
				type: 'oelDataSouseset/updateState',
				payload: {
					dataSouseeditVisible: false,
				},
		})
	}

	  const jiahao = () => {
  	let temp = displayObsSrvsList[displayObsSrvsList.length - 1]
  	let index = temp.index
  	index++
  	displayObsSrvsList.push({
 index, name: '', serverIP: '', serverPort: '', username: '', password: '',
})
  	dispatch({
			type: 'oelDataSouseset/updateState',											//抛一个事件给监听这个type的监听器
			payload: {
				  displayObsSrvsList,
			},
		})
	}
	const jianhao = (index) => {
		 const displayObsSrvsListNew = displayObsSrvsList.filter(temp => temp.index !== index)
		 dispatch({
			type: 'oelDataSouseset/updateState',											//抛一个事件给监听这个type的监听器
			payload: {
				  displayObsSrvsList: displayObsSrvsListNew,
			},
		})
	}
  const modalOpts = {
    title: `${type === 'creates' ? '新增数据源' : '编辑数据源'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }


  return (

    <Modal {...modalOpts} width="1000px">

      <Form layout="horizontal">
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><Icon type="user" />数据源名称</span>} key="1">
            <FormItem label="数据源名称" hasFeedback {...formItemLayout2}>
              {getFieldDecorator('name', {
            	initialValue: currentItemdata.name,
            	rules: [
             	 {
              	  required: true,
              	},
            	],
         	 })(<Input />)}
            </FormItem>
          </TabPane>
        </Tabs>
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><Icon type="user" />显示层OS配置</span>} key="1">
            {displayObsSrvsList.map(templet =>
              (<Row key={`row_${templet.index}`}>
                <Col span={5} key={`col_${templet.index}_0`}>
                  <FormItem label="名称" hasFeedback {...formItemLayout7} key={`mingcheng${templet.index}`}>
                    {getFieldDecorator(`mingcheng${templet.index}`, {
            	initialValue: templet.name,
         	 })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={4} key={`col_${templet.index}_1`}>
                  <FormItem label="IP" hasFeedback {...formItemLayoutIP} key={`serverIP${templet.index}`}>
                    {getFieldDecorator(`serverIP${templet.index}`, {
            	initialValue: templet.serverIP,
         	 })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={3} key={`col_${templet.index}_2`}>
                  <FormItem label="端口" hasFeedback {...formItemLayout6} key={`serverPort${templet.index}`}>
                    {getFieldDecorator(`serverPort${templet.index}`, {
            	initialValue: templet.serverPort,
          })(<InputNumber />)}
                  </FormItem>
                </Col>
                <Col span={5} key={`col_${templet.index}_3`}>
                  <FormItem label="用户名" hasFeedback {...formItemLayout1} key={`username${templet.index}`}>
                    {getFieldDecorator(`username${templet.index}`, {
              initialValue: templet.username,
         	 })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={3} key={`col_${templet.index}_4`}>
                  <FormItem label="密码" hasFeedback {...formItemLayout6} key={`password${templet.index}`}>
                    {getFieldDecorator(`password${templet.index}`, {
              initialValue: templet.password,
         	 })(<Input.Password />)}
                  </FormItem>
                </Col>
                <Col span={4} key={`col_${templet.index}_5`}>
                  <Button disabled={displayObsSrvsList.length === 1} onClick={jianhao.bind(this, templet.index)} style={{ marginLeft: '30px' }}>-</Button>
        	    &nbsp;&nbsp;&nbsp;
                  <Button onClick={jiahao}>+</Button>
                </Col>
               </Row>))}
          </TabPane>
        </Tabs>
        <Tabs defaultActiveKey="1" className="huiju-position">
          <TabPane tab={<span><Icon type="user" />汇聚层OS配置</span>} key="1">
            <Row>
              <Col span={6} >
                <FormItem label="主OS名称" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('nameos1', {
            	initialValue: (currentItemdata && currentItemdata.primeObjSrv ? currentItemdata.primeObjSrv.name : ''),
         	     rules: [
             	  {
              	  required: true,
              	 },
            	 ],
         	 })(<Input />)}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="IP" hasFeedback {...formItemLayoutIP}>
                  {getFieldDecorator('serverIPos1', {
            	initialValue: (currentItemdata && currentItemdata.primeObjSrv ? currentItemdata.primeObjSrv.serverIP : ''),
         	    rules: [
              {
                required: true,
              },
             ],
         	 })(<Input />)}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="端口" hasFeedback {...formItemLayout4}>
                  {getFieldDecorator('serverPortos1', {
            	initialValue: (currentItemdata && currentItemdata.primeObjSrv ? currentItemdata.primeObjSrv.serverPort : ''),
         	     rules: [
              {
                required: true,
              },
            ],
          })(<InputNumber />)}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="用户名" hasFeedback {...formItemLayout4}>
                  {getFieldDecorator('usernameos1', {
              initialValue: (currentItemdata && currentItemdata.primeObjSrv ? currentItemdata.primeObjSrv.username : ''),
         	    rules: [
              {
                required: true,
              },
            ],
         	 })(<Input />)}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="密码" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('passwordos1', {
              initialValue: (currentItemdata && currentItemdata.primeObjSrv ? currentItemdata.primeObjSrv.password : ''),
         	 })(<Input.Password />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6} >
                <FormItem label="备OS名称" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('nameos2', {
            	initialValue: (currentItemdata && currentItemdata.backupObjSrv ? currentItemdata.backupObjSrv.name : ''),
         	 })(<Input />)}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="IP" hasFeedback {...formItemLayoutIP}>
                  {getFieldDecorator('serverIPos2', {
            	initialValue: (currentItemdata && currentItemdata.backupObjSrv ? currentItemdata.backupObjSrv.serverIP : ''),
         	 })(<Input />)}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="端口" hasFeedback {...formItemLayout4}>
                  {getFieldDecorator('serverPortos2', {
            	initialValue: (currentItemdata && currentItemdata.backupObjSrv ? currentItemdata.backupObjSrv.serverPort : ''),
          })(<InputNumber />)}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="用户名" hasFeedback {...formItemLayout4}>
                  {getFieldDecorator('usernameos2', {
              initialValue: (currentItemdata && currentItemdata.backupObjSrv ? currentItemdata.backupObjSrv.username : ''),
         	 })(<Input />)}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="密码" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('passwordos2', {
              initialValue: (currentItemdata && currentItemdata.backupObjSrv ? currentItemdata.backupObjSrv.password : ''),
         	 })(<Input.Password />)}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
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
