const maconfig = require('../../utils/maconfig.js');//  引入公共接口
const app = getApp()
const mabase = require('../../utils/mabase.js')
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        background: '/images/activity/background.jpg',
        team: {
            bg: '/images/activity/team.png',
            title: '王者战队赛'
        },
        self: {
            bg: '/images/activity/self.png',
            title: '荣耀个人赛'
        },
        rank: {
            bg: '/images/activity/rank.png',
            title: '查看排行榜'
        },
        teamFrame: {
            createTeamFrame: '/images/activity/createTeamFrame.png',
            title: '输入战队名称',
            text: '* 中英文字符均可，5 个汉字以内',
            certain: '/images/activity/certain.png'
        },

        showCreateTeamFrame: false,
        teamName: '',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        app.privateShare();
        maconfig.getTabBarData(app)
            .then(res => {
                wx.hideLoading()

                return maconfig.getTeamData()

            })
            .then(data => {
                console.log(data);
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    //创建战队弹窗
    teamMatch: function () {
        this.setData({
            showCreateTeamFrame: true
        })
    },
    //获取战队名称
    getTeamName: function (e) {
        this.setData({
            teamName: e.detail.value
        })
    },
    //创建战队
    teamCertain: function () {
        const name = this.data.teamName.trim();

        maconfig.createTeam(name)
            .then(res => {
                console.log(res);
                if (res.Status == 1) {//创建队伍成功
                  mabase.navigateTo('/pages/waitingTeam/waitingTeam')
                }
            })
    }
})