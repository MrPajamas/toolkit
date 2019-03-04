//ARC Page 
var mabase = require('mabase.js');
function ARCPage(ops) {
  let nav = require('ARCNavigator.js');
  let options2 = ops;

  //on Load
  options2.onLoadOld = ops.onLoad;
  options2.onLoad = function(options) {

    let log = require('logvisit.js');
    log.logVisit(1, null, null);
    if (this.onLoadOld != null) {
      this.onLoadOld(options);
    }
  }

  options2.onShowOld = ops.onShow;
  options2.onShow = function(options) {
    var maconfig = require('maconfig.js');
    var that = this;
    if (ops.LoginEnabled == null || ops.LoginEnabled) {
      maconfig.isRegister()
        .then(res => {
          if (!res.Data.IsRegister) { //判断用户是否绑定过,否的话跳到 register 页面
            mabase.navigateTo('/pages/register/register')
          } else { //注册过，留在当页
            if (that.onShowOld != null) {
              that.onShowOld(options);
            }
          }
        })
    }else{
      if (that.onShowOld != null) {
        that.onShowOld(options);
      }
    }
  }

  //分享
  options2.onShareAppMessageOld = ops.onShareAppMessage;
  options2.onShareAppMessage = function(res) {
    let share = require('wxShare.js');
    if (this.onShareAppMessageOld == null) {
      return share.Share(res);
    } else {
      return this.onShareAppMessageOld(res);
    }
  }

  //ARC 点击事件处理

  options2.navClick = function(event) {
    nav.navigatorClick(event);
  }

  Page(options2);
}

module.exports = {
  ARCPage: ARCPage
}