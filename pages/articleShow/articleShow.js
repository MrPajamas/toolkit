const maconfig = require('../../utils/maconfig.js')
const mabase = require('../../utils/mabase.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()

app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        module: '活动',
        background: mabase.UrlBase + 'image/articleShow/background.png',
        banner: mabase.UrlBase + 'image/articleShow/banner1.png',
        blueFrame: mabase.UrlBase + 'image/articleShow/blueFrame.png',
        redLaud: mabase.UrlBase + 'image/articleShow/redLaud.png',
        grayLaud: mabase.UrlBase + 'image/articleShow/grayLaud.png',
        button: mabase.UrlBase + 'image/question/invitation.png',
        redHeart: mabase.UrlBase + 'image/videoWall/redHeart.png',
        grayHeart: mabase.UrlBase + 'image/videoWall/grayHeart.png',

        rankUrl: '/pages/rank/rank',
        registerUrl: '/pages/register/register',

        pages: 1,
        empty: false
    },
    LoginEnabled: false,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        app.privateShare({
            path: 'pages/articleShow/articleShow',
            title: '我正在参加“耀出众 | Surface王者之战”，快来为我助力吧！',
            imageUrl: UrlBase + 'image/share/otherShare.png',
        });
        wx.showLoading({ mask: true });
        let that = this;
        Promise.all([maconfig.getArticleShowData(1, 7), maconfig.getTabBarData(app), maconfig.isRegister()])
            .then(res => {
                const { list, pageCount, pageIndex, pageSize, recordCount } = res[0].Data;
                if (list.length == 0) {//暂无数据
                    that.setData({
                        empty: true
                    })
                    wx.hideLoading();
                } else {
                    that.setData({
                        list, pageCount, pageIndex, pageSize, recordCount,
                        IsRegister: res[2].Data.IsRegister,
                        IsNews: res[2].Data.IsNews,
                        pages: 1
                    });
                    wx.hideLoading()
                }

            })
            .catch(err => {
                wx.hideLoading()
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
        wx.showLoading({ mask: true });
        let that = this;
        if (app.globalData.onlyOneArticle) {//刚上传过文章
            Promise.all([maconfig.getArticleShowData(1, 7), maconfig.getTabBarData(app), maconfig.isRegister()])
                .then(res => {
                    const { list, pageCount, pageIndex, pageSize, recordCount } = res[0].Data;
                    if (list.length == 0) {//暂无数据
                        that.setData({
                            empty: true
                        })
                        wx.hideLoading();
                    } else {
                        that.setData({
                            list, pageCount, pageIndex, pageSize, recordCount,
                            IsRegister: res[2].Data.IsRegister,
                            IsNews: res[2].Data.IsNews,
                            pages: 1,
                            empty:false //去除文字提示
                        });
                        wx.hideLoading()
                    }

                })
                .catch(err => {
                    wx.hideLoading()
                })
        } else {
            maconfig.isRegister()
                .then(res => {
                    that.setData({
                        IsRegister: res.Data.IsRegister,
                        IsNews: res.Data.IsNews,
                    });
                    if (that.data.targetId && app.globalData.articlePraise) {
                        that.data.list.forEach((item, index) => {
                            if (item.Id == that.data.targetId) {
                                let PraiseCnt = 'list[' + index + '].PraiseCnt';
                                let IsPraise = 'list[' + index + '].IsPraise';
                                that.setData({
                                    [PraiseCnt]: app.globalData.articlePraise,
                                    [IsPraise]: app.globalData.articleIsPraise,
                                    targetId:''
                                })
                                app.globalData.articlePraise = '';
                                app.globalData.articleIsPraise = '';
                            }
                        })
                    }

                    wx.hideLoading()
                })
                .catch(err => {
                    wx.hideLoading()
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    //点赞
    laud: function (e) {
        const id = e.currentTarget.dataset.id,
            index = e.currentTarget.dataset.index,
            that = this;
        maconfig.laud(id)
            .then(res => {
                if (res.Status == 1) { //点赞成功
                    let list2 = that.data.list;
                    list2[index].IsPraise = true;

                    let judge = /w/.test(list2[index].PraiseCnt);
                    if (!judge) {
                        list2[index].PraiseCnt++;
                    }
                    that.setData({
                        list: list2
                    })
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
    //我要上传按钮
    goUpLoadArticle: function () {
        maconfig.isRegister()
            .then(res => {
                if (!res.Data.IsRegister) { //如果未注册过,跳去注册
                    mabase.navigateTo('/pages/register/register')
                } else if (res.Data.IsNews) { //已上传过文章
                    wx.showToast({
                        icon: 'none',
                        title: '您已上传过文章'
                    })
                } else {
                    mabase.navigateTo('/pages/upLoadArticle/upLoadArticle')
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
    goArticleContent: function (e) {
        wx.showLoading({ mask: true });
        let id = e.currentTarget.dataset.id;
        this.setData({
            targetId: id,
        })
        mabase.navigateTo('/pages/articleContent/articleContent?id=' + id)
    },
    goRank: function () {
        wx.showLoading({ mask: true });
        maconfig.isRegister()
            .then(res => {
                if (!res.Data.IsRegister) { //如果未注册过,跳去注册
                    mabase.navigateTo('/pages/register/register')
                } else {
                    mabase.navigateTo('/pages/rank/rank')
                }
            })
    },
    getMore: function () {
        wx.showLoading({ mask: true });
        let that = this,
            list = this.data.list;
        maconfig.getArticleShowData((that.data.pages + 1), 7)
            .then(res => {
                let list2 = res.Data.list,
                index = res.Data.pageIndex;
                if (list2[0]) { //如果下一页还有数据
                    that.setData({
                        list: list.concat(list2),
                        pages: index
                    })
                    wx.hideLoading();
                } else { //没有了
                    wx.showToast({
                        title: '到底啦',
                        icon: 'none'
                    })
                }
            })
            .catch(err => {
                wx.hideLoading();
            })
    }
})