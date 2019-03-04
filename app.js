const { UrlBase } = require('/utils/mabase.js')

App({
    onLaunch: function () {
        // 获取用户信息
        // wx.getSetting({
        //     success: res => {
        //         console.log(res);

        //     }
        // })
    },
    globalData: {
        userInfo: null
    },
    //分享
    privateShare(data = {}) {
        const currentPages = getCurrentPages();
        const _this = currentPages[currentPages.length - 1];
        const { title, path, imageUrl } = data;
        // 添加分享
        _this.onShareAppMessage = () => {
            return {
                title: title || 'Microsoft 精英荟',
                path: path || 'pages/index/index',
                imageUrl: imageUrl || UrlBase + 'image/share/shareR.jpg',
            }
        }
    },
    ARCPage: function (options) {
        let arcPage = require('/utils/ARCPage.js');
        arcPage.ARCPage(options);
    },

})