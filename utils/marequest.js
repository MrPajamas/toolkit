var mabase = require('mabase.js');
var mauser = require('mauser.js');

function request(options, forceReloadUserInfo = false) {
    if (options.enableUserInfo) {
        mauser.getMAUserInfo(function (userInfo) {
            if (options.data == null) {
                options.data = {};
            }
            options.data.sk = userInfo != null ? userInfo.SessionKey : '';
            options.data.openId = userInfo != null ? userInfo.OpenId : '';
            requestCore(options);
        }, forceReloadUserInfo);
    } else {
        requestCore(options);
    }
}

function requestCore(options) {
    var data = options.data;
    if (data == null) {
        data = {};
    }

    wx.request({
        url: mabase.UrlBase + options.url, //仅为示例，并非真实的接口地址
        data: data,
        header: {
            'content-type': 'application/x-www-form-urlencoded'
            // 'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {

            if (options.complete != null && res != null && res.data != null) {
                if (res.data.Status == -2) {
                    request(options, true);
                }
                else if (res.data.Status == -999) {
                    //如果接口不允许访问，则跳转一个页面
                    //console.log(res.data.Data);
                    wx.redirectTo({
                        url: res.data.Data,
                    })
                }
                else {
                    options.complete(res.data);
                }
            } else {
                if (options.complete != null) {
                    options.complete({
                        Status: -1,
                        Message: 'failed'
                    });
                }
            }
        },
        fail: function (res) {
            if (options.complete != null) {
                options.complete({
                    Status: -1,
                    Message: 'failed'
                });
            }
        }
    });
}

//上传文件的方法
function requestArcFile(options, forceReloadUserInfo = false) {

    if (options.enableUserInfo) {
        mauser.getMAUserInfo(function (userInfo) {
            if (options.data == null) {
                options.data = {};
            }
            options.data.sk = userInfo != null ? userInfo.SessionKey : '';
            options.data.openId = userInfo != null ? userInfo.OpenId : '';
            arcUploadFile(options);
        }, forceReloadUserInfo);
    } else {
        requestCore(options);
    }
}

//options.data.type=2 上传视频
//options.data.type=4 上传图片
// function requestArcFileCore(options) {

//   if (options.data.type==4)
//  {
//    wx.chooseImage({
//      success(res) {
//        const tempFilePaths = res.tempFilePaths

//        arcUploadFile(tempFilePaths[0], options)
//      }
//    })
//  }
//   else if (options.data.type==2)
//  {
//    wx.chooseVideo({
//      sourceType: ['album'],
//      maxDuration: 60,
//      camera: 'back',
//      success: function (res) {
//        console.log(res)
//        console.log(res.tempFilePath)
//        arcUploadFile(res.tempFilePath,options)
//      },
//      fail: function (res) {
//        if (options.complete != null) {
//          options.complete({
//            Status: -1,
//            Message: 'failed'
//          });
//        }
//      }
//    })
//  } 
// }

//上传文件
function arcUploadFile(options) {

    var data = options.data;
    if (data == null) {
        data = {};
    }
  console.log(options.tempFilePaths);
  console.log(data);
    wx.uploadFile({
        url: mabase.UrlBase + options.url, //仅为示例，并非真实的接口地址
        filePath: options.tempFilePaths,
        name: 'file',
        formData: data,
        success: function (res) {
           var resp=  JSON.parse(res.data);

          if (options.complete != null && resp != null && res.data != null) {
            if (resp.Status == -2) {
                    request(options, true);
                }
            else if (resp.Status == -999) {

              var index = mabase.getIndexOfPath(resp.Data);
                    if (index < 0) {

                        wx.navigateTo({
                          url: resp.Data,
                        })

                    } else if (index > 0) {
                        wx.navigateBack({
                            delta: index
                        })
                    }
                }
                else {
              options.complete(resp);
                }
            } else {
                if (options.complete != null) {
                    options.complete({
                        Status: -1,
                        Message: 'failed'
                    });
                }
            }
        },
        fail: function (res) {
            if (options.complete != null) {
                options.complete({
                    Status: -1,
                    Message: 'failed'
                });
            }
        }
    })
}





module.exports = {
    request, requestArcFile
}
