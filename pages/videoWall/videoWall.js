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
        module: '活动',
        background: UrlBase + 'image/videoWall/background.png',
        banner: UrlBase + 'image/videoWall/banner1.png',
        videoFrame: UrlBase + 'image/videoWall/videoFrame.png',
        a: UrlBase + 'image/videoWall/a.jpg',
        redHeart: UrlBase + 'image/videoWall/redHeart.png',
        grayHeart: UrlBase + 'image/videoWall/grayHeart.png',
        play: UrlBase + 'image/videoWall/play.png',
        button: UrlBase + 'image/question/invitation.png',
        shadow: UrlBase + 'image/videoWall/shadow.png',

        rankUrl: '/pages/rank/rank',
        uploadUrl: '/pages/rank/rank',
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
            path: 'pages/videoWall/videoWall',
            imageUrl: UrlBase + 'image/share/otherShare.png',
            title: '我正在参加“耀出众 | Surface王者之战”，快来为我助力吧！'
        });
        let that = this;
        Promise.all([maconfig.getTabBarData(app), maconfig.getVideoWallData(1, 6), maconfig.isRegister()])
            .then(res => {
                const { list, pageCount, pageIndex, pageSize, recordCount } = res[1].Data;
                if (list.length == 0) {//暂无数据
                    that.setData({
                        empty: true
                    })
                    wx.hideLoading();
                } else {
                    that.setData({
                        list, pageCount, pageIndex, pageSize, recordCount,
                        IsRegister: res[2].Data.IsRegister,
                        IsVideo: res[2].Data.IsVideo,
                        pages: 1
                    });
                    wx.hideLoading();
                }

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
        wx.showLoading({ mask: true });
        let that = this;
        if (app.globalData.onlyOne) {//刚上传过视频
            app.globalData.onlyOne = false;
            Promise.all([maconfig.getTabBarData(app), maconfig.getVideoWallData(1, 6), maconfig.isRegister()])
                .then(res => {
                    const { list, pageCount, pageIndex, pageSize, recordCount } = res[1].Data;
                    if (list.length == 0) {//暂无数据
                        that.setData({
                            empty: true
                        })
                        wx.hideLoading();
                    } else {
                        that.setData({
                            list, pageCount, pageIndex, pageSize, recordCount,
                            IsRegister: res[2].Data.IsRegister,
                            IsVideo: res[2].Data.IsVideo,
                            pages: 1,
                            empty: false //去除文字提示
                        });
                        wx.hideLoading();
                    }
                })
                .catch(err => {
                    wx.hideLoading();
                })
        } else {
            maconfig.isRegister()
                .then(res => {
                    that.setData({
                        IsRegister: res.Data.IsRegister,
                        IsVideo: res.Data.IsVideo
                    });
                    // 更新点赞
                    if (!!that.data.targetId && !!app.globalData.videoPraise) {
                        that.data.list.forEach(function (item, index) {
                            if (item.Id == that.data.targetId) {
                                let PraiseCnt = 'list[' + index + '].PraiseCnt';
                                let IsPraise = 'list[' + index + '].IsPraise';
                                that.setData({
                                    [PraiseCnt]: app.globalData.videoPraise,
                                    [IsPraise]: app.globalData.videoIsPraise,
                                    targetId: ''
                                })
                                app.globalData.videoPraise = '';
                                app.globalData.videoIsPraise = '';
                            }
                        })
                    }
                    wx.hideLoading();
                })
                .catch(err => {
                    wx.hideLoading();
                });
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
    onShareAppMessage: function () {

    },
    //点赞
    laud: function (e) {
        let that = this;
        const id = e.currentTarget.dataset.id,
            index = e.currentTarget.dataset.index;
        maconfig.laud(id)
            .then(res => {
                if (res.Status == 1) {//点赞成功
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
    goRank: function () {
        wx.showLoading({ mask: true })
        maconfig.isRegister()
            .then(res => {
                if (!res.Data.IsRegister) {//如果未注册过,跳去注册
                    mabase.navigateTo('/pages/register/register')
                } else {
                    mabase.navigateTo('/pages/rank/rank')
                }
            })
    },
    goUpLoadVideo: function () {
        wx.showLoading({ mask: true });
        maconfig.isRegister()
            .then(res => {
                let IsRegister = res.Data.IsRegister;
                ways.goUpLoadVideoPage(IsRegister, mabase);
            })
            .catch(err => {
                wx.hideLoading();
            })
    },
    goVideoPlay: function (e) {
        wx.showLoading({ mask: true });
        let title = e.currentTarget.dataset.title,
            fileurl = e.currentTarget.dataset.fileurl,
            douyinid = e.currentTarget.dataset.douyinid,
            praisecnt = e.currentTarget.dataset.praisecnt,
            id = e.currentTarget.dataset.id,
            ispraise = e.currentTarget.dataset.ispraise;
        this.setData({
            targetId: id,
        })
        mabase.navigateTo('/pages/videoPlay/videoPlay?title=' + title + '&fileurl=' + fileurl + '&douyinid=' + douyinid + '&praisecnt=' + praisecnt + '&id=' + id + '&ispraise=' + ispraise)
    },
    getMore: function () {
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
    }
})