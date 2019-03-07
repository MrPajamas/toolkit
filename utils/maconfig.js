var marequest = require('marequest.js');
var mabase = require('mabase.js');

// 是否绑定过
function isRegister() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Users/GetUserData',
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// Register页面 数据
function getRegisterData() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Home/GetRegisterData',
            enableUserInfo: true,
            complete: function (res) {
                const currentPages = getCurrentPages(),
                    _this = currentPages[currentPages.length - 1];
                const { listRegion, listStore, btnTitle, txt1, txt2, txt3, txt4 } = res.Data;
                _this.setData({ listRegion, listStore, btnTitle, txt1, txt2, txt3, txt4 });
                res && resolve(res);
            }
        })
    })
}


// // 获取验证码
// function getCode(TrueName, Mobile) {
//     return new Promise(resolve => {
//         marequest.request({
//             url: 'api/Users/SendCode',
//             enableUserInfo: true,
//             data: { TrueName, Mobile },
//             complete: function (res) {
//                 res && resolve(res);
//             }
//         })
//     })
// }
// 获取验证码
function getStore(TrueName, Mobile) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Users/Validate',
            enableUserInfo: true,
            data: { TrueName, Mobile },
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}




// 注册页面  用户授权的信息
function bindUserData(data = {}) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/home/BindUserData',
            data: data,
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// 注册页面  用户填写的信息
function bindInputData(data = {}) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Users/Register',
            data: data,
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}

// 首页数据
function getIndexData() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Home/GetIndexData',
            enableUserInfo: true,
            complete: function (res) {
                const currentPages = getCurrentPages(),
                    _this = currentPages[currentPages.length - 1];
                const { background, list } = res.Data;
                _this.setData({
                    background, list
                });
                res && resolve(res);
            }
        })
    })
}
// tabbar
function getTabBarData(app) {
    return new Promise(resolve => {

        let currentPages = getCurrentPages(),
            _this = currentPages[currentPages.length - 1],
            pagePath = _this.__route__;

        if (app.globalData.tabbar) {
            let gtabbar = app.globalData.tabbar;

            selectedColor(pagePath, gtabbar, _this);

            _this.setData({
                tabbar: gtabbar
            });
            resolve();
        } else {
            marequest.request({
                url: 'api/Home/GetTabBar',
                enableUserInfo: true,
                complete: function (res) {
                    let tabbar = res.Data;

                    selectedColor(pagePath, tabbar, _this);

                    app.globalData.tabbar = tabbar;
                    _this.setData({
                        tabbar: tabbar
                    });
                    res && resolve(res);
                }
            });
        }

        function selectedColor(pagePath, tabbar, _this) {
            (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
            for (let i in tabbar) {
                tabbar[i].selected = false;
                ((tabbar[i].PageUrl == pagePath) || (_this.data.module == tabbar[i].Title)) && (tabbar[i].selected = true);
            }
        }
    })
}


// study 数据
function getStudyData() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/home/GetEliteData',
            enableUserInfo: true,
            complete: function (res) {
                const currentPages = getCurrentPages(),
                    _this = currentPages[currentPages.length - 1];
                const { banner, listBanner, listIcon, product, sucai, mip } = res.Data;
                _this.setData({
                    banner, listBanner, listIcon, product, sucai, mip
                });
                res && resolve(res);
            }
        })
    })
}
// mine 数据
function getMineData() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Users/GetMineData',
            enableUserInfo: true,
            complete: function (res) {
                const currentPages = getCurrentPages(),
                    _this = currentPages[currentPages.length - 1];
                const { AvataUrl, IntegralCount, IntegralIcon, IntegralUnit, NickName, banner, isTodayCheckIn, listMenu, rightBtnTitle } = res.Data;
                _this.setData({
                    AvataUrl, IntegralCount, IntegralIcon, IntegralUnit, NickName, banner, isTodayCheckIn, listMenu, rightBtnTitle
                });
                res && resolve(res);
            }
        })
    })
}
// mine 数据
function getMyActivitiesData() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Home/GetMyActivity',
            enableUserInfo: true,
            complete: function (res) {
                const currentPages = getCurrentPages(),
                    _this = currentPages[currentPages.length - 1];
                const { news, ez, douYin } = res.Data;
                _this.setData({ news, ez, douYin });
                res && resolve(res);
            }
        })
    })
}

// match 数据
function getMatchData() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Home/GetActivityIndexData',
            enableUserInfo: true,
            complete: function (res) {
                const currentPages = getCurrentPages(),
                    _this = currentPages[currentPages.length - 1];
                const { CreateTeamBackground, CreateTeamBtn, CreateTeamTips, CreateTeamTitle, IsTeam, background, centerBtnBackground, centerBtnTitle, leftBtnBackground, leftBtnTitle, rigthBtnBackground, rigthBtnTitle, CreateTeamBtnBackground } = res.Data;
                _this.setData({
                    CreateTeamBackground, CreateTeamBtn, CreateTeamTips, CreateTeamTitle, IsTeam, background, centerBtnBackground, centerBtnTitle, leftBtnBackground, leftBtnTitle, rigthBtnBackground, rigthBtnTitle, CreateTeamBtnBackground
                });
                res && resolve(res);
            }
        })
    })
}

// rank 数据
function getRankData() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Team/RankingList',
            enableUserInfo: true,
            complete: function (res) {
                const currentPages = getCurrentPages(),
                    _this = currentPages[currentPages.length - 1];
                let { AvataUrl, Integral, IntegralUnit, TrueName, TeamName, TeamRankingNum, listJoin, UserRankingNum } = res.Data;
                let len = listJoin.length;
                for (let i = len; i < 3; i++) {
                    listJoin.push({
                        AvataUrl: _this.data.unknown,
                    })
                }
                _this.setData({ AvataUrl, Integral, IntegralUnit, TrueName, TeamName, TeamRankingNum, listJoin, UserRankingNum });
                res && resolve(res);
            }
        })
    })
}


// rank 加载战队排行榜
function getMoreTeamList(pageIndex, pageSize) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Team/RankingListToTeam',
            enableUserInfo: true,
            data: { pageIndex, pageSize },
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// rank 加载个人排行榜
function getMorePersonalList(pageIndex, pageSize) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Team/RankingListToPeople',
            enableUserInfo: true,
            data: { pageIndex, pageSize },
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// articleShow 数据
function getArticleShowData(pageIndex, pageSize) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Home/GetNewsList',
            enableUserInfo: true,
            data: { pageIndex, pageSize },
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// videoWall 数据
function getVideoWallData(pageIndex, pageSize) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Home/GetDouYinVideoList',
            enableUserInfo: true,
            data: { pageIndex, pageSize },
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}

// 点赞
function laud(Id) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Upload/Praise',
            enableUserInfo: true,
            data: { Id },
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}


// 查询战队
function getTeamData(data) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Team/GetTeamData',
            data: data,
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// 创建战队
function createTeam(name) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Team/Create',
            data: { name },
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// 邀请好友 share
function inviteFriend(TeamId) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Team/Share',
            data: { TeamId },
            enableUserInfo: true,
            complete: function (res) {
                const currentPages = getCurrentPages(),
                    _this = currentPages[currentPages.length - 1];
                const { title, url, imageUrl } = res.Data;
                _this.setData({
                    title,
                    path: url,
                    imageUrl
                });
                res && resolve({ res });
            }
        })
    })
}
// 加入战队
function joinTeam(data) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Team/Join',
            data: data,
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}

// 确定组队
function confirmTeam(TeamId) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Team/Confirm',
            data: TeamId,
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// 解散队伍
function dissolveTeam() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Team/Dissolve',
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// 退出队伍
function quitTeam() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Team/Quit',
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// 获取问题
function getQuestion() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Question/GetQuestionData',
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// 提交答案
function submitAnswer(data) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Question/SubmitAnswer',
            data: data,
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// 签到
function checkIn() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Users/CheckIn',
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}

// 获取日历
function getCalenda(date = "") {
    return new Promise(resolve => {
        if (date) {
            marequest.request({
                url: 'api/Users/CheckInCalendar',
                data: { date: date },
                enableUserInfo: true,
                complete: function (res) {
                    res && resolve(res);
                }
            })
        } else {
            marequest.request({
                url: 'api/Users/CheckInCalendar',
                enableUserInfo: true,
                complete: function (res) {
                    res && resolve(res);
                }
            })
        }
    })
}

// 上传文件
function upLoadFiles(type, tempFilePaths) {
    return new Promise(resolve => {
        marequest.requestArcFile({
            url: 'api/Upload/UploadAzureBlob',
            enableUserInfo: true,
            data: { type: type },
            tempFilePaths: tempFilePaths,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// 确认上传EZ认证
function uploadEz(Email = "", FileUrl = "") {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Upload/UploadEz',
            enableUserInfo: true,
            data: { Email, FileUrl },
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// 确认上传抖音视频
function upLoadVideo(data = {}) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Upload/UploadVideo',
            enableUserInfo: true,
            data: data,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// 组队赛规则
function uploadNews(Title, Context) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Upload/UploadNews',
            enableUserInfo: true,
            data: { Title, Context },
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
// 组队赛规则
function getTeamRule() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Home/GetTeamRule',
            enableUserInfo: true,
            complete: function (res) {
                const currentPages = getCurrentPages(),
                    _this = currentPages[currentPages.length - 1];
                const { rule } = res.Data;
                _this.setData({ rule });

                res && resolve(res);
            }
        })
    })
}

// 个人赛规则
function getPeopleRule() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Home/GetPeopleRule',
            enableUserInfo: true,
            complete: function (res) {
                const currentPages = getCurrentPages(),
                    _this = currentPages[currentPages.length - 1];
                const { rule } = res.Data;
                _this.setData({ rule });
                res && resolve(res);
            }
        })
    })
}

// 根据id获取文章
function getArticleContent(Id) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Home/GetNewsInfo',
            enableUserInfo: true,
            data: { Id },
            complete: function (res) {
                const currentPages = getCurrentPages(),
                    _this = currentPages[currentPages.length - 1];
                const { AvataUrl, Context, Id, IsPraise, PraiseCnt, Title, TrueName } = res.Data;
                _this.setData({ AvataUrl, Context, Id, IsPraise, PraiseCnt, Title, TrueName });
                res && resolve(res);
            }
        })
    })
}
// 根据id获取视频
function getVideo(Id) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Home/GetDouYinVideoInfo',
            enableUserInfo: true,
            data: { Id },
            complete: function (res) {
                const currentPages = getCurrentPages(),
                    _this = currentPages[currentPages.length - 1];
                const { Id, Title, PraiseCnt, FileUrl, ImageUrl, DouYinId, TrueName, IsPraise } = res.Data;
                _this.setData({ Id, Title, PraiseCnt, FileUrl, ImageUrl, DouYinId, TrueName, IsPraise });
                res && resolve(res);
            }
        })
    })
}

// 看视频或文章加分
function uploadSee(Id) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Upload/UploadSee',
            data: { Id },
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}
module.exports = {
    getStore,
    isRegister,
    getRegisterData,
    getIndexData,
    getTabBarData,
    bindUserData,
    bindInputData,
    getStudyData,
    getMineData,
    getTeamData,
    createTeam,
    getMatchData,
    inviteFriend,
    dissolveTeam,
    quitTeam,
    joinTeam,
    confirmTeam,
    getQuestion,
    submitAnswer,
    getCalenda,
    checkIn,
    uploadEz,
    getVideoWallData,
    laud,
    upLoadFiles,
    upLoadVideo,
    getArticleShowData,
    uploadNews,
    getMyActivitiesData,
    getRankData,
    getMoreTeamList,
    getMorePersonalList,
    getTeamRule,
    getPeopleRule,
    getArticleContent,
    getVideo,
    uploadSee
}