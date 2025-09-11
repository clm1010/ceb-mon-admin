import { request, config } from '../utils'
import { message, notification } from 'antd'
import { delay } from 'redux-saga'

const { zabbix } = config

export function zabbixConnection (params) {
	const zabbixUrl = `http:\/\/${params.zabbixUrl}\/api_jsonrpc.php`

	return request({
		url: zabbixUrl,
		method: 'post',
		data: params,
	})
}

//登录zabbix
export function* login ({ payload }, { call, put }) {
	let data = {}
	let p = zabbix.loginParam
	p.zabbixUrl = payload.host.createdByTool

	//login
	try {
		data = yield call(zabbixConnection, zabbix.loginParam)
	} catch (e) {
		notification.error({
	    message: `设备${payload.host.name}同步失败`,
	    description: '登录连接zabbix失败',
	  })
		payload.host.ext1 = `${payload.host.ext1}登录连接zabbix失败`
		payload.host.syncStatus = 'failed'

		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}

	if (data.error === undefined) {
		payload.token = data.result
		payload.id = data.id
		payload.host.ext1 = `${payload.host.ext1}登录zabbix成功 → `
	} else {
		notification.error({
	    message: `设备${payload.host.name}同步失败`,
	    description: data.error.data,
	  })
		payload.host.ext1 = `${payload.host.ext1}登录zabbix失败:${data.error.data} → `
		payload.host.syncStatus = 'failed'

		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}
	return payload
}

//检查host是否存在
export function* isHostExist ({ payload }, { call, put }) {
	let data = {}

	let checkHostParam = zabbix.checkHostParam
	checkHostParam.id = payload.id + 1
	checkHostParam.params.filter.host[0] = payload.host.discoveryIP
	checkHostParam.auth = payload.token
	checkHostParam.zabbixUrl = payload.host.createdByTool

	try {
		data = yield call(zabbixConnection, checkHostParam)
	} catch (e) {
		notification.error({
	    message: `设备${payload.host.name}同步失败`,
	    description: 'Zabbix连接失败',
	  })
		payload.host.ext1 = `${payload.host.ext1}Zabbix连接失败`
		payload.host.syncStatus = 'failed'

		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}

	if (data.error === undefined) {	//不报错
		payload.id = data.id

		if (data.result.length > 0) {	//host存在
			payload.hostid = data.result[0].hostid
			payload.interfaces = data.result[0].interfaces
			payload.host.ext1 = `${payload.host.ext1}检索host成功 → `
		} else {
			//不返回
			payload.host.ext1 = `${payload.host.ext1}没有检索到host → `
		}
	} else {
		payload.host.ext1 = `${payload.host.ext1}检索host失败:${data.error.data} → `
		payload.host.syncStatus = 'failed'

		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}
	return payload
}

//创建host
export function* createHost ({ payload }, { call, put }) {
	let data = {}

	let createHostParam = zabbix.createHostParam
	createHostParam.id = payload.id + 1
	createHostParam.params.host = payload.host.discoveryIP
	createHostParam.params.interfaces[0].ip = payload.host.discoveryIP
	createHostParam.auth = payload.token
	createHostParam.zabbixUrl = payload.host.createdByTool

	try {
		data = yield call(zabbixConnection, createHostParam)
	} catch (e) {
		notification.error({
	    message: `设备${payload.host.name}同步失败`,
	    description: 'Zabbix连接失败',
	  })
		payload.host.ext1 = `${payload.host.ext1}Zabbix连接失败`
		payload.host.syncStatus = 'failed'

		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}

	if (data.error === undefined) {	//host创建成功
		payload.id = data.id
		payload.host.ext1 = `${payload.host.ext1}创建host成功${data.id} → `
	} else {
		notification.error({
	    message: `设备${payload.host.name}同步失败`,
	    description: `创建host失败:${data.error.data};`,
	  })
		payload.host.ext1 = `${payload.host.ext1}创建host失败:${data.error.data} → `
		payload.host.syncStatus = 'failed'

		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}
	return payload
}

//创建items
export function* createItems ({ payload }, { call, put }) {
	let data = {}

	let createItemsParam = zabbix.createItemsParam
	createItemsParam.id = payload.id + 1
	createItemsParam.auth = payload.token
	createItemsParam.zabbixUrl = payload.host.createdByTool

	for (let param of createItemsParam.params) {
		param.hostid = payload.hostid
		param.interfaceid = payload.interfaces[0].interfaceid
		param.snmp_community = payload.host.snmpCommunity
	}

	try {
		data = yield call(zabbixConnection, createItemsParam)
	} catch (e) {
		notification.error({
	    message: `设备${payload.host.name}同步失败`,
	    description: 'Zabbix连接失败createItems',
	  })
		payload.host.ext1 = `${payload.host.ext1}Zabbix连接失败`
		payload.host.syncStatus = 'failed'

		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}

	payload.id = data.id

	if (data.error === undefined) {	//items创建成功
		payload.host.ext1 = `${payload.host.ext1}创建items成功 → `
	} else {
		notification.error({
	    message: `设备${payload.host.name}同步失败`,
	    description: `创建items失败:${data.error.data};`,
	  })
		payload.host.ext1 = `${payload.host.ext1}创建items失败:${data.error.data} → `
		payload.host.syncStatus = 'failed'

		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}
	return payload
}

//检查设备状态
export function* checkMoStatus ({ payload }, { call, put }) {
	let data = {}

	let checkMoStatus = zabbix.checkMoStatus
	checkMoStatus.id = payload.id + 1
	checkMoStatus.auth = payload.token
	checkMoStatus.params.filter.host[0] = payload.host.discoveryIP
	checkMoStatus.zabbixUrl = payload.host.createdByTool

	try {
		data = yield call(zabbixConnection, checkMoStatus)
	} catch (e) {
		notification.error({
	    message: `设备${payload.host.name}同步失败`,
	    description: 'Zabbix连接失败',
	  })
		payload.host.ext1 = `${payload.host.ext1}Zabbix连接失败`
		payload.host.syncStatus = 'failed'

		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}

	payload.id = data.id

	if (data.result[0].error === '' && data.result[0].snmp_error === '') {
		payload.host.ext1 = `${payload.host.ext1}检查设备状态成功 → `
	} else {
		notification.error({
	    message: `设备${payload.host.name}同步失败`,
	    description: `检查设备状态失败:${data.result[0].error},${data.result[0].snmp_error};`,
	  })

		payload.host.ext1 = `${payload.host.ext1}检查设备状态失败:${data.result[0].error},${data.result[0].snmp_error} → `
		payload.host.syncStatus = 'failed'

		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}
	return payload
}

//同步设备
export function* syncMO ({ payload }, { call, put }) {
	let data = {}

	payload.trySyncTimes = payload.trySyncTimes ? payload.trySyncTimes : 0
	let syncMoInfoParam = zabbix.syncMoInfoParam
	syncMoInfoParam.id = payload.id + 1
	syncMoInfoParam.auth = payload.token
	syncMoInfoParam.params.hostids = payload.hostid
	syncMoInfoParam.zabbixUrl = payload.host.createdByTool

	try {
		data = yield call(zabbixConnection, syncMoInfoParam)
	} catch (e) {
		notification.error({
	    message: `设备${payload.host.name}同步失败`,
	    description: 'Zabbix连接失败syncMO',
	  })
		payload.host.ext1 = `${payload.host.ext1}Zabbix连接失败`
		payload.host.syncStatus = 'failed'

		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}
	payload.id = data.id

	if (data.result.length > 0) {				//获取到了结果数据
		let errMessage = []
		let needWait = false

		//循环items判断是获取错误还是需要等待
		for (let item of data.result) {
			if (item.error != '') {
				errMessage.push(item.error)
			} else if (item.lastvalue == '0') {
				needWait = true
			}
		}

		if (errMessage.length > 0) {	//获取失败
			payload.error = `${host.discoveryIP}:从Zabbix上获取失败:${errMessage}`
		} else if (needWait) {
			payload.trySyncTimes += 1
			if (payload.trySyncTimes <= zabbix.maxSyncTimes) {	//如果没有超过最大尝试数
				yield delay(zabbix.intervalTime)
				yield* syncMO({ payload }, { call, put })	//递归调用自己继续同步
			} else {
				payload.error = '7.2.同步到数值为0，同步失败'

				payload.host.ext1 = `${payload.host.ext1}没有同步到任何信息,同步失败 → `
				payload.host.syncStatus = 'failed'

				yield put({
					type: 'objectMO/zabbixAdd',
					payload: { mos: [payload.host] },
				})
			}
		} else {
			//循环item取值
			for (let item of data.result) {
				if (item.name === 'u2temp-interfaces') {
					//把字符串里{#IFADMINSTATUS}这样的串替换成IFADMINSTATUS
					let lastvalue = item.lastvalue.split('{#SNMPINDEX}').join('SNMPINDEX')
					.split('{#IFPHYSADDRESS}').join('IFPHYSADDRESS')
					.split('{#IFSPEED}')
.join('IFSPEED')
					.split('{#IFMTU}')
.join('IFMTU')
					.split('{#IFOPERSTATUS}')
.join('IFOPERSTATUS')
					.split('{#IFADMINSTATUS}')
.join('IFADMINSTATUS')
					.split('{#IFNAME}')
.join('IFNAME')
					.split('{#IFDESCR}')
.join('IFDESCR')
					.split('{#IFTYPE}')
.join('IFTYPE')

					//字符串转json
					let ifts = JSON.parse(lastvalue).data

					//清除掉Intfs接口数据
					payload.host.intfs = []

					//循环同步结果中的接口信息
					for (let _ift of ifts) {
						let ift = {}
						ift.snmpIndex = _ift.SNMPINDEX
						ift.mac = _ift.IFPHYSADDRESS
						ift.bandwidth = _ift.IFSPEED
						ift.mtu = _ift.IFMTU
						ift.protocolStatus = _ift.IFOPERSTATUS
						ift.status = _ift.IFADMINSTATUS
						ift.portName = _ift.IFNAME
						ift.description = _ift.IFDESCR
						ift.intfType = _ift.IFTYPE

						payload.host.intfs.push(ift)
					}
				} else if (item.name === 'u2temp-location') {
					payload.host.location = item.lastvalue
				} else if (item.name === 'u2temp-objectid') {
					payload.host.objectID = item.lastvalue
				} else if (item.name === 'u2temp-systemname') {
					payload.host.hostname = item.lastvalue
				}
			}
			payload.host.syncStatus = 'success'
			payload.host.ext1 = `${payload.host.ext1}同步成功`
			payload.tempStatus = true	//这里做一个标记，当同步成功，删除临时items遇到网络异常时避免更新MO成为失败状态
		}
	} else {														//没获取到结果数据
		payload.trySyncTimes += 1
		if (payload.trySyncTimes <= zabbix.maxSyncTimes) {	//如果超过3次
			yield delay(zabbix.intervalTime)
			payload.host.ext1 = `${payload.host.ext1}第${payload.trySyncTimes}次同步MO → `
			yield* syncMO({ payload }, { call, put })	//递归调用自己继续同步
		} else {
			//message.error('超过最大尝试次数,同步MO失败;')

			notification.error({
		    message: `设备${payload.host.name}同步失败`,
		    description: '超过最大尝试次数,同步MO失败;',
		  })
			payload.host.ext1 = `${payload.host.ext1}超过最大尝试次数,同步MO失败 → `
			payload.host.syncStatus = 'failed'

			yield put({
				type: 'objectMO/zabbixAdd',
				payload: { mos: [payload.host] },
			})

			return
		}
	}
	return payload
}

//获取items
export function* getItems ({ payload }, { call, put }) {
	let data = {}

	let getItemsParam = zabbix.getItemsParam
	getItemsParam.id = payload.id + 1
	getItemsParam.auth = payload.token
	getItemsParam.params.hostids = payload.hostid
	getItemsParam.zabbixUrl = payload.host.createdByTool

	try {
		data = yield call(zabbixConnection, getItemsParam)
	} catch (e) {
		if (!payload.tempStatus) {
			notification.error({
		    message: `设备${payload.host.name}同步失败`,
		    description: 'Zabbix连接失败',
		  })
			payload.host.ext1 = `${payload.host.ext1}Zabbix连接失败`
			payload.host.syncStatus = 'failed'
		} else {
			payload.host.ext1 = `${payload.host.ext1} → Zabbix连接失败,删除Items失败`
		}
		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}
	payload.id = data.id

	if (data.error === undefined) {	//items获取成功
		payload.items = data.result
		payload.host.ext1 = `${payload.host.ext1}检索到${data.result.length}条items → `
		if (payload.tempStatus) {
			payload.host.ext1 = ` → ${payload.host.ext1}检索到${data.result.length}条items → `
		}
	} else {
		if (!payload.tempStatus) {
			notification.error({
			  message: `设备${payload.host.name}同步失败`,
			  description: `检索items失败:${data.error.data};`,
			})

			payload.host.ext1 = `${payload.host.ext1}检索items失败:${data.error.data} → `
			payload.host.syncStatus = 'failed'
		} else {
			payload.host.ext1 = `${payload.host.ext1} → Zabbix连接失败,删除Items失败`
		}
		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}

	return payload
}

//删除items
export function* deleteItems ({ payload }, { call, put }) {
	let data = {}

	let deleteItemsParam = zabbix.deleteItemsParam
	deleteItemsParam.id = payload.id + 1
	deleteItemsParam.auth = payload.token
	deleteItemsParam.params = payload.items.map(v => v.itemid)
	deleteItemsParam.zabbixUrl = payload.host.createdByTool

	let message = ''

	try {
		data = yield call(zabbixConnection, deleteItemsParam)
	} catch (e) {
		if (!payload.tempStatus) {
			notification.error({
		    message: `设备${payload.host.name}同步失败`,
		    description: 'Zabbix连接失败',
		  })
			payload.host.ext1 = `${payload.host.ext1}Zabbix连接失败`
			payload.host.syncStatus = 'failed'
		} else {
			payload.host.ext1 = `${payload.host.ext1} → Zabbix连接失败,删除Items失败`
		}
		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}

	payload.id = data.id

	if (data.error === undefined) {	//items获取成功
		if (payload.items.length === data.result.itemids.length) { //如果删除数和请求数一致，表示删除成功
			payload.host.ext1 = `${payload.host.ext1}删除items成功 → `
			if (payload.tempStatus) {
				payload.host.ext1 = `${payload.host.ext1}删除items成功`
			}
		} else {
			for (let _itemid of deleteItemsParam.params) {
				let flag = false

				for (let itemid of data.result.itemids)	{
					if (_itemid === itemid) {
						flag = true
						break
					}
				}

				if (flag === false) {
					message += `${itemid},`
				}
			}

			notification.error({
			  message: `设备${payload.host.name}同步失败`,
			  description: `删除item${message}失败;`,
			})

			payload.host.ext1 = `${payload.host.ext1}删除item${message}失败`

			yield put({
				type: 'objectMO/zabbixAdd',
				payload: { mos: [payload.host] },
			})

			return
		}
	} else {
		if (!payload.tempStatus) {
			notification.error({
			  message: `设备${payload.host.name}同步失败`,
			  description: `删除items失败:${data.error.data};`,
			})

			payload.host.ext1 = `${payload.host.ext1}删除items失败:${data.error.data} → `
			payload.host.syncStatus = 'failed'
		} else {
			payload.host.ext1 = `${payload.host.ext1} → Zabbix连接失败,删除Items失败`
		}
		yield put({
			type: 'objectMO/zabbixAdd',
			payload: { mos: [payload.host] },
		})

		return
	}

	return payload
}

//删除items大流程
//删除items
export function* deleteItemServ ({ payload }, { call, put }) {
	//3.获取items
	const getItemsRes = yield* getItems({ payload }, { call, put })

	if (getItemsRes.items.length > 0) {
		//4.删除items
		const deleteItemsRes = yield* deleteItems({ payload }, { call, put })
	}

	return payload
}
