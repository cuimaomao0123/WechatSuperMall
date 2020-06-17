let ajaxTimes = 0

export function request(params){
 ajaxTimes++
//显示加载中效果
wx.showLoading({
  title: '加载中',
  mask:true   //蒙版挡住，无法进去其他点击
})

  //定义基础url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve,reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success:(res) => {
        resolve(res.data.message)
      },
      fail:(err) => {
        reject(err)
      },
      complete:(() => {
        ajaxTimes--
        if(ajaxTimes === 0){
          wx.hideLoading()
        }
      })
    })
  })
} 
 