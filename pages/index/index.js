 Page({
   /**
    * 页面的初始数据
    */
   data: {
     image: 'https://s2.ax1x.com/2019/08/10/eOufDs.jpg',
     yiyan: {}
   },

   detectImage(src) {
     wx.showLoading({
       title: '分析中...'
     })

     const that = this

     wx.uploadFile({
       url: 'https://ai.qq.com/cgi-bin/appdemo_detectface',
       filePath: src,
       name: 'image_file',
       success(res) {
         console.log(res);
         const result = JSON.parse(res.data)

         // 检测失败
         if (result.ret !== 0) {
           wx.showToast({
             icon: 'none',
             title: '找不到你的小脸蛋喽'
           })
           return false
         }

         that.setData({
           result: result.data.face[0]
         })
         wx.hideLoading()
       }
     })
   },

   getImage(type = 'camera') {
     const that = this
     wx.chooseImage({
       count: 1,
       sizeType: ['original', 'compressed'],
       sourceType: [type],
       success(res) {
         const image = res.tempFiles[0]

         // 图片过大
         if (image.size > 1024 * 1000) {
           wx.showToast({
             icon: 'none',
             title: '图片过大, 请重新拍张小的！'
           })
           return false
         }

         that.setData({
           image: image.path
         })
         that.detectImage(image.path)
       }
     })
   },

   handleCamera() {
     this.getImage();
   },

   handleChoose() {
     this.getImage('album');
   },

   getYiyan() {
     var that = this
     wx.request({
       url: 'https://v1.hitokoto.cn/',
       header: {
         'content-type': 'application/json' // 默认值
       },
       success(res) {
         console.log(res.data);
         that.setData({
           yiyan: res.data.hitokoto
         })
       }
     })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
     this.getYiyan()
   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage() {
     if (this.data.result) {
       return {
         title: `刚刚测了自己的颜值为【${this.data.result.beauty}】你也赶紧来试试吧！`
       }
     }
   }
 })