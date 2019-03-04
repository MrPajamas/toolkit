const maconfig = require('../../utils/maconfig.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        module: '我的',
        banner: UrlBase + 'image/calendar/blue.jpg',
        signInIcon: UrlBase + 'image/calendar/signInIcon.png',
        red: UrlBase + 'image/calendar/red.png',
        arrow: UrlBase + 'image/study/arrow.png',
        close: UrlBase + '/image/match/close.png',

        checkFrame: UrlBase + 'image/calendar/checkFrame.png',
        checkFrameShow: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        app.privateShare();
        let that = this;

        //先签到
        maconfig.checkIn()
            .then(res => {
                if ((res.Status == 1) && res.Data.title) {//今日签到成功
                    const { title: Atitle, txt1: Atxt1, txt2: Atxt2, txt3: Atxt3} = res.Data;
                    that.setData({
                        Atitle, Atxt1, Atxt2, Atxt3, 
                        checkFrameShow: true
                    });
                } else if (res.Status == 1) {
                    that.setData({
                        checkFrameShow: true
                    });
                }
                return Promise.all([maconfig.getTabBarData(app), maconfig.getCalenda(),])
            })
            .then(res => {
                const { YearMouth, StartWeek, list, Week, tips, title, txt1, txt2, txt3,txt4, icon, CheckInTotalDay } = res[1].Data;
                //日历处理
                let list2 = list.map(item => {
                    if (item == "签") {
                        return false
                    } else {
                        return item
                    }
                })
                //inexistent
                let inexistentList = [];
                if (StartWeek != 0) {
                    for (let i = 0; i < StartWeek; i++) {
                        inexistentList.push(0);
                    }
                }
                let year = new Date().getFullYear(),
                    month = new Date().getMonth() + 1;
                that.setData({ YearMouth, StartWeek, list2, inexistentList, Week, tips, year, month, title, txt1, txt2, txt3, txt4,icon, CheckInTotalDay });
                wx.hideLoading();
            })
            .catch(err => {
                wx.hideLoading();
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
     *  分享
     */
    onShareAppMessage: function () {

    },
    close: function () {
        this.setData({
            checkFrameShow: false
        })
    },
    checkFrameShowClose: function () {
        this.setData({
            checkFrameShow: false
        })
    },
    // 上个月
    pre: function () {
        wx.showLoading({ mask: true });
        let year = this.data.year,
            month = this.data.month,
            that = this,
            targetDate;
        if ((month - 1) != 0) {//上个月  不是0
            targetDate = year + '-' + (month - 1) + '-' + 15;
            that.setData({
                year: year,
                month: --month
            })
        } else {//上一个月为0
            targetDate = (year - 1) + '-' + '12-' + 15;
            that.setData({
                year: --year,
                month: 12
            })
        }
        calenda(that, targetDate);
    },
    // 下个月
    next: function () {
        wx.showLoading({ mask: true });
        let year = this.data.year,
            month = this.data.month,
            that = this,
            targetDate;
        if ((month + 1) != 13) {//下个月不是13
            targetDate = year + '-' + (month + 1) + '-' + 15;
            that.setData({
                year: year,
                month: ++month
            })
        } else {//下一个月为13
            targetDate = (year + 1) + '-' + '1-' + 15;
            that.setData({
                year: ++year,
                month: 1
            })
        }
        calenda(that, targetDate);
    },
})
// 获取日历
function calenda(that, targetDate) {
    maconfig.getCalenda(targetDate)
        .then(res => {
            //日历处理
            const { list, YearMouth, StartWeek } = res.Data;
            let list2 = list.map(item => {
                if (item == "签") {
                    return false
                } else {
                    return item
                }
            })
            //inexistent
            let inexistentList = [];
            if (StartWeek != 0) {
                for (let i = 0; i < StartWeek; i++) {
                    inexistentList.push(0);
                }
            }
            that.setData({ list2, YearMouth, inexistentList });
            wx.hideLoading();
        })
}


