const maconfig = require('../../utils/maconfig.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        module: '活动',
        background: UrlBase + 'image/EZident/background.jpg',
        frame: UrlBase + 'image/EZident/frame.png',
        buttonFrame: UrlBase + 'image/EZident/buttonFrame.png',
        identBg: UrlBase + 'image/EZident/identBg.png',
        add: UrlBase + 'image/EZident/add.png',

        getFocus: false,

        email: '',
        FileUrl: '（从相册选择）',
        EZP: '（输入 EZ 网站登录邮箱）',
        FileUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        app.privateShare();
        Promise.all([maconfig.getTabBarData(app), maconfig.isRegister()])
            .then(res => {
                if (res[1].Data.IsEz) {//如果已经认证过
                    wx.hideLoading();
                    wx.showToast({
                        title: '您已认证过',
                        mask: true
                    })
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                        }, 1500)
                    }).then(res => {
                        wx.navigateBack({
                            delta: 1
                        })
                    })
                } else {
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
    focusEmain: function (e) {
        this.setData({
            getFocus: true
        })
    },
    emailChange: function (e) {
        let email = e.detail.value;
        this.setData({ email });
    },
    chooseImage: function () {
        let that = this;
        wx.chooseImage({
            count: 1,
            sourceType: ['album'],
            sizeType: ['original'],
            success(res) {
                wx.showLoading({ mask: true });
                maconfig.upLoadFiles(4, res.tempFilePaths[0])
                    .then(res => {
                        if (res.Status == 1) {
                            that.setData({
                                FileUrl: res.FileUrl
                            })
                            wx.hideLoading();
                        } else {
                            wx.showToast({
                                icon: 'none',
                                title: res.Message,
                                mask: true
                            })
                        }
                    })
                    .catch(err => {
                        wx.hideLoading();
                    })
            }
        })
    },
    //立即上传
    submit: function () {
        let reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$"),
            FileUrl = this.data.FileUrl,
            email = this.data.email,
            that = this;
        if (email == '') {//请您输入邮箱
            wx.showToast({
                icon: 'none',
                title: '请输入邮箱',
                mask: true
            })
        } else if (!reg.test(email)) {//邮箱格式有误
            wx.showToast({
                icon: 'none',
                title: '邮箱格式有误',
                mask: true
            })
        } else if (!FileUrl) {
            wx.showToast({
                icon: 'none',
                title: '请选择图片',
                mask: true
            })
        } else {//通过校验
            wx.showLoading({ mask: true });
            maconfig.uploadEz(email, FileUrl)
                .then(res => {
                    wx.hideLoading();
                    if (res.Status == 1) {//上传成功
                        wx.showToast({
                            title: '上传成功',
                            mask: true,
                            duration: 1500
                        })
                        setTimeout(() => {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 1500)
                    } else {//上传失败
                        wx.showToast({
                            icon: 'none',
                            title: res.Message,
                            mask: true,
                            duration: 1500
                        })
                    }
                })
                .catch(err => {
                    wx.showToast({
                        icon: 'none',
                        title: res.Message,
                        mask: true,
                        duration: 1500
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1500)
                })
        }
    }
})