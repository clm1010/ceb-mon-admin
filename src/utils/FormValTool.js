//校验IP地址格式
export function validateIP(rule, value, callback) {
	//IPV4
	let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

	//IPV6
	let reg1 = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
	let reg2 = /^((?:[0-9A-Fa-f]{1,4}(:[0-9A-Fa-f]{1,4})*)?)::((?:([0-9A-Fa-f]{1,4}:)*[0-9A-Fa-f]{1,4})?)$/
	let reg3 = /^(::(?:[0-9A-Fa-f]{1,4})(?::[0-9A-Fa-f]{1,4}){5})|((?:[0-9A-Fa-f]{1,4})(?::[0-9A-Fa-f]{1,4}){5}::)$/
	if(!value){
		callback()
	}else if (!(reg.test(value) || reg1.test(value) || reg2.test(value) || reg3.test(value)) && value !== undefined) {
		callback('IP address is wrong')
	} else {
		callback()
	}
}

//校验textarea不允许有回车
export function validateEnterKey(rule, value, callback) {
	if (value.indexOf('\n') > -1) {
		callback('请清除sql语句中的回车换行符。')
	} else {
		callback()
	}
}

//校验日期选择器起始结束时间不能超过半年
export function validateRangeLessThanHalfYear(rule, value, callback) {
	if (value === undefined || value === '') {
		callback()
	} else {
		let k = value[1].diff(value[0], 'year', true)
		if (value[1].diff(value[0], 'year', true) > 0.5) {
			callback('非周期维护期起始结束时间的跨度不能超过半年。')
		} else {
			callback()
		}
	}
}

export function getMenus(userPermissions) {
	let subMenus = []//子菜单
	let parMenus = [] //父菜单
	for (let i = 0; i < userPermissions.length; i++) {
		if (userPermissions[i].hasOwnProperty('bpid')) {
			subMenus.push({
				title: userPermissions[i].name,
				key: userPermissions[i].id,
				bpid: userPermissions[i].bpid
			})
		} else {
			parMenus.push({
				title: userPermissions[i].name,
				key: userPermissions[i].id,
			})
		}
	}
	parMenus.forEach((parItem) => {
		let children = []
		subMenus.forEach((subItem) => {
			if (subItem.bpid === parItem.key) {
				delete subItem.bpid
				children.push(subItem)
			}
		})
		if (children && children.length > 0)
			parItem.children = children
	})

	return parMenus 
}
