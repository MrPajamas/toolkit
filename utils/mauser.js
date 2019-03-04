var mabase = require('mabase.js');

function getMAUserInfo(callback, force = false) {

  if (mabase.App().globalData.MAUserInfo != null && !force) {
    wx.checkSession({
      success: function() {
        callback(mabase.App().globalData.MAUserInfo);
      },
      fail: function() {
        startGetMAUserInfo(callback);
      }
    });
  } else {
    startGetMAUserInfo(callback);
  }
}



function startGetMAUserInfo(callback) {
  if (!mabase.App().globalData.MAUserLock) {
    mabase.App().globalData.MAUserLock = true;
    getMAUserInfoCore(callback);
  } else {
    setTimeout(function() {
      getMAUserInfo(callback);
    }, 100);
  }
}




function getMAUserInfoCore(callback) {

  // 登录
  wx.login({
    success: res => {
      wx.request({
        method: 'POST',
        url: mabase.UrlBase + 'api/wechat/MAUserInfo', //仅为示例，并非真实的接口地址
        data: {
          code: res.code
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          mabase.App().globalData.MAUserInfo = res.data.Data;
          mabase.App().globalData.MAUserLock = false;
          callback(res.data.Data);
        },
        fail: function(res) {
          mabase.App().globalData.MAUserLock = false;
        }
      })
    }
  })
}

function setMAUserInfo(userinfo) {
  var sk = mabase.App().globalData.MAUserInfo != null ? mabase.App().globalData.MAUserInfo.SessionKey : '';

  wx.request({
    url: mabase.UrlBase + 'api/MaUser/setUserInfo', //仅为示例，并非真实的接口地址
    data: {
      sk: sk,
      nickName: userinfo.nickName,
      gender: userinfo.gender,
      language: userinfo.language,
      headImageUrl: userinfo.avatarUrl,
      province: userinfo.province,
      city: userinfo.city,
      country: userinfo.country
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function(res) {
      if (res.data.Status > 0) {
        mabase.App().globalData.MAUserInfo = res.data.Data;
      }
    }
  });

}


function setUserPhoneNumber(secData, iv) {
  var sk = mabase.App().globalData.MAUserInfo != null ? mabase.App().globalData.MAUserInfo.SessionKey : '';

  wx.request({
    url: mabase.UrlBase + 'api/MaUser/setphone', //仅为示例，并非真实的接口地址
    data: {
      sk: sk,
      secData: secData,
      iv: iv
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function(res) {
      if (res.data.Status > 0) {
        mabase.App().globalData.MAUserInfo = res.data.Data;
      }
    }
  });
}





module.exports = {
  getMAUserInfo: getMAUserInfo,
  setMAUserInfo: setMAUserInfo,
  setUserPhoneNumber: setUserPhoneNumber
}