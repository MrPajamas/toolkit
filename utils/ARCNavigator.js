var mabase = require('mabase.js');

function navigatorClick(event) {
  var url = event.currentTarget.dataset.url;
  var openType = event.currentTarget.dataset.opentype;

  if (url == null || url == "") {
    wx.showToast({
      title: '此模块暂不开放',
      icon: "none",
      duration: 1200
    })

    return;
  }





  var page = "/" + mabase.getCurrentPath().toLowerCase();

  var urlc = url.toLowerCase();
  // console.log(url + '\t' + page);
  if (urlc == page) {
    return;
  }

  // if (openType == "redirect")
  //   mabase.redirectTo(url);
  // else
    mabase.navigateTo(url);
}
module.exports = {
  navigatorClick: navigatorClick
}