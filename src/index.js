// import './index.html'
// import 'babel-polyfill'
import 'hacktimer'
import '@babel/polyfill';
import dva from 'dva'
import createLoading from 'dva-loading'
//import createBrowserHistory  from 'history/createBrowserHistory'
import { createBrowserHistory }  from "history"
import { message } from 'antd'
import {ozr} from './utils/clientSetting'
import { mynginxproxyport, myCompanyName } from './utils/config'

import ClientMonitor from 'skywalking-client-js';

if (myCompanyName === 'EGroup') {
  try {
    ClientMonitor.register({
      //collector: `http://192.168.0.127:85/skywalking`,
      //collector: `/skywalking`,   // causing flood of 'Invalid URL' error with error report to skywalking OAP
      collector: `http://${mynginxproxyport}/skywalking`, // param "myloginServiceInfo=localhost:8001" in create_container_nginx...sh
      service: 'ump-ui',
      pagePath: '/index',
      serviceVersion: 'v1.0.0',
      useFmp:true,
      //jsErrors: true,
      //apiErrors: true,
      //resourceErrors: true,
      //autoTracePerf:true,
      //detailMode:true
    });
  } catch (e) {
    console.log(e)
  }
};

document.title=(ozr('name')+'统一监控管理平台')


message.config({ top: 300, duration: 5 })
// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: createBrowserHistory(),
  onError (error) {
  	if (error.message !== 'Cannot read property \'data\' of undefined') {
	    message.error(error.message)
	  }
  },
})

// 2. Model
app.model(require('./models/app').default)

// 3. Router
app.router(require('./router').default)

// 4. Start
app.start('#root');



 