const maconfig = require('../../utils/maconfig.js')

const mabase = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        module: '我的',
        background: mabase.UrlBase + 'image/articleShow/background.jpg',
        blueFrame: mabase.UrlBase + 'image/articleShow/blueFrame.png',
        redLaud: mabase.UrlBase + 'image/articleShow/redLaud.png',
        grayLaud: mabase.UrlBase + 'image/articleShow/grayLaud.png',
        button: mabase.UrlBase + 'image/question/invitation.png',


        bigIcon: mabase.UrlBase + '/image/myActivities/bigIcon.png',
        studyIcon: mabase.UrlBase + '/image/myActivities/studyIcon.png',

        background: mabase.UrlBase + 'image/videoWall/background.jpg',
        videoFrame: mabase.UrlBase + '/image/myActivities/videoFrame.png',
        a: mabase.UrlBase + 'image/videoWall/a.jpg',

        redHeart: mabase.UrlBase + 'image/videoWall/redHeart.png',
        grayHeart: mabase.UrlBase + 'image/videoWall/grayHeart.png',

        play: mabase.UrlBase + 'image/videoWall/play.png',
        button: mabase.UrlBase + 'image/question/invitation.png',


        buttonBg: mabase.UrlBase + 'image/personal/buttonBg.png',
        isEmpty: false,

        change: mabase.UrlBase + 'image/myActivities/change.png',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
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
        let data = this.data,
            that = this;
        Promise.all([maconfig.getTabBarData(app), maconfig.getMyActivitiesData()])
            .then(res => {
                if (!data.news.Title && !data.ez.Id && !data.douYin.TrueName) {
                    that.setData({
                        isEmpty: true
                    })
                }
                wx.hideLoading();
            })
            .catch(err => {
                wx.hideLoading()
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
    goArticleContent: function (e) {
        wx.showLoading({ mask: true });
        let id = e.currentTarget.dataset.id;
        mabase.navigateTo('/pages/articleContent/articleContent?id=' + id )
    },
    goVideoPlay: function (e) {
        wx.showLoading({ mask: true });
        let title = e.currentTarget.dataset.title,
            fileurl = e.currentTarget.dataset.fileurl,
            douyinid = e.currentTarget.dataset.douyinid,
            praisecnt = e.currentTarget.dataset.praisecnt,
            id = e.currentTarget.dataset.id,
            ispraise = e.currentTarget.dataset.ispraise;
        mabase.navigateTo('/pages/videoPlay/videoPlay?title=' + title + '&fileurl=' + fileurl + '&douyinid=' + douyinid + '&praisecnt=' + praisecnt + '&id=' + id + '&ispraise=' + ispraise)
    },
    previewImage: function () {
        let img = this.data.ez.FileUrl;
        wx.previewImage({
            current: img, // 当前显示图片的http链接
            urls: [img] // 需要预览的图片http链接列表
        })
    },
    videoChange: function (e) {
        wx.showLoading({ mask: true });
        let id = e.currentTarget.dataset.id;

        mabase.navigateTo('/pages/upLoadVideo/upLoadVideo?id=' + id)
    },
    articleChange: function (e) {
        wx.showLoading({ mask: true });
        let id = e.currentTarget.dataset.id;

        mabase.navigateTo('/pages/upLoadArticle/upLoadArticle?id=' + id)
    }
})