const maconfig = require('../../utils/maconfig.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        list: [
            {
                icon: UrlBase + 'image/upLoadArticle/icon01.png',
                title: '标题：'
            },
            {
                icon: UrlBase + 'image/upLoadArticle/icon02.png',
                title: '正文：(请不要少于 100 个字符)'
            },
        ],
        focus: false,

        confirmFrameShow: false,
        confirmFrame: UrlBase + 'image/upLoadVideo/confirmFrame.png',
        yesOrNo: UrlBase + 'image/upLoadVideo/yesOrNo.png',
        close: UrlBase + '/image/match/close.png',
        confirmFrame_content1: '',
        confirmFrame_content2: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        app.privateShare();
        let that = this;
        if (options.id) {//修改
            Promise.all([maconfig.getArticleContent(options.id), maconfig.getTabBarData(app)])
                .then(res => {
                    let { Title, Context } = res[0].Data;
                    that.setData({
                        changeOr: '确认更改',
                        title: Title,
                        content: Context,
                        options
                    })
                    wx.hideLoading();
                })
        } else {//上传
            maconfig.getTabBarData(app)
                .then(res => {
                    that.setData({
                        changeOr: '立即上传',
                    })
                    wx.hideLoading();
                })
                .catch(err => {
                    wx.hideLoading();
                })
        }
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
    titleChange: function (e) {
        this.setData({
            title: e.detail.value
        })
    },
    contentChange: function (e) {
        this.setData({
            content: e.detail.value
        })
    },
    yes: function () {
        let data = this.data,
            that = this,
            title = data.title,
            content = data.content;
        this.setData({
            confirmFrameShow: false,
        })
        up(title, content)
    },
    cancle: function () {
        this.setData({
            confirmFrameShow: false
        })
    },
    //立即上传
    upLoadVideo: function () {
        let data = this.data,
            that = this,
            title = data.title,
            content = data.content;
        //校验
        if (!title) {
            wx.showToast({
                icon: 'none',
                title: '请填写标题'
            })
        } else if (!content) {
            wx.showToast({
                icon: 'none',
                title: '请填写文章内容'
            })
        } else if (data.options && data.options.id) {//通过校验，修改
            wx.hideLoading();
            that.setData({
                confirmFrameShow: true,
                confirmFrame_content1: '您正在更新文章信息，',
                confirmFrame_content2: '请确认是否更新？'
            })
        } else {//第一次上传
            up(title, content);
        }
    },
    autoFocus: function () {
        let confirmFrameShow = data.confirmFrameShow;
        console.log(confirmFrameShow);
        // this.setData({ focus: true });
    }
})


function up(title, content) {
    wx.showLoading({ mask: true, title: '上传中' });
    maconfig.uploadNews(title, content)
        .then(res => {
            if (res.Status == 1) {//上传成功
                wx.showToast({
                    title: res.Message,
                    mask: true
                })
                app.globalData.onlyOneArticle = true;//刚上传视频后，视频墙重新加载数据
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1500)
            } else {
                wx.hideLoading();
                wx.showToast({
                    icon: 'none',
                    title: res.Message
                })
            }
        })
        .catch(err => {
            wx.hideLoading();
            console.log(err);
        })
}