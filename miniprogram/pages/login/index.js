//index.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    empowered:true
  },


  onLoad: function() {
    wx.getUserInfo({
      success: res => {
        wx.navigateTo({
          url: '../index/index'
        })
      },
      fail:res=>{
        this.setData({ empowered:false})
      }
    })
  },
  getUserInfo: function () {
        wx.navigateTo({
        url: '../index/index'
      })
  },
  // bindGetUserInfo: function (e) {
  //   console.log(e.detail.userInfo)
  //   if (e.detail.userInfo) {
  //     //用户按了允许授权按钮
  //     wx.navigateTo({
  //       url: '../index/index'
  //     })
  //   } else {
  //     //用户按了拒绝按钮
  //   }
  // }
  
})
