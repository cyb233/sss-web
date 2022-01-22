import request from '@/utils/request'


export function getInfo() {
  return request({
    url: 'http://localhost:8888/district/query',
    method: 'get'
  })
}
