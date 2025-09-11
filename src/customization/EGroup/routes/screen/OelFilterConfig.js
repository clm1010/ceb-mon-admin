module.exports ={
  commonConfig:{
    oelViewer : 'e6501413-f909-4dac-8a17-e7bd3d056b3f',
  },
  /** 数据中心机房网络连通性 **/
  DataCenterRoom : {
    nodeOelFilter : 'e2b214e3-ecc0-4eac-98e1-90da3e830f21',
    nodeTitle : '数据中心机房网络线路告警详情',
  },
  /** 骨干网健康状况**/
  backBoneNetWord:{
    //骨干网节点
    nodeOelFilter : '45dcfcdf-6062-4f1d-b259-d326233a3e1d',
    nodeTitle : '骨干网节点分行告警详情',
    //骨干网线路
    lineOelFilter : '5a05ca12-ea62-4036-af43-99088dc66019',
    lineTitle : '骨干网线路中断告警详情',
  },
  /**  DWDM连接健康状况 **/
  DWDMDevice:{
    lineOelFilter : '9dd70c93-e475-4904-8ba6-28c673b7c29b',
    lineTitle : 'DWDM设备线路中断告警详情',
  },
  /** 网络服务域告警（1,2级） **/
  netWorkPerformance:{
      nodeOelFilter : '2bd7ee7b-7114-405e-9723-ab8423149078',
    nodeTitle : '网络服务域1,2级告警详情',
  },
  /** 网络大屏_第三方专线健康状态 **/
  DedicatedLineHealthStatus:{
    lineOelFilter : '0dc96e7c-ca58-4e1b-a85a-cd16fb3a3fd4',
    lineTitle : '网络大屏_第三方专线健康状态',
  },
};


