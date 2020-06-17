import { request } from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({

  data: {
    goodsObj:{},
    isCollect:false
  },
  //商品对象
  GoodsInfo:{},
  onShow: function () {
    let pages = getCurrentPages()
    let currentPage = pages[pages.length -1]
    let options = currentPage.options
   const {goods_id} = options
   this.getGoodsDetail(goods_id)
  },
  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({
      url:"/goods/detail",
      data:{
        goods_id
      }
    })
    this.GoodsInfo = goodsObj
    //获取缓存汇总的商品收藏数组
   let collect = wx.getStorageSync('collect') || []
    //判断当前商品是否被收藏
   let isCollect = collect.some(v =>v.goods_id==this.GoodsInfo.goods_id)
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce,
        pics:goodsObj.pics,
      },
      isCollect
    })
  },

  //点击轮播图，放大预览
  handlePreviewImage(e){
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    // 接收事件触发时获取点击图片的url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      urls: urls,
      current:current
    })
  },
  //点击加入购物车
  handleCartAdd(){
    let cart = wx.getStorageSync('cart') || []
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if(index === -1){
      //不存在，第一次添加商品
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo)
    }else{
      cart[index].num++;
    }
    wx.setStorageSync("cart",cart)
     wx.showToast({
       title: '加入成功',
       icon:'success',
       mask:true
     })
  },

  //处理收藏图标
  handleCollect(){
    let isCollect = false
   //先获取缓存看是不是已经存在
   let collect = wx.getStorageSync('collect') || []
   let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
   if(index !== -1){
     collect.splice(index,1)
     isCollect = false
     wx.showToast({
       title: '取消成功',
       mask:true
     })
   }else{
     collect.push(this.GoodsInfo)
     isCollect = true
     wx.showToast({
      title: '加入成功',
      mask:true
    })
   }
   //存入缓存
   wx.setStorageSync('collect', collect)
   //修改data中的isCollect
   this.setData({
     isCollect
   })
  }
})