const maconfig = require('../../utils/maconfig.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        module: '活动',
        background: UrlBase + 'image/personal/background2.jpg',
        buttonBg: UrlBase + 'image/personal/buttonBg.png',
        ruleBg: UrlBase + 'image/match/rule.png',
        close: UrlBase + 'image/match/close.png',
        ruleFrame: UrlBase + 'image/match/ruleFrame.png',
        line: UrlBase + 'image/match/line.png',
        list: [
            {
                icon: UrlBase + 'image/personal/icon04.png',
                text: '每日签到',
                url: '/pages/calendar/calendar'
            },
            {
                icon: UrlBase + 'image/personal/icon01.png',
                text: 'EZ 认证',
                url: '/pages/EZident/EZident'
            },
            {
                icon: UrlBase + 'image/personal/icon03.png',
                text: '抖音创意视频',
                url: '/pages/videoWall/videoWall'
            },
            {
                icon: UrlBase + 'image/personal/icon02.png',
                text: '微信文章 Show 精彩',
                url: '/pages/articleShow/articleShow'
            }
        ],
        place: '',
        color: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        let that = this;
        app.privateShare();
        Promise.all([maconfig.getTabBarData(app), maconfig.getPeopleRule()])
            .then(res => {
                that.data.rule.list2.forEach(item => {
                    if (item.color) {//需要变色项
                        that.setData({
                            color: item.color,
                            place: item.place
                        })
                    }
                })
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
    onShareAppMessage: function () {

    },
    ruleClose: function () {
        this.setData({
            showRuleFrame: false
        })
    },
    showRule: function () {
        this.setData({
            showRuleFrame: true
        })
    }
})