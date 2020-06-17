const {getSetting,openSetting,chooseAddress } = require('../../utils/util.js')
import regeneratorRuntime from "../../lib/runtime/runtime"
import { request,requestPayment } from "../../request/index"
Page({

  data: {
   address:{},
   cart:[],
   totalPrice:0,
   totalNum:0
  },
  onShow: function (options) {
    //获取缓存中的地址
   const address = wx.getStorageSync('address')
   //获取缓存中的购物车数据
   let cart = wx.getStorageSync('cart') || []
   //过滤后的购物车数组
   cart = cart.filter(v => v.checked)
   //总价格、总数量
   let totalPrice = 0
   let totalNum = 0
   cart.forEach(v => {
     totalPrice += v.num * v.goods_price
     totalNum += v.num
   })
   this.setData({
     address,
     cart,
     totalPrice,
     totalNum
   })
  },
  //点击支付
 async handleOrderPay(){
   try {
      //判断缓存有没有token
    const token = wx.getStorageSync('token')
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
      return
    }

      console.log('已经存在token')
      //创建订单
      const header = {authorization:token}
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address

      const cart = this.data.cart
      let goods = []
      cart.forEach(v => goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }))
      const orderParams = {goods_price,consignee_addr,goods}
      //准备发送请求创建订单获取订单编号
       const {order_number} = await request({
         url:"/myorders/create",
         method:'post',
         data:orderParams,
         header
       })
      //  console.log(res) //里面应该有订单编号
      //再发起预支付接口
      const {pay} = await request({
        url:"/my/orders/req_unifiedorder",
        method:"post",
        header,
        data:{order_number}
      })
      //发起微信支付
       await requestPayment(pay)
      //查询订单状态
      const res = await request({
        url:"/my/orders/chkOrder",
        method:"post",
        header,
        data:{order_number}
      })
      await wx.showToast({
        title: '支付成功'
      })
      //跳转支付成功页面
      wx.navigateTo({
        url: '/pages/order/order',
      })
   } catch (error) {
     await wx.showToast({
       title: '支付失败'
     })
     console.log(error)
   }
  }
})