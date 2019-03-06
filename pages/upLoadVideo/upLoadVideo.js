const maconfig = require('../../utils/maconfig.js')
const { UrlBase } = require('../../utils/mabase.js')
const app = getApp()
app.ARCPage({

    /**
     * 页面的初始数据
     */
    data: {
        add: UrlBase + 'image/upLoadVideo/add.png',
        list: [
            {
                icon: UrlBase + 'image/upLoadVideo/icon01.png',
                title: '标题：'
            },
            {
                icon: UrlBase + 'image/upLoadVideo/icon02.png',
                title: '抖音 ID：'
            },
            {
                icon: UrlBase + 'image/upLoadVideo/icon03.png',
                title: '抖音平台获赞数：'
            },
            {
                icon: UrlBase + 'image/upLoadVideo/icon04.png',
                title: '抖音视频：'
            },
        ],
        rankUrl: '/pages/rank/rank',

        title: '',
        id: '',
        number: '',
        FileUrl: '',

        // 立即上传或重新上传 文字
        changeOr: '',
        // 重新上传时的确认弹窗
        confirmFrameShow: false,
        confirmFrame: UrlBase + 'image/upLoadVideo/confirmFrame.png',
        yesOrNo: UrlBase + 'image/upLoadVideo/yesOrNo.png',
        close: UrlBase + '/image/match/close.png',
        confirmFrame_content: '',
        confirmFrame_content2: '',
        //1为读取，否则为上传  对应yes cancle事件
        confirmFrameCode: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ mask: true });
        app.privateShare();
        let that = this;
        if (options.id) {//修改
            Promise.all([maconfig.getVideo(options.id), maconfig.getTabBarData(app)])
                .then(res => {
                    let { Title, DouYinId, DouYinPraiseCnt } = res[0].Data;
                    that.setData({
                        changeOr: '确认更改',
                        title: Title,
                        id: DouYinId,
                        number: DouYinPraiseCnt,
                        options
                    });
                    wx.hideLoading();
                })
        } else {//上传
            maconfig.getTabBarData(app)
                .then(res => {
                    that.setData({
                        changeOr: '立即上传',
                        options
                    })
                    wx.hideLoading();
                })
                .catch(err => {
                    wx.hideLoading();
                })
        }
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
    titleChange: function (e) {
        let title = e.detail.value;
        this.setData({ title });
    },
    idChange: function (e) {
        let id = e.detail.value;
        this.setData({ id });
    },
    numberChange: function (e) {
        let number = e.detail.value;
        this.setData({ number });
    },
    tempFilePathChange: function (e) {
        let FileUrl = e.detail.value;
        this.setData({ FileUrl });
    },
    chooseVideo: function () {
        let that = this,
            data = this.data;
        if (data.options && data.options.id) {//修改
            that.setData({
                confirmFrameCode: 1,
                confirmFrameShow: true,
                confirmFrame_content: '更换为新视频后，之前视频获得的点赞数和微币也会清除掉哦，请确认是否更换？'
            })
        } else {//首次上传
            preUp(that);
        }
    },
    yes: function () {
        let data = this.data,
            title = data.title,
            id = data.id,
            number = data.number,
            FileUrl = data.FileUrl;
        this.setData({
            confirmFrameShow: false,
        })
        if (data.confirmFrameCode == 1) {//重新选择视频
            preUp(this);
        } else {
            up(title, id, number, FileUrl);
        }
    },
    cancle: function () {
        this.setData({
            confirmFrameShow: false
        })
    },
    //立即上传
    upLoadVideo: function () {
        wx.showLoading({ mask: true });
        let data = this.data,
            that = this,
            title = data.title,
            id = data.id,
            number = data.number,
            FileUrl = data.FileUrl,
            options = data.options,
            numberTest = /^([1-9]\d*|[0]{1,1})$/;//匹配正整数和0
        //校验
        if (!title) {
            wx.showToast({
                icon: 'none',
                title: '请填写标题'
            })
        } else if (!id) {
            wx.showToast({
                icon: 'none',
                title: '请填写抖音 ID'
            })
        } else if (!number) {
            wx.showToast({
                icon: 'none',
                title: '请填写获赞数'
            })
        }
        else if (!numberTest.test(number)) {
            wx.showToast({
                icon: 'none',
                title: '请填写正整数'
            })
        } else if (!FileUrl) {
            wx.showToast({
                icon: 'none',
                title: '请选择视频'
            })
        } else if (data.options && data.options.id) {//通过校验，修改视频
            wx.hideLoading();
            that.setData({
                confirmFrameCode: 2,
                confirmFrameShow: true,
                confirmFrame_content: '您正在更新视频信息，',
                confirmFrame_content2: '请确认是否修改？'
            })
        } else {//第一次上传
            let UpData = [ title, id, number, FileUrl ];
            if (options && options.mip) UpData.push(options.mip);//如果从mip上传的，添加标记参数
            up(...UpData);
        }
    }
})


//读取视频
function preUp(that) {
    wx.chooseVideo({
        sourceType: ['album'],
        compressed: false,
        success(res) {
            if (res.duration > 60) {//限制视频的时长
                return wx.showToast({
                    icon: 'none',
                    title: '视频超60秒'
                })
            }
            let p = 25 * 1024 * 1024;
            if (res.size > p) {//限制视频大小  100M
                return wx.showToast({
                    icon: 'none',
                    title: '视频不能超过25M，请重新上传'
                })
            }
            wx.showLoading({ mask: true, title: '读取中' });
            maconfig.upLoadFiles(2, res.tempFilePath)
                .then(res => {
                    if (res.Status == 1) {//上传成功
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
                    console.log(err);
                })
        }
    })
}

//上传视频
function up(title, id, number, FileUrl, mip) {
    wx.showLoading({ mask: true, title: '上传中' });
    let data = { Title: title, DouYinId: id, PraiseCnt: number, FileUrl };
    if (mip) data.Phase = mip; //如果是从Mip页面进来的,添加标记参数
    maconfig.upLoadVideo(data)
        .then(res => {
            if (res.Status == 1) {//上传成功
                wx.showToast({
                    title: res.Message,
                    mask: true
                })
                app.globalData.onlyOne = true;//刚上传视频后，视频墙重新加载数据
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1500)
            } else {
                wx.showToast({
                    icon: 'none',
                    title: res.Message,
                    mask: true
                })
            }
        })
        .catch(err => {
            wx.navigateBack({
                delta: 1
            })
            console.log(err);
        })
}