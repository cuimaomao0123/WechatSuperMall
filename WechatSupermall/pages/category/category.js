import { request } from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({
  data: {
  //左侧的菜单数据
  leftMenuList:[],
  //右侧的商品数据
  rightContent:[],
  //接口的返回数据
  //被点击的左侧菜单
  currentIndex:0,
  Cates:[],
  //右侧内容滚动条距离顶部高度
  scrollTop:0
  },
  onLoad: function (options) {
    /*
    {time:Data.now(),data:[...]}
    先判断本地有没有旧的数据，没有的话就去请求新的数据
    有旧的数据同时旧的也没有过期，就使用本地存储的旧的数据
     */
    const Cates = wx.getStorageSync('cates')
    if(!Cates){
      this.getCates()     
    }else{
      //有旧的数据，假设过期时间10s
      if(Date.now()-Cates.time > 1000 * 10){
        //重新发送请求
        this.getCates()     
      }else{
        //可以使用旧的数据
        this.setData({
          Cates :Cates.data,
          leftMenuList :Cates.data.map(v => v.cat_name),
          rightContent :Cates.data[0].children
        })
      }
    }
  },
  //获取分类数据
 async getCates(){
    // request({
    //   url: "/categories"
    // })
    // .then(res => {
    //   this.setData({
    //     Cates:res.data.message
    //   })
    //   //把数据存储到本地去
    //   wx.setStorageSync('cates', {
    //    time:Date.now(),
    //    data:this.data.Cates
    //   })
    //   //左侧数据
    //  let leftMenuList = this.data.Cates.map(v => v.cat_name)
    //  //右侧数据
    //   let rightContent = this.data.Cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })
    const res = await request({
      url: "/categories"
    })
    this.setData({
          Cates:res
        })
        //把数据存储到本地去
        wx.setStorageSync('cates', {
         time:Date.now(),
         data:this.data.Cates
        })
        //左侧数据
       let leftMenuList = this.data.Cates.map(v => v.cat_name)
       //右侧数据
        let rightContent = this.data.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
  },
  //左侧菜单的点击事件
  handleItemTap(e){
    let {index} = e.currentTarget.dataset
    let rightContent = this.data.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      //重新设置右边内容scrollTop高度
      scrollTop:0
    })
    
  }

})