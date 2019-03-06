// 二期接口
const marequest = require('marequest.js');


export default class maconfig2 {
    //mip 本期 banner
    static getMipCurrentData() {
        return new Promise(resolve => {
            marequest.request({
                url: 'api/Upload/GetMipConfig',
                enableUserInfo: true,
                complete(res) {
                    res && resolve(res);
                }
            })
        })
    }
    // mip 本期活动 视频列表
    static getMipCurrentTerm(pageIndex, pageSize) {
        return new Promise(resolve => {
            marequest.request({
                url: 'api/Home/GetDouYinVideoList',
                enableUserInfo: true,
                data: { pageIndex, pageSize, Phase: 1 },
                complete(res) {
                    res && resolve(res);
                }
            })
        })
    }
    // mip 往期活动 视频列表
    static getMipPastTerm() {
        return new Promise(resolve => {
            marequest.request({
                url: 'api/Home/GetPastPeriodVideoList',
                enableUserInfo: true,
                complete(res) {
                    res && resolve(res);
                }
            })
        })
    }
}



