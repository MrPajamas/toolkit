const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



var mabase = require('mabase.js');

var marequest = require('marequest.js');
//封装的跳转页面的方法
//url跳转的页面地址
function redirectTo(url) {

  marequest.request({
    url: 'api/link/redirect', //请求验证该地址是否能跳转
    data: {
      pageurl: url
    },
    enableUserInfo: true,
    complete: function (res) {
      var index = mabase.getIndexOfPath(url);
      if (index < 0) {
        wx.navigateTo({
          url: url,
        });
      } else if (index > 0) {
        wx.navigateBack({
          delta: index
        })
      }
    }
  });

}

module.exports = {
  formatTime: formatTime,
   redirectTo: redirectTo
}