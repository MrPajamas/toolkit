const maconfig = require('../../utils/maconfig.js')
const app = getApp()

app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true })
        app.privateShare();
        Promise.all([
            maconfig.getStudyData(),
            maconfig.getTabBarData(app),
        ])
            .then(res => {
                wx.hideLoading();
            })
            .catch(err => {
                wx.hideLoading();
            })
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    tabSwitch: function (e) {
        this.setData({
            selected: e.currentTarget.dataset.index
        })
    },
    notOpen: function () {
        wx.showToast({
            title: '功能即将上线，程序猿小哥哥正在开发中！',
            icon: 'none',
            mask: true
        })
    }
})