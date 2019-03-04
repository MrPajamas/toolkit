const maconfig = require('../../utils/maconfig.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()

app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        module: '活动',
        background: UrlBase + 'image/question/background.jpg',
        lightFrame: UrlBase + 'image/question/lightFrame.png',
        titleIcon: UrlBase + 'image/question/titleIcon.png',
        square: UrlBase + 'image/question/square1.png',
        correct: UrlBase + 'image/question/correct1.png',
        incorrect: UrlBase + 'image/question/incorrect1.png',
        submit: UrlBase + 'image/question/invitation.png',
        fTrue: UrlBase + 'image/question/true.png',
        fFalse: UrlBase + 'image/question/false.png',
        certain: UrlBase + 'image/question/certain.png',

        //是否今日答过题
        answered: false,

        selectIndex: -1,
        //弹窗
        trueFrame: false,
        falseFrame: false,

        //正确弹窗内容
        trueFrameContent: '',
        falseFrameContent: '',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        app.privateShare();
        let that = this;
        Promise.all([maconfig.getTabBarData(app), maconfig.getQuestion()])
            .then(res => {
                const { BtnTxt, QuestionId, Tips, Title, listAnswer, weekFailCnt, weekWinCnt, rightAnswerContext, rigthAnswer,rigthRemark } = res[1].Data;
                //判断今日是否答过题
                let answered = res[1].Data.listAnswer.some(item => {
                    return item.IsRightKey == true
                })
                that.setData({
                    answered, BtnTxt, QuestionId, Tips, Title, listAnswer, weekFailCnt, weekWinCnt,rigthRemark,
                    rightAnswerContext: rightAnswerContext || '',
                    rigthAnswer: rigthAnswer || ''
                })

                wx.hideLoading()
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
    // 选择答案
    selectAnswer: function (e) {
        console.log(e);
        this.setData({
            selectIndex: e.currentTarget.dataset.index,
            Id: e.currentTarget.dataset.id
        })
    },
    // 提交答案
    submit: function (e) {
        console.log(e);
        wx.showLoading({ mask: true });
        let that = this;
        maconfig.submitAnswer({ AnswerId: that.data.Id })
            .then(res => {
                if (res.Status == 1) {//回答正确
                    wx.hideLoading();
                    const { BtnTxt, Title } = res.Data;
                    that.setData({
                        trueFrame: !that.data.trueFrame,
                        trueFrameContent: { BtnTxt, Title }
                    })
                } else if (res.Status == -1) {//回答错误
                    wx.hideLoading();
                    const { BtnTxt, Title, list } = res.Data;
                    that.setData({
                        falseFrame: !that.data.falseFrame,
                        falseFrameContent: { BtnTxt, Title, list }
                    })
                } else {//提交失败 答过题了
                    wx.hideLoading();
                    console.log("提交失败");
                }
            })
    },
    iKnow: function () {
        wx.showLoading({ mask: true });
        let that = this;
        maconfig.getQuestion()
            .then(res => {
                const { BtnTxt, QuestionId, Tips, Title, listAnswer, weekFailCnt, weekWinCnt, rigthAnswer, rightAnswerContext,rigthRemark } = res.Data;
                //判断今日是否答过题
                let answered = res.Data.listAnswer.some(item => {
                    return item.IsRightKey == true
                })
                that.setData({
                    answered, BtnTxt, QuestionId, Tips, Title, listAnswer, weekFailCnt, weekWinCnt, rigthAnswer, rightAnswerContext,rigthRemark,
                    trueFrame: false,
                    falseFrame: false
                })
                wx.hideLoading()
            })
            .catch(err => {
                wx.hideLoading()
            })
    }
})