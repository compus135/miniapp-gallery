// pages/game/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    score:0,//分数
    isPlay:false,
    countDown:10,
    bestScore:0,
    scoreList:[],
    isViewScoreList:false,//查看榜单
    order:0,//排名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              }, () => {
                this.doGetScores();
              })
            }
          })
        }
      }
    })
  },

  beginPlay:function(e){
    let  list = [];
    var j = 4;
    var isSugarNum = 0;
    for (let i = 1; i <= 300; i++) {
      if (j == 4 && i > 10) {
        isSugarNum = Math.ceil(Math.random() * 4 + i - 1);
      }
      j--; if (j == 0) j = 4;
      list.push({ id: i, isSugar: isSugarNum == i, sugarNum: isSugarNum == i ? Math.ceil(Math.random() * 5) : null })
    }
    this.setData({ list, isPlay: true,score:0 },()=>{
      this.timer = setInterval(() => {
        const countDown = this.data.countDown
        this.setData({ countDown: countDown - 1 },()=>{
          if (this.data.countDown === 0) {
            this.doSaveScore();
            this.setData({list:[],countDown:0})
            clearInterval(this.timer)
          }
        })
      }, 1000)
    })
  },

  viewScoreBorad: function(e) {
    this.setData({isViewScoreList:true},()=>{
      this.doGetScores();
    })
  },

  closeScoreBorad: function (e) {
    this.setData({ isViewScoreList: false })
  },
  compare: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    }
  },
  doGetScores: function () {
    const { userInfo}=this.data;
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'getAll',
      data: {
        database: "scores"
      }
    }).then(res => {
      // console.log(res.result.data)
      wx.hideLoading()
      let order = 0;
      const scoreList = res.result.data.sort(this.compare('score'))
      const record = scoreList.find((v, i) => {
        order = i + 1;
        return v.userName === userInfo.nickName
      });
      this.setData({ scoreList, bestScore: record && record.score ? record.score : 0,order },()=>{

        wx.hideLoading()
      })
    })

  },

  doSaveScore:function(){
    const { score, bestScore, scoreList, userInfo, avatarUrl}=this.data;
    if (score > bestScore){
      const db = wx.cloud.database({});
      const collection = db.collection('scores');
      const record = scoreList.find(v => v.userName === userInfo.nickName);
        if (record){
          collection.doc(record['_id']).update({
            data:{
              avatarUrl,
              score
            }
          }).then(res=>{
            wx.showLoading({})
            this.doGetScores();
          })
        }
        else{
          collection.add({
            data: {
              avatarUrl,
              userName: userInfo.nickName,
              score,
            }
          }).then(res => {
            wx.showLoading({})
            this.doGetScores();
          })
        }
    }
  },

  rePlay:function(e){
    clearInterval(this.timer)
    this.setData({ countDown: 10, isPlay: false, list: [] }, () => {
      this.beginPlay()
    })
  },
  playAgain:function(e){
    this.setData({ countDown: 10, isPlay: false,list:[] }, () => {
      this.beginPlay()
    })
  }, 
  
  gameItemClick:function(e){
    const item = e.currentTarget.dataset["item"];
    let {  score,list}=this.data;
    if (item.isSugar){
      list[item.id-1].isSugar=false;
      this.setData({ score: score + 1,list })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})