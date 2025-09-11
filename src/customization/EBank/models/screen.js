import {query} from "../../../services/objectMO";
import {queryAlarms, queryMoRoomInfo, queryFiltersByUUID, queryAlarmsByfiltername} from "../../../services/screen";
import netWorkDomain from '../routes/screen/netWorkDomain'
import whToFhIps from '../routes/utils/zbToFHPortIp'
import resultTemp from '../routes/screen/ResultTemp'
import dataCenterResultTemp from '../routes/screen/DateCenterRoomResultTemp'
import lineConfig from '../routes/screen/DedicatedLineHealthStatusConfig'
import oelFilter from '../routes/screen/OelFilterConfig'

const uuid = `51fbf869-b754-4ef8-8866-387a84966c8e` //test 上线时替换成生成
export default {

  namespace: 'screen',

  state: {
    dataCenterRoompingFailed:[],
    alerts:[],
    netWorkPerformance:[],
    uuid : `51fbf869-b754-4ef8-8866-387a84966c8e` ,//test 上线时替换成生成,
    lineHealthData:[],
    modalVisible: false,
    dataCenterRoomLine:[],
    expands:true
  },

  subscriptions: {
    setup({
            dispatch,
            history
          }) {
      history.listen(location => {
        if (location.pathname === '/ZHscreen') {
          dispatch({
            type: 'queryDataRoomPingAlarms',
            payload: {uuid:uuid},
          })
            ,
            dispatch({
              type: 'queryBarcharts',
              payload: {uuid:uuid},
            }),
            dispatch({
              type: 'queryDWDMBreakUpAlarms',
              payload: {uuid:uuid},
            }),
            dispatch({
              type: 'queryNetWorkPerformance',
              payload: {uuid:uuid},
            }),
            dispatch({
              type: 'queryDedicatedLineHealthStatus',
              payload: {uuid:uuid},
            })
        }
      })
    },
  },

  effects: {
    *query({ payload}, {call,put}) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            alerts: data.data,
          },
        })
      }
    },

    *queryDataRoomPingAlarms({payload}, {call, put}){
      let moData = {};
      moData = yield call(queryMoRoomInfo, {
          branch:`ZH`,
          firstClass:`NETWORK`
        });
      let shiJingShanCnt = 0;
      let f3Cnt = 0;
      let taoRanTingCnt = 0;
      let zgcyhCnt = 2;
      let gdCnt = 0;
      let cpkfTestCnt = 0;
      let whzbCnt = 0;
      let whkfCnt = 0;
      let tianJingCnt = 0;
      for(let mo of moData.arr){
        switch (mo.room) {
          case 'F3大厦机房':
            f3Cnt = mo.num;
            break;
          case '石景山办公机房':
            shiJingShanCnt =  mo.num;
            break;
          case '陶然亭机房':
            taoRanTingCnt =  mo.num;
            break;
          case '中关村壹号':
            zgcyhCnt =  mo.num;
            break;
          case '光大大厦机房':
            gdCnt =  mo.num;
            break;
          case '昌平开发测试机房':
            cpkfTestCnt =  mo.num;
            break;
          case '武汉灾备机房':
            whzbCnt =  mo.num;
            break;
          case '武汉客服中心机房':
            whkfCnt =  mo.num;
            break;
          case '天津后台中心机房':
            tianJingCnt =  mo.num;
            break;
        }
      }

      let oelCfg = {}
      oelCfg.pagination = { current:0, pageSize:100 }
      oelCfg.filtername = '网络大屏_办公大楼及坐席健康状态'
      //oelCfg.whereSQL = `(( N_CustomerSeverity=1 or N_CustomerSeverity=2 or N_CustomerSeverity=3 ) and N_ComponentType ='网络' and AlertGroup = 'ICMP_Failed' and Severity >0 and N_MgtOrg='总行' and N_Room in ('F3大厦机房','石景山办公机房','陶然亭机房','中关村壹号','光大大厦机房','昌平开发测试机房','武汉灾备机房','武汉客服中心机房','天津后台中心机房') ) order by FirstOccurrence desc `
      //oelCfg.uuid = payload.uuid
      const alarms = yield call(queryAlarmsByfiltername, oelCfg)
      // 光大理财有限责任公司
      //oelCfg.whereSQL = `(( N_CustomerSeverity=1 or N_CustomerSeverity=2 or N_CustomerSeverity=3 ) and N_ComponentType ='网络' and AlertGroup = 'RPING_Failed' and Severity >0 and N_MgtOrg='总行' and NodeAlias in ('10.1.94.251', '10.1.94.233') ) order by FirstOccurrence desc `;
      const RpingAlarms = yield call(queryAlarmsByfiltername, oelCfg);
      let shiJingShanPingFailedCnt = 0
      let f3PingFailedCnt = 0
      let taoRanTingPingFailedCnt = 0
      let zgcyhPingFailedCnt = 0
      let gdPingFailedCnt = 0
      let cpkfTestPingFailedCnt = 0
      let whzbPingFailedCnt = 0
      let whkfPingFailedCnt = 0
      let tianJingPingFailedCnt = 0
      let gdFinancialCompanyRpingFaildCnt = 0;
      for(let alarm of alarms.alertsResponse.alertList){
        switch (alarm.N_Room) {
          case 'F3大厦机房':
            f3PingFailedCnt += 1
            break;
          case '石景山办公机房':
            shiJingShanPingFailedCnt += 1
            break;
          case '陶然亭机房':
            taoRanTingPingFailedCnt += 1
            break;
          case '中关村壹号':
            zgcyhPingFailedCnt += 1
            break;
          case '光大大厦机房':
            gdPingFailedCnt += 1
            break;
          case '昌平开发测试机房':
            cpkfTestPingFailedCnt += 1
            break;
          case '武汉灾备机房':
            whzbPingFailedCnt += 1
            break;
          case '武汉客服中心机房':
            whkfPingFailedCnt += 1
            break;
          case '天津后台中心机房':
            tianJingPingFailedCnt += 1
            break;
        }
      }
      for(let alarm of RpingAlarms.alertsResponse.alertList){
        if(alarm.Summary.indexOf('192.168.247.182') !== -1 || alarm.Summary.indexOf('192.168.246.194') !== -1) {
          gdFinancialCompanyRpingFaildCnt += 1
        }
      }
      // ping Fail
      let pingFailed = [];
      let shiJingShan = [];
      shiJingShan.key = '石景山办公机房';  // 0
      shiJingShan.value = '#00CD00';
      if(shiJingShanPingFailedCnt/shiJingShanCnt > 0){
        shiJingShan.value = '#ffff00';
        if(shiJingShanPingFailedCnt/shiJingShanCnt >0.5){
          shiJingShan.value ='#f00'
        }
      }
      pingFailed.push(shiJingShan);

      let f3 = [];
      f3.key = 'F3大厦'; // 1
      f3.value = '#00CD00';
      if(f3PingFailedCnt > 0){
        f3.value = '#ffff00';
        if(f3PingFailedCnt/f3Cnt >0.5){
          f3.value ='#f00'
        }
      }
      pingFailed.push(f3);

      let taoRanTing = [];
      taoRanTing.key = '陶然亭机房' ;// 2
      taoRanTing.value = '#00CD00';
      if(taoRanTingPingFailedCnt > 0){
        taoRanTing.value = '#ffff00';
        if(taoRanTingPingFailedCnt/taoRanTingCnt>0.5){
          taoRanTing.value ='#f00'
        }
      }
      pingFailed.push(taoRanTing);

      let zgcyh = [];
      zgcyh.key = '中关村壹号' ;//3
      zgcyh.value = '#00CD00';
      if(zgcyhPingFailedCnt > 0){
        zgcyh.value = '#ffff00';
        if(zgcyhPingFailedCnt/zgcyhCnt>0.5){
          zgcyh.value ='#f00'
        }
      }
      pingFailed.push(zgcyh);

      let gd = [];
      gd.key = '光大大厦'; // 4
      gd.value = '#00CD00';
      if(gdPingFailedCnt > 0){
        gd.value = '#ffff00';
        if(gdPingFailedCnt/gdCnt >0.5){
          gd.value ='#f00'
        }
      }
      pingFailed.push(gd);


      let cpkfTest = [];
      cpkfTest.key = '昌平开发测试'; // 5
      cpkfTest.value = '#00CD00';
      if(cpkfTestPingFailedCnt > 0){
        cpkfTest.value = '#ffff00';
        if(cpkfTestPingFailedCnt/cpkfTestCnt >0.5){
          cpkfTest.value ='#f00'
        }
      }
      pingFailed.push(cpkfTest);

      let FinancialCompany = [];
      FinancialCompany.key = '光大理财有限责任公司'; //6
      FinancialCompany.value = '#00CD00';
      pingFailed.push(FinancialCompany);

      let whzb = [];
      whzb.key = '武汉灾备' ;// 7
      whzb.value = '#00CD00';
      if(whzbPingFailedCnt > 0){
        whzb.value = '#ffff00';
        if(whzbPingFailedCnt/whzbCnt >0.5){
          whzb.value ='#f00'
        }
      }
      pingFailed.push(whzb);

      let whkf = [];
      whkf.key = '武汉客服中心' ;// 8
      whkf.value = '#00CD00';
      if(whkfPingFailedCnt > 0){
        whkf.value = '#ffff00';
        if( whkfPingFailedCnt/whkfCnt >0.5){
          whkf.value ='#f00'
        }
      }
      pingFailed.push(whkf);

      let tianJing = [];
      tianJing.key = '天津后台中心';//9
      tianJing.value = '#00CD00';
      if(tianJingPingFailedCnt > 0){
        tianJing.value = '#ffff00';
        if( tianJingPingFailedCnt/tianJingCnt >0.5){
          tianJing.value ='#f00'
        }
      }
      pingFailed.push(tianJing);

      // Rping Fail
      //oelCfg.whereSQL = `(( N_CustomerSeverity=1 or N_CustomerSeverity=2 or N_CustomerSeverity=3 ) and N_ComponentType ='网络' and AlertGroup = 'RPING_Failed' and N_MgtOrg='总行' and Severity >0 and NodeAlias in ('10.1.200.111','10.1.200.11','10.1.200.12','10.1.200.112','10.1.200.31','10.1.200.132','10.1.200.15','10.1.200.115','10.1.94.251','10.1.94.233')) order by FirstOccurrence desc`
      const RpingFailedAlarms = yield call(queryAlarmsByfiltername, oelCfg);
      let  dataCenter = dataCenterResultTemp;
      let dataCenterLine = ['#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00','#00CD00'];
      dataCenter.map(item => {
          let discoveryIpArr = item.discoveryIps.split(',');
          let targetIpArr = item.targetIps.split(',');
          item.num = 0;
          item.LineColor = '#00CD00';
          for(let alarm of RpingFailedAlarms.alertsResponse.alertList) {
            // 告警详情
            let Summary = alarm.Summary;
            // 告警组
            let alertGroup = alarm.AlertGroup;
            // 截取对端ip
            let regex1 = /\<(.+?)\>/g;
            let summaryContainTargetIp = [];
            summaryContainTargetIp  = Summary.match(regex1);
            let summaryTargetIp = ''
            if(summaryContainTargetIp !== null && summaryContainTargetIp.length > 0) {
              summaryTargetIp = summaryContainTargetIp[0].replace('<', '').replace('>', '')
            }
            // 设备Ip
            let nodeAlias = alarm.NodeAlias;
            for(let i = 0; i < discoveryIpArr.length; i++){
              if('RPING_Failed' === alertGroup){
                if(discoveryIpArr[i] === nodeAlias && summaryTargetIp === targetIpArr[i]){
                  item.num += 1;
                  if(item.num > 0){
                    item.LineColor = '#ffff00';
                    if(item.num > 1){
                      item.LineColor = '#f00';
                    }
                  }
                }
              }
            }
          }
        switch(item.value){
          case '陶然亭机房':
            dataCenterLine[0] = item.LineColor;
            break;
          case '光大大厦机房':
            dataCenterLine[1] = item.LineColor;
            break;
          case '昌平开发测试':
            dataCenterLine[2] = item.LineColor;
            break;
          case '武汉客服中心':
            dataCenterLine[3] = item.LineColor;
            break;
          case '光大理财子公司':
            dataCenterLine[4] = item.LineColor;
            break;
          case '武汉灾备中心':
            dataCenterLine[5] = item.LineColor;
            break;
          case '天津后台中心':
            dataCenterLine[6] = item.LineColor;
            break;
          case '石景山办公机房':
            dataCenterLine[7] = item.LineColor;
            break;
          case '中关村壹号':
            dataCenterLine[8] = item.LineColor;
            break;
          case 'F3光大中心':
            dataCenterLine[9] = item.LineColor;
            break;
        }
      });

      yield put({
        type: 'setState',
        payload: {
          dataCenterRoompingFailed:pingFailed,
          dataCenterRoomLine:dataCenterLine,
        },
      })
    },

    *queryBarcharts({payload}, {call, put}){
      let oelCfg = {}
      let alarmCfg = {}

      oelCfg.pagination = { current:0, pageSize:10 }
      alarmCfg.pagination = { current:0, pageSize:10 }
      alarmCfg.uuid = payload.uuid

      // 分行告警
      let nodeOelUUID = oelFilter.backBoneNetWord.nodeOelFilter;
      oelCfg.q = 'uuid== \'' + nodeOelUUID +'\'';
      const fhNodeOelWhereSql = yield call(queryFiltersByUUID, oelCfg)
      alarmCfg.whereSQL = fhNodeOelWhereSql.content[0].filter.filterItems[0].value;//`(( N_CustomerSeverity=1 or N_CustomerSeverity=2 or N_CustomerSeverity=3 ) and N_ComponentType ='网络' and N_MgtOrg='总行' and N_Component = '路由器' and Severity >0  and N_OrgName in ('昆明分行','沈阳分行','合肥分行','黑龙江分行','福州分行','南京分行','济南分行','上海分行','成都分行','北京分行','深圳分行','广州分行','郑州分行','重庆分行','长沙分行','天津分行','南宁分行','杭州分行','烟台分行','大连分行','长春分行','厦门分行','苏州分行','宁波分行','呼和浩特分行','太原分行','武汉分行','乌鲁木齐分行','兰州分行','西安分行','石家庄分行','青岛分行','无锡分行','南昌分行','海口分行','贵阳分行','银川分行','拉萨分行','西宁分行','首尔分行','卢森堡分行','香港分行','悉尼分行')) order by FirstOccurrence desc`
      const fhAlarms = yield call(queryAlarms, alarmCfg)

      // 分行线路
      let lineOelUUID = oelFilter.backBoneNetWord.lineOelFilter;
      oelCfg.q = 'uuid== \'' + lineOelUUID +'\'';
      const fhLineOelWhereSql = yield call(queryFiltersByUUID, oelCfg)

      alarmCfg.whereSQL = fhLineOelWhereSql.content[0].filter.filterItems[0].value
      const RpingFailedAlarms = yield call(queryAlarms, alarmCfg)
      const whRpingFailedAlarms = RpingFailedAlarms

      let alerts = [{success:true}]
      // 告警
      let alertFh = resultTemp
      let log = ''
      alertFh.map(alertFhItem=>{
        alertFhItem.Severity = 200
        for(let alarm of fhAlarms.alertsResponse.alertList) {
          if (alertFhItem.N_OrgId === alarm.N_OrgId) {
            if (alertFhItem.Severity > alarm.N_CustomerSeverity) {
              alertFhItem.Severity = alarm.N_CustomerSeverity
              log = log + ';' + alarm.N_OrgName + ':' + alertFhItem.Severity
            }
          }
        }
      })
      if(log !== '')
      console.log('分行告警等级：' + log)
      // SD,JX 线路
      alertFh.map(item => {
        if('JXQ' === item.N_OrgId || 'SD' === item.N_OrgId || 'WHZB' === item.N_OrgId){
            //console.log(item.N_OrgId)
        }else{
          item.lineColorSD = 0
          item.lineColorJX = 0
          let discoveryIpArr = item.discoveryIps.split(',');
          let targetIpArr = item.targetIps.split(',');
          let portNameArr = item.portNames.split(',');
          for(let alarm of RpingFailedAlarms.alertsResponse.alertList) {
            // 告警详情
            let Summary = alarm.Summary;
            // 告警组
            let alertGroup = alarm.AlertGroup;
            // 截取对端ip
            let regex1 = /\<(.+?)\>/g;
            let summaryContainTargetIp = [];
            summaryContainTargetIp  = Summary.match(regex1);
            let summaryTargetIp = ''
            if(summaryContainTargetIp !== null && summaryContainTargetIp.length > 0) {
              summaryTargetIp = summaryContainTargetIp[0].replace('<', '').replace('>', '')
            }
            // 设备Ip
            let nodeAlias = alarm.NodeAlias;
            for(let i = 0; i < discoveryIpArr.length; i++){
              if('Port_Discharge_Height' === alertGroup){ // 线路黄色
                if(nodeAlias === discoveryIpArr[i] && -1 !== Summary.indexOf(portNameArr[i])){
                  if(-1 !== portNameArr[i].indexOf('SDA')){
                    item.lineColorSD = 2
                  }else{
                    item.lineColorJX = 2
                  }
                }
              }else if('RPING_Packet_Loss' === alertGroup || 'RPING_Response_Time' === alertGroup){ // 线路黄色
                if(discoveryIpArr[i] === nodeAlias && summaryTargetIp === targetIpArr[i]){
                  if(-1 !== portNameArr[i].indexOf('SDA')){
                    item.lineColorSD = 2
                  }else{
                    item.lineColorJX = 2
                  }
                }
              }else if('RPING_Failed' === alertGroup){ // 线路红色
                if(discoveryIpArr[i] === nodeAlias && summaryTargetIp === targetIpArr[i]){
                  if(-1 !== portNameArr[i].indexOf('SDA')){
                    item.lineColorSD = 1
                  }else{
                    item.lineColorJX = 1
                  }
                }
              }
            }
          }
        }
      });


      // WH灾备线路
      alertFh.map(item=>{
        item.lineColorWH = 0
        for(let alarm of whRpingFailedAlarms.alertsResponse.alertList) {
          if(alarm.NodeAlias === '10.225.200.12'){
            for (let whToFhIp of whToFhIps) {
              if (alarm.Summary.indexOf(whToFhIp.value) !== -1 && alarm.Summary.indexOf(item.value) !== -1) {
                console.log('国内线路->WHZB中断')
                item.lineColorWH = 1
              }
            }
          }
        }
      })
      alerts[0].resultset = alertFh
      alerts[0].success = true
      yield put({
        type: 'setState',
        payload: {
          alerts: alerts,
        },
      })
    },

    *queryDWDMBreakUpAlarms({payload}, {call, put}){
      let oelCfg = {}
      oelCfg.pagination = { current:0, pageSize:100 }
      //oelCfg.uuid = uuid;
      //oelCfg.whereSQL = `(( N_CustomerSeverity=1 or N_CustomerSeverity=2 or N_CustomerSeverity=3 ) and N_ComponentType ='网络' and NodeAlias='10.1.71.24' and N_MgtOrg='总行' and Severity >0  )   order by FirstOccurrence desc`
      oelCfg.filtername = '网络大屏_DWDM连接健康状态'
      const dwdmAlarms = yield call(queryAlarmsByfiltername, oelCfg)

      let storageDeviceKeyWord = 'OSN6800'
      let coreDeviceKeyWord = 'OSN8800'
      let alarmKeyWord ='MUT_LOS'
      let data = [0,0,0,0,0,0,0,0]
      let coreA = 0
      let coreB = 0
      let coreC = 0
      let coreD = 0
      let storageAYD = 0
      let storageALT = 0
      let storageBLT = 0
      let storageBYD = 0
      const alertsResponse = dwdmAlarms.alertsResponse
      if(alertsResponse.page.totalElements> 0){
        for(let alarm of alertsResponse.alertList) {
          if(alarm.Summary.indexOf(alarmKeyWord) !== -1){
            //console.log('having alarmKeyWord')
            if(alarm.Summary.indexOf(coreDeviceKeyWord) !== -1){
              //console.log('having coreDeviceKeyWord')
              //console.log(alarm.Summary.split('location')[0])
              if(alarm.Summary.indexOf('UC#光10679') !== -1 ||
                alarm.Summary.indexOf('核心B组共建恒业') !== -1 ||
                alarm.Summary.indexOf('N31818/N31962') !== -1 ||
                alarm.Summary.indexOf('UC#光10680') !== -1){
                let deviceNum = alarm.Summary.split('location')[0].split('=')[1].split('.')[0].replace(coreDeviceKeyWord,'')
                switch (deviceNum) {
                  case 'A':
                    data[0]= 1
                    console.log('核心A-联通DWDM线路中断')
                    coreA = 1 // 联通
                    break
                  case 'B':
                    data[1]= 1
                    console.log('核心B-共恒建业DWDM线路中断')
                    coreB = 1 // 共恒建业
                    break
                  case 'C':
                    data[2]= 1
                    console.log('核心C-歌华有线DWDM线路中断')
                    coreC = 1 // 歌华有线
                    break
                  case 'D':
                    data[3] = 1 // 中国联通
                    console.log('核心D-中国联通DWDM线路中断')
                    coreD = 1
                    break
                }
              }
            }else if(alarm.Summary.indexOf(storageDeviceKeyWord) !== -1){
              //console.log('having storageDeviceKeyWord')
              // console.log(alarm.Summary.split('location')[0])
              // console.log(alarm.Summary.split('location')[0].split('=')[1])
              // console.log(alarm.Summary.split('location')[0].split('=')[1].split('.')[0])
              let deviceNum = alarm.Summary.split('location')[0].split('=')[1].
              split('.')[0].replace(storageDeviceKeyWord,'')
              //console.log(deviceNum)
              if(deviceNum==='A'){
                if(alarm.Summary.indexOf('CM#26001915803') !== -1){
                  data[4] = 1
                  console.log('存储A-移动DWDM线路中断')
                  storageAYD =1
                }else if(alarm.Summary.indexOf('UC#光6220') !== -1){
                  data[5] = 1
                  console.log('存储A-联通DWDM线路中断')
                  storageALT = 1
                }
              }else if(deviceNum==='B'){
                if(alarm.Summary.indexOf('UC#光6221') !== -1){
                  data[6] = 1
                  console.log('存储B-联通DWDM线路中断')
                  storageBLT = 1
                }else if(alarm.Summary.indexOf('CM#26001934112') !== -1){
                  data[7] = 1
                  console.log('存储B-移动DWDM线路中断')
                  storageBYD =1
                }
              }
            }
          }
        }

      }
      yield put({
        type: 'setState',
        payload: {
          lineData: data,
          coreA : coreA,
          coreB : coreB,
          coreC : coreC,
          coreD : coreD,
          storageAYD : storageAYD,
          storageALT : storageALT,
          storageBLT : storageBLT,
          storageBYD : storageBYD
        },
      })
    },

    *queryNetWorkPerformance({payload}, {call, put}){
      let oelCfg = {}
      oelCfg.pagination = { current:0, pageSize:100 }
      oelCfg.filtername = '网络大屏_网络服务域告警'
      const alarms = yield call(queryAlarmsByfiltername, oelCfg)
      let result = netWorkDomain
      for(let i = 0; i < result.length;i++){
        result[i].num = 0
        for(let alarm  of alarms.alertsResponse.alertList){
          if(result[i].contains.indexOf(alarm.N_AppName) !== -1){
                result[i].num += 1
          }
        }
      }
      yield put({
        type: 'setState',
        payload: {
          netWorkPerformance: result,
        },
      })
    },

    *queryDedicatedLineHealthStatus({payload}, {call, put}){
      let lineUUID = oelFilter.DedicatedLineHealthStatus.lineOelFilter;
      let oelWhereCfg = {};
      oelWhereCfg.pagination = { current:0, pageSize:100 };
      oelWhereCfg.q = 'uuid ==\''+ lineUUID + '\'';
      const dedicatedLineHealthStatusFilters = yield call(queryFiltersByUUID, oelWhereCfg);
      let sqlWhere = dedicatedLineHealthStatusFilters.content[0].filter.filterItems[0].value;

      let oelCfg = {};
      oelCfg.pagination = { current:0, pageSize:100 };
      oelCfg.whereSQL = sqlWhere;//`(( N_CustomerSeverity=1 or N_CustomerSeverity=2 or N_CustomerSeverity=3 ) and N_ComponentType ='网络' and (AlertGroup Like 'RPING' or AlertGroup = 'Port_Discharge_Height') and N_MgtOrg='总行' and Severity >0 and NodeAlias in ('10.1.94.251','10.1.94.233','10.1.94.222','10.1.94.221','10.195.201.201','10.195.201.211')) order by FirstOccurrence desc`;
      oelCfg.uuid = uuid;
      const RpingFailedAlarms = yield call(queryAlarms, oelCfg);
      let lineData = lineConfig
      lineData.map(item=>{
        item.lineColorSD = '#00CD00';
        item.lineColorJX = '#00CD00';
        let discoveryIpArr = item.discoveryIps.split(',');
        let targetIpArr = item.targetIps.split(',');
        let portNameArr = item.portNames.split(',');
        for(let alarm of RpingFailedAlarms.alertsResponse.alertList) {
          // 告警详情
          let Summary = alarm.Summary;
          // 告警组
          let alertGroup = alarm.AlertGroup;
          // 截取对端ip
          let regex1 = /\<(.+?)\>/g;
          let summaryContainTargetIp = [];
          summaryContainTargetIp  = Summary.match(regex1);
          let summaryTargetIp = ''
          if(summaryContainTargetIp !== null && summaryContainTargetIp.length > 0) {
            summaryTargetIp = summaryContainTargetIp[0].replace('<', '').replace('>', '')
          }
          // 设备Ip
          let nodeAlias = alarm.NodeAlias;
          for(let i = 0; i < discoveryIpArr.length; i++){
            if('Port_Discharge_Height' === alertGroup){ // 线路黄色
              if(nodeAlias === discoveryIpArr[i] && -1 !== Summary.indexOf(portNameArr[i])){
                if(-1 !== portNameArr[i].indexOf('SDA')){
                  item.lineColorSD = '#ffff00'
                }else{
                  item.lineColorJX = '#ffff00'
                }
              }
            }else if('RPING_Packet_Loss' === alertGroup || 'RPING_Response_Time' === alertGroup){ // 线路黄色
              if(discoveryIpArr[i] === nodeAlias && summaryTargetIp === targetIpArr[i]){
                if(-1 !== portNameArr[i].indexOf('SDA')){
                  item.lineColorSD = '#ffff00'
                }else{
                  item.lineColorJX = '#ffff00'
                }
              }
            }else if('RPING_Failed' === alertGroup){ // 线路红色
              if(discoveryIpArr[i] === nodeAlias && summaryTargetIp === targetIpArr[i]){
                if(-1 !== portNameArr[i].indexOf('SDA')){
                  item.lineColorSD = '#f00'
                }else{
                  item.lineColorJX = '#f00'
                }
              }
            }
          }
        }
      });
      yield put({
        type: 'setState',
        payload: {
          lineHealthData: lineData,
        },
      })
    },
  },

  reducers: {
    setState(state, action) {
      return { ...state, ...action.payload
      }
    },

    updateState(state, action) {
      return { ...state, ...action.payload  }
    },

    //这里控制弹出窗口显示 或者隐藏
    controllerModal(state, action) {
      return { ...state, ...action.payload }
    },
  },
}
