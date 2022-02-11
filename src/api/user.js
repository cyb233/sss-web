import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function getInfo(loginCode) {
  return request({
    url: '/user/info',
    method: 'post',
    data: {loginCode: loginCode}
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
