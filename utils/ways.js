
export default class ways {
    static setData(res, name = "") {
        const currentPages = getCurrentPages(),
            _this = currentPages[currentPages.length - 1];
        if (name) return _this.setData({ [name]: res });
        // 返回值是否为 对象
        if (Object.prototype.toString.call(res) == '[object Object]') {
            // 遍历--setData到页面中
            let data = {};
            for (let prop in res) {
                data[prop] = res[prop];
            }
            _this.setData(data);
        }
    }
    //跳去视频播放页
    static goVideoPlayPage(even, mabase) {
        let title = even.currentTarget.dataset.title,
            fileurl = even.currentTarget.dataset.fileurl,
            douyinid = even.currentTarget.dataset.douyinid,
            praisecnt = even.currentTarget.dataset.praisecnt,
            id = even.currentTarget.dataset.id,
            ispraise = even.currentTarget.dataset.ispraise;
        mabase.navigateTo(`/pages/videoPlay/videoPlay?title=${title}&fileurl=${fileurl}&douyinid=${douyinid}&praisecnt=${praisecnt}&id=${id}&ispraise=${ispraise}`);
    }
}