function onShareAppMessage(res) {
  var log = require('logvisit.js');
  log.logVisit(2, null, null);
  var fm = res.from;
  const {
    UrlBase
  } = require('/utils/mabase.js')
  return {
    title: title || 'Microsoft 精英荟',
    path: path || 'pages/index/index',
    imageUrl: UrlBase + 'image/share/share.jpg',
  }
}

module.exports = {
  Share: onShareAppMessage
}