
export default class ways {
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