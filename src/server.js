import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd()+"/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        // 세션만료기간 설정, 로그인을 얼마나 유지할지 결정
        /* 
        cookie: {
            maxAge: 20000,
        },
        */
        store: MongoStore.create({mongoUrl: process.env.DB_URL }),
    })
);

// session middleware다음에 있어야함!!
// 그래야 localsMiddleware가 session object에 접근할 수 있음.
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;