// const _URLBASE = 'https://msdemotoolkit.arcdmi.com/';
const _URLBASE = 'https://msdemotoolkit-test.arcdmi.com/';
// const _URLBASE = 'http://api.toolkit.com/';
//var marequest = require('marequest.js');
/*获取当前页带参数的url*/
function getCurrentUrl() {

  var currentPage = getCP(); //获取当前页面的对象
  var url = currentPage.route; //当前页面url
  var options = currentPage.options; //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  return urlWithArgs
}

/*获取当前页不带参数的路径*/
function getCurrentPath() {
  var currentPage = getCP(); //获取当前页面的对象
  return currentPage.route; //当前页面url
}


function getIndexOfPath(path) {
  var index = -1;
  var pages = getCurrentPages();

  for (var i = pages.length - 1; i >= 0; i--) {
    if (('/' + pages[i].route.toUpperCase()) == path.toUpperCase()) {
      index = pages.length - i - 1;
      break;
    }
  }
  return index;
}



/*获取当前页参数*/
function getUrlParam(name) {
  var currentPage = getCP();
  var options = currentPage.options //如果要获取url中所带的参数可以查看options
  for (var key in options) {
    if (key.toUpperCase() == name.toUpperCase())
      return options[key];
  }
  return null;
}


function getParamOfUrl(url, name) {

  if (url == null || url.indexOf('?') < 0)
    return null;

  url = url.substr(url.indexOf('?') + 1);


  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = url.match(reg);
  if (r != null) return r[2];
  return null;
}


function getCP() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  return currentPage;
}



function arcNavigateTo(url){
  var marequest = require('marequest.js');

  marequest.request({
    url: 'api/link/redirect', //请求验证该地址是否能跳转
    data: {
      pageurl: url
    },
    enableUserInfo: true,
    complete: function (res) {
      var index = getIndexOfPath(url);
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
function arcRedirectTo(url) {
  var marequest = require('marequest.js');
  var index = getIndexOfPath(url);


  marequest.request({
    url: 'api/link/redirect', //请求验证该地址是否能跳转
    data: {
      pageurl: url
    },
    enableUserInfo: true,
    complete: function (res) {
      if (index < 0) {
        wx.redirectTo({
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
  App: function() {
    return getApp();
  },
  UrlBase: _URLBASE,
  getCurrentUrl: getCurrentUrl,
  getCurrentPath: getCurrentPath,
  getUrlParam: getUrlParam,
  getParamOfUrl: getParamOfUrl,
  getIndexOfPath: getIndexOfPath,
  navigateTo:arcNavigateTo,
  redirectTo:arcRedirectTo
}