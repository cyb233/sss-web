import request from '@/utils/request'

export function getInfo(data) {
  return request({
    url: 'http://localhost:8888/airQualityIndex/query',
    method: 'post',
    data
  })
}
export function addInfo(data) {
  return request({
    url: 'http://localhost:8888/airQualityIndex/add',
    method: 'post',
    data
  })
}
export function setInfo(data) {
  return request({
    url: 'http://localhost:8888/airQualityIndex/modify',
    method: 'post',
    data
  })
}
export function delInfo(data) {
  return request({
    url: 'http://localhost:8888/airQualityIndex/remove',
    method: 'post',
    data
  })
}
