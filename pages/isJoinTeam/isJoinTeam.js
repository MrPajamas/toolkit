const maconfig = require('../../utils/maconfig.js')

const mabase = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        background: mabase.UrlBase + '/image/waitingTeam/background1.jpg',
        teamCreated: mabase.UrlBase + '/image/waitingTeam/teamCreated.png',
        certain: mabase.UrlBase + '/image/waitingTeam/certain.png',
        teamMemberBg: mabase.UrlBase + '/image/waitingTeam/teamMember.png',
        invitation: mabase.UrlBase + '/image/waitingTeam/invitation.png',
        unknown: mabase.UrlBase + '/image/waitingTeam/unknown.png',

        showTeamCreated: false,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({mask:true});
        this.setData({
            TeamId: options.teamId
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
        let that = this,
            TeamId = this.data.TeamId;
        wx.showLoading({mask:true});
        maconfig.isRegister()
            .then(res => {
                if (res.Data.IsRegister) {//判断用户是否绑定过，是的话留在当页
                    Promise.all([maconfig.getTabBarData(app), maconfig.getTeamData({ TeamId: TeamId })])
                        .then(res => {
                            if (res[1].Status < 0) {//如果此时目标队伍已经被解散,则跳去match页
                                return mabase.redirectTo('/pages/match/match')
                            }
                            if (res[1].Data.IsJoin) {//如果用户已经有了一个队伍，直接跳去wartingTeam页面
                                return mabase.redirectTo('/pages/waitingTeam/waitingTeam')
                            }
                            //战队信息
                            let { Integral, TeamId, TeamName, list, IsQuit, IsDissolve, operation, IsJoin } = res[1].Data;
                            //如果不足三人,就补充到3人为止
                            let len = list.length;
                            for (let i = len; i < 3; i++) {
                                list.push({
                                    AvataUrl: that.data.unknown,
                                })
                            }
                            that.setData({ Integral, TeamId, TeamName, list, IsQuit, IsDissolve, operation, IsJoin });
                            wx.hideLoading();
                        })
                        .catch(err => {
                            wx.hideLoading();
                        })
                } else {//未注册过，跳去注册
                    mabase.navigateTo('/pages/register/register')
                }
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

    joinTeam: function () {
        wx.showLoading({ mask: true });
        let that = this;
        maconfig.joinTeam({ TeamId: that.data.TeamId })
            .then(res => {
                if (res.Status == 1) {//加入成功
                    wx.showToast({
                        title: '加入成功',
                        mask: true
                    })
                    setTimeout(() => {
                        mabase.redirectTo('/pages/waitingTeam/waitingTeam')
                    }, 1500)
                } else {//加入失败
                    wx.showToast({
                        title: res.Message
                    })
                    setTimeout(() => {
                        mabase.redirectTo('/pages/match/match')
                    }, 1500)
                }
            })
            .catch(err => {
                mabase.redirectTo('/pages/match/match')
            })
    }
})