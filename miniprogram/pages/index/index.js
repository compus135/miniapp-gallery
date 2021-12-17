//index.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    swiperImgs: [
      { id: "image11", text: "", src: "cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder11.png" },
      { id: "image1", text:"追一生心的步伐",src:"cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder1.png"},
      { id: "image3", text: "两个独立的生命相依相伴", src: "cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder3.png" },
      { id: "image6", text: "浓烈的爱情惊艳了时光", src: "cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder6.png" },
      { id: "image5", text: "细水长流的感情温柔了岁月", src: "cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder5.png" },
      { id: "image7", text: "守候是彼此最深情的告白", src: "cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder7.png" },
      { id: "image8",text:"",src:"cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder8.png"},
      { id: "image9", text: "", src: "cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder9.png" },
      { id: "image10", text: "", src: "cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder10.png" }, 
      { id: "image14", text: "", src: "cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder14.png" },
      { id: "image2", text: "", src: "cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder2.png" },
      { id: "image12", text: "", src: "cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder12.png" },
      { id: "image4", text: "", src: "cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder4.png" },
      { id: "image15", text: "", src: "cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/silder15.png" },
    ],
    //图片
    empowered:false,//用户是否授权
    comments: [],// 评论列表
    showComments:false,//显示评论
    showLikes:false,//显示点赞
    inputValue:"",//评论输入框
    avatarUrl:"",//用户头像url
    iLike:false,//用户是否已点赞
    likes:[],//点赞列表
    isAudioPlay:true,//背景音乐是否播放
    isFastShow:true,
    currentImg:0,//当前轮播的图片下标
  },
  onShow() {
    // console.log("show")
    this.audioPlay();
  },
  onHide() {
    // console.log("hide")
  },
  getUserInfo: function () {
    wx.getUserInfo({
      success: res => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          empowered: true
        }, () => {
          this.doGetLikes();
          this.doGetComments();
          const that = this;
          setTimeout(function () {
            that.setData({ isFastShow: false })
          }, 18400)
        })
      },
      fail: res => {
        this.setData({ empowered: false })
      }
    })
  },

  onLoad: function() {
    this.getUserInfo();
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           },()=>{
    //             this.doGetLikes();
    //             this.doGetComments();
    //           })
    //         }
    //       })
    //     }
    //   }
    // });
    // const that = this;
    // setTimeout(function(){
    //   that.setData({isFastShow:false})
    // },18400)
  },

  jumpFastshow: function () {
    this.setData({ isFastShow:false})
  },

  goToPlayGame: function () {
    wx.navigateTo({
      url: '../game/index'
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: 'xx小程序',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },
  onReady(e) {
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.autoplay = true
    this.innerAudioContext.src = 'cloud://aiyun1010-tangliyan0419.6169-aiyun1010-tangliyan0419/kebukeyi.mp3'
  },
  audioPlay() {
    this.innerAudioContext&&this.innerAudioContext.play()
  },
  audioPause() {
    this.innerAudioContext&&this.innerAudioContext.pause()
  },
  audioClick: function () {
    const isAudioPlay = this.data.isAudioPlay
    isAudioPlay ? this.audioPause() : this.audioPlay()
    this.setData({ isAudioPlay: !isAudioPlay })
  },

  doGetComments:(function(e){
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'getAll',
      data: {
        database: "comments"
      }
    }).then(res => {
      wx.hideLoading()
      this.setData({ comments: res.result.data.reverse() })
    })
  }),

  doGetLikes:(function (e) {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'getAll',
      data: {
        database: "likeList"
      }
    }).then(res => {
      wx.hideLoading()      
      const data = res.result.data.reverse();
      const record = data.find(v => v.userName === this.data.userInfo.nickName);
      this.setData({ likes: data, iLike: record && record.iLike ? true : false  })
    })
  }),

  doClickBlank:(function(){
    this.doHideComments();
    this.doHideLikes();
  }),
  doShowComments:(function(e){
    this.setData({ showComments: true },()=>{
      this.doGetComments()
    })
  }),
  doHideComments: (function (e) {
    this.setData({ showComments: false })
  }),
  doShowLikes: (function (e) {
    this.setData({ showLikes: true }, () => {
      this.doGetLikes()
    })
  }),
  doHideLikes: (function (e) {
    this.setData({ showLikes: false })
  }),
  foucus: (function (e) {
    this.setData({ bottom: e.detail.height })
  }),
  blur: (function (e) {
    this.setData({ bottom: 0})
  }),
  setInputValue: (function (e) {
    this.setData({ inputValue: e.detail.value })
  }),
  doSetILike:(function(){
    const state = this.data;
    const db = wx.cloud.database();
    const collection = db.collection('likeList');
    collection.add({
      data: {
        userName: state.userInfo.nickName,
        avatarUrl: state.userInfo.avatarUrl,
        iLike: true,
        time: util.formatTime(new Date()),
        showTime: util.formatTime(new Date(), true),
      }, success: (res) => {
        this.doGetLikes();
      }, fail: (res) => {
        console.log(res)
      }
    })
    // collection.get().then(res=>{
        // const likes = res.data
        // const record = likes.find(v => v.userName === state.userInfo.nickName);
        // if (record){
        //   collection.doc(record['_id']).update({
        //     data:{
        //       avatarUrl:state.userInfo.avatarUrl,
        //       iLike: record.iLike?false:true
        //     },
        //      success: (res) => {
        //       this.doGetLikes();
        //     }
        //   })
        // }
        // else{
        //   collection.add({
        //     data: {
        //       userName: state.userInfo.nickName,
        //       avatarUrl: state.userInfo.avatarUrl,
        //       iLike: true
        //     }, success: (res) => {
        //       this.doGetLikes();
        //     }, fail: (res) => {
        //       console.log(res)
        //     }
        //   })
        // }
    // })
  }),
  doSendComment: (function (e) {
    const that = this;
    const inputValue = this.data.inputValue
    if (inputValue !== undefined && inputValue!==""){
      const db = wx.cloud.database();
      wx.showLoading()
      db.collection('comments').add({
        data: {
          userName: that.data.userInfo.nickName,
          avatarUrl: that.data.avatarUrl,
          content: inputValue,
          time: util.formatTime(new Date()),
          showTime: util.formatTime(new Date(),true),
        },
        success: res => {
          that.doGetComments();
          that.setData({ inputValue: "" });
          wx.hideLoading()
          wx.showToast({
            icon:"success",
            title: '谢谢您的祝福',
          })

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
        }
      })
    }
  }),
  swiperChange:function(e){
    // console.log(e.detail )
    this.setData({currentImg:e.detail.current})
  }
})
