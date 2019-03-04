const maconfig = require('../../utils/maconfig.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        background: UrlBase + '/image/rank/background.jpg',
        button: UrlBase + '/image/rank/button.png',
        selectButton: UrlBase + '/image/rank/selectButton.png',
        frame: UrlBase + '/image/rank/frame.png',
        Medal: UrlBase + '/image/rank/Medal.png',
        personalIcon: UrlBase + '/image/rank/personalIcon.png',
        v: UrlBase + '/image/rank/v.png',
        circle: UrlBase + '/image/rank/circle.png',
        line: UrlBase + '/image/rank/line.png',
        unknown: UrlBase + '/image/waitingTeam/unknown.png',

        teamShow: true,
        //组队页码
        pages: 1,
        // 个人页码
        personalPages: 1,
        //是否可以出发滚动加载
        isScrollBind: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        app.privateShare();
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
        this.setData({
            pages: 1,
            personalPages: 1
        });
        let that = this;
        Promise.all([
            maconfig.getTabBarData(app),
            maconfig.getRankData(),
            maconfig.getMoreTeamList(1, 6),
            maconfig.getMorePersonalList(1, 6)
        ])
            .then(res => {
                const teamList = res[2].Data.list,
                    personalList = res[3].Data.list;
                that.setData({
                    teamList,
                    personalList
                })
                wx.hideLoading();
            })
            .catch(err => {
                wx.hideLoading()
            })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({
            pages: 1,
            personalPages: 1,
            teamList: '',
            personalList: ''
        })
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
    teamShow: function () {
        this.setData({
            teamShow: true
        })
    },
    personalShow: function () {
        this.setData({
            teamShow: false
        })
    },
    getMore: function () {
        wx.showLoading({ mask: true });
        let that = this,
            teamList = this.data.teamList;
        maconfig.getMoreTeamList((that.data.pages + 1), 6)
            .then(res => {
                let list = res.Data.list,
                index = res.Data.pageIndex;
                if (list[0]) {//如果下一页还有数据
                    that.setData({
                        teamList: teamList.concat(list),
                        pages: index,
                    });
                    wx.hideLoading();
                } else {//没有了
                    wx.showToast({
                        title: '到底啦',
                        icon: 'none'
                    });
                }
            })
            .catch(err => {
                wx.hideLoading();
            })
    },
    getMorePersonal: function () {
        wx.showLoading({ mask: true });
        let that = this,
            personalList = this.data.personalList;

        maconfig.getMorePersonalList((that.data.personalPages + 1), 6)
            .then(res => {
                let list = res.Data.list,
                    index = res.Data.pageIndex
                if (list[0]) {//如果下一页还有数据
                    that.setData({
                        personalList: personalList.concat(list),
                        personalPages: index
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
    },
})