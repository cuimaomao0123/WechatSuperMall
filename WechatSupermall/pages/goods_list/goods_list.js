import { request } from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },{
        id:1,
        value:"销量",
        isActive:false
      },{
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },
  //接口要的参数
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  totalPages:1,
  
  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    this.getGoodsList()
  },
  //获取商品列表数据
  async getGoodsList(){
    const res = await request({
      url:"/goods/search",
      data:this.QueryParams
    })
    const total = res.total
    //计算总页数
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize)
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    })
    //数据回来了关闭下来刷新效果
    wx.stopPullDownRefresh()
  },

  //子组件传递过来的点击事件
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
  },
  //页面上划，滚动条触底事件
   onReachBottom(){
     if(this.QueryParams.pagenum >= this.totalPages){
       //表示没有下一页了
       wx.showToast({
         title: '没有下一页数据',
       })
     }else{
       //还有下一页
      //  当前页码++，对data数组拼接
      this.QueryParams.pagenum++;
      this.getGoodsList()
     }
   },
    //下拉刷新,需要在json文件开启一个爬配置项
    onPullDownRefresh(){
      this.setData({
        goodsList:[]
      })
      this.QueryParams.pagenum = 1
      this.getGoodsList()
    }
    
})