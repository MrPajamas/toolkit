// 二期接口
const marequest = require('marequest.js');
// mip 本期活动 视频列表
function getMipCurrentTerm(pageIndex, pageSize) {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Home/GetDouYinVideoList',
            enableUserInfo: true,
            data: { pageIndex, pageSize, Phase: 1 },
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}

export default {
    getMipCurrentTerm
}