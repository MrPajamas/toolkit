const maconfig = require('../../utils/maconfig.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        title: UrlBase + 'image/register/title.png',
        arrow: UrlBase + 'image/register/arrow.png',
        Ttrue: UrlBase + 'image/register/true.png',
        Tfalse: UrlBase + 'image/register/false.png',

        name: '',
        tel: '',
        privacy: false,

        store: '',


        nameDisable: false,
        telDisable: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        maconfig.getRegisterData()
            .then(res => {
                wx.hideLoading();
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
    getStore: function () {
        wx.showLoading({ mask: true });
        let data = this.data,
            that = this;
        if (!data.name) {
            wx.showToast({
                title: '请填写您的姓名',
                icon: 'none'
            })
        } else if (!data.tel) {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none'
            })
        }
        else if (!/^\d{11}$/.test(data.tel - 0)) {
            wx.showToast({
                title: '手机号格式有误',
                icon: 'none'
            })
        } else if (!data.privacy) {//未同意隐私
            wx.showToast({
                title: '为保护您的隐私，请同意后进行登录',
                icon: 'none'
            })
        } else {//通过校验  
            maconfig.getStore(data.name, data.tel + "")
                .then(res => {
                    if (res.Status == 1) {//成功
                        that.setData({
                            store: res.Data.Store,
                            nameDisable: true,
                            telDisable: true
                        })
                        wx.hideLoading();
                    } else {
                        wx.showToast({
                            title: res.Message,
                            icon: 'none',
                            duration: 5000
                        })
                    }
                })
                .catch(err => {
                    wx.hideLoading();
                    console.log(err);
                });
        }
    },
    getUserInfo: function (e) {
        if (e.detail.userInfo) {//授权成功
            wx.showLoading({ mask: true })
            let data = this.data,
                that = this,
                register = data.register;
            //用户填写的信息
            const form = {
                TrueName: data.name,
                Mobile: data.tel,
            }
            //将用户授权信息和用户填写信息 按顺序上传
            maconfig.bindUserData(e.detail.userInfo)
                .then(res => {
                    if (res.Status == 1) {
                        return maconfig.bindInputData(form)
                    }
                })
                .then(res => {
                    if (res.Status == 1) {//绑定成功
                        wx.showToast({
                            title: '绑定成功',
                            mask: true
                        })
                        setTimeout(() => {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 1500)
                    } else {
                        wx.showToast({
                            title: res.Message,
                            icon: 'none'
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    // name校验
    nameChange: function (e) {
        let value = e.detail.value.trim();
        this.setData({
            name: value
        })
    },
    // tel校验
    telChange: function (e) {
        let value = e.detail.value.trim();
        this.setData({
            tel: value
        })

    },
    confirmPrivacy: function () {
        this.setData({
            privacy: !this.data.privacy
        });
    }
})