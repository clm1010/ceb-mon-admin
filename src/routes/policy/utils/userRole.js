import React from 'react'
const user = JSON.parse(sessionStorage.getItem('user'))

export function adminRoles(){
    let onPower = user.roles
	let disPower = true
	for (let a = 0; a < onPower.length; a++) {
		if (onPower[a].name == '超级管理员') {
			disPower = false
		}
	}
    return disPower
}