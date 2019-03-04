const maconfig = require('../../utils/maconfig.js')
const app = getApp()
const mabase = require('../../utils/mabase.js')
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        calendarUrl: '/pages/calendar/calendar'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        app.privateShare()
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
        let that = this;
        if (!that.data.list) {
            wx.showLoading({ mask: true });
            maconfig.getIndexData()
                .then(res => {
                    wx.hideLoading();
                })
                .catch(err => {
                    wx.hideLoading();
                })
        }
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

    },
    notOpen: function () {
        wx.showToast({
            title: '功能即将上线，程序猿小哥哥正在开发中！',
            icon: 'none',
            mask: true
        })
    },
})