import { request } from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({
  data: {
   goods:[],
   isFocus:false,
   inputValue:''
  },
  TimeId:-1,
  //输入框的值改变会发生的事件
  handleInput(e){
  const {value} = e.detail
  if(!value.trim()){
    this.setData({
      goods:[],
      isFocus:false
    })
    return
   }
   this.setData({isFocus:true})
   //通过了验证
   clearTimeout(this.TimeId)
   this.TimeId = setTimeout(() => {
    this.qsearch(value)
   }, 1000);
  },
  //发送请求获取数据的函数
  async qsearch(query){
   const res = await request({
     url:"/goods/qsearch",
     data:{query}
   })
   this.setData({goods:res})
  },

  //点击了取消按钮
  handleCancel(){
    this.setData({
      inputValue:'',
      isFocus:false,
      goods:[]
    })
  }
})