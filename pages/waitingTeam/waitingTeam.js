const maconfig = require('../../utils/maconfig.js')
const mabase = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        module: '活动',
        background: mabase.UrlBase + '/image/waitingTeam/background1.jpg',
        teamCreated: mabase.UrlBase + '/image/waitingTeam/teamCreated.png',
        certain: mabase.UrlBase + '/image/waitingTeam/certain.png',
        teamMemberBg: mabase.UrlBase + '/image/waitingTeam/teamMember.png',
        invitation: mabase.UrlBase + '/image/waitingTeam/button2.png',
        unknown: mabase.UrlBase + '/image/waitingTeam/unknown.png',

        ruleBg: mabase.UrlBase + '/image/match/rule.png',
        close: mabase.UrlBase + '/image/match/close.png',
        ruleFrame: mabase.UrlBase + '/image/match/ruleFrame.png',
        line: mabase.UrlBase + '/image/match/line.png',

        showTeamCreated: false,
        GoRank: '/pages/rank/rank',
        goFight: '/pages/question/question',
        //定时器
        timer: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        maconfig.getTeamRule()
            .then(res => {

            })
            .catch(err => {
                console.log(err);
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

        Promise.all([maconfig.getTabBarData(app), maconfig.getTeamData()])//tabbat,数据
            .then(res => {
                //战队信息
                let { Integral, TeamId, TeamName, list, IsQuit, IsDissolve, operation } = res[1].Data;
                //如果不足三人,就补充到3人为止
                for (let i = list.length; i < 3; i++) {
                    list.push({
                        AvataUrl: that.data.unknown,
                    })
                }
                that.setData({ Integral, TeamId, TeamName, list, IsQuit, IsDissolve, operation });
                return maconfig.inviteFriend(that.data.TeamId)//分享 
            })
            .then(res => {
                that.setData({
                    timer: setInterval(() => {//实时刷新
                        maconfig.getTeamData()
                            .then(res => {

                                if (res.Status == 1) {//有队伍
                                    //战队信息
                                    let { Integral, TeamId, TeamName, list, IsQuit, IsDissolve, operation } = res.Data;
                                    //如果不足三人,就补充到3人为止
                                    for (let i = list.length; i < 3; i++) {
                                        list.push({
                                            AvataUrl: that.data.unknown,
                                        })
                                    }
                                    that.setData({ Integral, TeamId, TeamName, list, IsQuit, IsDissolve, operation });

                                    let isFull = list.every(item => {//判断队伍是否满了
                                        return item.TrueName
                                    })
                                    if (isFull && (res.Data.operation == 2)) {//如果队伍已经满了  就停止定时器,并刷新页面

                                        clearInterval(that.data.timer);

                                        mabase.redirectTo('/pages/waitingTeam/waitingTeam');
                                    }
                                } else {//队伍已被解散  队员都变成无队伍状态
                                    clearInterval(that.data.timer);

                                    mabase.redirectTo('/pages/match/match');
                                }

                            })
                    }, 3000)
                })
                wx.hideLoading();
            })
            .catch(err => {
                wx.hideLoading();
            })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        clearInterval(this.data.timer);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        clearInterval(this.data.timer);
    },

    onShareAppMessage: function () {
        let data = this.data;
        return {
            path: data.path,
            title: data.title,
            imageUrl: data.imageUrl
        }

    },
    closeTeamCreated: function () {
        maconfig.getTeamData()
            .then(res => {
                const { Integral, TeamId, TeamName, list, IsQuit, IsDissolve, operation } = res.Data;

                this.setData({
                    showTeamCreated: false,
                    Integral, TeamId, TeamName, list, IsQuit, IsDissolve, operation
                })
            })

    },
    //解散或退出
    doq: function () {
        if (this.data.IsDissolve) {//解散按钮
            maconfig.dissolveTeam()
                .then(res => {
                    if (res.Status == 1) {
                        dissolveOrQuit('已解散战队');
                    }
                })
        } else {//退出按钮
            maconfig.quitTeam()
                .then(res => {
                    if (res.Status == 1) {
                        dissolveOrQuit('已退出战队');
                    }
                })
        }

        function dissolveOrQuit(title) {
            return new Promise(resolve => {
                wx.showToast({
                    title: title
                })
                setTimeout(() => {
                    resolve()
                }, 1500)
            })
                .then(res => {
                    mabase.redirectTo('/pages/match/match')
                })
        }
    },
    //确认组队
    confirmTeam: function () {
        let that = this;
        maconfig.confirmTeam({ TeamId: that.data.TeamId })
            .then(res => {
                if (res.Status == 1) {//组建队伍成功
                    that.setData({
                        showTeamCreated: true
                    })
                } else {//组建失败 或 已被其他队员点击组建
                    mabase.redirectTo('/pages/waitingTeam/waitingTeam')
                }
            })
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