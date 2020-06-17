const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//promise形式的getSetting
const getSetting = () => {
  return new Promise((resolve,reject) => {
    wx.getSetting({
      success: (res) => {
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}
//promise形式的chooseAddress
const chooseAddress = () => {
  return new Promise((resolve,reject) => {
    wx.chooseAddress({
      success: (res) => {
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}

//promise形式的openSetting
const openSetting = () => {
  return new Promise((resolve,reject) => {
    wx.openSetting({
      success: (res) => {
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}

//登录
const login = () => {
  return new Promise((resolve,reject) => {
    wx.login({
      timeout:10000,
      success: (res) => {
        resolve(res)
      },
      fail:(err) =>{
        reject(err)
      }
    })
  })
}


//调微信支付接口，每个参数都有特殊含义
// pay里面有支付所必要的参数，见文档
const requestPayment = (pay) => {
  return new Promise((resolve,reject) => {
    wx.requestPayment({
      ...pay,
      success:(res)=> {
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      }
    })
 })
}


module.exports = {
  formatTime: formatTime,
  getSetting,
  chooseAddress,
  openSetting,
  login,
  requestPayment
}
