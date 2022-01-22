import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://localhost:8888/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: 'http://localhost:8888/user/register',
    method: 'post',
    data
  })
}

export function searchUser(data) {
  return request({
    url: 'http://localhost:8888/user/query',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: 'http://localhost:8888/user/modify',
    method: 'post',
    data
  })
}

export function refreshUser() {
  return request({
    url: 'http://localhost:8888/user/refreshuser',
    method: 'get',
  })
}
