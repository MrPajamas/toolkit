const marequest = require('marequest.js')


// 
function mipData() {
    return new Promise(resolve => {
        marequest.request({
            url: 'api/Users/GetUserData',
            enableUserInfo: true,
            complete: function (res) {
                res && resolve(res);
            }
        })
    })
}



export default {
    mipData
}