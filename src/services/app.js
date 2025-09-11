import { request, config } from '../utils'
const { api } = config
const {
 user, userLogout, userLogin, changepwd,grafanaAdd
} = api

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export async function logout () {
  return request({
    url: userLogout,
    method: 'post',
  })
}
export async function changePassword (params) {
  return request({
    url: `${changepwd + params.uuid}/changepwd/`,
    method: 'PATCH',
	 data: params,
  })
}
export async function query (params) {
  return request({
    url: user.replace('/:id', ''),
    method: 'get',
    data: params,
  })
}
export async function getgrafanaAdd (params) {
  return request({
    url: grafanaAdd,
    method: 'get',
	 data: params,
  })
}

