const maconfig = require('../../utils/maconfig.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        module: '活动',
        redHeart: UrlBase + 'image/videoWall/redHeart.png',
        grayHeart: UrlBase + 'image/videoWall/grayHeart.png',
        share: UrlBase + 'image/videoPlay/share.png',
    },
    LoginEnabled: false,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        let that = this;
        app.privateShare({
            title: '我正在参加“耀出众 | Surface王者之战”，快来为我助力吧！',
            imageUrl: UrlBase + 'image/share/otherShare.png',
            path: 'pages/articleContent/articleContent?id=' + options.id
        });

        maconfig.getArticleContent(options.id)
            .then(res => {
                wx.hideLoading();
                that.setData({
                    timer: setTimeout(() => {
                        maconfig.uploadSee(options.id)//看此视频超过10s
                            .then(res => {
                                if (res.Status == 1) {
                                    wx.showToast({
                                        icon: 'none',
                                        title: res.Message
                                    })
                                }
                            })
                    }, 10000)
                })
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
        clearTimeout(this.data.timer);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        clearTimeout(this.data.timer);
    },

    /**
     *  分享
     */
    onShareAppMessage: function () {

    },
    laud: function (e) {
        let that = this,
            id = this.data.Id;
        maconfig.laud(id)
            .then(res => {
                if (res.Status == 1) { //点赞成功
                    let judge = /w/.test(that.data.PraiseCnt);
                    if (!judge) {
                        that.setData({
                            IsPraise: true,
                            PraiseCnt: ++that.data.PraiseCnt
                        })
                    } else {
                        that.setData({
                            IsPraise: true,
                        })
                    }
                    app.globalData.articlePraise = that.data.PraiseCnt;
                    app.globalData.articleIsPraise = that.data.IsPraise;
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.Message
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
})