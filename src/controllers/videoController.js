export const trending = (req, res) => res.render("home", { pageTitle: "Comes from your controller", potato: "tomato" });
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search Video");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => {
    res.send("Delete Video");
};