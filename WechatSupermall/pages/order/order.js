// pages/order/order.js
Page({
  data: {
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },{
        id:1,
        value:"待付款",
        isActive:false
      },{
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      }
    ],
  },

  onLoad(options){

  },
  onShow: function (options) {
    //页面反复切换打开存在页面栈
   //1、获取当前小程序页面栈，长度最大为10个
   //2数组中 索引最大的页面就是当前页面了
   let pages = getCurrentPages()
   let currentPage = pages[pages.length -1]
   const type = currentPage.options.type
   this.changeTitleByIndex(type-1)
  },

  //根据标题索引来激活选选中标题数组
  changeTitleByIndex(index){
    let {tabs} = this.data
    tabs.forEach((item,i) => {
      i === index?item.isActive=true:item.isActive=false
    })
    this.setData({
      tabs
    })
  },

  //处理子组件传递的事件
  handleTabsItemChange(e){
    //获取索引
   const {index} = e.detail
   //修改原数组
   this.changeTitleByIndex(index)
  }
})


