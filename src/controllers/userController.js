import { application } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import { token } from "morgan";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async(req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if(password !== password2){
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }
    const exists = await User.exists({$or: [ { username: req.body.username }, { email } ]});
    if (exists) {
        return res.status(400).render("join", { 
            pageTitle,
            errorMessage: "This username/email is already taken."
        });
    }
    try{
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: error._message,
        });
    }
};
export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });
export const postLogin = async(req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login"
    // check if account exists
    const user = await User.findOne({username});
    if(!user){
        return res.status(400).render("login", { 
            pageTitle,
            errorMessage: "An account with this username does not exists.",
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", { 
            pageTitle,
            errorMessage: "Wrong password",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};
export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config ={ 
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope:"read:user user:email"
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};
export const finishGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl =`${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method:"POST",
            headers: {
                Accept: "application/json"
            },
        })
    ).json();
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl ="https://api.github.com";
        const userData = await(
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`
                },
            })
        ).json();

        const emailData = await(
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`
                },
            })
        ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj){
            return res.redirect("/login");
        }
        const existingUser = await User.findOne({ email: emailObj.email });
        if(existingUser){
            req.session.loggedIn = true;
            req.session.user = existingUser;
            return res.redirect("/");
        } else {
            // create an account (db에 해당 email을 가진 user가 없을때)
            const user = await User.create({
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password:"",
                socialOnly: true,
                location:userData.location,
            });
            req.session.loggedIn = true;
            // if 구문과 똑같이 `req.session.user = existingUser;`라고 적으셨다면, 
            // 새로 생성한 유저 정보가 세션에 제대로 저장이 안됩니다.
            // 그래서 req.session.user를 받는 로컬미들웨어 안의 loggedInUser 부분에 오류가 발생하고, 
            // base.pug의 #{loggedInUser.name}에도 오류가 발생
            req.session.user = user;
            return res.redirect("/");
        }
    }else {
        return res.redirect("/login");
    }
};
export const logout = (req, res) => res.send("Log Out");
export const see = (req, res) => res.send("See User");
export const edit = (req, res) => res.send("Edit User");
export const deleteUser = (req, res) => res.send("Delete User");