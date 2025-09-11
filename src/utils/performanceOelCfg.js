const peformanceCfg = {
	title: '待接管告警',
	type: 'bar',
	oelDatasource: '9e76c06b-03d7-4ca0-86d8-4dcc2c51f748',
	oelFilter: ' ( Manager like \'Zabbix\' ) and (( N_ComponentTypeId = \'NetWork\' and N_ComponentId = \'Switch\' ) or ( N_ComponentTypeId = \'NetWork\' and N_ComponentId = \'ROUTER\' ) or ( N_ComponentTypeId = \'NetWork\' and N_ComponentId = \'FIREWALL\' ) or N_SubComponent = \'%E7%AB%AF%E5%8F%A3\')',
	//oelFilter : ' 1=1 ',
	oelColumns: [
		{
			title: 'FirstOccurrence', width: 100, dataIndex: 'FirstOccurrence', key: 'FirstOccurrence', className: 'fontStyle',
		},
		{
			title: 'N_CustomerSeverity', width: 80, dataIndex: 'N_CustomerSeverity', key: 'N_CustomerSeverity', className: 'fontStyle',
		},
		{
			title: 'Summary', width: 300, dataIndex: 'Summary', key: 'Summary', className: 'fontStyle',
		},
		//{title:'Manager',width:50,dataIndex:'manager',key:'Manager',className: 'fontStyle'},
		//{title:'N_SubComponent',width:50,dataIndex:'n_SubComponent',key:'N_SubComponent',className: 'fontStyle'},
		//{title:'OZ_MoID',width:50,dataIndex:'oz_MoID',key:'OZ_MoID',className: 'fontStyle'},
	],
	switchRule: [
		{ key: 'N_ComponentTypeId', value: 'NetWork' },
		{ key: 'N_ComponentId', value: 'Switch' },
	],
	routerRule: [
		{ key: 'N_ComponentTypeId', value: 'NetWork' },
		{ key: 'N_ComponentId', value: 'ROUTER' },
	],
	firewallRule: [
		{ key: 'N_ComponentTypeId', value: 'NetWork' },
		{ key: 'N_ComponentId', value: 'FIREWALL' },
	],
	portRule: [
		{ key: 'N_ComponentId', value: 'PORT' },
	],
	lossRateTop20: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			top_info: {
				top_hits: {
					sort: [{ value: { order: 'desc' } }],
					_source: { include: ['bizarea', 'mo', 'value', 'hostip', 'hostname', 'clock', 'branchname'] },
					size: 70,
				},
			},
		},
	},
	responseTimeTop20: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			top_info: {
				top_hits: {
					sort: [{ value: { order: 'desc' } }],
					_source: { include: ['bizarea', 'mo', 'value', 'hostip', 'hostname', 'clock', 'branchname'] },
					size: 70,
				},
			},
		},
	},
	cpuUsageTop20: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			top_info: {
				top_hits: {
					sort: [{ value: { order: 'desc' } }],
					_source: { include: ['bizarea', 'mo', 'value', 'hostip', 'hostname', 'clock', 'branchname'] },
					size: 70,
				},
			},
		},
	},
	menUsageTop20: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			top_info: {
				top_hits: {
					sort: [{ value: { order: 'desc' } }],
					_source: { include: ['bizarea', 'mo', 'value', 'hostip', 'hostname', 'clock', 'branchname'] },
					size: 100,
				},
			},
		},
	},
	//设备页-响应时间仪表盘-查询配置
	responseTimeLossByIP: {
		query: {
			bool: {
				must: [
				]
			},
		},
		size: 0,
		aggs: {
			kpiname_info: {
				terms: {
					field: 'kpiname',
					size: 2,
				},
				aggs: {
					top_info: {
						top_hits: {
							sort: [{ clock: { order: 'desc' } }],
							_source: { include: ['bizarea', 'kpiname', 'value', 'keyword', 'hostname', 'clock'] },
							size: 1,
						},
					},
				},
			},
		},
	},

	// Node Details -- 查询配置
	nodeDetailsByUuid: {
		query: {
			bool: {
				must: [
					{
						term: {
							hostip: '',
						},
					},
				],
				must_not: [],
			},
		},
	},
	//end

	//设备页-丢包率仪表盘-查询配置
	lossRateByUuid: {
		query: {
			bool: {
				must: [
					{
						term: {
							kpiname: 'PING丢包率',
						},
					},
					{
						range: {
							clock: {
								gt: 0,
							},
						},
					},
					{
						term: {
							mo: '',
						},
					},
					{
						term: {
							branchname: '',
						},
					},
				],
			},
		},
		size: 0,
		aggs: {
			kpi_name: {
				terms: {
					field: 'mo',
					order: {
						avg_value: 'desc',
					},
					size: 1,
				},
				aggs: {
					avg_value: {
						avg: {
							field: 'value',
						},
					},
				},
			},
		},
	},
	//设备页-CPU使用率线性图-查询配置
	deviceCpuLineChart: {
		query: {
			bool: {
				must: []
			},
		},
		size: 0,
		aggs: {
			clock_value: {
				date_histogram: {
					field: '@timestamp',
					interval: 'minute',
					format: 'yyyy-MM-dd hh-mm-ss',
				},
				aggs: {
					group_kpiname: {
						terms: {
							field: "kpiname",
							size: 200
						},
						aggs: {
							max_value: {
								max: {
									field: "value"
								}
							},
							min_value: {
								min: {
									field: "value"
								}
							},
							avg_value: {
								avg: {
									field: "value"
								}
							}

						}
					}
				}
			},
		},
	},

	//设备页-响应时间-查询配置 ---start
	deviceResponseLineChart: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			clock_value: {
				date_histogram: {
					field: '@timestamp',
					interval: 'minute',
					format: 'yyyy-MM-dd hh-mm-ss',
				},
				aggs: {
					max_value: {
						max: {
							field: 'value',
						},
					},
					min_value: {
						min: {
							field: 'value',
						},
					},
					avg_value: {
						avg: {
							field: 'value',
						},
					},
				},
			},
		},
	},
	// 响应时间---end

	//设备页-丢包率-查询配置 ---start
	deviceLossLineChart: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			clock_value: {
				date_histogram: {
					field: '@timestamp',
					interval: 'minute',
					format: 'yyyy-MM-dd hh-mm-ss',
				},
				aggs: {
					max_value: {
						max: {
							field: 'value',
						},
					},
					min_value: {
						min: {
							field: 'value',
						},
					},
					avg_value: {
						avg: {
							field: 'value',
						},
					},
				},
			},
		},
	},
	// 丢包率---end


	//设备页-内存使用率线图-查询配置
	deviceMemLineChart: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			clock_value: {
				date_histogram: {
					field: '@timestamp',
					interval: 'minute',
					format: 'yyyy-MM-dd hh-mm-ss',
				},
				aggs: {
					group_kpiname: {
						terms: {
							field: "kpiname",
							size: 200
						},
						aggs: {
							max_value: {
								max: {
									field: "value"
								}
							},
							min_value: {
								min: {
									field: "value"
								}
							},
							avg_value: {
								avg: {
									field: "value"
								}
							}

						}
					}
				}
			},
		},
	},
	portUsageTop10: {
		query: {
			bool: {
				should: [
					{
						term: {
							kpiname: '端口输出流量带宽利用率',
						},
					},
					{
						term: {
							kpiname: '端口输入流量带宽利用率',
						},
					},
					{
						term: {
							kpiname: '端口输出流量实际值',
						},
					},
					{
						term: {
							kpiname: '端口输入流量实际值',
						},
					},
				],
				must: [
					{
						term: {
							branchname: '',
						},
					},
					{
						range: {
							'@timestamp': {
								gt: 'now-2h',
							},
						},
					},
				],
			},
		},
		size: 0,
		aggs: {
			device_uuid: {
				terms: {
					field: 'mo',
					size: 10,
				},
				aggs: {
					monamevalue: {
						terms: {
							field: 'hostname',
						},
						aggs: {
							avg_value: {
								avg: {
									field: 'value',
								},
							},
						},
					},
					keywordvalue: {
						terms: {
							field: 'keyword',
						},
						aggs: {
							avg_value: {
								avg: {
									field: 'value',
								},
							},
						},
					},
					kpi_name: {
						terms: {
							field: 'kpiname',
							order: {
								avg_kpi: 'desc',
							},
						},
						aggs: {
							avg_kpi: {
								avg: {
									field: 'value',
								},
							},
						},
					},
				},
			},
		},
	},
	portTrafficTop10: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			top_info: {
				top_hits: {
					sort: [{ value: { order: 'desc' } }],
					_source: { include: ['hostname', 'bizarea', 'value', 'keyword', 'clock', 'mo', 'hostip', 'branchname'] },
					size: 70,
				},
			},
		},
	},
	portTrafficTopIn10: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			top_info: {
				top_hits: {
					sort: [{ value: { order: 'desc' } }],
					_source: { include: ['hostname', 'bizarea', 'value', 'keyword', 'clock', 'mo', 'hostip', 'branchname'] },
					size: 70,
				},
			},
		},
	},
	// 通过设备ID查询对应的端口输入输出利用率
	portUsageByID: {
		query: {
			bool: {
				should: [
					{
						term: {
							kpiname: '端口输出流量带宽利用率',
						},
					},
					{
						term: {
							kpiname: '端口输入流量带宽利用率',
						},
					},
				],
				must: [
					{
						term: {
							mo: '',
						},
					},
					{
						range: {
							clock: {
								gt: 0,
							},
						},
					},
				],
			},
		},
		size: 0,
		aggs: {
			device_uuid: {
				terms: {
					field: 'mo',
				},
				aggs: {
					monamevalue: {
						terms: {
							field: 'moname',
						},
						aggs: {
							avg_value: {
								avg: {
									field: 'value',
								},
							},
						},
					},
					keywordvalue: {
						terms: {
							field: 'keyword',
						},
						aggs: {
							avg_value: {
								avg: {
									field: 'value',
								},
							},
						},
					},
					kpi_name: {
						terms: {
							field: 'kpiname',
							order: {
								avg_kpi: 'desc',
							},
						},
						aggs: {
							avg_kpi: {
								avg: {
									field: 'value',
								},
							},
						},
					},
				},
			},
		},
	},

	// 通过设备ID查询对应的端口输入输出流量
	portTrafficByID: {
		query: {
			bool: {
				should: [
					{
						term: {
							kpiname: '端口输入流量实际值',
						},
					},
					{
						term: {
							kpiname: '端口输出流量实际值',
						},
					},
				],
				must: [
					{
						term: {
							mo: '',
						},
					},
					{
						range: {
							clock: {
								gt: 0,
							},
						},
					},
				],
			},
		},
		size: 0,
		aggs: {
			device_uuid: {
				terms: {
					field: 'mo',
				},
				aggs: {
					monamevalue: {
						terms: {
							field: 'moname',
						},
						aggs: {
							avg_value: {
								avg: {
									field: 'value',
								},
							},
						},
					},
					keywordvalue: {
						terms: {
							field: 'keyword',
						},
						aggs: {
							avg_value: {
								avg: {
									field: 'value',
								},
							},
						},
					},
					kpi_name: {
						terms: {
							field: 'kpiname',
							order: {
								sum_kpi: 'desc',
							},
						},
						aggs: {
							sum_kpi: {
								sum: {
									field: 'value',
								},
							},
						},
					},
				},
			},
		},
	},
	// end
	// 通过设备ID查询对应的端口输入输出利用率
	IntfInfoByID: {
		query: {
			bool: {
				should: [
					{
						term: {
							kpiname: '端口输出流量带宽利用率',
						},
					},
					{
						term: {
							kpiname: '端口输入流量带宽利用率',
						},
					},
					{
						term: {
							kpiname: '端口输出流量实际值',
						},
					},
					{
						term: {
							kpiname: '端口输入流量实际值',
						},
					},
				],
				must: [
					{
						term: {
							mo: '',
						},
					},
					{
						term: {
							branchname: '',
						},
					},
					{
						range: {
							'@timestamp': {
								gt: 'now-2h',
							},
						},
					},
				],
			},
		},
		size: 0,
		aggs: {
			device_uuid: {
				terms: {
					field: 'mo',
				},
				aggs: {
					monamevalue: {
						terms: {
							field: 'moname',
							size: 1,
						},
						aggs: {
							avg_value: {
								avg: {
									field: 'value',
								},
							},
						},
					},
					keywordvalue: {
						terms: {
							field: 'keyword',
						},
						aggs: {
							avg_value: {
								avg: {
									field: 'value',
								},
							},
						},
					},
					kpi_name: {
						terms: {
							field: 'kpiname',
							order: {
								avg_kpi: 'desc',
							},
						},
						aggs: {
							avg_kpi: {
								avg: {
									field: 'value',
								},
							},
						},
					},
				},
			},
		},
	},
	//end
	portUtilization: {
		query: {
			bool: {
				must: []
			},
		},
		size: 0,
		aggs: {
			clock_value: {
				date_histogram: {
					field: '@timestamp',
					interval: 'minute',
					format: 'yyyy-MM-dd hh-mm-ss',
				},
				aggs: {
					kpiname_info: {
						terms: {
							field: 'kpiname',
						},
						aggs: {
							avg_value: {
								avg: {
									field: 'value',
								},
							},
						},
					},
				},
			},
		},
	},
	flow: {
		query: {
			bool: {
				must: []
			},
		},
		size: 0,
		aggs: {
			clock_value: {
				date_histogram: {
					field: '@timestamp',
					interval: 'minute',
					format: 'yyyy-MM-dd hh-mm-ss',
				},
				aggs: {
					kpiname_info: {
						terms: {
							field: 'kpiname',
						},
						aggs: {
							max_value: {
								max: {
									field: 'value',
								},
							},
							min_value: {
								min: {
									field: 'value',
								},
							},
							avg_value: {
								avg: {
									field: 'value',
								},
							},
						},
					},
				},
			},
		},
	},
	//接口实际值
	interfaceInfo: {
		query: {
			bool: {
				must: [
					{
						term: {
							kpiname: '',
						},
					},
					{
						range: {
							clock: {
								gt: 0,
							},
						},
					},
					{
						term: {
							mo: '',
						},
					},
					{
						term: {
							branchname: '',
						},
					},
				],
			},
		},
		size: 1,
		sort: {
			clock: { order: 'desc' },
		},
	},
	recUsageByUuid: {//仪表盘输入利用率
		query: {
			bool: {
				must: []
			},
		},
		size: 0,
		aggs: {
			kpiname_info: {
				terms: {
					field: 'kpiname',
					size: 2,
				},
				aggs: {
					top_info: {
						top_hits: {
							sort: [{ clock: { order: 'desc' } }],
							_source: { include: ['bizarea', 'kpiname', 'value', 'keyword', 'hostname', 'clock'] },
							size: 1,
						},
					},
				},
			},
		},
	},

	tranUsageByUuid: {//仪表盘输出利用率
		query: {
			bool: {
				must: [
					{
						term: {
							kpiname: '端口输出流量带宽利用率',
						},
					},
					{
						range: {
							clock: {
								gt: 0,
							},
						},
					},
					{
						term: {
							mo: '',
						},
					},
					{
						term: {
							branchname: '',
						},
					},
				],
			},
		},
		size: 0,
		aggs: {
			kpi_name: {
				terms: {
					field: 'mo',
					order: {
						avg_value: 'desc',
					},
					size: 1,
				},
				aggs: {
					avg_value: {
						avg: {
							field: 'value',
						},
					},
				},
			},
		},
	},
	InDicards: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			top_info: {
				top_hits: {
					sort: [{ value: { order: 'desc' } }],
					_source: { include: ['mo', 'moname', 'clock', 'value', 'hostip', 'keyword', 'branchname'] },
					size: 80,
				},
			},
		},
	},
	OutDicards: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			top_info: {
				top_hits: {
					sort: [{ value: { order: 'desc' } }],
					_source: { include: ['mo', 'moname', 'clock', 'value', 'hostip', 'keyword', 'branchname'] },
					size: 80,
				},
			},
		},
	},
	InError: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			top_info: {
				top_hits: {
					sort: [{ value: { order: 'desc' } }],
					_source: { include: ['mo', 'moname', 'clock', 'value', 'hostip', 'keyword', 'branchname'] },
					size: 100,
				},
			},
		},
	},
	OutError: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			top_info: {
				top_hits: {
					sort: [{ value: { order: 'desc' } }],
					_source: { include: ['mo', 'moname', 'clock', 'value', 'hostip', 'keyword', 'branchname'] },
					size: 100,
				},
			},
		},
	},
	//
	Error_Dicards_info: {
		query: {
			bool: {
				must: [],
			},
		},
		aggs: {
			group_moname: {
				terms: {
					field: 'moname',
					order: {
						aggs_max: 'desc'
					},
					size: 10000
				},
				aggs: {
					aggs_max: {
						max: {
							field: 'value'
						}
					},
					bucket_field: {
						bucket_sort: {
							from: 0,
							size: 10
						}
					},
					top_info: {
						top_hits: {
							sort: [{
								value: {
									order: "desc"
								}
							}],
							_source: { include: ['mo', 'moname', 'clock', 'value', 'hostip', 'keyword', 'branchname'] },
							size: 1,
						}
					}
				}
			},
			count: {
				cardinality: {
					field: "moname"
				}
			}
		},
		size: 0
	},
	//
	lossValue: {
		query: {
			bool: {
				must: []
			},
		},
		size: 0,
		aggs: {
			clock_value: {
				date_histogram: {
					field: '@timestamp',
					interval: 'minute',
					format: 'yyyy-MM-dd hh-mm-ss',
				},
				aggs: {
					kpiname_info: {
						terms: {
							field: 'kpiname',
						},
						aggs: {
							avg_value: {
								avg: {
									field: 'value',
								},
							},
						},
					},
				},
			},
		},
	},
	wrongValue: {
		query: {
			bool: {
				must: []
			},
		},
		size: 0,
		aggs: {
			clock_value: {
				date_histogram: {
					field: '@timestamp',
					interval: 'minute',
					format: 'yyyy-MM-dd hh-mm-ss',
				},
				aggs: {
					kpiname_info: {
						terms: {
							field: 'kpiname',
						},
						aggs: {
							avg_value: {
								avg: {
									field: 'value',
								},
							},
						},
					},
				},
			},
		},
	},
	portInfo: {
		query: {
			bool: {
				must: [
					{ term: { hostip: '' } },
					{ term: { keyword: '' } },
					{ range: { clock: { gt: 0 } } },
				],
				should: [
					{ term: { kpiname: '端口描述' } },
					{ term: { kpiname: '端口实际状态' } },
				],
			},
		},
		aggs: {
			kpiname_info: {
				terms: {
					field: 'kpiname',
					size: 2,
				},
				aggs: {
					top_info: {
						top_hits: {
							sort: [{ clock: { order: 'desc' } }],
							_source: { include: ['value'] },
							size: 1,
						},
					},
				},
			},
		},
		size: 0,
	},
	portsList: {
		query: {
			bool: {
				must: [
					{ match: { hostip: '' } },
					{ match: { subcompontid: 'Port' } },
				],
			},
		},
		aggs: {
			kpi_interface: {
				terms: {
					field: 'mo',
					size: 200,
				},
			},
			hostname: {
				terms: {
					field: 'keyword',
					size: 200,
				},
			},
		},
		size: 0,
	},
	portsTable: {
		query: {
			bool: {
				must: [
					{ match: { mo: '' } },
					{ range: { clock: { gt: 0 } } },
				],
				should: [
					{ match: { kpiname: '总行端口输入流量带宽利用率' } },
					{ match: { kpiname: '总行端口输出流量带宽利用率' } },
					{ match: { kpiname: '总行端口输入流量实际值' } },
					{ match: { kpiname: '总行端口输出流量实际值' } },
					{ match: { kpiname: '端口输入丢包数' } },
					{ match: { kpiname: '端口输出丢包数' } },
					{ match: { kpiname: '端口输入错包数' } },
					{ match: { kpiname: '端口输出错包数' } },
				],
			},
		},
		size: 0,
		aggs: {
			apiname_info: {
				terms: {
					field: 'kpiname',
				},
				aggs: {
					avg_value: {
						avg: { field: 'value' },

					},
				},
			},
		},
	},
	portState: {
		query: {
			bool: {
				must: [
					{ match: { kpiname: '端口实际状态' } },
					{ match: { mo: '' } },
				],
			},
		},
		size: 1,
		sort: {
			clock: { order: 'desc' },
		},
	},
	findByMoId: {
		query: {
			bool: {
				must: [
					{ match: { mo: '' } },
				],
			},
		},
		size: 1,
	},
	findAllInterfaceList: {
		query: {
			bool: {
				must: [
					{ range: { clock: { gt: 0 } } },
					{ term: { hostip: '' } },
					{ term: { subcompontid: 'Port' } },
				]
			},
		},
		size: 0,
		aggs: {
			apiname_info: {
				terms: {
					field: 'mo',
					size: 200,
				},
				aggs: {
					keyword_info: {
						terms: {
							field: 'kpiname',
							size: 200,
						},
						aggs: {
							top_info: {
								top_hits: {
									sort: [{ clock: { order: 'desc' } }],
									_source: { include: ['value', 'keyword', 'hostip'] },
									size: 1,
								},
							},
						},
					},
				},
			},
		},
	},
	topUsage10: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			top_info: {
				top_hits: {
					sort: [{ value: { order: 'desc' } }],
					_source: { include: ['hostname', 'bizarea', 'value', 'keyword', 'clock', 'mo', 'hostip', 'branchname'] },
					size: 70,
				},
			},

		},
	},
	topUsageIn10: {
		query: {
			bool: {
				must: [],
			},
		},
		size: 0,
		aggs: {
			top_info: {
				top_hits: {
					sort: [{ value: { order: 'desc' } }],
					_source: { include: ['hostname', 'bizarea', 'value', 'keyword', 'clock', 'mo', 'hostip', 'branchname'] },
					size: 70,
				},
			},
		},
	},
	queryLine: {
		query: {
			bool: {
				must: [

				],
			},
		},
		size: 0,
		aggs: {
			line_info: {
				terms: {
					field: 'mo',
					size: 600,
				},
				aggs: {
					kpiname_info: {
						terms: {
							field: 'kpiname',
							size: 3,
						},
						aggs: {
							top_info: {
								top_hits: {
									sort: [{ clock: { order: 'desc' } }],
									_source: { include: ['hostname', 'hostip', 'moname', 'keyword', 'hostname', 'value'] },
									size: 1,
								},
							},
						},
					},
				},
			},
		},
	},
	queryLog: {
		size: 0,
		aggs: {
			top_info: {
				top_hits: {
					sort: [{ time: { order: 'desc' } }],
					size: 20,
				},
			},
		},
	},
	inForwardQuery: {
		"query": {
			"bool": {
				"must": [

				]
			}
		},
		"size": 0,
		"aggs": {
			"topInfo": {
				"top_hits": {
					"sort": [{ "value": { "order": "desc" } }],
					"_source": ["mo", "moname", "clock", "value", "hostip", "keyword", "branchname"],
					"size": 70
				}
			}
		}
	},
	outForwardQuery: {
		"query": {
			"bool": {
				"must": [

				]
			}
		},
		"size": 0,
		"aggs": {
			"topInfo": {
				"top_hits": {
					"sort": [{ "value": { "order": "desc" } }],
					"_source": ["mo", "moname", "clock", "value", "hostip", "keyword", "branchname"],
					"size": 70
				}
			}
		}
	},
	inForwardRateQuery: {
		"query": {
			"bool": {
				"must": [

				]
			}
		},
		"size": 0,
		"aggs": {
			"topInfo": {
				"top_hits": {
					"sort": [{ "value": { "order": "desc" } }],
					"_source": ["mo", "moname", "clock", "value", "hostip", "keyword", "branchname"],
					"size": 70
				}
			}
		}
	},
	outForwardRateQuery: {
		"query": {
			"bool": {
				"must": [

				]
			}
		},
		"size": 0,
		"aggs": {
			"topInfo": {
				"top_hits": {
					"sort": [{ "value": { "order": "desc" } }],
					"_source": ["mo", "moname", "clock", "value", "hostip", "keyword", "branchname"],
					"size": 70
				}
			}
		}
	},
	queryLines: {
		"size": 0,
		"query": {
			"bool": {
				"must": [
					{
						"term": { "vlan_id": "" }
					},
					{
						"range": {
							"time": { "gt": 0 }
						}
					}
				]
			}
		},
		"aggs": {
			"top_info": {
				"top_hits": {
					"sort": [{ "time": { "order": "acs" } }],
					"_source": { "include": ["tx_bitps", "rx_bitps", "time"] },
					"size": 60
				}
			}
		}
	},
	queryJXQDX: {
		"size": 0,
		"query": {
			"bool": {
				"must": [
					{
						"term": { "vlan_id": "" }
					},
					{
						"range": {
							"time": { "gt": 0 }
						}
					}
				]
			}
		},
		"aggs": {
			"top_info": {
				"top_hits": {
					"sort": [{ "time": { "order": "acs" } }],
					"_source": { "include": ["tx_bitps", "rx_bitps", "time"] },
					"size": 60
				}
			}
		}
	},
	queryTOP: {
		"size": 0,
		"query": {
			"bool": {
				"must": [
					{ "term": { "vlan_id": "" } },
					{ "range": { "time": { "gt": 0 } } }
				]
			}
		},
		"aggs": {
			"top_info": {
				"top_hits": {
					"sort": [{ "tcp_syn_packet": { "order": "desc" } }],
					"_source": { "include": ["ip_endpoint1", "ip_endpoint2", "time", "tcp_syn_packet"] },
					"size": 10
				}
			}
		}
	},
	queryJXQDXTop: {
		"size": 0,
		"query": {
			"bool": {
				"must": [
					{ "term": { "vlan_id": "" } },
					{ "range": { "time": { "gt": 0 } } }
				]
			}
		},
		"aggs": {
			"top_info": {
				"top_hits": {
					"sort": [{ "tcp_syn_packet": { "order": "desc" } }],
					"_source": { "include": ["ip_endpoint1", "ip_endpoint2", "time", "tcp_syn_packet"] },
					"size": 10
				}
			}
		}
	},
	querySDYD: {
		"size": 0,
		"query": {
			"bool": {
				"must": [
					{
						"term": { "vlan_id": "" }
					},
					{
						"range": {
							"time": { "gt": 0 }
						}
					}
				]
			}
		},
		"aggs": {
			"top_info": {
				"top_hits": {
					"sort": [{ "time": { "order": "acs" } }],
					"_source": { "include": ["tx_bitps", "rx_bitps", "time"] },
					"size": 60
				}
			}
		}
	},
	querySDYDTop: {
		"size": 0,
		"query": {
			"bool": {
				"must": [
					{ "term": { "vlan_id": "" } },
					{ "range": { "time": { "gt": 0 } } }
				]
			}
		},
		"aggs": {
			"top_info": {
				"top_hits": {
					"sort": [{ "tcp_syn_packet": { "order": "desc" } }],
					"_source": { "include": ["ip_endpoint1", "ip_endpoint2", "time", "tcp_syn_packet"] },
					"size": 10
				}
			}
		}
	},
	queryJXQYD: {
		"size": 0,
		"query": {
			"bool": {
				"must": [
					{
						"term": { "vlan_id": "" }
					},
					{
						"range": {
							"time": { "gt": 0 }
						}
					}
				]
			}
		},
		"aggs": {
			"top_info": {
				"top_hits": {
					"sort": [{ "time": { "order": "acs" } }],
					"_source": { "include": ["tx_bitps", "rx_bitps", "time"] },
					"size": 60
				}
			}
		}
	},
	queryJXQYDTop: {
		"size": 0,
		"query": {
			"bool": {
				"must": [
					{ "term": { "vlan_id": "" } },
					{ "range": { "time": { "gt": 0 } } }
				]
			}
		},
		"aggs": {
			"top_info": {
				"top_hits": {
					"sort": [{ "tcp_syn_packet": { "order": "desc" } }],
					"_source": { "include": ["ip_endpoint1", "ip_endpoint2", "time", "tcp_syn_packet"] },
					"size": 10
				}
			}
		}
	},
	querySDLT: {
		"size": 0,
		"query": {
			"bool": {
				"must": [
					{
						"term": { "vlan_id": "" }
					},
					{
						"range": {
							"time": { "gt": 0 }
						}
					}
				]
			}
		},
		"aggs": {
			"top_info": {
				"top_hits": {
					"sort": [{ "time": { "order": "acs" } }],
					"_source": { "include": ["tx_bitps", "rx_bitps", "time"] },
					"size": 60
				}
			}
		}
	},
	querySDLTTop: {
		"size": 0,
		"query": {
			"bool": {
				"must": [
					{ "term": { "vlan_id": "" } },
					{ "range": { "time": { "gt": 0 } } }
				]
			}
		},
		"aggs": {
			"top_info": {
				"top_hits": {
					"sort": [{ "tcp_syn_packet": { "order": "desc" } }],
					"_source": { "include": ["ip_endpoint1", "ip_endpoint2", "time", "tcp_syn_packet"] },
					"size": 10
				}
			}
		}
	},
	queryJXQLT: {
		"size": 0,
		"query": {
			"bool": {
				"must": [
					{
						"term": { "vlan_id": "" }
					},
					{
						"range": {
							"time": { "gt": 0 }
						}
					}
				]
			}
		},
		"aggs": {
			"top_info": {
				"top_hits": {
					"sort": [{ "time": { "order": "acs" } }],
					"_source": { "include": ["tx_bitps", "rx_bitps", "time"] },
					"size": 60
				}
			}
		}
	},
	queryJXQLTTop: {
		"size": 0,
		"query": {
			"bool": {
				"must": [
					{ "term": { "vlan_id": "" } },
					{ "range": { "time": { "gt": 0 } } }
				]
			}
		},
		"aggs": {
			"top_info": {
				"top_hits": {
					"sort": [{ "tcp_syn_packet": { "order": "desc" } }],
					"_source": { "include": ["ip_endpoint1", "ip_endpoint2", "time", "tcp_syn_packet"] },
					"size": 10
				}
			}
		}
	},
	timeOP: {
		"size": 1,
		"query": {
			"bool": {
				"must": [
					{ "term": { "hostip": "" } },
					{ "term": { "keyword": "" } },
					{ "term": { "branchname": "" } },
					{ "range": { "clock": { "gt": 0 } } },
					{ "term": { "kpiname": "" } }
				]
			}
		},
		"aggs": {
			"top_info": {
				"top_hits": {
					"sort": [{ "clock": { "order": "desc" } }],
					"_source": { "include": ["clock"] },
					"size": 2
				}
			}
		}
	},
	firewallTable: {
		"size": 0,
		"query": {
			"bool": {
				"must": [

				]
			}
		},
		"aggs": {
			"group_appname": {
				"terms": {
					"field": "appname",
					"size": 60
				},
				"aggs": {
					"group_mo": {
						"terms": {
							"field": "mo",
							"size": 3200
						},
						"aggs": {
							"group_kpiname": {
								"terms": {
									"field": "kpiname",
									"size": 20
								},
								"aggs": {
									"top_info": {
										"top_hits": {
											"sort": [{ "clock": { "order": "desc" } }],
											"_source": { "include": ["branchname", "hostip", "appname", "moname", "value", "keyword", "hostname"] },
											"size": 1
										}
									}
								}
							}
						}
					}
				}
			}
		}
	},
	findFireWall: {
		"size": 1,
		"query": {
			"bool": {
				"must": [

				]
			}
		}
	},
	netFireWallCPU: {
		"query": {
			"bool": {
				"must": [
				]
			}
		},
		"size": 0,
		"aggs": {
			"clock_value": {
				"date_histogram": {
					"field": "@timestamp",
					"interval": "5m",
					"min_doc_count": 1,
					"format": "yyyy-MM-dd hh-mm-ss"
				},
				"aggs": {
					"avg_value": {
						"avg": { "field": "value" }
					}
				}
			}
		}
	},
	netFireWallMemory: {
		"query": {
			"bool": {
				"must": [
				]
			}
		},
		"size": 0,
		"aggs": {
			"clock_value": {
				"date_histogram": {
					"field": "@timestamp",
					"interval": "5m",
					"min_doc_count": 1,
					"format": "yyyy-MM-dd hh-mm-ss"
				},
				"aggs": {
					"avg_value": {
						"avg": { "field": "value" }
					}
				}
			}
		}
	},
	netFireWallNewSession: {
		"query": {
			"bool": {
				"must": [
				]
			}
		},
		"size": 0,
		"aggs": {
			"clock_value": {
				"date_histogram": {
					"field": "@timestamp",
					"interval": "5m",
					"min_doc_count": 1,
					"format": "yyyy-MM-dd hh-mm-ss"
				},
				"aggs": {
					"avg_value": {
						"avg": { "field": "value" }
					}
				}
			}
		}
	},
	netFireWallConcurrentSession: {
		"query": {
			"bool": {
				"must": [
				]
			}
		},
		"size": 0,
		"aggs": {
			"clock_value": {
				"date_histogram": {
					"field": "@timestamp",
					"interval": "5m",
					"min_doc_count": 1,
					"format": "yyyy-MM-dd hh-mm-ss"
				},
				"aggs": {
					"avg_value": {
						"avg": { "field": "value" }
					}
				}
			}
		}
	},
	netFireWallResponseTime: {
		"query": {
			"bool": {
				"must": [
				]
			}
		},
		"size": 0,
		"aggs": {
			"clock_value": {
				"date_histogram": {
					"field": "@timestamp",
					"interval": "5m",
					"min_doc_count": 1,
					"format": "yyyy-MM-dd hh-mm-ss"
				},
				"aggs": {
					"avg_value": {
						"avg": { "field": "value" }
					}
				}
			}
		}
	},
	netFireWallPacketLoss: {
		"query": {
			"bool": {
				"must": [
				]
			}
		},
		"size": 0,
		"aggs": {
			"clock_value": {
				"date_histogram": {
					"field": "@timestamp",
					"interval": "5m",
					"min_doc_count": 1,
					"format": "yyyy-MM-dd hh-mm-ss"
				},
				"aggs": {
					"avg_value": {
						"avg": { "field": "value" }
					}
				}
			}
		}
	},
	netLinePageMo: {
		"size": 1,
		"query": {
			"bool": {
				"must": []
			}
		}
	},
	netLinePageRpingLoss: {
		"query": {
			"bool": {
				"must": []
			}
		},
		"size": 0,
		"aggs": {
			"clock_value": {
				"date_histogram": {
					"field": "@timestamp",
					"interval": "1m",
					"min_doc_count": 1,
					"format": "yyyy-MM-dd hh-mm-ss"
				},
				"aggs": {
					"avg_value": {
						"avg": { "field": "value" }
					}
				}
			}
		}
	},
	f5Table: {
		"size": 0,
		"query": {
			"bool": {
				"must": [

				]
			}
		},
		"aggs": {
			"group_appname": {
				"terms": {
					"field": "appname",
					"size": 60
				},
				"aggs": {
					"group_mo": {
						"terms": {
							"field": "mo",
							"size": 3200
						},
						"aggs": {
							"group_kpiname": {
								"terms": {
									"field": "kpiname",
									"size": 20
								},
								"aggs": {
									"top_info": {
										"top_hits": {
											"sort": [{ "clock": { "order": "desc" } }],
											"_source": { "include": ["branchname", "hostip", "appname", "moname", "value", "keyword", "hostname"] },
											"size": 1
										}
									}
								}
							}
						}
					}
				}
			}
		}
	},
	netLinePageRpingTime: {
		"query": {
			"bool": {
				"must": []
			}
		},
		"size": 0,
		"aggs": {
			"clock_value": {
				"date_histogram": {
					"field": "@timestamp",
					"interval": "1m",
					"min_doc_count": 1,
					"format": "yyyy-MM-dd hh-mm-ss"
				},
				"aggs": {
					"avg_value": {
						"avg": { "field": "value" }
					}
				}
			}
		}
	},
	queryInputInterface: {
		"query": {
			"bool": {
				"must": [
					{ "term": { "kpi_key": "kpi.10.1.35.128_GigabitEthernet1-1.zh_net_input_realvalue" } },
					{ "range": { "timestamp": { "gt": 1599494400000, "lt": 1599580799000 } } }
				]
			}
		},
		"sort": [{ "timestamp": { "order": "asc" } }],
		"size": 1440
	},
	queryAggsIn: {
		"query": {
			"bool": {
				"must": []
			}
		},
		"size": 0,
		"aggs": {
			"clock_value": {
				"date_histogram": {
					"field": "timestamp",
					"interval": "1m",
					"min_doc_count": 1,
					"format": "yyyy-MM-dd hh-mm-ss"
				},
				"aggs": {
					"avg_value": {
						"avg": { "field": "value" }
					},
					"avg_upper": {
						"avg": { "field": "upper" }
					},
					"avg_lower": {
						"avg": { "field": "lower" }
					},
				}
			}
		}
	},
	queryOutInterface: {
		"query": {
			"bool": {
				"must": [
					{ "term": { "kpi_key": "kpi.10.1.35.128_GigabitEthernet1-1.zh_net_output_realvalue" } },
					{ "range": { "timestamp": { "gt": 1599494400000, "lt": 1599580799000 } } }
				]
			}
		},
		"sort": [{ "timestamp": { "order": "asc" } }],
		"size": 1440
	},
	queryAggsOut: {
		"query": {
			"bool": {
				"must": []
			}
		},
		"size": 0,
		"aggs": {
			"clock_value": {
				"date_histogram": {
					"field": "timestamp",
					"interval": "1m",
					"min_doc_count": 1,
					"format": "yyyy-MM-dd hh-mm-ss"
				},
				"aggs": {
					"avg_value": {
						"avg": { "field": "value" }
					},
					"avg_upper": {
						"avg": { "field": "upper" }
					},
					"avg_lower": {
						"avg": { "field": "lower" }
					},
				}
			}
		}
	},
	queryAllInterfacer:
	{
		"size": 0,
		"query": {
			"bool": {
				"must": [
					{ "term": { "componetid": "FIREWALL" } },
					{ "term": { "subcomponet": "端口" } },
					{
						"bool": {
							"should": [
								{ "terms": { "kpiname": ["总行端口输出流量实际值", "总行端口输入流量实际值"] } }
							]
						}
					}
				]
			}
		},
		"aggs": {
			"group_kpiname": {
				"terms": {
					"field": "moname",
					"size": 200
				},
				"aggs": {
					"group_kpiname": {
						"terms": {
							"field": "kpiname",
							"size": 2
						},
						"aggs": {
							"top_info": {
								"top_hits": {
									"sort": [{ "clock": { "order": "desc" } }],
									"_source": { "include": ["moname", "value", "moname"] },
									"size": 1
								}
							}
						}
					}
				}
			}
		}
	},
	queryOperateRecord: {
		"query": {
			"bool": {
				"must": []
			}
		},
		"sort": [{
			"@timestamp": {
				"order": "asc"
			}
		}],
		"size": 50
	},
	// 查询数据中心互联区
	queryDCT: {
		"query": {
			"bool": {
				"must": [
					{
						"bool": {
							"should": [
								{
									"term": {
										"kpiname": {
											"value": "总行端口输入流量实际值"
										}
									}
								},
								{
									"term": {
										"kpiname": {
											"value": "总行端口输出流量实际值"
										}
									}
								}
							]
						}
					},{
						"bool":{
							"should":[]
						}
					}
				]
			}
		},
		"size": 0,
		"aggs": {
			"timeGroup": {
				"date_histogram": {
					"field": '@timestamp',
					"interval": 'minute',
					"format": 'yyyy-MM-dd hh-mm-ss',
				},
				"aggs": {
					"kpinameGroup": {
						"terms": {
							"field": "kpiname"
						},
						"aggs": {
							"sumValue": {
								"sum": {
									"field": "value"
								}
							}
						}
					}
				}
			}
		}
	},
	queryDCT_Month: {
		"query": {
			"bool": {
				"must": [
					{
						"bool": {
							"should": [
								{
									"term": {
										"kpiname": {
											"value": "总行端口输入流量实际值"
										}
									}
								},
								{
									"term": {
										"kpiname": {
											"value": "总行端口输出流量实际值"
										}
									}
								}
							]
						}
					},{
						"bool":{
							"should":[]
						}
					}
				]
			}
		},
		"size": 0,
		"aggs": {
			"timeGroup": {
				"date_histogram": {
					"field": "@timestamp",
					"interval": "hour",
					"format": "yyyy-MM-dd hh-mm-ss"
				},
				"aggs": {
					"kpinameGroup": {
						"terms": {
							"field": "kpiname"
						},
						"aggs": {
							"MaxValue": {
								"sum": {
									"field": "value_max"
								}
							},
							"AvgValue": {
								"sum": {
									"field": "value_avg"
								}
							},
							"MinValue": {
								"sum": {
									"field": "value_min"
								}
							}
						}
					}
				}
			}
		}
	},
	singleSSLChar: {
		"query": {
			"bool": {
				"must": [
				]
			}
		},
		"size": 0,
		"aggs": {
			"clock_value": {
				"date_histogram": {
					"field": "@timestamp",
					"interval": "5m",
					"min_doc_count": 1,
					"format": "yyyy-MM-dd hh-mm-ss"
				},
				"aggs": {
					"avg_value": {
						"avg": { "field": "value" }
					}
				}
			}
		}
	},
	querySSLColony: {
		"query": {
			"bool": {
				"must": [
					{
						"bool": {
							"should": [
								{
									"term": {
										"kpiname": {
											"value": "SSL每秒连接"
										}
									}
								},
								{
									"term": {
										"kpiname": {
											"value": "SSL-VS并发"
										}
									}
								}
							]
						}
					},{
						"bool":{
							"should":[]
						}
					}
				]
			}
		},
		"size": 0,
		"aggs": {
			"timeGroup": {
				"date_histogram": {
					"field": '@timestamp',
					"interval": 'minute',
					"format": 'yyyy-MM-dd hh-mm-ss',
				},
				"aggs": {
					"kpinameGroup": {
						"terms": {
							"field": "kpiname"
						},
						"aggs": {
							"avgValue": {
								"sum": {
									"field": "value"
								}
							}
						}
					}
				}
			}
		}
	},
	qps: {
		query: {
			bool: {
				must: [
					{
						range: {
							clock: {
								gte: 0,
								lte: 0
							}
						}
					}
				]
			}
		},
		size: 0,
		aggs: {
			group_by_device: {
				terms: {
					field: "hostname",
					size: 1000
				},
				aggs: {
					latest_info: {
						top_hits: {
							sort: [{ clock: { order: "desc" } }],
							_source: {
								include: [
									"hostname",
									"hostip",
									"bizarea",
									"vendor",
									"component",
									"clock",
									"value"
								]
							},
							size: 1
						}
					},
					time_series: {
						histogram: {
							field: "clock",
							interval: 3600,
							min_doc_count: 0
						},
						aggs: {
							values: {
								top_hits: {
									sort: [{ clock: { order: "asc" } }],
									_source: {
										include: ["clock", "value"]
									},
									size: 100
								}
							}
						}
					}
				}
			}
		}
	}
}

export { peformanceCfg }
