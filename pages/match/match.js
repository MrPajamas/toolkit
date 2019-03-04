const maconfig = require('../../utils/maconfig.js')
const mabase = require('../../utils/mabase.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        showCreateTeamFrame: false,
        showRuleFrame: false,
        teamName: '',
        selfUrl: '/pages/personal/personal',
        goRank: '/pages/rank/rank',
        close: mabase.UrlBase + '/image/match/close.png',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        app.privateShare({
            imageUrl: UrlBase + 'image/share/otherShare.png',
            title: '我正在参加“耀出众 | Surface王者之战”，快来为我助力吧！'
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
        wx.showLoading({ mask: true });
        Promise.all([maconfig.getMatchData(), maconfig.getTabBarData(app)])
            .then(res => {
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
    //点击战队赛
    teamMatch: function () {
        wx.showLoading({ mask: true });
        if (this.data.IsTeam) {//如果已创建过战队,跳去waitingTeam页
            mabase.navigateTo('/pages/waitingTeam/waitingTeam');
        } else {//如果未创建,则弹出框
            this.setData({
                showCreateTeamFrame: true
            })
            wx.hideLoading();
        }
    },
    //获取战队名称
    getTeamName: function (e) {
        this.setData({
            teamName: e.detail.value
        })
    },
    //创建战队
    teamCertain: function () {
        wx.showLoading({ mask: true });
        let name = this.data.teamName.trim(),
            that = this;
        maconfig.createTeam(name)
            .then(res => {
                if (res.Status == 1) {//创建队伍成功
                    that.setData({
                        showCreateTeamFrame: false,
                        name: ''
                    })
                    mabase.navigateTo('/pages/waitingTeam/waitingTeam');
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
    close: function () {
        this.setData({
            showCreateTeamFrame: false,
            teamName: ''
        })
    },

})