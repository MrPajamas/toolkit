var marequest = require('marequest.js');
var mabase = require('mabase.js');

var vtype = 1;
var vname = '';
var vurl = '';

function logVisit(r, n, u = '') {
  if (r != null) {
    vtype = r;
  }
  vname = n;
  vurl = u;
  logVisitCore();
}


function logVisitCore() {
  var url = vurl;
  if (url == '' || url == null) {
    url = mabase.getCurrentUrl();
  }
  marequest.request({
    url: 'api/logVisit', //仅为示例，并非真实的接口地址
    data: {
      url: url,
      vtype: vtype,
      vname: vname == '' ? url : vname
    },
    enableUserInfo: true,
    complete: function(res) {
      if (res.Status == 2 && res.Data != null && res.Data != '') {
        wx.redirectTo({
          url: res.Data
        })
      }
    }
  });
}






module.exports = {
  logVisit: logVisit
}