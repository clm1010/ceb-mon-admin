export const custOutRoutes = [
/*  {//历史告警
    path:'/historyviewGroup',
    models: () => [import('./models/historyviewGroup'),import('./models/historyview'),import('../../models/mainRuleInstanceInfo'),import('../../components/alarmFromComp/alarmFrom'),import('../../components/notifyWayComp/notifyWay'),import('../../components/alarmSeverityComp/alarmSeverity'),import('../../components/userSelectComp/userSelect'),import('../../components/moSelectComp/moSelect')],
    component: () => import('./routes/historyview'),
    exact:false,
  },
  {//老平台历史告警
    path:'/u1Historyviews',
    models: () => [import('./models/u1HistoryviewGroup'),import('./models/u1Historyview')],
    component: () => import('./routes/u1Historyview/'),
    exact:false,
  }*/
];

export const custInRoutes = [
/*   {//用户信息
    path:'/userInfo',
    models: () => [import('./models/userinfo')],
    component: () => import('./routes/user/userinfo'),
    exact:true,
  },
  {//角色管理
    path:'/roles',
    models: () => [import('./models/roles'), import('./models/objectMOsModal')],
    component: () => import('./routes/user/roles/'),
    exact:true,
  },
 */


/*   {//通知规则管理
    path:'/notification',
    models: () => [import('./models/notification'),import('./models/userinfo'),import('./models/roles'), import('./routes/utils/alarmFromComp/alarmFrom'),import('./routes/utils/alarmSeverityComp/alarmSeverity'),import('./routes/utils/moSelectComp/moSelect'),import('./routes/utils/notifyWayComp/notifyWay')],
    component: () => import('./routes/notification/'),
    exact:true,
  },
  {//通知记录查询
    path:'/notficationView',
    models: () => [import('./models/notficationView'), import('./models/userinfo'),import('./routes/utils/alarmFromComp/alarmFrom'),import('./routes/utils/alarmSeverityComp/alarmSeverity'),import('./routes/utils/moSelectComp/moSelect'),import('./routes/utils/notifyWayComp/notifyWay')],
    component: () => import('./routes/notficationView/'),
    exact:true,
  },
  {//app消息流水
    path:'/APPinfor',
    models: () => [import('./models/APPinfor'),import('./models/historyview')],
    component: () => import('./routes/APPinfor/'),
    exact:true,
  },*/


  //===================================================
  {//数据库自服务
    path:'/dbwizard',
    models: () => [import('./models/dbwizard'), import('../../components/appSelectComp/appSelect')],
    component: () => import('./routes/dbwizard'),
    exact:true,
  },
  {//操作系统自服务
    path:'/oswizard',
    models: () => [import('./models/oswizard'), import('../../components/appSelectComp/appSelect')],
    component: () => import('./routes/oswizard'),
    exact:true,
  },
/* 
  {//实时告警列表
    path:'/oel',
    models: () => [import('./models/oelEventFilter'),import('./models/oelDataSouseset'),import('./models/oel'),import('./models/oelToolset'),import('./models/eventviews')],
    component: () => import('./routes/oel/'),
    exact:true,
  }, */
/*   {//服务台实时告警查询
    path:'/monitorview',
    models: () => [import('./models/oelEventFilter'),import('./models/oelDataSouseset'),import('./models/monitorview')],
    component: () => import('./routes/monitorview/'),
    exact:true,
  }, */
/*   {//一线实时告警查询
    path:'/frontview',
    models: () => [import('./models/oelEventFilter'),import('./models/oelDataSouseset'),import('./models/frontview')],
    component: () => import('./routes/frontview/'),
    exact:true,
  }, */
 /*  {//分行实时告警查询
    path:'/branchview',
    models: () => [import('./models/oelEventFilter'),import('./models/oelDataSouseset'),import('./models/branchview')],
    component: () => import('./routes/branchview'),
    exact:true,
  }, */
/*   {//未恢复告警查询
    path:'/oelCust',
    models: () => [import('./models/oelEventFilter'),import('./models/oelDataSouseset'),import('./models/oelCust'),import('./models/oelToolset'),import('./models/eventviews')],
    component: () => import('./routes/oelCust/'),
    exact:true,
  }, */
/*   {//监控维护告警
    path:'/monview',
    models: () => [import('./models/oelEventFilter'), import('./models/oelDataSouseset'), import('./models/monview')],
    component: () => import('./routes/monview/'),
    exact:true,
  }, */
 /*  {//总行实时告警
    path:'/centerview',
    models: () => [import('./models/oelEventFilter'),import('./models/oelDataSouseset'),import('./models/centerview')],
    component: () => import('./routes/centerview/'),
    exact:true,
  }, */
/*   {//告警分布图
    path:'/alarmdiagram',
    models: () => [import('./models/distribution'),import('./models/oelEventFilter'), import('./models/oelDataSouseset'), import('../../components/appSelectComp/appSelect')],
    component: () => import('./routes/distriibution'),
    exact:true,
  }, */
/*   {//告警跟踪
    path:'/oelTrack',
    models: () => [import('./models/oelTrack')],
    component: () => import('./routes/oelTrack/'),
    exact:true,
  }, */
/*   {//信用卡一线实时告警查询
    path:'/xykfrontview',
    models: () => [import('./models/oelEventFilter'),import('./models/oelDataSouseset'),import('./models/frontview')],
    component: () => import('./routes/frontview/'),
    exact:true,
  }, */

  {//总行监视视图
    path:'/monitorZH',
    models: () => [import('./models/monitor')],
    component: () => import('./routes/monitor/'),
    exact:true,
  },
  {//分行监控视图
    path:'/monitorFH',
    models: () => [import('./models/monitor')],
    component: () => import('./routes/monitorBranch/'),
    exact:true,
  },
  {//护网行动监控视图  该路由在大屏视图中
    path:'/monitorSummary',
    models: () => [import('./models/monitorSummary')],
    component: () => import('./routes/monitorSummary/'),
    exact:true,
  },
  {//大屏视图
    path:'/screen',
    models: () => [import('./models/screen')],
    component: () => import('./routes/screen'),
    exact:true,
  },

/*  {//报表配置
    path:'/formConfigurationGroup',
    models: ()=>[import('./models/formConfigurationGroup'),import('./models/formConfiguration')],
    component: () => import('./routes/formConfiguration'),
    exact:false,
  },

  {//总行网络
    path:'/totalnet',
    models: () => [import('./models/totalnet')],
    component: ()=> import('./routes/totalnet/'),
    exact:true,
  },
  {//分行网络
    path:'/branchnet',
    models: () => [import('./models/branchnet'),import('./models/totalnet')],
    component: ()=> import('./routes/branchnet/'),
    exact:true,
  },*/
  {//监控工具
    path:'/toolLink',
    models: () => [import('./models/toolLink')],
    component: () => import('./routes/toolLink/'),
    exact:true,
  },
  {//通知渠道
    path:'/channel',
    models: () => [import('../../models/channel')],
    component: () => import('../../routes/channel'),
    exact:true,
  },
]
