const maconfig = require('../../utils/maconfig.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        banner: UrlBase + 'image/mip/banner.jpg',
        blueLine_left: UrlBase + 'image/mip/blueLine_left.png',
        blueLine_right: UrlBase + 'image/mip/blueLine_right.png',
        tab_bg: UrlBase + 'image/mip/tab_bg.png',
        tab_grayBg: UrlBase + 'image/mip/tab_grayBg.png',
        middleBanner: UrlBase + 'image/mip/middleBanner.jpg',
        detail: UrlBase + 'image/mip/detail.png',


        // tab
        tabswitch: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        Promise.all([maconfig.getTabBarData(app),])
            .then(res => {
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
    //tab切换
    switch(e) {
        let tabswitch = e.currentTarget.dataset.tabswitch;
        this.setData({ tabswitch });
    }
})