import Video from "../models/Video";

export const home = (req, res) => {
    // 최신버전 mongoose에서는 Model.find()에서 callback함수를 지원하지 않는다.
    // mongoose를 다운그레이드하거나 promise를 사용해야한다.
    Video.find({}, (error, videos) => {
        res.render("home", { pageTitle: "Home", videos: [] });
    });
};
export const watch = (req, res) => {
    // const id = req.params.id;은 아래 표현식과 같은 표현이다.
    const { id } = req.params;
    res.render("watch", { pageTitle: `Watching` });
};
export const getEdit = (req, res) => {
    const { id } = req.params;
    const video = videos[id-1];
    res.render("edit", { pageTitle: `Editing`});
};
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
    res.render("upload", { pageTitle: "Upload Video"});
};
export const postUpload = (req, res) => {
    const {title} = req.body;

    return res.redirect("/");
};