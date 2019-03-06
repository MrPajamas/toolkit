const maconfig = require('../../utils/maconfig.js')
const mabase = require('../../utils/mabase.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()
import maconfig2 from '../../utils/maconfig2'
import ways from '../../utils/ways'

app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        topBanner: UrlBase + 'image/mip/topBanner.jpg',
        blueLine_left: UrlBase + 'image/mip/blueLine_left.png',
        blueLine_right: UrlBase + 'image/mip/blueLine_right.png',
        tab_bg: UrlBase + 'image/mip/tab_bg.png',
        tab_grayBg: UrlBase + 'image/mip/tab_grayBg.png',
        // middleBanner: UrlBase + 'image/mip/banner.jpg',
        detail: UrlBase + 'image/mip/detail.png',
        play: UrlBase + 'image/videoWall/play.png',
        redHeart: UrlBase + 'image/videoWall/redHeart.png',
        grayHeart: UrlBase + 'image/videoWall/grayHeart.png',
        button: UrlBase + 'image/question/invitation.png',
        detailFrame: UrlBase + 'image/mip/detailFrame.png',
        time: UrlBase + 'image/mip/time.png',
        close: UrlBase + '/image/match/close.png',
        arrow: UrlBase + '/image/mip/arrow.png',
        placingBg: UrlBase + '/image/mip/placingBg.png',

        module: '活动',
        // tab 切换
        tabswitch: 1,

        pages: 1,
        detailFrameShow: false,
        // 往期高度
        pastItemHeight: 0,
        // 展开项索引
        slideIndex: '',
        // 展开队列
        slideQueue: [],
        exp: ''
    },
    LoginEnabled: false,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        let that = this;
        app.privateShare({
            path: 'pages/mip/mip',
            imageUrl: UrlBase + 'image/share/otherShare.png',
            title: '我正在参加“耀出众 | Surface王者之战”，快来为我助力吧！'
        });
        //动态设置高度
        let current = wx.createSelectorQuery();//本期
        let past = wx.createSelectorQuery();//往期
        current.selectAll('.height').boundingClientRect(rect => {
            //屏幕高度
            let windowHeight = wx.getSystemInfoSync().windowHeight;
            //所有.height元素的高度和
            let sum = rect.reduce((prev, item) => {
                return prev + item.height;
            }, 0);
            that.setData({ height: windowHeight - sum - 35 });
        }).exec();
        past.selectAll('.pastHeight').boundingClientRect(rect => {
            let windowHeight = wx.getSystemInfoSync().windowHeight;
            let sum = rect.reduce((prev, item) => {
                return prev + item.height;
            }, 0);
            that.setData({ pastHeight: windowHeight - sum - 15 });
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
        Promise.all([
            maconfig.getTabBarData(app),
            maconfig2.getMipCurrentTerm(1, 6),
            maconfig2.getMipCurrentData(),
            maconfig2.getMipPastTerm()
        ])
            .then(res => {
                const { list, pageCount, pageIndex, pageSize, recordCount } = res[1].Data;
                const { BannerUrl, IsRegister, IsMipVideo } = res[2].Data;
                const pastList = res[3].Data;//往期视频
                that.setData({
                    list, pageCount, pageIndex, pageSize, recordCount,
                    IsRegister, IsMipVideo, BannerUrl,
                    pages: 1,
                    pastList,
                    exp: '敬请期待'
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
        maconfig2.getMipCurrentTerm((that.data.pages + 1), 6)
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
        if (!this.data.IsRegister) {//如果未注册过,跳去注册
            mabase.navigateTo('/pages/register/register')
        } else {
            mabase.navigateTo('/pages/upLoadVideo/upLoadVideo?mip=1')
        }
    },
    isDetailFrameShow() {
        let that = this;
        this.setData({
            detailFrameShow: !that.data.detailFrameShow
        })
    },
    // 展开动画
    slide(even) {
        let index = even.currentTarget.dataset.index,
            slideQueue = this.data.slideQueue,
            animation1 = wx.createAnimation(),
            animation2 = wx.createAnimation(),
            that = this;

        if (slideQueue.includes(index)) {//已打开 -->  关闭
            animation1.height(0).step({ duration: 250 });
            animation2.rotate().step({ duration: 250 });
            // 关闭后移除队列
            let i = slideQueue.indexOf(index);
            slideQueue.splice(i, 1);
        } else {// 打开
            animation1.height('1150rpx').step({ duration: 250 });
            animation2.rotate(-180).step({ duration: 250 });
            // 展开后加入slideQueue
            slideQueue.push(index);
        }
        this.setData({
            slideDown: animation1.export(),
            arrowRotate: animation2.export(),
            slideIndex: index
        });
    },
})