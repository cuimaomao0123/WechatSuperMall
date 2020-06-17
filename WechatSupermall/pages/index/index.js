//引入网络请求方法
import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[],
    catesList:[],
    floorList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },

  //获取轮播图数据方法
  getSwiperList(){
    request({
      url: "/home/swiperdata",
    }).then(res => {
       res.forEach(v => {
         v.navigator_url = v.navigator_url.replace(/main/,'goods_detail')
       })
      this.setData({
        swiperList: res
      })
    })
  },
  //获取分类导航数据
  getCateList() {
    request({
      url: "/home/catitems",
    }).then(res => {
      this.setData({
        catesList: res
      })
    })
  },
  //获取楼层数据
  getFloorList() {
    request({
      url: "/home/floordata",
    }).then(res => {
      this.setData({
        floorList: res
      })
    })
  }
})