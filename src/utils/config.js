// const mynginxproxy = 'mynginxproxyInfo'
// const performanceproxy = 'performanceproxyinfo'
const performancepath = 'performancepathinfo'
const myexportnginxproxy = 'myexportnginxproxyInfo'
const totalnetproxy = 'totalnetproxyInfo'
// const myCompanyName = 'myCompanyNameInfo'//'EBan4k'
const mynginxproxyport = 'mynginxportInfo' // use for skywalking oap with format ip:port


const mynginxproxy = `http://192.168.0.8:9987`
// const mynginxproxy = `http://15.2.22.89:9090`
// const totalnetproxy = 'http://10.218.32.65:9090'
const myCompanyName = 'EBank'//'EGroup'//
const performanceproxy = '/api0';
// const performancepath = 'u2serviceregisteraudit/_doc/_search/'

const name = `${myCompanyName}`
const system_name = '统一监控管理平台'
//const footerText= `${ozr('shortName')}科技部  © 2019`,
const iconFontJS = '/iconfont.js'
const CORS = [`${mynginxproxy}`,'https://15.2.20.33:22443', 'http://10.218.36.18:8000', 'http://10.1.71.127:9200', `${performanceproxy}`, 'http://10.218.32.65:9090', 'http://10.218.36.18:9080', `${myexportnginxproxy}`, `${totalnetproxy}`,'http://10.218.34.24:8080','http://10.214.118.5']
const YQL = ''
const openPages = ['/login', '/oel', '/historyviews', '/u1Historyviews', '/oelCust', '/monitorSummary', '/rulespreview', '/oelCompression', '/oelHint']
const apiPrefix = '/api/v1'
const countDown = 60
const sessionTime = 2400000 //40分钟，毫秒单位 1s = 1000ms

const api = {
  eppPolicy: `${mynginxproxy}/api/v1/epp/epp-event-mask-policy`,
  epp: `${mynginxproxy}/api/v1/epp/epp-ins`,
  alarmProcess: `${mynginxproxy}/api/v1/em/all`,
  iam: `${mynginxproxy}/api/v1/users/iam-sso`,
  iamState: `${mynginxproxy}/api/v1/ops/es-state`,
  entry: `${mynginxproxy}/api/v1/users/oauth-sso/entry`,
  oauthssoLogin: `${mynginxproxy}/api/v1/users/oauth-sso/login`,
  performanceproxy: `${performanceproxy}`,
  //	performance: 'http://10.218.36.18:8000/u2performance/doc/_search/', //现场环境的elsaticsearch地址
  performance: `${performanceproxy}/${performancepath}`, //测试环境的elsaticsearch地址
  zabbixUrl: 'http://192.168.0.158:1025/api_jsonrpc.php',
  userLogin: `${mynginxproxy}/api/v1/users/login`,
  userLogout: `${mynginxproxy}/api/v1/users/logout`,
  getUserByToken: `${mynginxproxy}/api/v1/users/current`,
  dashboard: '/dashboard',
  tools: `${mynginxproxy}/api/v1/tools/`,
  totalnet: `${mynginxproxy}/evaluation_dns/api/v1/evaluate/evaluation`,
  branchnet: `${mynginxproxy}/evaluation_dns/api/v1/evaluate/evaluation`,
  equipment: `${mynginxproxy}/evaluation_dns/api/v1/evaluate/appName`,
  branchData: `${mynginxproxy}/evaluation_dns/api/v1/branch/`,
  indexlist: `${mynginxproxy}/evaluation_dns/api/v1/detail/moDetail`,
  strategylist: `${mynginxproxy}/evaluation_dns/api/v1/detail/moDetail`,
  kpiPolicyList: `${mynginxproxy}/evaluation_dns/api/v1/detail/detailModal`,
  kpiPolicyExport: `${mynginxproxy}/evaluation_dns/api/v1/detail/export`,
  scoreLineData: `${mynginxproxy}/evaluation_dns/api/v1/evaluate/line`,
  indexinfo: `${mynginxproxy}/api/v1/std-indicators/`,
  strategyinfo: `${mynginxproxy}/api/v1/policy-templates/`,
  toolcheck: `${mynginxproxy}/api/v1/tools/?do=check-available`,
  cfgs: `${mynginxproxy}/api/v1/tools/`,
  objectsMO: `${mynginxproxy}/api/v1/mos/`,
  moDown: `${mynginxproxy}/api/v1/export/mo`,
  objectGroups: `${mynginxproxy}/api/v1/mos/groups`,
  template: `${mynginxproxy}/api/v1/template/`,
  stdindicators: `${mynginxproxy}/api/v1/std-indicators/`,
  stdindicatorsGroups: `${mynginxproxy}/api/v1/std-indicators/groups/`,
  objects: `${mynginxproxy}/api/v1/mos/groups`,
  zabbixItemsinfo: `${mynginxproxy}/api/v1/zabbix-items/`,
  zabbixItemsGroups: `${mynginxproxy}/api/v1/zabbix-items/groups/`,
  appSearchFromCmdb: `${mynginxproxy}/api/v1/cmdb_node_info/distnct_list`,
  timePeriods: `${mynginxproxy}/api/v1/time-periods/`,
  policyTemplet: `${mynginxproxy}/api/v1/policy-templates/`,
  policyRule: `${mynginxproxy}/api/v1/monitor-rules/`,
  policyInstance: `${mynginxproxy}/api/v1/policies/`,
  nes: `${mynginxproxy}/api/v1/nes/`,
  ruleInstance: `${mynginxproxy}/api/v1/rule-instances/`,
  mosIssueOffline: `${mynginxproxy}/api/v1/rule-instances/issue-offline`,
  monitorRules: `${mynginxproxy}/api/v1/monitor-rules/`,
  alarms: `${mynginxproxy}/api/v1/osts/alerts`,
  alarmtree: `${mynginxproxy}/api/v1/osts/compact_tree`,
  alarmcompact: `${mynginxproxy}/api/v1/osts/compact_alerts`,
  oelEventFilter: `${mynginxproxy}/api/v1/ef/`,
  toolset: `${mynginxproxy}/api/v1/et/`,
  osts: `${mynginxproxy}/api/v1/osts/`,
  eventviews: `${mynginxproxy}/api/v1/ev/`,
  applications: `${mynginxproxy}/api/v1/apps/`,
  databases: `${mynginxproxy}/api/v1/dbs/`,
  middleWares: `${mynginxproxy}/api/v1/mws/`,
  os: `${mynginxproxy}/api/v1/oses/`,
  deleteAllOsFs: `${mynginxproxy}/api/v1/oses/fses/`,
  deleteAllOsDisk: `${mynginxproxy}/api/v1/oses/diskes/`,
  servers: `${mynginxproxy}/api/v1/servers/`,
  lines: `${mynginxproxy}/api/v1/lines/`,
  branchip: `${mynginxproxy}/api/v1/branch-ips/`,
  changepwd: `${mynginxproxy}/api/v1/users/`,
  userinfo: `${mynginxproxy}/api/v1/users/`,
  roles: `${mynginxproxy}/api/v1/roles/`,
  users: '/users',
  user: '/user/:id',
  umdbs: `${mynginxproxy}/api/v1/umdb/`,
  lookup: `${mynginxproxy}/api/v1/lookup/`,
  lookupGroups: `${mynginxproxy}/api/v1/lookup/g/`,
  permission: `${mynginxproxy}/api/v1/permissions/`,
  maintenanceTemplet: `${mynginxproxy}/api/v1/mt-templates/`,
  mtsGroups: `${mynginxproxy}/api/v1/mts/groups/`,
  mtsinfo: `${mynginxproxy}/api/v1/mts/`,
  appCategories: `${mynginxproxy}/api/v1/app-categories/`,
  exportExcelURL: `${mynginxproxy}`,
  notificationRules: `${mynginxproxy}/api/v1/notification_rules/`,
  ticket: `${mynginxproxy}/api/v1/em/ticket/`,
  historyview: `${mynginxproxy}/api/v1/reporter_status/`,
  historyQuery: `${mynginxproxy}/api/v1/reporter_status/custom-filter/`,
  severity: `${mynginxproxy}/api/v1/rep_audit_severity/`,
  details: `${mynginxproxy}/api/v1/reporter_details/`,
  journal: `${mynginxproxy}/api/v1/reporter_journal/`,
  notificationInfo: `${mynginxproxy}/api/v1/notification/`,
  storages: `${mynginxproxy}/api/v1/storage/`,
  tservers: `${mynginxproxy}/api/v1/hwservers/`,
  IP: `${mynginxproxy}/api/v1/ips/`,
  PageSets: `${mynginxproxy}/api/v1/pagesets/`,
  CloudDevices: `${mynginxproxy}/api/v1/cloudDevices/`,
  SpecialDevices: `${mynginxproxy}/api/v1/specialdevices/`,
  ReportFunctions: `${mynginxproxy}/api/v1/reporter_function/`,
  NodeReports: `${mynginxproxy}/reporter/`,
  UpdateHistorys: `${mynginxproxy}/api/v1/update-history/`,
  alarmJourney: `${mynginxproxy}/api/v1/osts/journals`,
  downloadReporter: `${mynginxproxy}/api/v1/reporter_status/download/`,
  u1ReporterStatus: `${mynginxproxy}/api/v1/old_reporter_status/`,
  u1ReportSeveritys: `${mynginxproxy}/api/v1/old_rep_audit_severity/`,
  u1ReportJournals: `${mynginxproxy}/api/v1/old_reporter_journal/`,
  u1ReportDetails: `${mynginxproxy}/api/v1/old_reporter_details/`,
  notfications: `${mynginxproxy}/api/v1/notification/`,
  changeMt: `${mynginxproxy}/api/v1/reporter_status/mt-status/`,
  screen: `${mynginxproxy}/api/v1/osts/sql_query/`,
  dataDict: `${mynginxproxy}/api/v1/dicts/`,
  dataDictItem: `${mynginxproxy}/api/v1/dict-datas/`,
  channel: `${mynginxproxy}/api/v1/umdb/`,
  APPinfor: `${mynginxproxy}/api/v1/message_data/`,
  rulePreview: `${mynginxproxy}/api/v1/monitor-rules/preview`,
  trackTimer: `${mynginxproxy}/api/v1/trace-conf/`,
  trackAlarm: `${mynginxproxy}/api/v1/trace-alarm/`,
  trackAction: `${mynginxproxy}/api/v1/trace-action/`,
  moDiscovery: `${mynginxproxy}/api/v1/mos/discovery`,
  wizardPreview: `${mynginxproxy}/api/v1/monitor-rules/wizardPreview`,
  neAndIntfs: `${mynginxproxy}/api/v1/nes/neAndIntfs`,
  mosChange: `${mynginxproxy}/api/v1/mos/change`,
  wizardPreviewLine: `${mynginxproxy}/api/v1/monitor-rules/wizardPreview/line`,
  nesOffline: `${mynginxproxy}/api/v1/nes/offline`,
  lineOffline: `${mynginxproxy}/api/v1/lines/offline`,
  mosOffline: `${mynginxproxy}/api/v1/mos/offline`,
  dbsOffline: `${mynginxproxy}/api/v1/dbs/offline`,
  dlIndicator: `${mynginxproxy}/api/v1/export/indicator`,
  dlIndicatorImpl: `${mynginxproxy}/api/v1/export/indicator-impl`,
  dlNotificationRule: `${mynginxproxy}/api/v1/export/notification-rule`,
  dlRule: `${mynginxproxy}/api/v1/export/rule`,
  dlTemplate: `${mynginxproxy}/api/v1/export/template`,
  dldataDict: `${mynginxproxy}/api/v1/export/dict`,
  ulIndicator: `${mynginxproxy}/api/v1/import/kpi`,
  ulIndicatorImpl: `${mynginxproxy}/api/v1/import/kpi-impl`,
  ulNotificationRule: `${mynginxproxy}/api/v1/import/notification-rule`,
  ulRule: `${mynginxproxy}/api/v1/import/rule`,
  ulTemplate: `${mynginxproxy}/api/v1/import/policy-template`,
  uldataDict: `${mynginxproxy}/api/v1/import/dict`,
  //
  xykuserLogin: `${mynginxproxy}/searchxykalarm/api/v1/users/login`,     //信用卡接口
  xykeventviews: `${mynginxproxy}/searchxykalarm/api/v1/ev/`,     //信用卡接口
  xykosts: `${mynginxproxy}/searchxykalarm/api/v1/osts/`,       //信用卡接口
  xyktoolset: `${mynginxproxy}/searchxykalarm/api/v1/et/`,         //信用卡接口
  xykoelEventFilter: `${mynginxproxy}/searchxykalarm/api/v1/ef/`,    //信用卡接口
  xykalarms: `${mynginxproxy}/searchxykalarm/api/v1/osts/alerts`,    //信用卡接口
  xykalarmJourney: `${mynginxproxy}/searchxykalarm/api/v1/osts/journals`, //信用卡接口
  xykdownloadReporter: `${mynginxproxy}/searchxykalarm/api/v1/reporter_status/download/`, //信用卡接口
  xykhistoryview: `${mynginxproxy}/searchxykalarm/api/v1/reporter_status/`,
  xykseverity: `${mynginxproxy}/searchxykalarm/api/v1/rep_audit_severity/`,
  xykjournal: `${mynginxproxy}/searchxykalarm/api/v1/reporter_journal/`,
  xyknotificationInfo: `${mynginxproxy}/searchxykalarm/api/v1/notification/`,
  xykappCategories: `${mynginxproxy}/searchxykalarm/api/v1/app-categories/`,
  forbidIssu: `${mynginxproxy}/api/v1/issue-action-config/`, //下发禁用接口
  dbDiscovery: `${mynginxproxy}/api/v1/mos/discovery/db`,
  osDiscovery: `${mynginxproxy}/api/v1/mos/discovery/os`,
  discovery: `${mynginxproxy}/api/v1/discovery/`,
  wizardPreviewBrIP: `${mynginxproxy}/api/v1/monitor-rules/wizardPreview/branchIp`,
  jobs: `${mynginxproxy}/api/v1/jobs/`,
  label: `${mynginxproxy}/api/v1/tags/`,
  promTree: `${mynginxproxy}/api/v1/tools/prom-tree`,
  mtreviewer: `${mynginxproxy}/api/v1/users/mt-reviewer`,
  savereviewer: `${mynginxproxy}/api/v1/mt-reviewer/`,
  knowledge: `${mynginxproxy}/api/v1/Knowledge-base/getRecommendation`,
  registServe: `${mynginxproxy}/api/v1/service-register/`,
  registServeExport: `${mynginxproxy}/api/v1/export/service-register`,
  registServeImport: `${mynginxproxy}/api/v1/import/service-register`,
  authadd:`${mynginxproxy}/api/v1/mpoin/auth/add`,
  authdelete:`${mynginxproxy}/api/v1/mpoin/auth/delete`,
  grafanaAdd:`${mynginxproxy}/api/v1/thirdparty/grafanacookie`,
  specialPolicy:`${mynginxproxy}/api/v1/specialPolicy/`,
  toolLable:`${mynginxproxy}/api/v1/tools/label_values`,
  personalCurve:`${mynginxproxy}/api/v1/tools/query_range`,
  getAllOrg:`${mynginxproxy}/api/v1/thirdparty/getAllOrg`,
  ExceptOrg:`${mynginxproxy}/api/v1/thirdparty/getAllUsersExceptOrg`,
  FromOrg:`${mynginxproxy}/api/v1/thirdparty/getAllUsersFromOrg`,
  addUserToOrg:`${mynginxproxy}/api/v1/thirdparty/addUserToOrg`,
  delUserFromOrg:`${mynginxproxy}/api/v1/thirdparty/delUserFromOrg`,
  dsl:`${mynginxproxy}/api/v1/reporter_status/dsl`,
  recommendAddress:`http://10.218.34.24:8080/api/forest/v1/alert/info/`,
  getClusterRule:`${mynginxproxy}/api/v1/cluster_rule/clusterRule`, // 查询
  clusterRuleIssue:`${mynginxproxy}/api/v1/cluster_rule/issue`,
  clusterRuleNormal:`${mynginxproxy}/api/v1/cluster_rule/normalRule`,
  clusterRuleBasics:`${mynginxproxy}/api/v1/cluster_rule/basicsRule`,
  clusterRuleupDate:`${mynginxproxy}/api/v1/cluster_rule/updateRule`, // 更新
  clusterRuleCheck:`${mynginxproxy}/api/v1/cluster_rule/ExportCheckRule`, // 校验
  clusterbyname:`${mynginxproxy}/api/v1/cluster_rule/SelectedClusterRule`, // 校验
  findOsMO:`${mynginxproxy}/api/v1/mos/discovery/os/nantian`,
  OSSelfService:`${mynginxproxy}/api/v1/mos/wizardPreview/os/nantian`,

  tolc:`${mynginxproxy}/datainsight`,
  outCallUsers:`${mynginxproxy}/webapi/poin/alarmInfo/getCallUsers`,
  outCallapi:`${mynginxproxy}/webapi/poin/alarmInfo/showAlarmNoticeHistory`,
  ZabbixOSImport:`${mynginxproxy}/api/v1/mos/discovery/os/nantian/batch`,
  checkexists:`${mynginxproxy}/api/v1/mos/discovery/os/nantian/checkexists`,
  batchOnmonitor:`${mynginxproxy}/api/v1/mos/wizardPreview/os/nantian/batch`,
  OS_offline:`${mynginxproxy}/api/v1/mos/offline/nantian`,
  zabbixHsot:`${mynginxproxy}/api/v1/mos/queryhosts/nantian`,
  monthReportApi:`${mynginxproxy}/api/v1/month-report/`,
  urlDns:`${mynginxproxy}/api/v1/url/`,
  mtExport:`${mynginxproxy}/api/v1/export/mt`,

  cpaas_project_clust:`${mynginxproxy}/ump_cpaas/auth/v1/projects`,
  cpass_service_pod:`${mynginxproxy}/ump_cpaas/kubernetes`,
  cpass_clusters:`/ump_cpaas/auth/v1/clusters`,
  historyCloums:`${mynginxproxy}/api/v1/user-view/`,
  // cpaas_project_clust:`/cpaas/tenant-adapter/non-native/v1/project/list`,
  // cpaas_name:`/cpaas/auth-apiserver/auth/v1`,
  // cpass_service_pod:`/cpaas/clusters-proxy/kubernetes`,
  // cpass_clusters:`/cpaas/tenant-adapter/native/v1/clusters`,

  // fileApi:`${mynginxproxy}/fileAssistantAPI/api/command/getFiles`,
  // fileApiDown:`${mynginxproxy}/fileAssistantAPI/api/file/download`,
  // fileApiUpload:`${mynginxproxy}/fileAssistantAPI/api/file/upload`,
  // fileApiDel:`${mynginxproxy}/fileAssistantAPI/api/file/deleteSftp`,
  flinkPolicy:`${mynginxproxy}/flinkapi/api/ump_doc/`, // flink策略
  flinkDevice:`${mynginxproxy}/flinkapi/api/monitorDevice`, // flink设备
  flinkDict:`${mynginxproxy}/flinkapi/api/dict`,
  flinkPolicyGroup:`${mynginxproxy}/flinkapi/api/templateGroup/`, // 组
  flinkTemplate:`${mynginxproxy}/flinkapi/api/policyTemplate/`, // 模板
  flinkCondition:`${mynginxproxy}/flinkapi/api/policyCondition/`, // 条件

  epp_status:`${mynginxproxy}/api/v1/epp-status/`,
  testapi: `${mynginxproxy}/fbsapi/api/v1/monitor/test`,
  monitorProject: `${mynginxproxy}/fbsapi/api/v1/monitor/project`,
  clusertapi: `${mynginxproxy}/fbsapi/api/v1/monitor/cluster`,
  namespaceapi: `${mynginxproxy}/fbsapi/api/v1/monitor/namespace`,
  serviceapi: `${mynginxproxy}/fbsapi/api/v1/monitor/service`,
  monitorExport: `${mynginxproxy}/fbsapi/api/v1/monitor/export`,
  // grafana 跳转
  grafanaAdress:`${mynginxproxy}/api/v1/thirdparty/grafanaredirect`,
  mt_instances:`${mynginxproxy}/api/v1/mt-templates/create_instances`,
  mt_import:`${mynginxproxy}/api/v1/mt-templates/importFromExcel`,
  // 数据库自服务
  dbWizard:`${mynginxproxy}/api/v1/mos/nantian/dbmid/`,
  // 分布式集中配置
  configuration:`${mynginxproxy}/api/v1/distribute-configuration/`,
  // 日志审计 模块
  logModal:`${mynginxproxy}/api/v1/audit-log-module/`,
  personStrategy:`${mynginxproxy}/api/v1/personalized-strategy/`,
  // 报表
  journalingApi:`${mynginxproxy}/journa/api/reporter/`,
  reporterApi:`${mynginxproxy}/journa/api/jpa/reporter_config/all_sort/`,
  // 告警提示
  oelHint: `${mynginxproxy}/api/v1/osts/hotspot_alerts`,
}

export { name, system_name, iconFontJS, CORS, YQL, openPages, apiPrefix, countDown, myCompanyName, mynginxproxyport,  sessionTime, api }
