import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input, notification } from 'antd'
import {ozr} from '../../utils/clientSetting'
import { config } from '../../utils'
import styles from './index.less'
import { loginStyles } from '../../utils/clientSetting'

import {genFilterDictObjByName} from '../../utils/FunctionTool'
//动态首页样式
import background from './background.css'
const FormItem = Form.Item

const Login = ({
  login,
  iam,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  let oLoad = false
  let loginLoading = false
	let infos = sessionStorage.getItem('info')
  if (login !== undefined) {
    oLoad = login.oLoad
    loginLoading = login.loginLoading
  } else if (iam !== undefined) {
    oLoad = iam.oLoad
    loginLoading = iam.loginLoading
  }

	const infoPart = () => {
		return (
  <div>
    {login.notifications.map(templet =>
      (<div className={styles.infoInner}>
        <span>{new Date(templet.updateTime).format('yyyy-MM-dd hh:mm:ss')}</span>
        <span>{templet.content}</span>
      </div>))}
  </div>
		)
	}

	const notifications = () => {
		let timeStamp = new Date().getTime()
		let endTime = timeStamp - 259200000
		let a = new Date(endTime + 28800000).toISOString()//三天前
		let b = new Date(timeStamp + 28800000).toISOString()//当前时间
		dispatch({
			type: 'login/notifications',
			payload: {
				q: `updateTime=timein=(${a},${b})`,
			},
		})
	}


	const openNotificationWithIcon = (type) => {
		if (oLoad) {
			notification[type]({
		    message: '升级通知',
		    description: infoPart(),
		    placement: 'bottomRight',
		    duration: null,
		  })
		}
	}

/*	if(infos === null){
		notifications();
	}*/

	if (login.notifications.length > 0) {
		openNotificationWithIcon('info')
	}
	const inputValue = (e) => {
		dispatch({
	  		type: 'login/querySuccess',
	  		payload: {
	  			oLoad: false,
	  		},
	  })
	}

  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }
  
  const {umpState, redirecUrl} = login
  if (!umpState && redirecUrl != '') window.location = redirecUrl

  return (
    <div className={loginStyles.ELoginBg}>
      <div className={styles.warnning}>严禁在本平台处理、传输绝密、机密、秘密、内部、商密一级信息</div>
  {umpState?
      <div className={styles.form}>
        <div className={styles.formbg} />
        <div className={styles.forminner}>
          <div className={styles.logo}>
            {/*<img alt={'logo'} src={config.logo} />*/}
            <div className={loginStyles.ELoginLogo} />
            {/*<span>{config.name}</span>*/}
            <div className={styles.logotext}>
              <span>{ozr('name')}</span>
              <span>统一监控管理平台</span>
            </div>
          </div>
          <form>
            <FormItem hasFeedback>
              {getFieldDecorator('username', {
		          				initialValue: 'admin',
		            			rules: [
		              		{
		                			required: true,
		              		},
		            			],
		          		})(<Input size="large" onInput={e => inputValue(e)} onPressEnter={handleOk} placeholder="Username" />)}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
		          				initialValue: '',
		            			rules: [
		              		{
		                			required: true,
		              		},
		            			],
		          		})(<Input size="large" onInput={e => inputValue(e)} type="password" onPressEnter={handleOk} placeholder="Password" />)}
            </FormItem>
            <Row>
              <Button type="primary" size="large" onClick={handleOk} loading={loginLoading}>
		            			登  录
              </Button>
            </Row>

          </form>
        </div>
      </div>
      :null}
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ login, iam }) => ({ login, iam }))(Form.create()(Login))
