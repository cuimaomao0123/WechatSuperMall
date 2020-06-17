// pages/collect/collect.js
Page({
  data: {
    tabs:[
      {
        id:0,
        value:"商品收藏",
        isActive:true
      },{
        id:1,
        value:"品牌收藏",
        isActive:false
      },{
        id:2,
        value:"店铺收藏",
        isActive:false
      },
      {
        id:3,
        value:"浏览途径",
        isActive:false
      }
    ],
    collect:[]
  },
  
  onShow(){
    const collect = wx.getStorageSync('collect') || []
    this.setData({collect})
  },
  //tab切换处理事件
  handleTabsItemChange(e){
    //获取索引
   const {index} = e.detail
   //修改原数组
   let {tabs} = this.data
   tabs.forEach((item,i) => {
     i === index?item.isActive=true:item.isActive=false
   })
   this.setData({
     tabs
   })
  }
})