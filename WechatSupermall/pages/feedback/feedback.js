// pages/feedback/feedback.js
Page({

  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },{
        id:1,
        value:"商品、商家投诉",
        isActive:false
      }
    ],
    //被选中的图片路径数组
    chooseImgs:[],
    //文本域的内容
    textVal:''
  },
  
  //外网的图片路径数组
   UpLoadImgs:[],

  //处理自定义组件事件
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
  //选择图片事件
  handleChooseImg(){
    //这个微信接口不能同时上传多个！！！
   wx.chooseImage({
     count:9,      //同时选中图片的数量
     sizeType:['original','compressed'],  //图片的格式，原图/压缩
     sourceType:['album','camera'],   //图片的来源，相册/照相机
     success:(res) => {
       this.setData({
        chooseImgs:[...this.data.chooseImgs,...res.tempFilePaths]
       })
     }
   })
  },
  //点击自定义图片组件
  handleRemoveImg(e){
    const {index} = e.currentTarget.dataset
    let {chooseImgs} = this.data
    chooseImgs.splice(index,1)
    this.setData({chooseImgs})
  },
  //文本域的输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  //提交按钮的点击事件
  handleFormSubmit(){
    const {textVal,chooseImgs} = this.data
    if(!textVal.trim()){
      //不合法
      wx.showToast({
        title: '输入不合法',
        mask:true,
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title: '正在上传中',
      mask:true
    })
    //如果用户没有上传图片，只写了文本也可以上传
    if(chooseImgs.length != 0){
     //准备上传图片到专门的服务器
    chooseImgs.forEach((v,i) => {
      wx.uploadFile({
       filePath: v,
       name: 'file',     //这个名称要和后台一致，才能获取上传成功
       url: 'https://images.ac.cn/Home/Index/UploadAction/',
       formData:{},        //附带的文本信息
       success:(res) => {
         console.log(res)
         if(i === chooseImgs.length-1){
           wx.hideLoading({
             success:() => {
              wx.showToast({
                title: '提交成功'
              })
             }
           });
           
           this.setData({
             textVal:'',
             chooseImgs:[]
           })
           //返回
           wx.navigateBack({
             detail:1
           })
         }
       }
     })
   });
  }else{
    wx.hideLoading({
      success:() => {
       wx.showToast({
         title: '提交成功'
       })
      }
    });
    console.log('只是提交了文本')
    wx.navigateBack({
     detail:1
    })
  }
    
  }
})