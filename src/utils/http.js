import Fly from '../../node_modules/flyio/dist/npm/wx'
const fly = new Fly()
// const baseURL = 'http://118.24.111.143:8081'
const baseURL = 'http://localhost:8089'

fly.config.baseURL = baseURL
fly.interceptors.request.use((request) => {
  request.headers = {
    'X-Tag': 'recruit',
    'content-type': 'application/json'
  }
  return request
})

// 添加响应拦截器
fly.interceptors.response.use(
  (response) => {
    if (response.data.code !== 0) {
      console.log(response.data.msg)
    }
    return response// 请求成功之后将返回值返回
  },
  (err) => {
    console.log(err)
  }
)
export default fly
