const maconfig = require('../../utils/maconfig.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()

app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        whiteHeart: UrlBase + 'image/videoPlay/whiteHeart.png',
        redHeart: UrlBase + 'image/videoPlay/redHeart.png',
        share: UrlBase + 'image/videoPlay/whiteShare.png',
    },
    LoginEnabled: false,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let {
            fileurl,
            douyinid,
            title,
            praisecnt,
            id,
            ispraise
        } = options;
        if (ispraise == 'true') {
            ispraise = true
        } else {
            ispraise = false
        }
        this.setData({
            fileurl,
            douyinid,
            title,
            praisecnt,
            id,
            ispraise
        })
        app.privateShare({
            path: 'pages/videoPlay/videoPlay?title=' + title + '&fileurl=' + fileurl + '&douyinid=' + douyinid + '&praisecnt=' + praisecnt + '&id=' + id + '&ispraise=' + ispraise,
            title: '我正在参加“耀出众 | Surface王者之战”，快来为我助力吧！',
            imageUrl: UrlBase + 'image/share/otherShare.png',
        });
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
    onShareAppMessage: function () {

    },
    laud: function (e) {
        let that = this,
            id = this.data.id;
        maconfig.laud(id)
            .then(res => {
                if (res.Status == 1) { //点赞成功
                    let judge = /w/.test(that.data.praisecnt);
                    if (!judge) {
                        that.setData({
                            ispraise: true,
                            praisecnt: ++that.data.praisecnt
                        })
                    } else {
                        that.setData({
                            ispraise: true,
                        })
                    }
                    app.globalData.videoPraise = that.data.praisecnt;
                    app.globalData.videoIsPraise = that.data.ispraise;
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
    videoStart: function (e) {
        let id = this.data.id;
        this.setData({
            timer: setTimeout(() => {
                maconfig.uploadSee(id)//看此视频超过10s
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
    }
})