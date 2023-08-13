import Video from "../models/Video";

/* 

Video.find({}, (error, videos) => {
    if(error){
        return res.render("server-error")
    }
    return res.render("home", { pageTitle: "Home", videos })
});

*/

export const home = async(req, res) => {
    try{
        const videos = await Video.find({});
        console.log(videos);
        return res.render("home", { pageTitle: "Home", videos });
    } catch {
        return res.render("server-error");
    }
};
export const watch = (req, res) => {
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
export const postUpload = async(req, res) => {
    const {title, description, hashtags } = req.body;
    await Video.create({
        title: title,
        description: description,
        createdAt: Date.now(),
        hashtags: hashtags.split(",").map(word => `#${word}`),
        meta: {
            views: 0,
            rating: 0,

        },
    });
    // Video.create()방법과 video.save()방법이 있다.
    /*
    const video = new Video({
        title: title,
        description: description,
        createdAt: Date.now(),
        hashtags: hashtags.split(",").map(word => `#${word}`),
        meta: {
            views: 0,
            rating: 0,

        },
    });
    await video.save(); 
    */
    return res.redirect("/");
};