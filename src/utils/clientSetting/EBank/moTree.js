export default  [{
  name: '所有监控对象',
  key: 'MO',
  children: [{
    name: '网络',
    key: 'NETWORK',
    disabled: true,
    children: [{
      name: '路由器',
      key: 'NETWORK-ROUTER',
      children: [{
        name: '接口',
        key: 'NETWORK-ROUTER-NET_INTF',
      }],
    }, {
      name: '交换机',
      key: 'NETWORK-SWITCH',
      children: [{
        name: '接口',
        key: 'NETWORK-SWITCH-NET_INTF',
      }],
    }, {
      name: '防火墙',
      key: 'NETWORK-FIREWALL',
      children: [{
        name: '接口',
        key: 'NETWORK-FIREWALL-NET_INTF',
      }],
    }, {
      name: '网络管理器',
      key: 'NETWORK-NM',
    }, {
      name: '负载均衡',
      key: 'NETWORK-F5',
      children: [{
        name: '接口',
        key: 'NETWORK-F5-NET_INTF',
      }],
    }, {
      name: '线路',
      key: 'NETWORK-HA_LINE',
    }, {
      name: '网点IP',
      key: 'NETWORK-BRANCH_IP',
    }, {
      name: '主机',
      key: 'SERVER',
    }],
  }, {
    name: 'IP',
    key: 'IP',
  }, {
    name: '硬件',
    key: 'HARDWARE',
    disabled: true,
    children: [{
        name: '服务器',
        key: 'HARDWARE-HWSERVER',
        disabled: true,
        children: [{
          name: '小型机',
          key: 'HARDWARE-HWSERVER-MINICOMPUTER',
        }, {
          name: 'PC服务器',
          key: 'HARDWARE-HWSERVER-PCSERVER',
        }, {
          name: '刀笼及控制台',
          key: 'HARDWARE-HWSERVER-BLADE_CONSOLE',
        }, {
          name: '其它',
          key: 'HARDWARE-HWSERVER-OTHER',
        }],
      },
      {
        name: '存储',
        key: 'STORAGE',
        disabled: true,
        children: [{
          name: '存储设备',
          key: 'HARDWARE-STORAGE-NAS_STORAGE_DEVICE',
        }, {
          name: '光纤交换机',
          key: 'HARDWARE-STORAGE-NAS_FSWITCH',
        }, {
          name: '其它',
          key: 'HARDWARE-STORAGE-OTHER',
        }],
      },
      {
        name: '特殊设备',
        key: 'HARDWARE-SPECIALDEVICE',
      },
      {
        name: '云设备',
        key: 'HARDWARE-CLOUDDEVICE',
      },
    ],
  }, {
    name: '操作系统',
    key: 'OS',
    children: [{
        name: 'AIX',
        key: 'OS-OS_AIX',
      }, {
        name: 'HP-UX',
        key: 'OS-OS_HP_UX',
      }, {
        name: 'K-UX',
        key: 'OS-OS_K_UX',
      }, {
        name: 'Linux',
        key: 'OS-OS_LINUX',
      }, {
        name: 'WINDOWS',
        key: 'OS-OS_WINDOWS',
      },
      {
        name: '麒麟',
        key: 'OS-OS_KIRIN',
      },
      {
        name: '其它',
        key: 'OS-OTHER',
      },
    ],
  },{
    name: '数据库',
    key: 'DB',
    disabled: true,
    children: [{
        name: 'Oracle',
        //key: 'DB_ORACLE',
        key: 'DB-DB_ORACLE-null',
//        disabled: true,
      },
      // {
      //   name: 'Oracle物理节点',
      //   key: 'DB-oracle-node',
      //  disabled: true,
      // },
      {
        name: 'Mysql',
        //key: 'DB_MYSQL',
        key: 'DB-DB_MYSQL-null',
//        disabled: true,
      },
      {
        name: 'Redis',
        key: 'DB-Redis',
        disabled: true,
      },
      {
        name: 'IBM DB2',
        //key: 'DB_DB2',
        key: 'DB-DB_DB2-null',
//        disabled: true,
      },
      {
        name: '微软MS SQL',
        //key: 'DB_MSSQL',
        key: 'DB-DB_MSSQL-null',
//        disabled: true,
      },
      {
        name: '其它',
        key: 'DB-other',
        disabled: true,
      },
    ],
  }, {
    name: '中间件',
    key: 'MW',
    children: [{
        name: 'Weblogic',
        key: 'MW-MW_WEBLOGIC',
      },
/*       {
        name: 'Weblogic域',
        key: 'MW-Weblogic',
      },
      {
        name: 'Weblogic服务',
        key: 'MW-Weblogic-server',
      }, */
      {
        name: 'Tuexdo',
        key: 'MW-MW-Tuexdo',
        disabled: true,
      },
      {
        name: 'Tomcat',
        key: 'MW-MW_TOMCAT',
      },
      {
        name: 'Ngnix',
        key: 'MW-MW-Ngnix',
        disabled: true,
      },
      {
        name: 'MQ',
        key: 'MW-MQ',
        disabled: true,
      },
      {
        name: 'Websphere',
        key: 'MW-MW_WEBSPHERE',
      },
      {
        name: 'Kafka',
        key: 'MW-MW_KAFKA',
      },
      {
        name: '其它',
        key: 'MW-other',
        disabled: true,
      },
    ],
  }, {
    name: '应用',
    key: 'APP',
    disabled: true,
    children: [{
      name: 'URL',
      key: 'APP-APP_URL_DNS',
      disabled: false,
    },{
        name: '页面',
        key: 'APPLICATION-PAGESET',
        disabled: true,
      },
      {
        name: '进程',
        key: 'APP-process',
        disabled: true,
      },
      {
        name: '端口',
        key: 'APP-port',
        disabled: true,
      },
      {
        name: 'core文件',
        key: 'APP-core',
        disabled: true,
      },
      {
        name: 'F5Pool',
        key: 'APP-F5Pool',
        disabled: true,
      },
      {
        name: '其它',
        key: 'APP-other',
        disabled: true,
      },
    ],
  }],
}]
