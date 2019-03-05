const maconfig = require('../../utils/maconfig.js')
const mabase = require('../../utils/mabase.js')
const { UrlBase } = require('../../utils/mabase.js')
import ways from '../../utils/ways'
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
        play: UrlBase + 'image/videoWall/play.png',
        redHeart: UrlBase + 'image/videoWall/redHeart.png',
        grayHeart: UrlBase + 'image/videoWall/grayHeart.png',
        button: UrlBase + 'image/question/invitation.png',
        detailFrame: UrlBase + 'image/mip/detailFrame.png',
        time: UrlBase + 'image/mip/time.png',
        close: mabase.UrlBase + '/image/match/close.png',

        module: '活动',
        // tab 切换
        tabswitch: 1,

        pages: 1,
        detailFrameShow: false
    },
    LoginEnabled: false,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        let that = this;
        app.privateShare({
            path: 'pages/videoWall/videoWall',
            imageUrl: UrlBase + 'image/share/otherShare.png',
            title: '我正在参加“耀出众 | Surface王者之战”，快来为我助力吧！'
        });
        //动态设置高度
        let query = wx.createSelectorQuery();
        query.selectAll('.height').boundingClientRect(rect => {
            //屏幕高度
            let windowHeight = wx.getSystemInfoSync().windowHeight;
            //所有.height元素的高度和
            let sum = rect.reduce((prev, item) => {
                return prev + item.height;
            }, 0);
            that.setData({ height: windowHeight - sum - 10 });
        }).exec();
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
        let that = this;
        Promise.all([maconfig.getTabBarData(app), maconfig.getVideoWallData(1, 6), maconfig.isRegister()])
            .then(res => {
                const { list, pageCount, pageIndex, pageSize, recordCount } = res[1].Data;
                that.setData({
                    list, pageCount, pageIndex, pageSize, recordCount,
                    IsRegister: res[2].Data.IsRegister,
                    IsVideo: res[2].Data.IsVideo,
                    pages: 1
                });
                wx.hideLoading();
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
    //tab切换
    switch(e) {
        let tabswitch = e.currentTarget.dataset.tabswitch;
        this.setData({ tabswitch });
    },
    getMore() {
        wx.showLoading({ mask: true });
        let that = this,
            list = this.data.list;
        maconfig.getVideoWallData((that.data.pages + 1), 6)
            .then(res => {
                let list2 = res.Data.list,
                    index = res.Data.pageIndex;
                if (list2[0]) {//如果下一页还有数据
                    that.setData({
                        list: list.concat(list2),
                        pages: index
                    })
                    wx.hideLoading();
                } else {//没有了
                    wx.hideLoading();
                    wx.showToast({
                        title: '到底啦',
                        icon: 'none'
                    })
                }
            })
            .catch(err => {
                wx.hideLoading();
            })
    },
    goVideoPlay(even) {
        wx.showLoading({ mask: true });
        ways.goVideoPlayPage(even, mabase);
    },
    goUpLoadVideo() {
        ways.goUpLoadVideoPage(this.data.IsRegister, mabase);
    },
    isDetailFrameShow() {
        let that = this;
        this.setData({
            detailFrameShow:!that.data.detailFrameShow
        })
    }
})