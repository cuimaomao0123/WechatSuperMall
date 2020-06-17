const {getSetting,openSetting,chooseAddress } = require('../../utils/util.js')
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({

  data: {
   address:{},
   cart:[],
   allChecked:false,
   totalPrice:0,
   totalNum:0
  },
  onShow: function (options) {
    //获取缓存中的地址
   const address = wx.getStorageSync('address')
   //获取缓存中的购物车数据
   const cart = wx.getStorageSync('cart') || []
   //计算全选,every数组方法，遍历，接收一个回调函数，每一个回调都返回true，every方法才会返回true
   //只要有一个返回false,将不再循环，直接返回false
   //有个注意点：空数组调用every，返回值也是true
   const allChecked = cart.length?cart.every(v=>v.checked):false
   //总价格、总数量
   let totalPrice = 0
   let totalNum = 0
   cart.forEach(v => {
     if(v.checked){
       totalPrice += v.num * v.goods_price
       totalNum += v.num
     }
   })
   this.setData({
     address,
     cart,
     allChecked,
     totalPrice,
     totalNum
   })
  },
  async handleChooseAddress(){
    //调接口，获取地址
    //1、获取权限状态
    // wx.getSetting({
    //   success:(res) => {
    //    const scopeAddress = res.authSetting['scope.address']
    //    if(scopeAddress === true || scopeAddress === undefined){
    //      //直接调用接口
    //      wx.chooseAddress({
    //        success: (res1) => {
    //          console.log(res1)
    //        },
    //      })
    //    }else{
    //      //拒绝了，需要再次手动引导打开授权页面
    //      wx.openSetting({
    //        success: (res2) => {
    //         wx.chooseAddress({
    //           success: (res3) => {
    //            console.log(res3)
    //           },
    //         })
    //        },
    //      })
    //    }
    //   },
    // })
  try {
    //1、获取权限
  const res1 = await getSetting()
  const scopeAddress = res1.authSetting['scope.address']
  //2、判断权限状态
  if(scopeAddress === true || scopeAddress === undefined){
    //3、直接获取收获地址
  const address = await chooseAddress()
    //4、存入缓存
  wx.setStorageSync('address', address)
  }else{
    //4、引诱用户打开授权
    await openSetting()
    const address = await chooseAddress()
    wx.setStorageSync('address', address)
  }
  } catch (error) {
    console.log(error)
  }
 },
 //修改复选框(修改本地data及缓存中的状态值)
 handleItemChange(e){
  const goods_id = e.currentTarget.dataset.id
  let {cart} = this.data
  let index = cart.findIndex(v => v.goods_id === goods_id)
  cart[index].checked = !cart[index].checked

  //再次重新计算全选、总价格、总数量
  const allChecked = cart.length?cart.every(v=>v.checked):false
  //总价格、总数量
  //再把购物车数据重新设置回data和缓存中
  let totalPrice = 0
  let totalNum = 0
  cart.forEach(v => {
    if(v.checked){
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    }
  })
  this.setData({
    cart,totalPrice,totalNum,allChecked
  })
  wx.setStorageSync('cart', cart)
 },

  //全选
  handleItemAllCheck(){
    let {cart,allChecked} = this.data 
    allChecked =!allChecked
    cart.forEach(v =>v.checked = allChecked)
  //总价格、总数量
  //再把购物车数据重新设置回data和缓存中
  let totalPrice = 0
  let totalNum = 0
  cart.forEach(v => {
    if(v.checked){
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    }
  })
  this.setData({
    cart,totalPrice,totalNum,allChecked
  })
  wx.setStorageSync('cart', cart)
  },

  //商品数量的编辑
  handleItemNumEdit(e){
    const {operation,id} = e.currentTarget.dataset
    let {cart} = this.data
    const index = cart.findIndex(v => v.goods_id === id)
    if(cart[index].num ===1 && operation === -1){
      wx.showModal({
        title:'提示',
        content:'你是否要删除',
        success:(res) =>{
          if(res.confirm){
           cart.splice(index,1)
             //设置回data和缓存中
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if(v.checked){
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      }
    })
    this.setData({
      cart,totalPrice,totalNum
    })
    wx.setStorageSync('cart', cart)
          }else if(res.cancel){
           
          }
        }
      })
    }else{
      cart[index].num+=operation
    //设置回data和缓存中
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if(v.checked){
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      }
    })
    this.setData({
      cart,totalPrice,totalNum
    })
    wx.setStorageSync('cart', cart)
    }
  },
  //点击结算
  handlePay(){
    //判断收货地址
  const {address,totalNum} = this.data
  if(!address.userName){
   wx.showToast({
     title: '你还没有添加地址',
     icon:'none'
   })
   return;
  }
  //判断是否选购商品
  if(totalNum ===0){
    wx.showToast({
      title: '你还没有添加商品呢',
      icon:'none'
    })
    return
  }
  //跳转支付页面
  wx.navigateTo({
    url: '/pages/pay/pay'
  })
  }
})