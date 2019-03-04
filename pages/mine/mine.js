const maconfig = require('../../utils/maconfig.js')
const mabase = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        signUrl: '/pages/calendar/calendar'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        app.privateShare();

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
        wx.showLoading({ mask: true });
        Promise.all([maconfig.getTabBarData(app), maconfig.getMineData()])
            .then(res => {
                wx.hideLoading();
            })
            .catch(err => {
                wx.hideLoading();
                console.log(err);
            })
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    goUrl: function (e) {
        mabase.navigateTo(e.currentTarget.dataset.url)
    },
    notOpen: function () {
        wx.showToast({
            title: '功能即将上线，程序猿小哥哥正在开发中！',
            icon: 'none',
            mask: true
        })
    }
})