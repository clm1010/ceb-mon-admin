export const custOutRoutes = [
];

export const custInRoutes = [
  {//总行监视视图
    path: '/monitorZH',
    models: () => [import('./models/monitor')],
    component: () => import('./routes/monitor/'),
    exact: true,
  },
  {//分行监控视图
    path: '/monitorFH',
    models: () => [import('./models/monitor')],
    component: () => import('./routes/monitorBranch/'),
    exact: true,
  },
  {//护网行动监控视图  该路由在大屏视图中
    path: '/monitorSummary',
    models: () => [import('./models/monitorSummary')],
    component: () => import('./routes/monitorSummary/'),
    exact: true,
  },
  {//大屏视图
    path: '/ZHscreen',
    models: () => [import('./models/screen')],
    component: () => import('./routes/screen'),
    exact: true,
  },
  {//注册服务
    path: '/registerServices',
    models: () => [import('./models/registerServices')],
    component: () => import('./routes/registerServices'),
    exact: true,
  },
  {//监控工具
    path: '/toolLink',
    models: () => [import('./models/toolLink')],
    component: () => import('./routes/toolLink/'),
    exact: true,
  },
  {//个性化
    path: '/personalMonitor',
    models: () => [import('./models/personalMonitor')],
    component: () => import('./routes/personalMonitor/'),
    exact: true,
  },
  {//通知渠道
    path: '/channel',
    models: () => [import('../../models/channel')],
    component: () => import('../../routes/channel'),
    exact: true,
  },
  {//org操作用户
    path: '/orgOper',
    models: () => [import('./models/orgOper')],
    component: () => import('./routes/orgOper'),
    exact: true,
  },
  {//服务注册审计
    path: '/audit',
    models: () => [import('./models/audit')],
    component: () => import('./routes/audit'),
    exact: true,
  },
  {//单集群下发规则
    path: '/clusterRule',
    models: () => [import('./models/clusterRule')],
    component: () => import('./routes/clusterRule'),
    exact: true,
  },
  {//操作系统自服务
    path: '/oswizard',
    models: () => [import('./models/oswizard'), import('../../components/appSelectComp/appSelect'), import('../../models/oelEventFilter'), import('../../models/oelDataSouseset'), import('../../models/oel'), import('../../models/oelToolset'), import('../../models/eventviews')],
    component: () => import('./routes/oswizard'),
    exact: true,
  },
  {//监控月报
    path: '/monthreport',
    models: () => [import('./models/monthreport')],
    component: () => import('./routes/monthreport'),
    exact: true,
  },
  {//个性化服务注册
    path: '/perRegisServer',
    models: () => [import('./models/registerServices')],
    component: () => import('./routes/perRegisServer'),
    exact: true,
  },
  // {//文件助手
  //   path: '/fileAssistant',
  //   models: () => [import('./models/fileAssistant')],
  //   component: () => import('./routes/fileAssistant'),
  //   exact: true,
  // },
  {//监控对接自服务
    path: '/autoSearch',
    models: () => [import('./models/autoSearch')],
    component: () => import('./routes/autoSearch'),
    exact: true,
  },
  {//flink计算平台
    path: '/flinkComputPlat',
    models: () => [import('./models/flinkComputPlat')],
    component: () => import('./routes/flinkComputPlat'),
    exact: true,
  },
  {//分布式集中配置
    path: '/TogetherConfig',
    models: () => [import('./models/togetherConfig')],
    component: () => import('./routes/togetherConfig'),
    exact: true,
  },
  {//个性化策略
    path: '/personalizedStrategy',
    models: () => [import('./models/personalizedStrategy')],
    component: () => import('./routes/personalizedStrategy'),
    exact: true,
  },
  {//报表管理
    path: '/formPresentationGroup',
    models: () => [import('./models/baobiao')],
    component: () => import('./routes/baobiao'),
    exact: true,
  },
  // {//个性化
  //   path: '/specialmonitor',
  //   models: () => [import('./models/specialmonitor')],
  //   component: () => import('./routes/specialmonitor/'),
  //   exact: true,
  // },
  // {//个性化 增加
  //   path: '/specialmonitor/add',
  //   models: () => [import('./models/specialmonitor'), import('../../components/appSelectComp/appSelect')],
  //   component: () => import('./routes/specialmonitor/add'),
  //   exact: true,
  // },
]
