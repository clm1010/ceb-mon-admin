import { request, config } from '../utils'
const { api } = config
const { userLogin, getUserByToken, iam, iamState, entry, oauthssoLogin } = api

export async function login (data) {
  return request({
    url: userLogin,
    method: 'post',
    data,
  })
}
export async function iamStates(data) {
  return request({
    url: iamState,
    method: 'get',
    data,
  })
}

export async function entrys(data) {
  return request({
    url: entry,
    method: 'get',
    data,
  })
}
export async function iamLogins(data) {
  return request({
    url: `${oauthssoLogin}${data}`,
    method: 'get',
  })
}

// 为了支持IAM登录方式
export async function iamLogin (data) {
  return request({
    url: iam,
    method: 'post',
    data: { iamTicket: data.iamcaspticket },
  })
}

export async function getUser () {
  return request({
    url: getUserByToken,
    method: 'get',
  })
}
