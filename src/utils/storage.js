// storage存储模块

const INFO_KEY = 'gjw_mobile_info' // 用户页面键名
const HISTORY_KEY = 'gjw_history_list' // 搜索页面键名

// 获取用户信息
export const getInfo = () => {
  const obj = { token: '', userId: '' }
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : obj // 判断本地是否有用户信息
}

// 存储用户信息
export const setInfo = (obj) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}

// 清除用户信息
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// 获取搜索历史
export const getHistoryList = () => {
  const result = localStorage.getItem(HISTORY_KEY)
  return result ? JSON.parse(result) : [] // 判断本地是否有搜索历史
}

// 存储搜索历史
export const setHistoryList = (arr) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr))
}
